import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Square } from "lucide-react";

const SCROLL_SPEED = 1; // px per frame ~ gentle continuous scroll

export default function AutoScrollControl() {
  const [active, setActive] = useState(false);
  const [scrolledAway, setScrolledAway] = useState(false);
  const rafRef = useRef(null);
  const posRef = useRef(0);

  useEffect(() => {
    const onScroll = () => setScrolledAway(window.scrollY > 200);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!active) return;

    posRef.current = window.scrollY;
    let lastTime = performance.now();

    const tick = (now) => {
      const dt = now - lastTime;
      lastTime = now;
      const step = SCROLL_SPEED * (dt / (1000 / 60));
      posRef.current += step;

      const maxScroll =
        document.documentElement.scrollHeight - window.innerHeight;

      if (posRef.current >= maxScroll - 1) {
        // Reached bottom — stop and smoothly return to top
        setActive(false);
        window.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }

      window.scrollTo(0, posRef.current);
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);

    // Stop if user manually scrolls (wheel/touch)
    const handleWheel = () => setActive(false);
    const handleTouch = () => setActive(false);
    const handleKey = (e) => {
      if (["ArrowUp", "ArrowDown", "PageUp", "PageDown", " "].includes(e.key)) {
        setActive(false);
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: true });
    window.addEventListener("touchmove", handleTouch, { passive: true });
    window.addEventListener("keydown", handleKey);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("touchmove", handleTouch);
      window.removeEventListener("keydown", handleKey);
    };
  }, [active]);

  return (
    <div className="px-8 md:px-16 pb-6">
      <motion.button
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        onClick={() => setActive((a) => !a)}
        className="inline-flex items-center gap-3 px-5 py-3 rounded-full transition-all duration-500"
        style={{
          background: active ? "#1A1A1A" : "transparent",
          border: "1px solid rgba(140, 134, 122, 0.3)",
          color: active ? "#F2F1ED" : "#8C867A",
        }}
      >
        {active ? (
          <Square size={14} strokeWidth={1.5} fill="currentColor" />
        ) : (
          <Play size={14} strokeWidth={1.5} fill="currentColor" />
        )}
        <span className="font-mono text-[10px] uppercase tracking-[0.3em]">
          {active ? "Detener recorrido" : "Recorrido automático"}
        </span>
        {active && (
          <motion.span
            className="w-1.5 h-1.5 rounded-full"
            style={{ background: "#F2F1ED" }}
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          />
        )}
      </motion.button>

      {/* Floating stop button when active and scrolled away */}
      <AnimatePresence>
        {active && scrolledAway && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.4 }}
            className="fixed bottom-6 right-6 z-50"
          >
            <button
              onClick={() => setActive(false)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-full shadow-lg"
              style={{
                background: "rgba(26, 26, 26, 0.9)",
                backdropFilter: "blur(20px)",
                color: "#F2F1ED",
              }}
            >
              <Square size={12} strokeWidth={1.5} fill="currentColor" />
              <span className="font-mono text-[10px] uppercase tracking-[0.3em]">
                Detener
              </span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}