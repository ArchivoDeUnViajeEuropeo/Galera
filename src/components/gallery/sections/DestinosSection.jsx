import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin,
  Camera,
  Landmark,
  Sun,
  Bike,
  Anchor,
  Castle,
  Building2,
  Church,
} from "lucide-react";
import SectionHeader from "./SectionHeader";
import GalleryImage from "@/components/gallery/GalleryImage";
import { base44 } from "@/api/base44Client";

const ICON_MAP = [
  { match: ["parís", "paris"], Icon: Building2, label: "La Ville Lumière" },
  { match: ["roma", "rome"], Icon: Landmark, label: "La Città Eterna" },
  { match: ["florencia", "florence"], Icon: Church, label: "Culla del Rinascimento" },
  { match: ["milan", "milán"], Icon: Church, label: "Moda e Stile" },
  { match: ["budapest"], Icon: Building2, label: "Perla del Danubio" },
  { match: ["turquia", "turquía", "turkey"], Icon: Sun, label: "Entre dos mundos" },
  { match: ["barcelona"], Icon: Sun, label: "Ciudad Condal" },
  { match: ["ámsterdam", "amsterdam"], Icon: Bike, label: "De Grachten" },
  { match: ["lisboa", "lisbon"], Icon: Anchor, label: "Cidade Branca" },
  { match: ["praga", "prague"], Icon: Castle, label: "Matka Měst" },
];

function getIcon(name) {
  const lower = name.toLowerCase();
  for (const entry of ICON_MAP) {
    if (entry.match.some((m) => lower.includes(m))) {
      return entry;
    }
  }
  return { Icon: MapPin, label: "Destino" };
}

function cleanName(name) {
  return name.split(/\s*[-–—]\s*/)[0].trim();
}

function getCountry(name) {
  const parts = name.split(/\s*[-–—]\s*/);
  return parts.length > 1 ? parts[1].trim() : "";
}

function DestinoCarousel({ images, name, selectedIndex, onSelect }) {
  const [paused, setPaused] = useState(false);
  if (images.length === 0) return null;
  const loopImages = images.length > 1 ? [...images, ...images] : images;

  return (
    <div
      className="overflow-hidden pb-2"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div
        className={`flex gap-3 md:gap-4 ${images.length > 1 ? "scroll-left-large" : ""} ${paused ? "paused" : ""}`}
        style={{ width: "max-content" }}
      >
        {loopImages.map((img, i) => {
          const realIndex = i % images.length;
          const isSelected = selectedIndex === realIndex;
          return (
            <button
              key={`${img.id}-${i}`}
              onClick={() => onSelect(realIndex)}
              className="relative overflow-hidden rounded-sm flex-shrink-0 group cursor-pointer"
              style={{ width: "140px", height: "180px" }}
            >
              <GalleryImage
                src={img.viewUrl}
                alt={`${name} — ${realIndex + 1}`}
                className="w-full h-full transition-transform duration-700 group-hover:scale-105"
              />
              <div
                className="absolute inset-0 transition-opacity duration-500"
                style={{
                  background: isSelected ? "transparent" : "rgba(26,26,26,0.4)",
                  opacity: isSelected ? 0 : 1,
                }}
              />
              {isSelected && (
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

function DestinoBlock({ destino, index }) {
  const allImages = [destino.mainImage, ...destino.gallery].filter(Boolean);
  const [selectedImage, setSelectedImage] = useState(0);
  const current = allImages[selectedImage];

  useEffect(() => {
    if (allImages.length <= 1) return;
    const t = setInterval(() => {
      setSelectedImage((i) => (i + 1) % allImages.length);
    }, 4000);
    return () => clearInterval(t);
  }, [allImages.length]);

  const isEven = index % 2 === 0;
  const { Icon, label } = getIcon(destino.name);
  const cityName = cleanName(destino.name);
  const country = getCountry(destino.name);

  if (!destino.mainImage) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 60, filter: "blur(10px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
      className="mb-32 md:mb-48"
    >
      <div className={`flex flex-col ${isEven ? "md:flex-row" : "md:flex-row-reverse"} gap-8 md:gap-16 items-center`}>
        {/* Large image */}
        <div className="flex-1 w-full">
          <div className="relative overflow-hidden rounded-sm" style={{ aspectRatio: "3 / 4" }}>
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedImage}
                initial={{ opacity: 0, scale: 1.05, filter: "blur(12px)" }}
                animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                exit={{ opacity: 0, scale: 0.98, filter: "blur(8px)" }}
                transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                className="absolute inset-0"
              >
                <GalleryImage
                  src={current.viewUrl}
                  alt={destino.name}
                  className="w-full h-full"
                />
              </motion.div>
            </AnimatePresence>
            {/* Image counter */}
            <div className="absolute bottom-4 right-4 z-10">
              <p
                className="font-mono text-[10px] uppercase tracking-[0.3em]"
                style={{ color: "#F2F1ED", textShadow: "0 1px 4px rgba(0,0,0,0.4)" }}
              >
                {String(selectedImage + 1).padStart(2, "0")} / {String(allImages.length).padStart(2, "0")}
              </p>
            </div>
          </div>
        </div>

        {/* Name + icon */}
        <div className="flex-1 w-full text-center md:text-left">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.2 }}
            className="flex items-center justify-center md:justify-start gap-3 mb-6"
          >
            <Icon
              size={20}
              strokeWidth={1.5}
              style={{ color: "#8C867A" }}
            />
            <p
              className="font-mono text-[10px] uppercase tracking-[0.4em]"
              style={{ color: "#8C867A" }}
            >
              {label}
            </p>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, x: isEven ? -20 : 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="font-mono text-[10px] uppercase tracking-[0.4em] mb-4"
            style={{ color: "#8C867A" }}
          >
            {String(index + 1).padStart(2, "0")} / {String(6).padStart(2, "0")}
          </motion.p>

          <motion.h3
            initial={{ opacity: 0, y: 30, filter: "blur(8px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="font-display text-5xl md:text-7xl lg:text-8xl leading-[0.9] tracking-tight"
            style={{ color: "#1A1A1A", letterSpacing: "-0.03em" }}
          >
            {cityName}
          </motion.h3>

          {country && (
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="font-body text-sm md:text-base mt-4 italic"
              style={{ color: "#8C867A" }}
            >
              {country}
            </motion.p>
          )}

          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="h-px mt-8 origin-center"
            style={{ background: "rgba(140, 134, 122, 0.3)", width: "60px" }}
          />
        </div>
      </div>

      {/* Auto-scrolling carousel */}
      {allImages.length > 1 && (
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.4 }}
          className="mt-10 md:mt-12"
        >
          <p
            className="font-mono text-[10px] uppercase tracking-[0.3em] mb-4"
            style={{ color: "#8C867A" }}
          >
            Galería · {allImages.length} imágenes
          </p>
          <DestinoCarousel
            images={allImages}
            name={destino.name}
            selectedIndex={selectedImage}
            onSelect={setSelectedImage}
          />
        </motion.div>
      )}
    </motion.div>
  );
}

export default function DestinosSection() {
  const [destinos, setDestinos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    base44.functions
      .invoke("listParticipants", { folderPath: "Web/02-Destinos" })
      .then((res) => setDestinos(res.data.participants || []))
      .catch(() => setDestinos([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section id="destinos" className="py-24 md:py-32 px-8 md:px-16">
      <SectionHeader
        number="02"
        title="Destinos"
        description="Seis ciudades, seis lenguajes de luz. El mapa de un verano europeo."
      />

      {loading ? (
        <div className="space-y-32 mt-16">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex flex-col md:flex-row gap-8 md:gap-16 items-center">
              <div className="flex-1 shimmer rounded-sm" style={{ aspectRatio: "3 / 4" }} />
              <div className="flex-1">
                <div className="shimmer h-12 md:h-16 w-2/3 rounded mb-4" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-16">
          {destinos.map((d, i) => (
            <DestinoBlock key={d.name} destino={d} index={i} />
          ))}
        </div>
      )}
    </section>
  );
}