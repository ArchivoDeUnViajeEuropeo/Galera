import React, { useState, useEffect } from "react";

const SECTIONS = [
  { id: "participantes", label: "Participantes" },
  { id: "destinos", label: "Destinos" },
  { id: "escultura-arte", label: "Escultura y Arte" },
  { id: "arquitectura", label: "Arquitectura" },
  { id: "grupales", label: "Grupales" },
  { id: "preparativos", label: "Preparativos" },
  { id: "estadisticas", label: "Estadísticas" },
];

export default function SectionNav() {
  const [visible, setVisible] = useState(false);
  const [active, setActive] = useState("participantes");

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentY = window.scrollY;
          setVisible(currentY > 200);
          for (const s of [...SECTIONS].reverse()) {
            const el = document.getElementById(s.id);
            if (el && el.getBoundingClientRect().top < window.innerHeight / 2) {
              setActive(s.id);
              break;
            }
          }
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  if (!visible) return null;

  return (
    <div
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-2 py-2 rounded-full max-w-[calc(100vw-1.5rem)] overflow-x-auto filmstrip-scroll"
      style={{
        background: "rgba(242, 241, 237, 0.8)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        border: "1px solid rgba(140, 134, 122, 0.2)",
      }}
    >
      <div className="flex items-center gap-0.5 flex-nowrap">
        {SECTIONS.map((s) => (
          <button
            key={s.id}
            onClick={() => scrollTo(s.id)}
            className="px-2.5 md:px-4 py-2 text-[9px] md:text-[11px] font-mono uppercase tracking-widest transition-colors duration-300 rounded-full whitespace-nowrap flex-shrink-0"
            style={{
              color: active === s.id ? "#1A1A1A" : "#8C867A",
              background: active === s.id ? "#E0DED7" : "transparent",
            }}
          >
            {s.label}
          </button>
        ))}
      </div>
    </div>
  );
}