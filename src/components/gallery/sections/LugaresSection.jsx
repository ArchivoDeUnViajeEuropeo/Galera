import React from "react";
import { motion } from "framer-motion";
import SectionHeader from "./SectionHeader";
import GalleryImage from "@/components/gallery/GalleryImage";

const LUGARES = [
  {
    src: "https://media.base44.com/images/public/6a4f00dc0a9f25b2b33fc54c/2cb31ce21_generated_image.png",
    title: "Plaza Mayor",
    city: "Salamanca",
    note: "El punto de encuentro del grupo al atardecer.",
  },
  {
    src: "https://media.base44.com/images/public/6a4f00dc0a9f25b2b33fc54c/d5c6069df_generated_image.png",
    title: "Callejón del Café",
    city: "Roma",
    note: "El primer espresso del viaje, en un rincón escondido.",
  },
  {
    src: "https://media.base44.com/images/public/6a4f00dc0a9f25b2b33fc54c/2bb1d0078_generated_813799ca.png",
    title: "Duna Dorada",
    city: "Costa Atlántica",
    note: "Una parada improvisada camino a Lisboa.",
  },
  {
    src: "https://media.base44.com/images/public/6a4f00dc0a9f25b2b33fc54c/2df44fb13_generated_f6356939.png",
    title: "Galería de Luz",
    city: "París",
    note: "El interior donde la luz se volvió protagonista.",
  },
];

export default function LugaresSection() {
  return (
    <section id="escultura-arte" className="py-24 md:py-32 px-8 md:px-16">
      <SectionHeader
        number="03"
        title="Escultura y Arte"
        description="La talla, el mármol, el pincel. Las obras que detuvieron el viaje y exigieron ser miradas."
      />

      <div className="space-y-6 md:space-y-10">
        {LUGARES.map((l, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 40, filter: "blur(8px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{
              duration: 1.2,
              ease: [0.22, 1, 0.36, 1],
            }}
            className={`flex flex-col ${i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"} gap-6 md:gap-10 items-center`}
          >
            <div className="flex-1 w-full overflow-hidden rounded-sm">
              <GalleryImage
                src={l.src}
                alt={l.title}
                className="aspect-[3/2]"
              />
            </div>
            <div className="flex-1 w-full">
              <p
                className="font-mono text-[10px] uppercase tracking-[0.3em] mb-3"
                style={{ color: "#8C867A" }}
              >
                {String(i + 1).padStart(2, "0")} · {l.city}
              </p>
              <h3
                className="font-display text-2xl md:text-4xl tracking-tight mb-3"
                style={{ color: "#1A1A1A", letterSpacing: "-0.02em" }}
              >
                {l.title}
              </h3>
              <p
                className="text-sm md:text-base max-w-md"
                style={{ color: "#8C867A", lineHeight: 1.8 }}
              >
                {l.note}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}