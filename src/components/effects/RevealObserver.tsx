"use client";

import { useEffect } from "react";

/**
 * Um único IntersectionObserver para o site inteiro.
 * Marca com [data-revealed] cada elemento [data-reveal] que entra na tela — as animações
 * em si são CSS puro (globals.css). Um MutationObserver cobre novas páginas e filtros.
 */
export function RevealObserver() {
  useEffect(() => {
    if (!("IntersectionObserver" in window)) {
      document.documentElement.classList.remove("js");
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.setAttribute("data-revealed", "");
            io.unobserve(entry.target);
          }
        }
      },
      { rootMargin: "0px 0px -6% 0px", threshold: 0.08 },
    );

    const observe = (root: ParentNode) => {
      root.querySelectorAll("[data-reveal]:not([data-revealed])").forEach((element) => io.observe(element));
    };
    observe(document);

    const mo = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        mutation.addedNodes.forEach((node) => {
          if (!(node instanceof Element)) return;
          if (node.matches("[data-reveal]:not([data-revealed])")) io.observe(node);
          observe(node);
        });
      }
    });
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      io.disconnect();
      mo.disconnect();
    };
  }, []);

  return null;
}
