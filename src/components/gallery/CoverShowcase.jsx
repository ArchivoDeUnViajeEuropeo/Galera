import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ArrowDown } from "lucide-react";
import { Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";

function cleanLabel(name) {
  return name
    .replace(/\.[^.]+$/, "")
    .replace(/^\d+_/, "")
    .replace(/_\d+$/, "")
    .replace(/_/g, " ")
    .trim();
}

export default function CoverShowcase() {
  const [images, setImages] = useState([]);
  const [index, setIndex] = useState(0);
  const [loaded, setLoaded] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    base44.functions
      .invoke("listDriveImages", { folderPath: "Web/01-portada" })
      .then((res) => {
        setImages(res.data.images || []);
      })
      .catch(() => setImages([]))
      .finally(() => setLoading(false));
  }, []);

  const next = useCallback(() => {
    setIndex((i) => (i + 1) % images.length);
  }, [images.length]);

  useEffect(() => {
    if (images.length <= 1) return;
    const t = setInterval(next, 5000);
    return () => clearInterval(t);
  }, [next, images.length]);

  if (loading) {
    return (
      <section className="relative w-full h-screen overflow-hidden">
        <div className="absolute inset-0 shimmer" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-[#E0DED7] border-t-[#1A1A1A] rounded-full animate-spin" />
        </div>
      </section>
    );
  }

  if (images.length === 0) {
    return (
      <section className="relative w-full h-screen overflow-hidden flex items-center justify-center">
        <p className="font-mono text-xs uppercase tracking-[0.3em]" style={{ color: "#8C867A" }}>
          No se encontraron imágenes
        </p>
      </section>
    );
  }

  return (
    <section className="relative w-full h-screen overflow-hidden">
      {/* Crossfading images */}
      <AnimatePresence mode="sync">
        <motion.div
          key={index}
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
        >
          {!loaded[images[index].viewUrl] && (
            <div className="absolute inset-0 shimmer" />
          )}
          <motion.img
            src={images[index].viewUrl}
            alt={images[index].name}
            onLoad={() =>
              setLoaded((p) => ({ ...p, [images[index].viewUrl]: true }))
            }
            initial={{ scale: 1.08, filter: "blur(12px)" }}
            animate={{
              scale: 1,
              filter: loaded[images[index].viewUrl] ? "blur(0px)" : "blur(12px)",
            }}
            transition={{ duration: 6, ease: [0.22, 1, 0.36, 1] }}
            className="w-full h-full object-cover"
          />
        </motion.div>
      </AnimatePresence>

      {/* Gradient veil */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to bottom, rgba(242,241,237,0.15) 0%, rgba(242,241,237,0.25) 40%, rgba(242,241,237,0.85) 88%, rgba(242,241,237,1) 100%)",
        }}
      />

      {/* Top label */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="absolute top-8 left-8 md:top-10 md:left-16 z-20"
      >
        <p
          className="font-mono text-[11px] uppercase tracking-[0.3em]"
          style={{ color: "#F2F1ED" }}
        >
          Viaje Europeo
        </p>
      </motion.div>

      {/* Image counter */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.6 }}
        className="absolute top-8 right-8 md:top-10 md:right-16 z-20"
      >
        <p
          className="font-mono text-[11px] uppercase tracking-[0.3em]"
          style={{ color: "#F2F1ED" }}
        >
          {String(index + 1).padStart(2, "0")} / {String(images.length).padStart(2, "0")}
        </p>
      </motion.div>

      {/* Title + buttons */}
      <div className="absolute inset-0 flex flex-col items-center justify-end pb-20 md:pb-28 px-8 z-10">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="font-mono text-[11px] uppercase tracking-[0.4em] mb-5"
          style={{ color: "#8C867A" }}
        >
          Crónica Visual de un Viaje
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 40, filter: "blur(8px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 1.4, delay: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="font-display text-5xl md:text-[9vw] leading-[0.88] text-center tracking-tight"
          style={{ color: "#1A1A1A", letterSpacing: "-0.02em" }}
        >
          El Archivo
          <br />
          de un Viaje
          <br />
          <span className="italic font-normal" style={{ color: "#8C867A" }}>
            Europeo
          </span>
        </motion.h1>

        {/* Two large buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 1.1, ease: [0.22, 1, 0.36, 1] }}
          className="mt-12 md:mt-14 flex flex-col sm:flex-row gap-4 sm:gap-6 w-full max-w-2xl"
        >
          <Link to="/recorrido" className="flex-1 group">
            <div
              className="relative flex items-center justify-between px-7 py-5 rounded-sm overflow-hidden transition-all duration-500"
              style={{ background: "#1A1A1A", color: "#F2F1ED" }}
            >
              <span className="font-mono text-xs uppercase tracking-[0.2em]">
                Recorrido Interactivo
              </span>
              <ArrowRight
                size={18}
                className="transition-transform duration-500 group-hover:translate-x-1.5"
              />
              <span
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{ background: "rgba(140, 134, 122, 0.2)" }}
              />
            </div>
          </Link>

          <Link to="/descargas" className="flex-1 group">
            <div
              className="relative flex items-center justify-between px-7 py-5 rounded-sm overflow-hidden transition-all duration-500 border"
              style={{
                background: "transparent",
                color: "#1A1A1A",
                borderColor: "#1A1A1A",
              }}
            >
              <span className="font-mono text-xs uppercase tracking-[0.2em]">
                Descargas
              </span>
              <ArrowRight
                size={18}
                className="transition-transform duration-500 group-hover:translate-x-1.5"
              />
              <span
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{ background: "#E0DED7" }}
              />
            </div>
          </Link>
        </motion.div>
      </div>

      {/* Scroll cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.6 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2"
      >
        <span
          className="font-mono text-[10px] uppercase tracking-[0.3em]"
          style={{ color: "#8C867A" }}
        >
          Álbum
        </span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: [0.22, 1, 0.36, 1] }}
        >
          <ArrowDown size={14} style={{ color: "#8C867A" }} />
        </motion.div>
      </motion.div>

      {/* Progress dots */}
      {images.length > 1 && (
        <div className="absolute bottom-6 right-8 md:right-16 z-20 flex gap-2">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              className="h-1 rounded-full transition-all duration-500"
              style={{
                width: i === index ? "24px" : "8px",
                background: i === index ? "#1A1A1A" : "rgba(140, 134, 122, 0.4)",
              }}
              aria-label={`Imagen ${i + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  );
}