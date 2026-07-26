import React from "react";
import { motion } from "framer-motion";
import { Download } from "lucide-react";
import SlowRise from "@/components/gallery/SlowRise";
import GalleryImage from "@/components/gallery/GalleryImage";

function DownloadCard({ img, index }) {
  const handleDownload = async () => {
    try {
      const response = await fetch(img.src);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `archive-${index + 1}.jpg`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch {
      window.open(img.src, "_blank");
    }
  };

  const heights = ["320px", "400px", "280px", "360px", "300px", "440px"];
  const h = heights[index % heights.length];

  return (
    <SlowRise delay={index * 0.08} className="break-inside-avoid mb-4 md:mb-6">
      <motion.div
        className="relative group cursor-pointer overflow-hidden rounded-sm"
        whileHover={{ y: -4 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        onClick={handleDownload}
      >
        <GalleryImage
          src={img.src}
          alt={img.alt}
          style={{ height: h }}
        />
        {/* Download overlay */}
        <div className="absolute inset-0 flex items-end justify-center pb-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            whileHover={{ y: 0, opacity: 1 }}
            className="flex items-center gap-2 px-4 py-2 rounded-full"
            style={{
              background: "rgba(26, 26, 26, 0.85)",
              backdropFilter: "blur(8px)",
            }}
          >
            <Download size={14} color="#F2F1ED" />
            <span className="font-mono text-[11px] uppercase tracking-widest" style={{ color: "#F2F1ED" }}>
              Download
            </span>
          </motion.div>
        </div>
      </motion.div>
    </SlowRise>
  );
}

export default function ArchiveSection({ images }) {
  return (
    <section id="archive" className="py-24 md:py-40">
      <div className="px-8 md:px-16 mb-12 md:mb-20">
        <SlowRise>
          <p
            className="font-mono text-xs uppercase tracking-[0.3em] mb-3"
            style={{ color: "#8C867A" }}
          >
            Act II
          </p>
          <h2
            className="font-display text-3xl md:text-5xl tracking-tight"
            style={{ color: "#1A1A1A", letterSpacing: "-0.02em" }}
          >
            The Archive
          </h2>
          <p className="mt-4 text-sm md:text-base max-w-lg" style={{ color: "#8C867A", lineHeight: 1.6 }}>
            Select any image to download. Each piece is preserved at its original resolution, 
            ready to be held, printed, or reimagined.
          </p>
        </SlowRise>
      </div>

      {/* Masonry grid */}
      <div className="px-8 md:px-16">
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 md:gap-6">
          {images.map((img, i) => (
            <DownloadCard key={i} img={img} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}