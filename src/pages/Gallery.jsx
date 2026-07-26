import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import AutoScrollControl from "@/components/gallery/AutoScrollControl";
import SectionNav from "@/components/gallery/sections/SectionNav";
import DestinosSection from "@/components/gallery/sections/DestinosSection";
import ParticipantesSection from "@/components/gallery/sections/ParticipantesSection";
import PreparativosSection from "@/components/gallery/sections/PreparativosSection";
import EsculturaArteSection from "@/components/gallery/sections/EsculturaArteSection";
import ArquitecturaSection from "@/components/gallery/sections/ArquitecturaSection";
import RecuerdosGrupalesSection from "@/components/gallery/sections/RecuerdosGrupalesSection";
import EstadisticasSection from "@/components/gallery/sections/EstadisticasSection";

const Divider = () => (
  <div className="px-8 md:px-16">
    <div className="h-px w-full" style={{ background: "rgba(140, 134, 122, 0.15)" }} />
  </div>
);

export default function Gallery() {
  return (
    <div className="min-h-screen" style={{ background: "#F2F1ED" }}>
      <div className="px-8 md:px-16 pt-10 pb-4">
        <Link
          to="/"
          className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] transition-colors duration-300 hover:text-[#1A1A1A]"
          style={{ color: "#8C867A" }}
        >
          <ArrowLeft size={14} />
          Volver al inicio
        </Link>
      </div>

      <AutoScrollControl />

      <ParticipantesSection />
      <Divider />
      <DestinosSection />
      <Divider />
      <EsculturaArteSection />
      <Divider />
      <ArquitecturaSection />
      <Divider />
      <RecuerdosGrupalesSection />
      <Divider />
      <PreparativosSection />
      <Divider />
      <EstadisticasSection />

      <SectionNav />
    </div>
  );
}