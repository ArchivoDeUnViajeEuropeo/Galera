import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const sections = [
  { id: "sanctuary", label: "Sanctuary" },
  { id: "archive", label: "Archive" },
  { id: "tangible", label: "Tangible" },
];

export default function GhostNav() {
  const [visible, setVisible] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [activeSection, setActiveSection] = useState("sanctuary");

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentY = window.scrollY;
          setVisible(currentY < lastScrollY && currentY > 100);
          setLastScrollY(currentY);

          // Determine active section
          for (const section of [...sections].reverse()) {
            const el = document.getElementById(section.id);
            if (el && el.getBoundingClientRect().top < window.innerHeight / 2) {
              setActiveSection(section.id);
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
  }, [lastScrollY]);

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.nav
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-1 py-1 rounded-full"
          style={{
            background: "rgba(242, 241, 237, 0.7)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            border: "1px solid rgba(140, 134, 122, 0.2)",
          }}
        >
          <div className="flex items-center gap-1">
            {sections.map((s) => (
              <button
                key={s.id}
                onClick={() => scrollTo(s.id)}
                className="relative px-5 py-2 text-xs font-mono uppercase tracking-widest transition-colors duration-300"
                style={{ color: activeSection === s.id ? "#1A1A1A" : "#8C867A" }}
              >
                {activeSection === s.id && (
                  <motion.div
                    layoutId="nav-pill"
                    className="absolute inset-0 rounded-full"
                    style={{ background: "#E0DED7" }}
                    transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  />
                )}
                <span className="relative z-10">{s.label}</span>
              </button>
            ))}
          </div>
        </motion.nav>
      )}
    </AnimatePresence>
  );
}