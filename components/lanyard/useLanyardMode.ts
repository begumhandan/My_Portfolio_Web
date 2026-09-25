"use client";

import { useEffect, useState } from "react";

export type LanyardMode = "3d" | "static";

function supportsWebGL() {
  try {
    const canvas = document.createElement("canvas");
    return !!(canvas.getContext("webgl2") || canvas.getContext("webgl"));
  } catch {
    return false;
  }
}

/**
 * "3d" only on desktop-sized screens (≥ 1024px) with WebGL and no reduced-motion preference.
 * Returns null until mounted so SSR and the first client render agree.
 */
export function useLanyardMode(): LanyardMode | null {
  const [mode, setMode] = useState<LanyardMode | null>(null);

  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 1024px)");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const webgl = supportsWebGL();

    const update = () => setMode(desktop.matches && !reduced.matches && webgl ? "3d" : "static");
    update();

    desktop.addEventListener("change", update);
    reduced.addEventListener("change", update);
    return () => {
      desktop.removeEventListener("change", update);
      reduced.removeEventListener("change", update);
    };
  }, []);

  return mode;
}
