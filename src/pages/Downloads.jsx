import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import DownloadGallery from "@/components/gallery/DownloadGallery";

export default function Downloads() {
  return (
    <div className="min-h-screen" style={{ background: "#F2F1ED" }}>
      <div className="px-8 md:px-16 pt-10">
        <Link
          to="/"
          className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] transition-colors duration-300 hover:text-[#1A1A1A]"
          style={{ color: "#8C867A" }}
        >
          <ArrowLeft size={14} />
          Volver al inicio
        </Link>
      </div>
      <DownloadGallery />
    </div>
  );
}