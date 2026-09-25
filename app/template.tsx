"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

/** Re-mounts on every navigation, giving each route a soft fade-in transition. */
export default function Template({ children }: { children: ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}
