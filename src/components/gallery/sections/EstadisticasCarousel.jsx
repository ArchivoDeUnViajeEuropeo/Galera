import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import GalleryImage from "@/components/gallery/GalleryImage";
import { base44 } from "@/api/base44Client";

export default function EstadisticasCarousel() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    base44.functions
      .invoke("listDriveImages", { folderPath: "Web/07-Estadisticas" })
      .then((res) => setImages(res.data.images || []))
      .catch(() => setImages([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="shimmer rounded-sm h-64 md:h-80 mb-16 md:mb-24" />;
  }

  if (images.length === 0) return null;

  const loopImages = images.length > 1 ? [...images, ...images] : images;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 1.2 }}
      className="mb-16 md:mb-24"
    >
      <div
        className="overflow-hidden pb-2"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <div
          className={`flex gap-4 md:gap-6 scroll-left-large ${paused ? "paused" : ""}`}
          style={{ width: "max-content" }}
        >
          {loopImages.map((img, i) => (
            <div
              key={`${img.id}-${i}`}
              className="relative overflow-hidden rounded-sm flex-shrink-0"
              style={{ width: "280px", height: "360px" }}
            >
              <GalleryImage
                src={img.viewUrl}
                alt={`Estadísticas — ${(i % images.length) + 1}`}
                className="w-full h-full"
              />
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}