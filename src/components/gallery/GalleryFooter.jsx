import React from "react";
import { motion } from "framer-motion";
import SlowRise from "@/components/gallery/SlowRise";

export default function GalleryFooter({ pdfUrl }) {
  return (
    <footer className="relative py-24 md:py-40 px-8 md:px-16 overflow-hidden">
      {/* Horizontal rule */}
      <motion.div
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
        className="origin-left h-px w-full mb-16 md:mb-24"
        style={{ background: "rgba(140, 134, 122, 0.3)" }}
      />

      <SlowRise>
        <h3
          className="font-display text-4xl md:text-[7vw] leading-[0.9] tracking-tight"
          style={{ color: "#1A1A1A", letterSpacing: "-0.02em" }}
        >
          El Archivo
          <br />
          <span className="italic font-normal" style={{ color: "#8C867A" }}>
            Permanece.
          </span>
        </h3>
      </SlowRise>

      <div className="flex flex-col md:flex-row items-start md:items-end justify-between mt-16 md:mt-24 gap-8">
        <SlowRise delay={0.1}>
          <p className="font-mono text-[11px] uppercase tracking-widest" style={{ color: "#8C867A" }}>
            © {new Date().getFullYear()} Archive of Light
          </p>
        </SlowRise>

        {pdfUrl && (
          <SlowRise delay={0.2}>
            <a
              href={pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-[11px] uppercase tracking-widest transition-colors duration-300 hover:text-[#1A1A1A]"
              style={{ color: "#8C867A" }}
            >
              Download the Album →
            </a>
          </SlowRise>
        )}
      </div>
    </footer>
  );
}