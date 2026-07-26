import React from "react";
import { motion } from "framer-motion";

export default function HeroSection({ heroImage }) {
  return (
    <section className="relative w-full h-screen overflow-hidden flex items-end">
      {/* Background image */}
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="Archive of Light — Gallery entrance"
          className="w-full h-full object-cover"
        />
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(to bottom, rgba(242,241,237,0.1) 0%, rgba(242,241,237,0.85) 80%, rgba(242,241,237,1) 100%)",
          }}
        />
      </div>

      {/* Title */}
      <div className="relative z-10 w-full px-8 md:px-16 pb-16 md:pb-24">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="font-mono text-xs uppercase tracking-[0.3em] mb-4"
          style={{ color: "#8C867A" }}
        >
          A Digital Sanctuary
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 40, filter: "blur(8px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 1.4, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="font-display text-5xl md:text-[8vw] leading-[0.9] tracking-tight"
          style={{ color: "#1A1A1A", letterSpacing: "-0.02em" }}
        >
          The Archive
          <br />
          <span className="italic font-normal" style={{ color: "#8C867A" }}>
            of Light
          </span>
        </motion.h1>
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1.2, delay: 1, ease: [0.22, 1, 0.36, 1] }}
          className="origin-left mt-8 h-px w-32 md:w-64"
          style={{ background: "#8C867A" }}
        />
      </div>
    </section>
  );
}