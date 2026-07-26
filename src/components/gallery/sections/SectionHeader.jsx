import React from "react";
import { motion } from "framer-motion";

export default function SectionHeader({ number, title, description }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40, filter: "blur(8px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
      className="mb-12 md:mb-20"
    >
      <div className="flex items-center gap-4 mb-4">
        <span
          className="font-mono text-xs tracking-[0.3em]"
          style={{ color: "#8C867A" }}
        >
          {number}
        </span>
        <div
          className="h-px w-12"
          style={{ background: "rgba(140, 134, 122, 0.4)" }}
        />
      </div>
      <h2
        className="font-display text-3xl md:text-5xl tracking-tight mb-4"
        style={{ color: "#1A1A1A", letterSpacing: "-0.02em" }}
      >
        {title}
      </h2>
      {description && (
        <p
          className="text-sm md:text-base max-w-xl"
          style={{ color: "#8C867A", lineHeight: 1.8 }}
        >
          {description}
        </p>
      )}
    </motion.div>
  );
}