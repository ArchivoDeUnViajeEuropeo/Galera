import React from "react";
import CoverShowcase from "@/components/gallery/CoverShowcase";
import TangibleSection from "@/components/gallery/TangibleSection";

export default function Home() {
  return (
    <div className="min-h-screen" style={{ background: "#F2F1ED" }}>
      <CoverShowcase />

      {/* Album download section at the bottom */}
      <TangibleSection />
    </div>
  );
}