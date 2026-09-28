#!/usr/bin/env python3
"""
Castilho Produções — gerador de placeholders fotográficos.

Cria "frames cinematográficos desfocados" (luz, silhuetas fora de foco, bokeh,
grão de filme, vinheta) para ocupar o lugar das fotografias reais enquanto o
portfólio definitivo não é enviado. Cada cena conversa com a categoria do
ensaio (famílias, casais, gestantes, infantil, retratos).

As imagens geradas ficam em /public/images e podem ser simplesmente
substituídas por fotografias reais com o mesmo nome de arquivo.

Uso (opcional — as imagens já estão no repositório):
    pip install numpy scipy pillow
    python3 scripts/placeholders/generate_placeholders.py
"""

from __future__ import annotations

import math
from dataclasses import dataclass, field
from pathlib import Path

import numpy as np
from PIL import Image
from scipy.ndimage import gaussian_filter, zoom

ROOT = Path(__file__).resolve().parents[2]
OUT = ROOT / "public" / "images"


# ---------------------------------------------------------------------------
# Paleta das cenas
# ---------------------------------------------------------------------------


def c(hex_value: str) -> np.ndarray:
    hex_value = hex_value.lstrip("#")
    return np.array([int(hex_value[i : i + 2], 16) / 255 for i in (0, 2, 4)], dtype=np.float32)


SCENES: dict[str, dict] = {
    # Campo no fim de tarde — famílias, infantil
    "golden": dict(
        top=["#efd9b4", "#e7c089", "#d39f62"],
        bottom=["#8a6a41", "#5e4629", "#3b2b1a"],
        horizon=0.63,
        light="#fff0d2",
        rim="#ffd49a",
        bokeh=["#ffe9bf", "#ffd796", "#fff6e2"],
        clothes=["#b09a7c", "#8a765e", "#5f5243", "#a28a6c", "#7a6955"],
        skin="#a87a5a",
        shade=0.42,
        split=("#2d2a2f", "#fff1dc"),
    ),
    # Interior com luz de janela — casa, gestantes, retratos
    "window": dict(
        top=["#6e5c4c", "#5a4a3d", "#46392f"],
        bottom=["#3b3129", "#2c241e", "#1f1a16"],
        horizon=0.74,
        light="#fff3e0",
        rim="#ffe2bd",
        bokeh=["#fff1da", "#ffe4c0"],
        clothes=["#b9aa96", "#8d7c69", "#a8977f", "#6e5f50"],
        skin="#b88768",
        shade=0.7,
        split=("#1f2227", "#fff0dc"),
    ),
    # Manhã clara, linho — gestantes, recém-nascidos, infantil
    "linen": dict(
        top=["#eee5d8", "#e0d3c1", "#cfbea8"],
        bottom=["#c5b39b", "#ae9a80", "#937f66"],
        horizon=0.7,
        light="#ffffff",
        rim="#fff6ea",
        bokeh=["#ffffff", "#fff8ee"],
        clothes=["#b8a791", "#8f7e6b", "#a39179", "#6f6152"],
        skin="#b08466",
        shade=0.72,
        split=("#6d6258", "#fffaf2"),
    ),
    # Praia nublada — casais
    "shore": dict(
        top=["#d9dcdc", "#c9cdcc", "#b8bdbb"],
        bottom=["#8e9894", "#b9aa92", "#a08d72"],
        horizon=0.56,
        light="#f7f4ee",
        rim="#f1ece2",
        bokeh=["#f4f1ea"],
        clothes=["#9d948a", "#2f2c2a", "#857a6c", "#57504a"],
        skin="#b3876a",
        shade=0.7,
        split=("#27302f", "#fbf4e8"),
    ),
    # Anoitecer na cidade — casais, noivados
    "dusk": dict(
        top=["#2c3140", "#433c4a", "#8a6653"],
        bottom=["#3a3134", "#241f22", "#161315"],
        horizon=0.6,
        light="#ffc98a",
        rim="#ffbf7a",
        bokeh=["#ffb869", "#ffd9a1", "#f59a58", "#ffe7c4"],
        clothes=["#1f1c1d", "#3b3433", "#d8c7b0", "#5b4b44"],
        skin="#9a6c55",
        shade=0.35,
        split=("#1b2233", "#ffd9a8"),
    ),
    # Estúdio — retratos profissionais
    "studio": dict(
        top=["#857a6e", "#766b60", "#62584f"],
        bottom=["#534a42", "#403933", "#2d2824"],
        horizon=0.82,
        light="#f7efe6",
        rim="#fff3e6",
        bokeh=["#ffffff"],
        clothes=["#1c1b1b", "#2e2b29", "#8f857a", "#4a4540"],
        skin="#b98a6c",
        shade=0.75,
        split=("#202126", "#f8eee2"),
    ),
    # Sombra de árvores — famílias, infantil
    "grove": dict(
        top=["#c9c7a4", "#9d9d74", "#6f7250"],
        bottom=["#5d5f40", "#43452e", "#2d2e1f"],
        horizon=0.66,
        light="#fbf3d7",
        rim="#fbe8b8",
        bokeh=["#fcf6dc", "#f1efc4", "#fff8e6"],
        clothes=["#a49680", "#857661", "#5f5242", "#9b8a6f"],
        skin="#b08163",
        shade=0.55,
        split=("#1f261e", "#fff2d6"),
    ),
}


# ---------------------------------------------------------------------------
# Estruturas
# ---------------------------------------------------------------------------


@dataclass
class Person:
    x: float  # centro horizontal (0..1 da largura)
    feet: float  # linha dos pés (0..1 da altura, pode passar de 1)
    height: float  # altura (fração da altura da imagem)
    build: float = 1.0
    clothes: int = 0
    belly: int = 0  # -1 esquerda, 1 direita
    lean: float = 0.0  # inclinação da cabeça (fração da altura da pessoa)


@dataclass
class Shot:
    path: str
    scene: str
    size: tuple[int, int]
    seed: int
    people: list[Person] = field(default_factory=list)
    light: tuple[float, float, float, float] = (0.5, 0.45, 0.35, 0.9)  # x, y, raio, força
    window: tuple[float, float, float, float] | None = None  # x, y, w, h
    bokeh: int = 18
    bokeh_zone: tuple[float, float, float, float] = (0.0, 0.0, 1.0, 0.7)
    bokeh_size: tuple[float, float] = (0.012, 0.05)
    dof: float = 0.026  # desfoque das silhuetas (fração da largura)
    backlit: bool = True
    links: bool = False  # mãos dadas entre pessoas vizinhas
    exposure: float = 1.0
    leak: float = 0.0  # vazamento de luz lateral
    grass: bool = False  # capim nítido em primeiro plano (plano de foco)
    quality: int = 78


# ---------------------------------------------------------------------------
# Primitivas
# ---------------------------------------------------------------------------


def gradient(stops: list[str], t: np.ndarray) -> np.ndarray:
    cols = [c(s) for s in stops]
    n = len(cols) - 1
    t = np.clip(t, 0, 1) * n
    i = np.clip(np.floor(t).astype(int), 0, n - 1)
    f = (t - i)[..., None]
    a = np.stack(cols)[i]
    b = np.stack(cols)[i + 1]
    return a * (1 - f) + b * f


def ellipse(xx, yy, cx, cy, rx, ry, soft=0.18):
    d = np.sqrt(((xx - cx) / max(rx, 1e-3)) ** 2 + ((yy - cy) / max(ry, 1e-3)) ** 2)
    return np.clip((1 - d) / soft, 0, 1)


def smooth(v, a, b):
    t = np.clip((v - a) / (b - a), 0, 1)
    return t * t * (3 - 2 * t)


def screen(base, add):
    return 1 - (1 - base) * (1 - np.clip(add, 0, 1))


# ---------------------------------------------------------------------------
# Renderização
# ---------------------------------------------------------------------------


def render(shot: Shot) -> None:
    sc = SCENES[shot.scene]
    rng = np.random.default_rng(shot.seed)
    W, H = shot.size
    s = 4  # camadas suaves em baixa resolução
    lw, lh = W // s, H // s
    yy, xx = np.mgrid[0:lh, 0:lw].astype(np.float32)
    u, v = xx / lw, yy / lh

    # 1. Fundo: céu/parede → horizonte → chão
    hz = sc["horizon"]
    top = gradient(sc["top"], v / hz)
    bottom = gradient(sc["bottom"], (v - hz) / (1 - hz))
    blend = smooth(v, hz - 0.05, hz + 0.07)[..., None]
    img = top * (1 - blend) + bottom * blend

    # variação orgânica de baixa frequência (nuvens, folhagem, parede)
    n = gaussian_filter(rng.normal(size=(lh, lw)), sigma=lw * 0.07)
    n = n / (np.abs(n).max() + 1e-6)
    img *= (1 + n[..., None] * 0.07)

    # 2. Janela (interiores)
    if shot.window:
        wx, wy, ww, wh = shot.window
        win = ((u > wx) & (u < wx + ww) & (v > wy) & (v < wy + wh)).astype(np.float32)
        # caixilho sutil
        mull = (np.abs(u - (wx + ww / 2)) < 0.004) | (np.abs(v - (wy + wh * 0.42)) < 0.004)
        win = win * (1 - mull.astype(np.float32) * 0.6)
        win = gaussian_filter(win, sigma=lw * 0.012)
        spill = gaussian_filter(win, sigma=lw * 0.16) * 2.2
        light = c(sc["light"])
        img = screen(img, win[..., None] * light * 0.95)
        img = img + spill[..., None] * light * 0.22
        # feixe de luz no chão
        beam = ellipse(u, v, wx + ww * 0.8, hz + 0.12, ww * 1.4, 0.07, soft=0.9)
        img = img + gaussian_filter(beam, lw * 0.03)[..., None] * light * 0.12

    # 3. Fonte de luz (sol, luz de estúdio)
    lx, ly, lr, ls = shot.light
    ax = W / H
    dist2 = ((u - lx) * ax) ** 2 + (v - ly) ** 2
    glow = np.exp(-dist2 / (2 * (lr * 0.55) ** 2)) * ls
    core = np.exp(-dist2 / (2 * (lr * 0.12) ** 2)) * ls
    img = screen(img, glow[..., None] * c(sc["light"]) * 0.55)
    img = screen(img, core[..., None] * c(sc["light"]) * 0.6)

    # 4. Bokeh de fundo (antes das pessoas)
    def bokeh_layer(count, zone, sizes, strength):
        layer = np.zeros((lh, lw, 3), dtype=np.float32)
        zx, zy, zw, zh = zone
        for _ in range(count):
            bx = zx + rng.random() * zw
            by = zy + rng.random() * zh
            br = (sizes[0] + rng.random() ** 2 * (sizes[1] - sizes[0])) * lw
            col = c(sc["bokeh"][rng.integers(len(sc["bokeh"]))])
            disc = ellipse(xx, yy, bx * lw, by * lh, br, br, soft=0.25)
            ring = np.clip(disc * 1.25 - 0.25, 0, 1) * 0.15 + disc
            layer += ring[..., None] * col * (0.05 + rng.random() * strength)
        return layer

    if shot.bokeh:
        img = screen(img, bokeh_layer(shot.bokeh, shot.bokeh_zone, shot.bokeh_size, 0.22))

    # 5. Pessoas (silhuetas fora de foco, sempre mais escuras que o fundo)
    if shot.people:
        alpha = np.zeros((lh, lw), dtype=np.float32)
        color = np.zeros((lh, lw, 3), dtype=np.float32)
        shade = sc["shade"] if shot.backlit else sc["shade"]
        light_x = shot.window[0] + shot.window[2] / 2 if shot.window else shot.light[0]

        def paint(mask, col):
            nonlocal alpha, color
            color = color * (1 - mask[..., None]) + col * mask[..., None]
            alpha = alpha + mask * (1 - alpha)

        ordered = sorted(shot.people, key=lambda p: p.feet)
        for p in ordered:
            Hh = p.height * lh
            cx = p.x * lw
            fy = p.feet * lh
            b = p.build
            # luz lateral: o lado voltado para a luz fica mais claro (volume)
            direction = 1.0 if light_x >= p.x else -1.0
            side = np.clip(0.62 + 0.5 * ((xx - cx) / (Hh * 0.16)) * direction, 0.35, 1.05)[..., None]
            if shot.backlit:
                side = side * 0 + 0.8
            cloth = c(sc["clothes"][p.clothes % len(sc["clothes"])]) * shade
            cloth2 = c(sc["clothes"][(p.clothes + 2) % len(sc["clothes"])]) * shade * 0.85
            skin = c(sc["skin"]) * shade
            hair = c("#2a211b") * (0.5 + 0.5 * shade)
            paint(ellipse(xx, yy, cx, fy - Hh * 0.25, Hh * 0.085 * b, Hh * 0.27, 0.4), cloth2 * side)
            paint(ellipse(xx, yy, cx, fy - Hh * 0.6, Hh * 0.13 * b, Hh * 0.22, 0.35), cloth * side)
            if p.belly:
                paint(
                    ellipse(xx, yy, cx + p.belly * Hh * 0.08, fy - Hh * 0.5, Hh * 0.09, Hh * 0.1, 0.4),
                    cloth * side,
                )
            hx = cx + p.lean * Hh
            paint(ellipse(xx, yy, (cx + hx) / 2, fy - Hh * 0.82, Hh * 0.035, Hh * 0.05, 0.5), skin * side)
            paint(ellipse(xx, yy, hx, fy - Hh * 0.905, Hh * 0.06, Hh * 0.075, 0.3), skin * side)
            paint(ellipse(xx - direction * Hh * 0.012, yy, hx - direction * Hh * 0.01, fy - Hh * 0.93,
                          Hh * 0.06, Hh * 0.06, 0.45), hair)

        if shot.links and len(ordered) > 1:
            byx = sorted(shot.people, key=lambda p: p.x)
            for a, b2 in zip(byx, byx[1:]):
                hy = min(a.feet - a.height * 0.47, b2.feet - b2.height * 0.47) * lh
                x0, x1 = a.x * lw, b2.x * lw
                arm = ellipse(xx, yy, (x0 + x1) / 2, hy, abs(x1 - x0) / 2, a.height * lh * 0.02, 0.6)
                paint(arm, c(sc["skin"]) * shade * 0.9)

        # nunca mais claro que o fundo: silhueta sempre "pesa" na imagem
        color = np.minimum(color, img * 0.92)
        tallest = max(p.height for p in shot.people)
        sigma = shot.dof * lw * (0.55 + 0.55 * min(tallest, 2.0))
        a_blur = gaussian_filter(alpha, sigma)
        col_blur = np.stack([gaussian_filter(color[..., i] * alpha, sigma) for i in range(3)], -1)
        img = img * (1 - a_blur[..., None]) + col_blur
        # luz de contorno (contraluz)
        if shot.backlit:
            wide = gaussian_filter(alpha, sigma * 2.2)
            rim = np.clip(wide - a_blur * 0.9, 0, 1) * (1 - a_blur)
            img = screen(img, rim[..., None] * c(sc["rim"]) * 0.7)

    # 6. Bokeh de primeiro plano (grande e muito suave)
    if shot.bokeh:
        fg = bokeh_layer(max(2, shot.bokeh // 6), (0, 0, 1, 1), (0.05, 0.11), 0.1)
        img = screen(img, gaussian_filter(fg, sigma=(lw * 0.012, lw * 0.012, 0)))

    img = np.clip(img * shot.exposure, 0, 1.4)

    # 7. Amplia para resolução final (camadas suaves)
    img = np.stack([zoom(img[..., i], (H / lh, W / lw), order=3) for i in range(3)], -1)[:H, :W]
    Y, X = np.mgrid[0:H, 0:W].astype(np.float32)
    U, V = X / W, Y / H

    # 7b. Capim em foco no primeiro plano — dá leitura de "foco raso" à cena
    if shot.grass or shot.scene in ("golden", "grove"):
        from PIL import ImageDraw

        ss = 2
        mask_img = Image.new("L", (W * ss, H * ss), 0)
        hi_img = Image.new("L", (W * ss, H * ss), 0)
        dm, dh = ImageDraw.Draw(mask_img), ImageDraw.Draw(hi_img)
        blades = int(W * 0.09)
        for _ in range(blades):
            x0 = rng.random() * W
            length = H * (0.05 + rng.random() ** 2.2 * 0.2)
            bend = (rng.random() - 0.5) * length * 0.5
            width = max(1.0, W * (0.0009 + rng.random() * 0.0016))
            pts = []
            for t in np.linspace(0, 1, 14):
                pts.append(((x0 + bend * t * t) * ss, (H + 4 - length * t) * ss))
            for (xa, ya), (xb, yb) in zip(pts, pts[1:]):
                wdt = int(max(1, width * ss * (1 - 0.8 * (H - yb / ss) / length)))
                dm.line([(xa, ya), (xb, yb)], fill=255, width=wdt)
                if rng.random() < 0.35:
                    dh.line([(xa + wdt * 0.3, ya), (xb + wdt * 0.3, yb)], fill=160, width=max(1, wdt // 2))
            # sementes no topo de alguns talos
            if rng.random() < 0.25:
                tx, ty = pts[-1]
                r_ = width * ss * 1.8
                dm.ellipse([tx - r_, ty - r_ * 3, tx + r_, ty + r_], fill=255)
                dh.ellipse([tx - r_ * 0.5, ty - r_ * 2.6, tx + r_ * 0.9, ty + r_ * 0.6], fill=200)
        gm = np.asarray(mask_img.resize((W, H), Image.LANCZOS), dtype=np.float32) / 255
        gh = np.asarray(hi_img.resize((W, H), Image.LANCZOS), dtype=np.float32) / 255
        gm = gaussian_filter(gm, 0.7)
        gh = gaussian_filter(gh, 0.9)
        dark = c(sc["bottom"][-1]) * 0.55
        img = img * (1 - gm[..., None]) + dark * gm[..., None]
        img = screen(img, gh[..., None] * c(sc["rim"]) * 0.75)

    # 8. Vazamento de luz lateral
    if shot.leak:
        side = 1 if rng.random() > 0.5 else 0
        d = np.abs(U - side)
        leak = np.exp(-d / 0.16) * (0.6 + 0.4 * np.sin(V * 3 + rng.random() * 6))
        img = screen(img, leak[..., None] * c("#ff9a5c") * shot.leak)

    # 9. Halação (brilho avermelhado em torno das altas luzes)
    lum = img @ np.array([0.299, 0.587, 0.114], dtype=np.float32)
    hl = np.clip((lum - 0.7) / 0.3, 0, 1)
    halo = gaussian_filter(hl[:: 4, :: 4], sigma=W * 0.004)
    halo = zoom(halo, (H / halo.shape[0], W / halo.shape[1]), order=1)[:H, :W]
    img = img + halo[..., None] * c("#ff7a4a") * 0.07

    # 10. Curva de filme: pretos levemente elevados, ombro suave nas altas luzes
    k = 2.1
    img = (1 - np.exp(-k * img)) / (1 - math.exp(-k))
    img = 0.028 + img * 0.955
    lum = img @ np.array([0.299, 0.587, 0.114], dtype=np.float32)
    sh, hi = (c(x) for x in SCENES[shot.scene]["split"])
    img = img + (sh - 0.5)[None, None] * 0.07 * ((1 - lum) ** 2)[..., None]
    img = img + (hi - 0.5)[None, None] * 0.05 * (lum ** 2)[..., None]

    # 11. Vinheta
    r = np.sqrt(((U - 0.5) * 2) ** 2 * 0.8 + ((V - 0.5) * 2) ** 2)
    img = img * (1 - 0.28 * np.clip(r, 0, 1.5) ** 2.4)[..., None]

    # 12. Grão de filme
    grain = rng.normal(size=(H, W)).astype(np.float32)
    grain = gaussian_filter(grain, 0.7) * 2.0
    lum = img @ np.array([0.299, 0.587, 0.114], dtype=np.float32)
    amp = 0.008 + 0.02 * (1 - np.abs(lum * 2 - 1) ** 2)
    img = img + (grain * amp)[..., None]

    out = np.clip(img * 255 + 0.5, 0, 255).astype(np.uint8)
    path = OUT / shot.path
    path.parent.mkdir(parents=True, exist_ok=True)
    Image.fromarray(out, "RGB").save(
        path, "JPEG", quality=shot.quality, optimize=True, progressive=True, subsampling=2
    )
    print(f"  {shot.path}  {W}x{H}  {path.stat().st_size // 1024} KB")


# ---------------------------------------------------------------------------
# Composições
# ---------------------------------------------------------------------------

L = (1800, 1200)  # paisagem 3:2
P = (1200, 1500)  # retrato 4:5
T = (1200, 1800)  # retrato 2:3
WIDE = (1920, 1080)  # 16:9
CINE = (2400, 1004)  # anamórfico 2.39:1


def family(x=0.5, feet=0.9, h=0.34, kids=2, spread=0.06, clothes=0, rng=None):
    rng = rng or np.random.default_rng(0)
    people = [
        Person(x - spread * 1.5, feet, h, 1.05, clothes),
        Person(x + spread * 1.5, feet + 0.004, h * 0.93, 0.95, clothes + 1),
    ]
    for i in range(kids):
        kx = x + (i - (kids - 1) / 2) * spread * 1.1
        people.append(Person(kx, feet + 0.01, h * (0.5 + rng.random() * 0.15), 1.1, clothes + 2 + i))
    return people


def couple(x=0.5, feet=0.95, h=0.7, gap=0.05, clothes=0, lean=0.03):
    return [
        Person(x - gap, feet, h, 1.05, clothes, lean=lean),
        Person(x + gap, feet + 0.003, h * 0.92, 0.95, clothes + 1, lean=-lean),
    ]


def shots() -> list[Shot]:
    r = np.random.default_rng(7)
    S: list[Shot] = []

    # --- Hero -----------------------------------------------------------
    S.append(Shot("hero/hero.jpg", "golden", (2400, 1500), 11,
                  people=family(0.62, 0.86, 0.36, 2, 0.05, rng=r),
                  light=(0.72, 0.5, 0.42, 1.0), links=True, bokeh=26, leak=0.12, quality=82))
    S.append(Shot("hero/hero-mobile.jpg", "golden", (1080, 1920), 12,
                  people=family(0.5, 0.8, 0.3, 2, 0.085, rng=r),
                  light=(0.62, 0.48, 0.5, 1.0), links=True, bokeh=22, leak=0.1, quality=80))

    # --- Manifesto (5 fases) -------------------------------------------
    S.append(Shot("manifesto/01.jpg", "linen", P, 21,
                  people=[Person(0.5, 1.35, 1.25, 1.1, 0), Person(0.44, 0.98, 0.42, 1.2, 2, lean=0.02)],
                  light=(0.15, 0.25, 0.5, 0.8), window=(-0.05, 0.05, 0.25, 0.6), backlit=False, bokeh=6))
    S.append(Shot("manifesto/02.jpg", "dusk", P, 22, people=couple(0.5, 1.2, 1.0, 0.07, 0, 0.04),
                  light=(0.5, 0.55, 0.4, 0.5), bokeh=34, bokeh_zone=(0, 0.1, 1, 0.6)))
    S.append(Shot("manifesto/03.jpg", "window", P, 23,
                  people=[Person(0.55, 1.05, 0.9, 1.0, 0, belly=-1)],
                  light=(0.1, 0.35, 0.4, 0.5), window=(0.02, 0.12, 0.28, 0.55), backlit=False, bokeh=0))
    S.append(Shot("manifesto/04.jpg", "golden", P, 24, people=couple(0.5, 0.92, 0.5, 0.045, 1, 0.01),
                  light=(0.62, 0.52, 0.45, 0.9), bokeh=20, leak=0.08))
    S.append(Shot("manifesto/05.jpg", "window", P, 25, people=[],
                  light=(0.7, 0.4, 0.5, 0.45), window=(0.55, 0.1, 0.32, 0.58), bokeh=4))

    # --- Portfólio ------------------------------------------------------
    # 1. Tarde de domingo — Famílias (campo)
    d = "portfolio/tarde-de-domingo/"
    S += [
        Shot(d + "cover.jpg", "golden", P, 101, people=family(0.5, 0.9, 0.42, 2, 0.07, rng=r),
             light=(0.55, 0.5, 0.45, 1.0), links=True, bokeh=24, quality=82),
        Shot(d + "01.jpg", "golden", L, 102, people=family(0.4, 0.84, 0.3, 2, 0.045, rng=r),
             light=(0.72, 0.52, 0.35, 1.0), links=True, bokeh=20, leak=0.1),
        Shot(d + "02.jpg", "golden", P, 103, people=[Person(0.5, 1.1, 0.8, 1.2, 2)],
             light=(0.4, 0.4, 0.4, 0.9), bokeh=20),
        Shot(d + "03.jpg", "golden", P, 104, people=couple(0.52, 1.25, 1.05, 0.08, 0, 0.03),
             light=(0.3, 0.45, 0.45, 0.9), bokeh=14),
        Shot(d + "04.jpg", "golden", L, 105, people=[], light=(0.6, 0.5, 0.5, 1.0), bokeh=40,
             bokeh_zone=(0, 0, 1, 1), bokeh_size=(0.015, 0.06), leak=0.18),
        Shot(d + "05.jpg", "golden", L, 106, people=family(0.6, 0.8, 0.22, 2, 0.035, rng=r),
             light=(0.45, 0.55, 0.3, 1.0), links=True, bokeh=12),
    ]

    # 2. Casa cheia — Famílias (interior)
    d = "portfolio/casa-cheia/"
    S += [
        Shot(d + "cover.jpg", "window", P, 201, people=family(0.55, 1.02, 0.62, 2, 0.08, 0, rng=r),
             light=(0.15, 0.3, 0.45, 0.6), window=(0.0, 0.08, 0.3, 0.6), backlit=False, bokeh=4, quality=82),
        Shot(d + "01.jpg", "window", L, 202, people=family(0.6, 0.95, 0.58, 2, 0.05, 1, rng=r),
             light=(0.2, 0.3, 0.4, 0.6), window=(0.05, 0.08, 0.2, 0.62), backlit=False, bokeh=3),
        Shot(d + "02.jpg", "linen", P, 203, people=[Person(0.5, 1.02, 0.5, 1.2, 1)],
             light=(0.3, 0.3, 0.45, 0.7), window=(0.0, 0.0, 0.3, 0.5), backlit=False, bokeh=6),
        Shot(d + "03.jpg", "window", P, 204, people=couple(0.5, 1.4, 1.3, 0.09, 2, 0.05),
             light=(0.75, 0.3, 0.45, 0.6), window=(0.7, 0.05, 0.3, 0.6), backlit=False, bokeh=0),
        Shot(d + "04.jpg", "window", L, 205, people=[], light=(0.3, 0.45, 0.4, 0.5),
             window=(0.18, 0.1, 0.24, 0.58), bokeh=6, bokeh_zone=(0.1, 0.2, 0.5, 0.5)),
        Shot(d + "05.jpg", "linen", L, 206, people=family(0.45, 0.95, 0.5, 1, 0.06, 0, rng=r),
             light=(0.8, 0.3, 0.5, 0.8), window=(0.72, 0.0, 0.3, 0.6), backlit=False, bokeh=4),
    ]

    # 3. Dez anos depois — Casais (praia)
    d = "portfolio/dez-anos-depois/"
    S += [
        Shot(d + "cover.jpg", "shore", P, 301, people=couple(0.5, 0.95, 0.62, 0.045, 0, 0.02),
             light=(0.5, 0.35, 0.6, 0.6), bokeh=4, quality=82),
        Shot(d + "01.jpg", "shore", L, 302, people=couple(0.32, 0.8, 0.28, 0.02, 1, 0.01),
             light=(0.6, 0.4, 0.6, 0.5), bokeh=3),
        Shot(d + "02.jpg", "shore", P, 303, people=couple(0.5, 1.35, 1.2, 0.08, 0, 0.05),
             light=(0.5, 0.3, 0.5, 0.5), bokeh=2),
        Shot(d + "03.jpg", "shore", P, 304, people=[Person(0.45, 1.25, 1.1, 1.0, 0)],
             light=(0.7, 0.3, 0.5, 0.6), bokeh=2),
        Shot(d + "04.jpg", "shore", L, 305, people=[], light=(0.45, 0.45, 0.7, 0.6), bokeh=0, leak=0.08),
        Shot(d + "05.jpg", "shore", L, 306, people=couple(0.7, 0.86, 0.36, 0.03, 1, 0.015),
             light=(0.3, 0.4, 0.6, 0.6), bokeh=2),
    ]

    # 4. Antes do sim — Casais / noivado (cidade ao anoitecer)
    d = "portfolio/antes-do-sim/"
    S += [
        Shot(d + "cover.jpg", "dusk", P, 401, people=couple(0.5, 1.05, 0.78, 0.05, 0, 0.03),
             light=(0.5, 0.55, 0.35, 0.55), bokeh=40, bokeh_zone=(0, 0.1, 1, 0.65), quality=82),
        Shot(d + "01.jpg", "dusk", L, 402, people=couple(0.62, 0.95, 0.58, 0.04, 1, 0.02),
             light=(0.3, 0.55, 0.3, 0.5), bokeh=50, bokeh_zone=(0, 0.15, 1, 0.55)),
        Shot(d + "02.jpg", "dusk", P, 403, people=[Person(0.5, 1.3, 1.15, 1.0, 2)],
             light=(0.5, 0.45, 0.35, 0.45), bokeh=36, bokeh_zone=(0, 0, 1, 0.7)),
        Shot(d + "03.jpg", "dusk", L, 404, people=[], light=(0.5, 0.55, 0.5, 0.5), bokeh=70,
             bokeh_zone=(0, 0, 1, 1), bokeh_size=(0.01, 0.07)),
        Shot(d + "04.jpg", "dusk", P, 405, people=couple(0.5, 1.45, 1.3, 0.07, 0, 0.06),
             light=(0.5, 0.35, 0.4, 0.45), bokeh=30),
        Shot(d + "05.jpg", "dusk", L, 406, people=couple(0.38, 0.9, 0.44, 0.035, 0, 0.02),
             light=(0.7, 0.55, 0.3, 0.5), bokeh=46, bokeh_zone=(0.3, 0.1, 0.7, 0.6)),
    ]

    # 5. Quarenta semanas — Gestantes
    d = "portfolio/quarenta-semanas/"
    S += [
        Shot(d + "cover.jpg", "linen", P, 501, people=[Person(0.48, 1.05, 0.9, 1.0, 0, belly=1)],
             light=(0.85, 0.3, 0.5, 0.8), window=(0.72, 0.02, 0.3, 0.62), backlit=False, bokeh=3, quality=82),
        Shot(d + "01.jpg", "window", L, 502, people=[Person(0.55, 0.98, 0.78, 1.0, 0, belly=-1)],
             light=(0.2, 0.3, 0.4, 0.6), window=(0.08, 0.08, 0.22, 0.62), backlit=False, bokeh=0),
        Shot(d + "02.jpg", "golden", P, 503, people=[Person(0.5, 0.95, 0.62, 1.0, 0, belly=1),
                                                      Person(0.43, 0.955, 0.66, 1.05, 2)],
             light=(0.62, 0.5, 0.4, 0.9), bokeh=22, leak=0.08),
        Shot(d + "03.jpg", "linen", P, 504, people=[Person(0.5, 1.6, 1.5, 1.1, 1, belly=-1)],
             light=(0.2, 0.2, 0.5, 0.8), window=(0.0, 0.0, 0.25, 0.5), backlit=False, bokeh=2),
        Shot(d + "04.jpg", "linen", L, 505, people=[], light=(0.65, 0.35, 0.5, 0.8),
             window=(0.52, 0.02, 0.3, 0.62), bokeh=5),
        Shot(d + "05.jpg", "golden", L, 506, people=[Person(0.4, 0.86, 0.4, 1.0, 0, belly=1)],
             light=(0.62, 0.52, 0.35, 1.0), bokeh=20),
    ]

    # 6. Primeiro verão — Infantil
    d = "portfolio/primeiro-verao/"
    S += [
        Shot(d + "cover.jpg", "grove", P, 601, people=[Person(0.5, 0.95, 0.5, 1.25, 0)],
             light=(0.55, 0.3, 0.5, 0.8), bokeh=34, bokeh_zone=(0, 0, 1, 0.6), quality=82),
        Shot(d + "01.jpg", "grove", L, 602, people=[Person(0.42, 0.9, 0.36, 1.25, 1),
                                                     Person(0.55, 0.92, 0.3, 1.25, 3)],
             light=(0.6, 0.3, 0.4, 0.8), bokeh=40, bokeh_zone=(0, 0, 1, 0.6)),
        Shot(d + "02.jpg", "linen", P, 603, people=[Person(0.5, 1.5, 1.2, 1.3, 0)],
             light=(0.3, 0.3, 0.5, 0.8), window=(0.0, 0.0, 0.3, 0.55), backlit=False, bokeh=4),
        Shot(d + "03.jpg", "grove", P, 604, people=[Person(0.62, 1.4, 1.3, 1.0, 1),
                                                     Person(0.42, 1.0, 0.45, 1.3, 0)],
             light=(0.3, 0.3, 0.4, 0.7), bokeh=26),
        Shot(d + "04.jpg", "grove", L, 605, people=[], light=(0.5, 0.35, 0.5, 0.8), bokeh=60,
             bokeh_zone=(0, 0, 1, 1), bokeh_size=(0.01, 0.05)),
        Shot(d + "05.jpg", "golden", L, 606, people=[Person(0.5, 0.86, 0.28, 1.25, 1)],
             light=(0.5, 0.52, 0.35, 1.0), bokeh=16, leak=0.12),
    ]

    # 7. Presença — Retratos profissionais (estúdio)
    d = "portfolio/presenca/"
    S += [
        Shot(d + "cover.jpg", "studio", P, 701, people=[Person(0.5, 1.75, 1.55, 1.05, 0)],
             light=(0.5, 0.35, 0.45, 0.6), backlit=False, bokeh=0, quality=82),
        Shot(d + "01.jpg", "studio", L, 702, people=[Person(0.62, 1.7, 1.45, 1.0, 2)],
             light=(0.45, 0.4, 0.5, 0.55), backlit=False, bokeh=0),
        Shot(d + "02.jpg", "studio", P, 703, people=[Person(0.5, 1.2, 1.0, 1.0, 1)],
             light=(0.5, 0.3, 0.45, 0.5), backlit=False, bokeh=0),
        Shot(d + "03.jpg", "studio", P, 704, people=[Person(0.45, 2.1, 1.95, 1.0, 0, lean=0.02)],
             light=(0.6, 0.3, 0.4, 0.6), backlit=False, bokeh=0),
        Shot(d + "04.jpg", "window", L, 705, people=[Person(0.35, 1.3, 1.05, 1.0, 3)],
             light=(0.7, 0.3, 0.4, 0.5), window=(0.62, 0.06, 0.26, 0.62), backlit=False, bokeh=0),
        Shot(d + "05.jpg", "studio", L, 706, people=[], light=(0.5, 0.45, 0.6, 0.6), bokeh=0),
    ]

    # 8. Luz de janela — Retratos individuais
    d = "portfolio/luz-de-janela/"
    S += [
        Shot(d + "cover.jpg", "window", P, 801, people=[Person(0.55, 1.6, 1.4, 1.0, 0, lean=-0.02)],
             light=(0.1, 0.35, 0.4, 0.55), window=(0.0, 0.1, 0.22, 0.6), backlit=False, bokeh=0, quality=82),
        Shot(d + "01.jpg", "window", L, 802, people=[Person(0.62, 1.1, 0.82, 1.0, 1)],
             light=(0.25, 0.3, 0.4, 0.55), window=(0.1, 0.06, 0.24, 0.62), backlit=False, bokeh=0),
        Shot(d + "02.jpg", "window", P, 803, people=[Person(0.45, 2.0, 1.85, 1.0, 2, lean=0.03)],
             light=(0.8, 0.3, 0.4, 0.6), window=(0.75, 0.05, 0.25, 0.6), backlit=False, bokeh=0),
        Shot(d + "03.jpg", "linen", P, 804, people=[Person(0.5, 1.3, 1.1, 1.0, 0)],
             light=(0.3, 0.25, 0.5, 0.8), window=(0.0, 0.0, 0.3, 0.55), backlit=False, bokeh=2),
        Shot(d + "04.jpg", "window", L, 805, people=[], light=(0.5, 0.35, 0.5, 0.45),
             window=(0.4, 0.08, 0.22, 0.6), bokeh=8, bokeh_zone=(0.3, 0.1, 0.4, 0.6)),
        Shot(d + "05.jpg", "window", L, 806, people=[Person(0.3, 1.25, 1.0, 1.0, 0, lean=0.02)],
             light=(0.75, 0.35, 0.45, 0.6), window=(0.64, 0.05, 0.28, 0.62), backlit=False, bokeh=0),
    ]

    # --- Categorias -----------------------------------------------------
    S += [
        Shot("categories/familias.jpg", "grove", T, 901, people=family(0.5, 0.88, 0.36, 2, 0.08, 1, rng=r),
             light=(0.5, 0.35, 0.45, 0.8), links=True, bokeh=30, bokeh_zone=(0, 0, 1, 0.55)),
        Shot("categories/casais.jpg", "shore", T, 902, people=couple(0.5, 0.95, 0.55, 0.04, 0, 0.02),
             light=(0.5, 0.35, 0.6, 0.6), bokeh=2),
        Shot("categories/gestantes.jpg", "window", T, 903, people=[Person(0.52, 1.02, 0.8, 1.0, 0, belly=-1)],
             light=(0.12, 0.3, 0.4, 0.6), window=(0.0, 0.08, 0.3, 0.55), backlit=False, bokeh=0),
        Shot("categories/infantil.jpg", "golden", T, 904, people=[Person(0.5, 0.9, 0.34, 1.25, 1)],
             light=(0.52, 0.52, 0.45, 1.0), bokeh=26, leak=0.1),
        Shot("categories/retratos.jpg", "studio", T, 905, people=[Person(0.5, 1.8, 1.5, 1.05, 0)],
             light=(0.5, 0.3, 0.5, 0.6), backlit=False, bokeh=0),
    ]

    # --- Momentos editoriais -------------------------------------------
    S += [
        Shot("cinematic/break.jpg", "shore", CINE, 1001, people=family(0.64, 0.82, 0.3, 1, 0.03, 1, rng=r),
             light=(0.4, 0.4, 0.5, 0.6), links=True, bokeh=2, leak=0.06, quality=80),
        Shot("cta/cta.jpg", "dusk", WIDE, 1002, people=family(0.5, 0.95, 0.52, 1, 0.05, 0, rng=r),
             light=(0.5, 0.58, 0.4, 0.6), links=True, bokeh=46, bokeh_zone=(0, 0.1, 1, 0.55)),
        Shot("experience/01.jpg", "window", L, 1003, people=couple(0.6, 1.2, 0.95, 0.07, 1, 0.03),
             light=(0.2, 0.3, 0.4, 0.55), window=(0.06, 0.08, 0.22, 0.6), backlit=False, bokeh=0),
        Shot("experience/02.jpg", "golden", P, 1004, people=[Person(0.45, 0.9, 0.5, 1.0, 1),
                                                              Person(0.6, 0.91, 0.3, 1.25, 3)],
             light=(0.6, 0.5, 0.4, 1.0), links=True, bokeh=18),
    ]

    # --- Sobre ----------------------------------------------------------
    S += [
        Shot("about/photographer.jpg", "studio", P, 1101, people=[Person(0.52, 1.7, 1.5, 1.05, 0, lean=0.015)],
             light=(0.35, 0.3, 0.45, 0.6), backlit=False, bokeh=0, quality=82),
        Shot("about/behind-01.jpg", "golden", L, 1102, people=[Person(0.3, 0.95, 0.7, 1.0, 2),
                                                               *family(0.72, 0.8, 0.28, 1, 0.035, 0, rng=r)],
             light=(0.75, 0.5, 0.4, 1.0), bokeh=16, leak=0.08),
        Shot("about/behind-02.jpg", "window", P, 1103, people=[Person(0.5, 1.2, 0.95, 1.0, 1)],
             light=(0.8, 0.3, 0.4, 0.55), window=(0.7, 0.05, 0.3, 0.6), backlit=False, bokeh=0),
    ]

    # --- Instagram (diário visual) -------------------------------------
    IG = (1080, 1350)
    S += [
        Shot("instagram/01.jpg", "golden", IG, 1201, people=[Person(0.5, 1.2, 0.9, 1.2, 0)],
             light=(0.45, 0.45, 0.45, 1.0), bokeh=26, leak=0.1),
        Shot("instagram/02.jpg", "window", IG, 1202, people=[], light=(0.5, 0.35, 0.5, 0.5),
             window=(0.36, 0.08, 0.3, 0.55), bokeh=4),
        Shot("instagram/03.jpg", "dusk", IG, 1203, people=couple(0.5, 1.2, 0.95, 0.06, 0, 0.04),
             light=(0.5, 0.5, 0.4, 0.5), bokeh=36),
        Shot("instagram/04.jpg", "linen", IG, 1204, people=[Person(0.5, 1.15, 0.7, 1.0, 0, belly=1)],
             light=(0.8, 0.3, 0.5, 0.8), window=(0.7, 0.0, 0.3, 0.55), backlit=False, bokeh=3),
        Shot("instagram/05.jpg", "grove", IG, 1205, people=family(0.5, 0.9, 0.4, 1, 0.07, 0, rng=r),
             light=(0.5, 0.3, 0.5, 0.8), links=True, bokeh=30, bokeh_zone=(0, 0, 1, 0.55)),
        Shot("instagram/06.jpg", "studio", IG, 1206, people=[Person(0.5, 1.9, 1.65, 1.0, 1)],
             light=(0.4, 0.3, 0.45, 0.6), backlit=False, bokeh=0),
    ]
    return S


def main() -> None:
    import sys

    only = sys.argv[1] if len(sys.argv) > 1 else None
    todo = [s for s in shots() if not only or s.path.startswith(only)]
    print(f"Gerando {len(todo)} placeholders em {OUT} ...")
    for shot in todo:
        render(shot)


if __name__ == "__main__":
    main()
