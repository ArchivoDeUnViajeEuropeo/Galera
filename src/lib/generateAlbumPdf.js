import { base44 } from "@/api/base44Client";

// A5 portrait in mm
const PAGE_W = 148;
const PAGE_H = 210;
const MARGIN = 15;

// Coffee palette
const COLORS = {
  ink: "#1A1A1A",
  coffee: "#8C867A",
  coffeeLight: "#B8B0A4",
  paper: "#F2F1ED",
  paperDeep: "#E0DED7",
};

// Helper: hex -> rgb array for jsPDF setTextColor/setDrawColor
function hexToRgb(hex) {
  const h = hex.replace("#", "");
  return [
    parseInt(h.substring(0, 2), 16),
    parseInt(h.substring(2, 4), 16),
    parseInt(h.substring(4, 6), 16),
  ];
}

// Transform a Google Drive thumbnail URL into a CORS-enabled googleusercontent URL
function toCorsUrl(url) {
  try {
    const u = new URL(url);
    if (u.hostname === "drive.google.com" && u.pathname === "/thumbnail") {
      const id = u.searchParams.get("id");
      if (id) return `https://lh3.googleusercontent.com/d/${id}=w1600`;
    }
    return url;
  } catch {
    return url;
  }
}

// Load an image URL into a data URL via canvas (handles CORS)
function loadImageAsDataUrl(url) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = toCorsUrl(url);
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext("2d");
      // Warm paper-tone background behind transparent areas
      ctx.fillStyle = COLORS.paper;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
      try {
        resolve(canvas.toDataURL("image/jpeg", 0.92));
      } catch (e) {
        reject(e);
      }
    };
    img.onerror = () => reject(new Error("img load error"));
  });
}

// Fetch all gallery sections' images (excluding statistics)
export async function fetchAlbumData() {
  const sections = [
    {
      number: "01",
      title: "Participantes",
      description: "Ocho viajeros, un mismo rumbo.",
      fn: () => base44.functions.invoke("listParticipants", {}),
      normalize: (res) =>
        (res.data.participants || []).map((p) => ({
          src: p.mainImage?.viewUrl,
          caption: p.name,
        })),
    },
    {
      number: "02",
      title: "Destinos",
      description: "Seis ciudades, seis lenguajes de luz.",
      fn: () =>
        base44.functions.invoke("listParticipants", { folderPath: "Web/02-Destinos" }),
      normalize: (res) =>
        (res.data.participants || []).map((d) => ({
          src: d.mainImage?.viewUrl,
          caption: d.name,
        })),
    },
    {
      number: "03",
      title: "Escultura y Arte",
      description: "Formas liberadas de la piedra.",
      fn: () =>
        base44.functions.invoke("listDriveImages", {
          folderPath: "Web/05-escultura y arte",
        }),
      normalize: (res) =>
        (res.data.images || []).map((img) => ({ src: img.viewUrl, caption: "" })),
    },
    {
      number: "04",
      title: "Arquitectura",
      description: "La piedra y el cielo.",
      fn: () =>
        base44.functions.invoke("listDriveImages", { folderPath: "Web/06-arquitectura" }),
      normalize: (res) =>
        (res.data.images || []).map((img) => ({ src: img.viewUrl, caption: "" })),
    },
    {
      number: "05",
      title: "Recuerdos Grupales",
      description: "Los instantes compartidos.",
      fn: () =>
        base44.functions.invoke("listDriveImages", { folderPath: "Web/08 - Grupales" }),
      normalize: (res) =>
        (res.data.images || []).map((img) => ({ src: img.viewUrl, caption: "" })),
    },
    {
      number: "06",
      title: "Preparativos",
      description: "La anticipación antes del destino.",
      fn: () =>
        base44.functions.invoke("listDriveImages", { folderPath: "Web/04-preparativos" }),
      normalize: (res) =>
        (res.data.images || []).map((img) => ({ src: img.viewUrl, caption: "" })),
    },
  ];

  const results = await Promise.all(
    sections.map(async (s) => {
      try {
        const res = await s.fn();
        const images = (s.normalize(res) || []).filter((i) => i.src);
        return { ...s, images };
      } catch {
        return { ...s, images: [] };
      }
    })
  );

  return results;
}

// Ornament: small diamond + flanking short rules, centered at (cx, cy)
function drawOrnament(pdf, cx, cy, halfWidth = 14, color = COLORS.coffee) {
  const [r, g, b] = hexToRgb(color);
  pdf.setDrawColor(r, g, b);
  pdf.setLineWidth(0.3);
  // left rule
  pdf.line(cx - halfWidth, cy, cx - 3, cy);
  // right rule
  pdf.line(cx + 3, cy, cx + halfWidth, cy);
  // diamond (small rotated square)
  const d = 1.6;
  pdf.setFillColor(r, g, b);
  pdf.triangle(cx, cy - d, cx + d, cy, cx, cy + d, "F");
  pdf.triangle(cx, cy - d, cx - d, cy, cx, cy + d, "F");
}

function coverPage(pdf) {
  const [ir, ig, ib] = hexToRgb(COLORS.ink);
  const [cr, cg, cb] = hexToRgb(COLORS.coffee);

  // Top label
  pdf.setFont("helvetica", "italic");
  pdf.setFontSize(9);
  pdf.setTextColor(cr, cg, cb);
  pdf.text("EL ARCHIVO DE UN VIAJE EUROPEO", PAGE_W / 2, 45, { align: "center" });

  // Ornament below label
  drawOrnament(pdf, PAGE_W / 2, 55, 22);

  // Main title — large, multi-line
  pdf.setFont("times", "bold");
  pdf.setFontSize(48);
  pdf.setTextColor(ir, ig, ib);
  pdf.text("Un Verano", PAGE_W / 2, 100, { align: "center" });
  pdf.text("en Europa", PAGE_W / 2, 122, { align: "center" });

  // Subtitle italic
  pdf.setFont("times", "italic");
  pdf.setFontSize(13);
  pdf.setTextColor(cr, cg, cb);
  pdf.text("Memoria de un recorrido", PAGE_W / 2, 140, { align: "center" });

  // Bottom ornament + year
  drawOrnament(pdf, PAGE_W / 2, 175, 18);
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(9);
  pdf.setTextColor(cr, cg, cb);
  pdf.text("MMXXVI", PAGE_W / 2, 185, { align: "center" });
}

function sectionDividerPage(pdf, section, pageIndex) {
  const [ir, ig, ib] = hexToRgb(COLORS.ink);
  const [cr, cg, cb] = hexToRgb(COLORS.coffee);

  // Section number — large, top
  pdf.setFont("times", "normal");
  pdf.setFontSize(64);
  pdf.setTextColor(cr, cg, cb);
  pdf.text(section.number, PAGE_W / 2, 90, { align: "center" });

  // Ornament
  drawOrnament(pdf, PAGE_W / 2, 105, 16);

  // Title
  pdf.setFont("times", "bold");
  pdf.setFontSize(28);
  pdf.setTextColor(ir, ig, ib);
  pdf.text(section.title, PAGE_W / 2, 125, { align: "center" });

  // Description
  pdf.setFont("times", "italic");
  pdf.setFontSize(12);
  pdf.setTextColor(cr, cg, cb);
  pdf.text(section.description, PAGE_W / 2, 140, { align: "center" });

  // Bottom corner: page number
  drawPageNumber(pdf, pageIndex);
}

function drawPageNumber(pdf, num) {
  const [cr, cg, cb] = hexToRgb(COLORS.coffee);
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(8);
  pdf.setTextColor(cr, cg, cb);
  pdf.text(String(num).padStart(2, "0"), PAGE_W - MARGIN, PAGE_H - 8, {
    align: "right",
  });
}

// Place an image fit within a box, preserving aspect ratio, centered
function drawImageFit(pdf, dataUrl, x, y, w, h) {
  // We need image dimensions; create temp image to get ratio
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const ratio = img.naturalWidth / img.naturalHeight;
      let dw = w;
      let dh = w / ratio;
      if (dh > h) {
        dh = h;
        dw = h * ratio;
      }
      const dx = x + (w - dw) / 2;
      const dy = y + (h - dh) / 2;
      const fmt = dataUrl.indexOf("image/png") !== -1 ? "PNG" : "JPEG";
      pdf.addImage(dataUrl, fmt, dx, dy, dw, dh);
      resolve();
    };
    img.onerror = () => resolve();
    img.src = dataUrl;
  });
}

// Image page: one centered image with caption and page number
async function imagePage(pdf, item, pageIndex) {
  const [cr, cg, cb] = hexToRgb(COLORS.coffee);
  const imgH = PAGE_H - MARGIN * 2 - 20; // leave room for caption
  let dataUrl;
  try {
    dataUrl = await loadImageAsDataUrl(item.src);
  } catch {
    // placeholder block
    pdf.setFillColor(...hexToRgb(COLORS.paperDeep));
    pdf.rect(MARGIN, MARGIN, PAGE_W - MARGIN * 2, imgH, "F");
    drawPageNumber(pdf, pageIndex);
    return;
  }

  await drawImageFit(pdf, dataUrl, MARGIN, MARGIN, PAGE_W - MARGIN * 2, imgH);

  // Caption
  if (item.caption) {
    drawOrnament(pdf, PAGE_W / 2, PAGE_H - MARGIN - 6, 12, COLORS.coffeeLight);
    pdf.setFont("helvetica", "italic");
    pdf.setFontSize(9);
    pdf.setTextColor(cr, cg, cb);
    pdf.text(item.caption, PAGE_W / 2, PAGE_H - 8, { align: "center" });
  }
  drawPageNumber(pdf, pageIndex);
}

export async function generateAlbumPdf(onProgress) {
  const { jsPDF } = await import("jspdf");
  const pdf = new jsPDF({ unit: "mm", format: [PAGE_W, PAGE_H], orientation: "portrait" });

  // Set paper background
  const [pr, pg, pb] = hexToRgb(COLORS.paper);
  pdf.setFillColor(pr, pg, pb);
  pdf.rect(0, 0, PAGE_W, PAGE_H, "F");

  coverPage(pdf);

  const sections = await fetchAlbumData();

  let pageNum = 2;
  for (const section of sections) {
    if (section.images.length === 0) continue;
    pdf.addPage();
    pdf.setFillColor(pr, pg, pb);
    pdf.rect(0, 0, PAGE_W, PAGE_H, "F");
    sectionDividerPage(pdf, section, pageNum);
    pageNum++;

    for (const item of section.images) {
      pdf.addPage();
      pdf.setFillColor(pr, pg, pb);
      pdf.rect(0, 0, PAGE_W, PAGE_H, "F");
      await imagePage(pdf, item, pageNum);
      pageNum++;
      if (onProgress) onProgress(pageNum);
    }
  }

  // Back cover
  pdf.addPage();
  pdf.setFillColor(pr, pg, pb);
  pdf.rect(0, 0, PAGE_W, PAGE_H, "F");
  drawOrnament(pdf, PAGE_W / 2, PAGE_H / 2, 24);
  pdf.setFont("times", "italic");
  pdf.setFontSize(12);
  pdf.setTextColor(...hexToRgb(COLORS.coffee));
  pdf.text("Fin del archivo", PAGE_W / 2, PAGE_H / 2 + 18, { align: "center" });
  drawOrnament(pdf, PAGE_W / 2, PAGE_H / 2 + 32, 14);

  return pdf;
}

export async function downloadAlbumPdf(onProgress) {
  const pdf = await generateAlbumPdf(onProgress);
  pdf.save("Archivo-Viaje-Europeo-A5.pdf");
}