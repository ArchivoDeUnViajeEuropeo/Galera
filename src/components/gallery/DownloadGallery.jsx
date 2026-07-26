import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Download, X, ChevronLeft, ChevronRight } from "lucide-react";
import GalleryImage from "@/components/gallery/GalleryImage";
import { base44 } from "@/api/base44Client";

const SECTIONS = [
  { id: "participantes", label: "Participantes", type: "participants", folderPath: "Web/03-Participantes" },
  { id: "destinos", label: "Destinos", type: "participants", folderPath: "Web/02-Destinos" },
  { id: "escultura", label: "Escultura y Arte", type: "images", folderPath: "Web/05-escultura y arte" },
  { id: "arquitectura", label: "Arquitectura", type: "images", folderPath: "Web/06-arquitectura" },
  { id: "grupales", label: "Grupales", type: "images", folderPath: "Web/08 - Grupales" },
  { id: "preparativos", label: "Preparativos", type: "images", folderPath: "Web/04-preparativos" },
  { id: "estadisticas", label: "Estadísticas", type: "images", folderPath: "Web/07-Estadisticas" },
];

function downloadUrl(img) {
  if (img.downloadUrl) return img.downloadUrl;
  return `https://drive.google.com/uc?export=download&id=${img.id}`;
}

async function fetchSection(section) {
  try {
    if (section.type === "images") {
      const res = await base44.functions.invoke("listDriveImages", { folderPath: section.folderPath });
      return (res.data.images || []).map((img) => ({
        id: img.id,
        name: img.name,
        viewUrl: img.viewUrl,
        downloadUrl: downloadUrl(img),
        section: section.label,
      }));
    } else {
      const res = await base44.functions.invoke("listParticipants", { folderPath: section.folderPath });
      const out = [];
      for (const p of res.data.participants || []) {
        if (p.mainImage) {
          out.push({
            id: p.mainImage.id,
            name: p.mainImage.name,
            viewUrl: p.mainImage.viewUrl,
            downloadUrl: downloadUrl(p.mainImage),
            section: section.label,
          });
        }
        for (const g of p.gallery || []) {
          out.push({
            id: g.id,
            name: g.name,
            viewUrl: g.viewUrl,
            downloadUrl: downloadUrl(g),
            section: section.label,
          });
        }
      }
      return out;
    }
  } catch (e) {
    return [];
  }
}

function Lightbox({ images, index, onClose, onNav }) {
  const current = images[index];

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") onNav((i) => (i + 1) % images.length);
      if (e.key === "ArrowLeft") onNav((i) => (i - 1 + images.length) % images.length);
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [images.length, onClose, onNav]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center p-4 md:p-8"
      style={{ background: "rgba(20,20,20,0.96)" }}
      onClick={onClose}
    >
      <button
        onClick={onClose}
        className="absolute top-5 right-5 z-10 p-2 rounded-full transition-colors"
        style={{ color: "#F2F1ED" }}
        aria-label="Cerrar"
      >
        <X size={24} strokeWidth={1.5} />
      </button>

      {/* Counter */}
      <p
        className="absolute top-6 left-1/2 -translate-x-1/2 font-mono text-[10px] uppercase tracking-[0.3em]"
        style={{ color: "#8C867A" }}
      >
        {String(index + 1).padStart(2, "0")} / {String(images.length).padStart(2, "0")} · {current.section}
      </p>

      <AnimatePresence mode="wait">
        <motion.img
          key={current.id}
          src={current.viewUrl}
          alt={current.name || "Imagen"}
          initial={{ opacity: 0, scale: 0.98, filter: "blur(10px)" }}
          animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
          exit={{ opacity: 0, scale: 1.02, filter: "blur(8px)" }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-full max-h-[72vh] object-contain rounded-sm"
          onClick={(e) => e.stopPropagation()}
        />
      </AnimatePresence>

      {/* Nav arrows */}
      {images.length > 1 && (
        <>
          <button
            onClick={(e) => { e.stopPropagation(); onNav((i) => (i - 1 + images.length) % images.length); }}
            className="absolute left-3 md:left-6 top-1/2 -translate-y-1/2 p-2"
            style={{ color: "#F2F1ED" }}
            aria-label="Anterior"
          >
            <ChevronLeft size={32} strokeWidth={1.5} />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onNav((i) => (i + 1) % images.length); }}
            className="absolute right-3 md:right-6 top-1/2 -translate-y-1/2 p-2"
            style={{ color: "#F2F1ED" }}
            aria-label="Siguiente"
          >
            <ChevronRight size={32} strokeWidth={1.5} />
          </button>
        </>
      )}

      {/* Download button */}
      <a
        href={current.downloadUrl}
        download={current.name || "imagen.jpg"}
        target="_blank"
        rel="noopener noreferrer"
        onClick={(e) => e.stopPropagation()}
        className="mt-6 inline-flex items-center gap-2 px-6 py-3 rounded-full font-mono text-[11px] uppercase tracking-[0.25em] transition-all duration-300 hover:scale-105"
        style={{ background: "#F2F1ED", color: "#1A1A1A" }}
      >
        <Download size={14} strokeWidth={1.5} />
        Descargar imagen
      </a>
    </motion.div>
  );
}

export default function DownloadGallery() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("todos");
  const [lightboxIndex, setLightboxIndex] = useState(null);

  useEffect(() => {
    let mounted = true;
    Promise.all(SECTIONS.map(fetchSection)).then((results) => {
      if (!mounted) return;
      const all = results.flat();
      setImages(all);
      setLoading(false);
    });
    return () => { mounted = false; };
  }, []);

  const filtered = filter === "todos" ? images : images.filter((i) => i.section === filter);
  const tabs = [{ id: "todos", label: "Todos" }, ...SECTIONS.map((s) => ({ id: s.label, label: s.label }))];

  const closeLightbox = useCallback(() => setLightboxIndex(null), []);

  return (
    <div className="px-8 md:px-16 pb-24">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        className="mb-12 md:mb-16"
      >
        <p
          className="font-mono text-[10px] uppercase tracking-[0.4em] mb-4"
          style={{ color: "#8C867A" }}
        >
          Archivo visual
        </p>
        <h1
          className="font-display text-5xl md:text-7xl leading-[0.9] tracking-tight"
          style={{ color: "#1A1A1A", letterSpacing: "-0.03em" }}
        >
          Descargas
        </h1>
        <p
          className="font-body text-sm md:text-base mt-4 max-w-xl"
          style={{ color: "#8C867A" }}
        >
          Explora todas las imágenes del recorrido. Selecciona una para previsualizarla y descargarla.
        </p>
      </motion.div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-10 md:mb-14">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setFilter(t.id)}
            className="px-3 md:px-4 py-2 text-[10px] md:text-[11px] font-mono uppercase tracking-widest rounded-full transition-colors duration-300"
            style={{
              color: filter === t.id ? "#F2F1ED" : "#8C867A",
              background: filter === t.id ? "#1A1A1A" : "transparent",
              border: "1px solid rgba(140,134,122,0.25)",
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Count */}
      {!loading && (
        <p
          className="font-mono text-[10px] uppercase tracking-[0.3em] mb-6"
          style={{ color: "#8C867A" }}
        >
          {filtered.length} {filtered.length === 1 ? "imagen" : "imágenes"}
        </p>
      )}

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4">
          {[...Array(15)].map((_, i) => (
            <div key={i} className="shimmer rounded-sm aspect-square" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <p
          className="font-mono text-xs uppercase tracking-[0.3em]"
          style={{ color: "#8C867A" }}
        >
          No se encontraron imágenes
        </p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4">
          {filtered.map((img, i) => (
            <motion.button
              key={`${img.id}-${i}`}
              initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
              whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              viewport={{ once: true, margin: "-30px" }}
              transition={{ duration: 0.7, delay: (i % 10) * 0.04, ease: [0.22, 1, 0.36, 1] }}
              onClick={() => setLightboxIndex(i)}
              className="relative overflow-hidden rounded-sm group cursor-pointer aspect-square"
            >
              <GalleryImage
                src={img.viewUrl}
                alt={img.name || `Imagen ${i + 1}`}
                className="w-full h-full transition-transform duration-700 ease-out group-hover:scale-105"
              />
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center"
                style={{ background: "rgba(20,20,20,0.4)" }}
              >
                <span className="inline-flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.25em]"
                  style={{ color: "#F2F1ED" }}
                >
                  <Download size={12} strokeWidth={1.5} />
                  Ver
                </span>
              </div>
              <span
                className="absolute bottom-2 left-2 font-mono text-[8px] uppercase tracking-widest opacity-0 group-hover:opacity-70 transition-opacity duration-500"
                style={{ color: "#F2F1ED" }}
              >
                {img.section}
              </span>
            </motion.button>
          ))}
        </div>
      )}

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxIndex !== null && filtered.length > 0 && (
          <Lightbox
            images={filtered}
            index={lightboxIndex}
            onClose={closeLightbox}
            onNav={setLightboxIndex}
          />
        )}
      </AnimatePresence>
    </div>
  );
}