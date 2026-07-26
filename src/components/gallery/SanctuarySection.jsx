import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import SlowRise from "@/components/gallery/SlowRise";
import GalleryImage from "@/components/gallery/GalleryImage";

export default function SanctuarySection({ images }) {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });
  const textX = useTransform(scrollYProgress, [0, 1], ["0%", "-15%"]);

  return (
    <section id="sanctuary" ref={containerRef} className="relative py-24 md:py-40">
      {/* Parallax background text */}
      <motion.div
        style={{ x: textX }}
        className="absolute top-16 md:top-24 left-0 pointer-events-none select-none overflow-hidden whitespace-nowrap"
      >
        <span
          className="font-display text-[12vw] md:text-[10vw] italic opacity-[0.04] tracking-tight"
          style={{ color: "#1A1A1A" }}
        >
          Sanctuary · Sanctuary · Sanctuary
        </span>
      </motion.div>

      <div className="px-8 md:px-16 mb-12 md:mb-20">
        <SlowRise>
          <p
            className="font-mono text-xs uppercase tracking-[0.3em] mb-3"
            style={{ color: "#8C867A" }}
          >
            Act I
          </p>
          <h2
            className="font-display text-3xl md:text-5xl tracking-tight"
            style={{ color: "#1A1A1A", letterSpacing: "-0.02em" }}
          >
            The Sanctuary
          </h2>
        </SlowRise>
      </div>

      {/* Horizontal filmstrip */}
      <div className="filmstrip-scroll overflow-x-auto">
        <div className="flex gap-4 md:gap-6 px-8 md:px-16 pb-6" style={{ width: "max-content" }}>
          {images.map((img, i) => (
            <SlowRise key={i} delay={i * 0.1}>
              <motion.div
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="relative group cursor-pointer flex-shrink-0"
              >
                <GalleryImage
                  src={img.src}
                  alt={img.alt}
                  className="rounded-sm"
                  style={{
                    width: img.width || "360px",
                    height: img.height || "480px",
                  }}
                />
                {/* Lens soften — dim surroundings on hover */}
                <div
                  className="absolute inset-0 rounded-sm opacity-0 group-hover:opacity-100 transition-opacity duration-700"
                  style={{
                    boxShadow: "0 0 0 100vmax rgba(242, 241, 237, 0.5)",
                  }}
                />
                {/* Metadata */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  whileHover={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  className="absolute bottom-4 left-4 right-4"
                >
                  <p className="font-mono text-[11px] uppercase tracking-widest" style={{ color: "#F2F1ED" }}>
                    {img.alt}
                  </p>
                </motion.div>
              </motion.div>
            </SlowRise>
          ))}
        </div>
      </div>
    </section>
  );
}