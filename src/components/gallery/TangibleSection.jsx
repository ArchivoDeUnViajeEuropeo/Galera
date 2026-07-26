import React, { useState } from "react";
import { motion } from "framer-motion";
import { FileDown, Loader2 } from "lucide-react";
import SlowRise from "@/components/gallery/SlowRise";
import { base44 } from "@/api/base44Client";

function PdfStack() {
  const pages = [0, 1, 2, 3];
  const rotations = [-6, -3, 3, 6];
  const yOffsets = [-8, -4, -4, -8];

  return (
    <div className="relative w-64 h-80 md:w-80 md:h-96">
      {pages.map((_, i) => (
        <motion.div
          key={i}
          className="absolute inset-0 rounded-sm"
          style={{
            background: i === pages.length - 1 ? "#F2F1ED" : "#E0DED7",
            border: "1px solid rgba(140, 134, 122, 0.2)",
            boxShadow: "0 2px 20px rgba(26, 26, 26, 0.06)",
            transformOrigin: "bottom center",
            zIndex: i,
          }}
          initial={{ rotate: 0, y: 0 }}
          whileInView={{
            rotate: rotations[i],
            y: yOffsets[i],
          }}
          viewport={{ once: true }}
          transition={{
            duration: 1.2,
            delay: 0.3 + i * 0.12,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          {i === pages.length - 1 && (
            <div className="flex flex-col items-center justify-center h-full p-8">
              <div className="w-full space-y-3">
                <div className="h-2 rounded-full w-3/4 mx-auto" style={{ background: "#E0DED7" }} />
                <div className="h-2 rounded-full w-1/2 mx-auto" style={{ background: "#E0DED7" }} />
                <div className="mt-6 w-full aspect-[4/3] rounded-sm" style={{ background: "#E0DED7" }} />
                <div className="h-2 rounded-full w-2/3 mx-auto mt-4" style={{ background: "#E0DED7" }} />
                <div className="h-2 rounded-full w-1/3 mx-auto" style={{ background: "#E0DED7" }} />
              </div>
            </div>
          )}
        </motion.div>
      ))}
    </div>
  );
}

export default function TangibleSection() {
  const [downloading, setDownloading] = useState(false);

  const handleDownload = async () => {
    if (downloading) return;
    setDownloading(true);
    try {
      const res = await base44.functions.invoke("getAlbumPdf", {});
      const data = res.data;
      if (!data || !data.base64) throw new Error("No se pudo obtener el PDF");
      const byteChars = atob(data.base64);
      const byteNumbers = new Uint8Array(byteChars.length);
      for (let i = 0; i < byteChars.length; i++) {
        byteNumbers[i] = byteChars.charCodeAt(i);
      }
      const blob = new Blob([byteNumbers], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = data.fileName || "El archivo de un viaje europeo.pdf";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error(e);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <section id="tangible" className="py-24 md:py-40">
      <div className="px-8 md:px-16 mb-12 md:mb-20">
        <SlowRise>
          <p
            className="font-mono text-xs uppercase tracking-[0.3em] mb-3"
            style={{ color: "#8C867A" }}
          >
            Act III
          </p>
          <h2
            className="font-display text-3xl md:text-5xl tracking-tight"
            style={{ color: "#1A1A1A", letterSpacing: "-0.02em" }}
          >
            Lo tangible
          </h2>
        </SlowRise>
      </div>

      <div className="px-8 md:px-16">
        <div className="flex flex-col md:flex-row items-center gap-16 md:gap-24">
          {/* PDF Stack */}
          <SlowRise className="flex-shrink-0">
            <PdfStack />
          </SlowRise>

          {/* CTA */}
          <SlowRise delay={0.2} className="max-w-md">
            <p className="text-sm md:text-base mb-8" style={{ color: "#8C867A", lineHeight: 1.8 }}>
              El archivo, destilado en un álbum imprimible. Cada imagen compuesta y secuenciada
              para la forma física — listo para volverse papel, tinta y luz entre tus manos.
            </p>
            <motion.button
              onClick={handleDownload}
              disabled={downloading}
              whileHover={{ scale: downloading ? 1 : 1.02 }}
              whileTap={{ scale: downloading ? 1 : 0.98 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="group flex items-center gap-4 px-8 py-4 rounded-sm transition-colors duration-500 disabled:opacity-60"
              style={{
                background: "#1A1A1A",
                color: "#F2F1ED",
              }}
            >
              {downloading ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <FileDown size={18} className="group-hover:translate-y-0.5 transition-transform duration-300" />
              )}
              <span className="font-mono text-xs uppercase tracking-[0.2em]">
                {downloading ? "Descargando…" : "Descargar Álbum PDF"}
              </span>
            </motion.button>
            <p className="mt-4 font-mono text-[11px] uppercase tracking-widest" style={{ color: "#8C867A" }}>
              Alta resolución · Listo para imprimir · Formato A5
            </p>
          </SlowRise>
        </div>
      </div>
    </section>
  );
}