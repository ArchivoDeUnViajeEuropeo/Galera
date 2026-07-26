import React, { useState } from "react";
import { motion } from "framer-motion";

export default function GalleryImage({ src, alt, className = "", style = {} }) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className={`relative overflow-hidden ${className}`} style={style}>
      {!loaded && <div className="absolute inset-0 shimmer rounded" />}
      <motion.img
        src={src}
        alt={alt}
        onLoad={() => setLoaded(true)}
        initial={{ opacity: 0, filter: "blur(20px)" }}
        animate={loaded ? { opacity: 1, filter: "blur(0px)" } : {}}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        className="w-full h-full object-cover"
        loading="lazy"
      />
    </div>
  );
}