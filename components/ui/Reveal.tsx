"use client";

import { motion, type HTMLMotionProps } from "framer-motion";

interface RevealProps extends HTMLMotionProps<"div"> {
  delay?: number;
  /** Starting horizontal offset in px (e.g. -32 to slide in from the left). */
  x?: number;
  /** Starting vertical offset in px. */
  y?: number;
}

/** Fades & slides its children in the first time they scroll into view. */
export function Reveal({ children, delay = 0, x = 0, y = 24, ...rest }: RevealProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x, y }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -80px 0px" }}
      transition={{ duration: 0.6, delay, ease: [0.21, 0.47, 0.32, 0.98] }}
      {...rest}
    >
      {children}
    </motion.div>
  );
}
