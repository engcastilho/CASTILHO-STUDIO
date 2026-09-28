"use client";

import { useEffect, useRef, useState } from "react";

import { useFinePointer } from "@/lib/hooks";

/**
 * Cursor contextual: sobre elementos com [data-cursor="Ver ensaio"], uma pequena etiqueta
 * acompanha o ponteiro. O cursor nativo continua visível (usabilidade em primeiro lugar).
 * Só existe em dispositivos com mouse; em telas de toque, não é montado.
 */
export function CursorLabel() {
  const ref = useRef<HTMLDivElement>(null);
  const enabled = useFinePointer();
  const [label, setLabel] = useState("");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!enabled) return;
    let frame = 0;
    let x = 0;
    let y = 0;
    let current: Element | null = null;

    const paint = () => {
      frame = 0;
      ref.current?.style.setProperty("--x", `${x}px`);
      ref.current?.style.setProperty("--y", `${y}px`);
    };

    const onMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      x = event.clientX;
      y = event.clientY;
      const target = (event.target as Element | null)?.closest?.("[data-cursor]") ?? null;
      if (target !== current) {
        current = target;
        if (target) setLabel(target.getAttribute("data-cursor") ?? "");
        setVisible(Boolean(target));
      }
      if (!frame) frame = requestAnimationFrame(paint);
    };
    const onLeave = () => {
      current = null;
      setVisible(false);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    window.addEventListener("scroll", onLeave, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("scroll", onLeave);
      cancelAnimationFrame(frame);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div ref={ref} className="cursor-label" data-visible={visible} aria-hidden>
      <span className="flex h-20 w-20 items-center justify-center rounded-full bg-paper/90 text-center text-[0.625rem] font-medium uppercase leading-tight tracking-[0.18em] text-ink shadow-[0_8px_30px_rgba(0,0,0,0.12)] backdrop-blur-md">
        {label}
      </span>
    </div>
  );
}
