import React from "react";
import { motion } from "framer-motion";
import SectionHeader from "./SectionHeader";
import EstadisticasCarousel from "./EstadisticasCarousel";

const STATS = [
  { value: "6", unit: "", label: "Ciudades" },
  { value: "6", unit: "", label: "Hoteles" },
  { value: "17", unit: "días", label: "De viaje" },
  { value: "3", unit: "", label: "Aviones internos" },
  { value: "2", unit: "", label: "Cumpleaños" },
  { value: "199,876", unit: "", label: "Pasos" },
  { value: "145.93", unit: "km", label: "Totales" },
];

const DAILY_DATA = [
  { day: "26 de abril", pasos: 6311, km: 7.9 },
  { day: "27 de abril", pasos: 6229, km: 4.4 },
  { day: "28 de abril", pasos: 17641, km: 12.4 },
  { day: "29 de abril", pasos: 13789, km: 9.6 },
  { day: "30 de abril", pasos: 8796, km: 6.2 },
  { day: "1 de mayo", pasos: 13515, km: 9.5 },
  { day: "2 de mayo", pasos: 12586, km: 8.9 },
  { day: "3 de mayo", pasos: 15520, km: 11.1 },
  { day: "4 de mayo", pasos: 14057, km: 10 },
  { day: "5 de mayo", pasos: 12491, km: 8.9 },
  { day: "6 de mayo", pasos: 7537, km: 6.53 },
  { day: "7 de mayo", pasos: 18239, km: 12.9 },
  { day: "8 de mayo", pasos: 10541, km: 7.5 },
  { day: "9 de mayo", pasos: 10118, km: 7.2 },
  { day: "10 de mayo", pasos: 12544, km: 8.8 },
  { day: "11 de mayo", pasos: 8203, km: 5.8 },
  { day: "12 de mayo", pasos: 6901, km: 4.9 },
  { day: "13 de mayo", pasos: 4858, km: 3.4 },
];

export default function EstadisticasSection() {
  const maxKm = Math.max(...DAILY_DATA.map((d) => d.km));

  return (
    <section id="estadisticas" className="py-24 md:py-32 px-8 md:px-16">
      <SectionHeader
        number="07"
        title="Estadísticas"
        description="El viaje en números. La medida de una aventura que trasciende la memoria."
      />

      <EstadisticasCarousel />

      {/* Big numbers grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-px mb-16 md:mb-24" style={{ background: "rgba(140, 134, 122, 0.2)" }}>
        {STATS.map((s, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{
              duration: 1,
              delay: i * 0.06,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="p-6 md:p-8"
            style={{ background: "#F2F1ED" }}
          >
            <div className="flex items-baseline gap-1">
              <span
                className={`font-display tracking-tight ${
                  s.value.length > 5
                    ? "text-3xl md:text-4xl"
                    : "text-4xl md:text-6xl"
                }`}
                style={{ color: "#1A1A1A", letterSpacing: "-0.02em" }}
              >
                {s.value}
              </span>
              {s.unit && (
                <span
                  className="font-mono text-xs"
                  style={{ color: "#8C867A" }}
                >
                  {s.unit}
                </span>
              )}
            </div>
            <p
              className="font-mono text-[10px] uppercase tracking-widest mt-2"
              style={{ color: "#8C867A" }}
            >
              {s.label}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Recorrido por día */}
      <motion.div
        initial={{ opacity: 0, y: 40, filter: "blur(8px)" }}
        whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
      >
        <h3
          className="font-mono text-xs uppercase tracking-[0.3em] mb-8"
          style={{ color: "#8C867A" }}
        >
          Recorrido por día
        </h3>
        <div className="space-y-3">
          {DAILY_DATA.map((d, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.8,
                delay: i * 0.06,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="flex items-center gap-4"
            >
              <span
                className="font-mono text-[11px] uppercase tracking-widest w-28 md:w-32 flex-shrink-0"
                style={{ color: "#8C867A" }}
              >
                {d.day}
              </span>
              <span
                className="font-mono text-[11px] w-16 text-right"
                style={{ color: "#1A1A1A" }}
              >
                {d.pasos.toLocaleString("es-MX")}
              </span>
              <div className="flex-1 h-6 relative" style={{ background: "#E0DED7" }}>
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: `${(d.km / maxKm) * 100}%` }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 1.2,
                    delay: 0.3 + i * 0.06,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="h-full"
                  style={{ background: "#1A1A1A" }}
                />
              </div>
              <span
                className="font-mono text-[11px] w-16 text-right"
                style={{ color: "#1A1A1A" }}
              >
                {d.km} km
              </span>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}