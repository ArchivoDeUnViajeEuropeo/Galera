import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import SectionHeader from "./SectionHeader";
import GalleryImage from "@/components/gallery/GalleryImage";
import { base44 } from "@/api/base44Client";

function AutoCarousel({ images, name }) {
  const [paused, setPaused] = useState(false);
  if (images.length === 0) return null;
  // Duplicate images for seamless loop
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
        {loopImages.map((img, i) => (
          <div
            key={`${img.id}-${i}`}
            className="relative overflow-hidden rounded-sm flex-shrink-0"
            style={{ width: "160px", height: "200px" }}
          >
            <GalleryImage
              src={img.viewUrl}
              alt={`${name} — ${i + 1}`}
              className="w-full h-full"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

function ParticipantBlock({ participant, index }) {
  const isEven = index % 2 === 0;
  const mainImage = participant.mainImage;
  const galleryImages = participant.gallery || [];

  if (!mainImage) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 60, filter: "blur(10px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
      className="mb-32 md:mb-48"
    >
      {/* Main image + name */}
      <div className={`flex flex-col ${isEven ? "md:flex-row" : "md:flex-row-reverse"} gap-8 md:gap-16 items-center`}>
        {/* Main image */}
        <div className="flex-1 w-full">
          <div className="relative overflow-hidden rounded-sm" style={{ aspectRatio: "3 / 4" }}>
            <GalleryImage
              src={mainImage.viewUrl}
              alt={participant.name}
              className="w-full h-full"
            />
          </div>
        </div>

        {/* Name */}
        <div className="flex-1 w-full text-center md:text-left">
          <motion.p
            initial={{ opacity: 0, x: isEven ? -20 : 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="font-mono text-[10px] uppercase tracking-[0.4em] mb-6"
            style={{ color: "#8C867A" }}
          >
            {String(index + 1).padStart(2, "0")} / {String(8).padStart(2, "0")}
          </motion.p>
          <motion.h3
            initial={{ opacity: 0, y: 30, filter: "blur(8px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="font-display text-4xl md:text-6xl lg:text-7xl leading-[0.95] tracking-tight"
            style={{ color: "#1A1A1A", letterSpacing: "-0.03em" }}
          >
            {participant.name}
          </motion.h3>
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

      {/* Auto-scrolling carousel with remaining images */}
      {galleryImages.length > 0 && (
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
            Más momentos
          </p>
          <AutoCarousel images={galleryImages} name={participant.name} />
        </motion.div>
      )}
    </motion.div>
  );
}

export default function ParticipantesSection() {
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    base44.functions
      .invoke("listParticipants", {})
      .then((res) => setParticipants(res.data.participants || []))
      .catch(() => setParticipants([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section id="participantes" className="py-24 md:py-32 px-8 md:px-16">
      <SectionHeader
        number="01"
        title="Participantes"
        description="Ocho viajeros, un mismo rumbo. Cada uno dejó su huella en este archivo."
      />

      {loading ? (
        <div className="space-y-32 mt-16">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex flex-col md:flex-row gap-8 md:gap-16 items-center">
              <div className="flex-1 shimmer rounded-sm" style={{ aspectRatio: "3 / 4" }} />
              <div className="flex-1">
                <div className="shimmer h-10 md:h-14 w-2/3 rounded mb-4" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-16">
          {participants.map((p, i) => (
            <ParticipantBlock key={p.name} participant={p} index={i} />
          ))}
        </div>
      )}
    </section>
  );
}