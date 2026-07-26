import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Palette } from "lucide-react";
import SectionHeader from "./SectionHeader";
import GalleryImage from "@/components/gallery/GalleryImage";
import { base44 } from "@/api/base44Client";

const QUOTES = [
  "La escultura es el arte de la inteligencia.",
  "Cada forma esconde un alma que espera ser liberada.",
  "El arte no reproduce lo visible, lo hace visible.",
];

function FeaturedImage({ images, index }) {
  const current = images[index];

  return (
    <div className="relative overflow-hidden rounded-sm" style={{ aspectRatio: "4 / 5" }}>
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0, scale: 1.08, filter: "blur(14px)" }}
          animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
          exit={{ opacity: 0, scale: 0.96, filter: "blur(10px)" }}
          transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0"
        >
          {/* Slow Ken Burns drift */}
          <motion.div
            initial={{ scale: 1 }}
            animate={{ scale: 1.06, x: "1%", y: "-1%" }}
            transition={{ duration: 8, ease: "easeInOut" }}
            className="w-full h-full"
          >
            <GalleryImage
              src={current.viewUrl}
              alt={`Escultura y Arte — ${index + 1}`}
              className="w-full h-full"
            />
          </motion.div>
        </motion.div>
      </AnimatePresence>

      {/* Soft gradient veil */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(to top, rgba(26,26,26,0.35) 0%, transparent 45%)",
        }}
      />

      {/* Counter */}
      <div className="absolute bottom-5 right-5 z-10">
        <p
          className="font-mono text-[10px] uppercase tracking-[0.3em]"
          style={{ color: "#F2F1ED", textShadow: "0 1px 4px rgba(0,0,0,0.5)" }}
        >
          {String(index + 1).padStart(2, "0")} / {String(images.length).padStart(2, "0")}
        </p>
      </div>
    </div>
  );
}

function MosaicTile({ img, index, isActive, onSelect }) {
  // Vary tile sizes for a mosaic feel
  const sizes = [
    { col: "col-span-2", row: "row-span-2", h: "h-full" },
    { col: "col-span-1", row: "row-span-1", h: "h-32 md:h-40" },
    { col: "col-span-1", row: "row-span-2", h: "h-full" },
    { col: "col-span-2", row: "row-span-1", h: "h-32 md:h-40" },
  ];
  const size = sizes[index % sizes.length];

  return (
    <motion.button
      initial={{ opacity: 0, y: 30, filter: "blur(8px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 1, delay: (index % 4) * 0.12, ease: [0.22, 1, 0.36, 1] }}
      onClick={() => onSelect(index)}
      className={`relative overflow-hidden rounded-sm ${size.col} ${size.row} ${size.h} group cursor-pointer`}
    >
      <GalleryImage
        src={img.viewUrl}
        alt={`Escultura y Arte — ${index + 1}`}
        className="w-full h-full transition-transform duration-[1.2s] ease-out group-hover:scale-105"
      />
      <div
        className="absolute inset-0 transition-opacity duration-700"
        style={{
          background: isActive ? "transparent" : "rgba(26,26,26,0.3)",
          opacity: isActive ? 0 : 1,
        }}
      />
      {isActive && (
        <div
          className="absolute inset-0"
          style={{ boxShadow: "inset 0 0 0 2px #1A1A1A" }}
        />
      )}
    </motion.button>
  );
}

function LargeCarousel({ images, offsetIndex, featured, onSelect }) {
  const [paused, setPaused] = useState(false);
  const loopImages = images.length > 1 ? [...images, ...images] : images;

  return (
    <div
      className="overflow-hidden pb-2"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div
        className={`flex gap-4 md:gap-6 scroll-left-large ${paused ? "paused" : ""}`}
        style={{ width: "max-content" }}
      >
        {loopImages.map((img, i) => {
          const realIndex = (i % images.length) + offsetIndex;
          const isActive = featured === realIndex;
          return (
            <button
              key={`${img.id}-${i}`}
              onClick={() => onSelect(realIndex)}
              className="relative overflow-hidden rounded-sm flex-shrink-0 group cursor-pointer"
              style={{ width: "280px", height: "360px" }}
            >
              <GalleryImage
                src={img.viewUrl}
                alt={`Escultura y Arte — ${realIndex + 1}`}
                className="w-full h-full transition-transform duration-[1.2s] ease-out group-hover:scale-105"
              />
              <div
                className="absolute inset-0 transition-opacity duration-700"
                style={{
                  background: isActive ? "transparent" : "rgba(26,26,26,0.25)",
                  opacity: isActive ? 0 : 1,
                }}
              />
              {isActive && (
                <div
                  className="absolute inset-0"
                  style={{ boxShadow: "inset 0 0 0 2px #1A1A1A" }}
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default function EsculturaArteSection() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [featured, setFeatured] = useState(0);
  const quoteRef = useRef(Math.floor(Math.random() * QUOTES.length));

  useEffect(() => {
    base44.functions
      .invoke("listDriveImages", { folderPath: "Web/05-escultura y arte" })
      .then((res) => setImages(res.data.images || []))
      .catch(() => setImages([]))
      .finally(() => setLoading(false));
  }, []);

  // Slow auto-rotation of featured image
  useEffect(() => {
    if (images.length <= 1) return;
    const t = setInterval(() => {
      setFeatured((i) => (i + 1) % images.length);
    }, 6000);
    return () => clearInterval(t);
  }, [images.length]);

  const handleSelect = (i) => {
    setFeatured(i);
  };

  return (
    <section id="escultura-arte" className="py-24 md:py-32 px-8 md:px-16">
      <SectionHeader
        number="03"
        title="Escultura y Arte"
        description="Formas talladas en el tiempo. Un recorrido por las obras que hablaron sin palabras."
      />

      {loading ? (
        <div className="flex flex-col md:flex-row gap-8 md:gap-12">
          <div className="flex-1 shimmer rounded-sm" style={{ aspectRatio: "4 / 5" }} />
          <div className="flex-1 grid grid-cols-3 gap-3">
            {[...Array(7)].map((_, i) => (
              <div key={i} className="shimmer rounded-sm h-32 md:h-40" />
            ))}
          </div>
        </div>
      ) : images.length === 0 ? (
        <p
          className="font-mono text-xs uppercase tracking-[0.3em]"
          style={{ color: "#8C867A" }}
        >
          No se encontraron imágenes
        </p>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2 }}
        >
          {/* Quote */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, delay: 0.3 }}
            className="flex items-center gap-3 mb-10 md:mb-14"
          >
            <Palette size={18} strokeWidth={1.5} style={{ color: "#8C867A" }} />
            <p
              className="font-display italic text-base md:text-lg"
              style={{ color: "#8C867A" }}
            >
              {QUOTES[quoteRef.current]}
            </p>
          </motion.div>

          {/* Featured + Mosaic */}
          <div className="flex flex-col md:flex-row gap-8 md:gap-12 items-start">
            {/* Featured large image */}
            <div className="w-full md:w-[42%] md:flex-shrink-0">
              <FeaturedImage images={images} index={featured} />
            </div>

            {/* Interactive mosaic */}
            <div className="flex-1 w-full">
              <div className="grid grid-cols-3 auto-rows-fr gap-3 md:gap-4">
                {images.slice(0, 9).map((img, i) => (
                  <MosaicTile
                    key={img.id}
                    img={img}
                    index={i}
                    isActive={featured === i}
                    onSelect={handleSelect}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Large auto-scrolling carousel for remaining images */}
          {images.length > 9 && (
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.4 }}
              className="mt-12 md:mt-16"
            >
              <p
                className="font-mono text-[10px] uppercase tracking-[0.3em] mb-5"
                style={{ color: "#8C867A" }}
              >
                Continuación de la galería
              </p>
              <LargeCarousel
                images={images.slice(9)}
                offsetIndex={9}
                featured={featured}
                onSelect={handleSelect}
              />
            </motion.div>
          )}
        </motion.div>
      )}
    </section>
  );
}