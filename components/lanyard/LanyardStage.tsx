"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";

// three.js / rapier (WASM) are only downloaded when the 3D stage actually mounts.
const LanyardScene = dynamic(() => import("./LanyardScene"), { ssr: false });

/** Marks the element (in the hero's right column) the lanyard should hang above. */
export const LANYARD_ANCHOR_ATTR = "data-lanyard-anchor";

interface Layout {
  anchorX: number;
  /** Changes on resize so the physics scene re-mounts with a fresh anchor. */
  key: string;
}

/**
 * Desktop-only 3D layer covering the whole hero. The canvas itself is click-through; it takes
 * pointer events from the hero section, so the card can be dragged across the full hero while
 * the text and buttons underneath stay interactive. Rendering pauses when scrolled out of view.
 */
export function LanyardStage() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(true);
  const [section, setSection] = useState<HTMLElement | null>(null);
  const [layout, setLayout] = useState<Layout | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    setSection(el.parentElement);

    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting));
    observer.observe(el);

    let timer: number | undefined;
    const measure = () => {
      const stage = el.getBoundingClientRect();
      const anchor = el.parentElement
        ?.querySelector(`[${LANYARD_ANCHOR_ATTR}]`)
        ?.getBoundingClientRect();
      const anchorX = anchor ? (anchor.left + anchor.width / 2 - stage.left) / stage.width : 0.75;
      setLayout({ anchorX, key: `${Math.round(stage.width)}x${Math.round(stage.height)}` });
    };
    const onResize = () => {
      window.clearTimeout(timer);
      timer = window.setTimeout(measure, 200);
    };
    measure();
    window.addEventListener("resize", onResize);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", onResize);
      window.clearTimeout(timer);
    };
  }, []);

  return (
    <motion.div
      ref={ref}
      aria-hidden
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, delay: 0.2 }}
      className="pointer-events-none absolute inset-0 z-10"
    >
      {section && layout && (
        <LanyardScene
          key={layout.key}
          active={visible}
          anchorX={layout.anchorX}
          eventSource={section}
        />
      )}
    </motion.div>
  );
}
