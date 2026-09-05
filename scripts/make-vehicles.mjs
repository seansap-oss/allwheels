/**
 * Motora original vehicle illustration generator (zero dependencies).
 * Produces attractive, realistic-style SVG artwork for catalogue + listings.
 * 100% Motora-owned — no copied photos, no hotlinks (per catalogue spec §1).
 * Usage: node scripts/make-vehicles.mjs
 */
import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const out = join(dirname(fileURLToPath(import.meta.url)), "..", "public", "images", "vehicles");
mkdirSync(out, { recursive: true });

function sky(theme) {
  const themes = {
    day: ["#7dd3fc", "#e0f2fe", "#f8fafc"],
    sunset: ["#312e81", "#f97316", "#fdba74"],
    city: ["#0f2050", "#1a5fd0", "#93c5fd"],
    hills: ["#065f46", "#6ee7b7", "#ecfdf5"],
    desert: ["#92400e", "#fbbf24", "#fef3c7"],
  };
  const [a, b, c] = themes[theme] ?? themes.day;
  return `<defs><linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${a}"/><stop offset="0.65" stop-color="${b}"/><stop offset="1" stop-color="${c}"/></linearGradient></defs><rect width="800" height="600" fill="url(#sky)"/>`;
}

function backdrop(theme) {
  let s = "";
  if (theme === "city") {
    s += `<g fill="#0a1633" opacity="0.55">`;
    const bars = [40, 110, 190, 300, 420, 520, 640, 720];
    for (const x of bars) {
      const h = 120 + ((x * 37) % 130);
      s += `<rect x="${x}" y="${440 - h}" width="70" height="${h}"/>`;
      for (let wy = 440 - h + 12; wy < 428; wy += 22)
        for (let wx = x + 8; wx < x + 62; wx += 16)
          s += `<rect x="${wx}" y="${wy}" width="8" height="10" fill="#fde68a" opacity="0.8"/>`;
    }
    s += `</g>`;
  } else if (theme === "hills") {
    s += `<polygon points="0,440 180,260 360,440" fill="#047857" opacity="0.7"/><polygon points="240,440 460,220 680,440" fill="#065f46" opacity="0.8"/><polygon points="560,440 700,300 800,440" fill="#047857" opacity="0.7"/>`;
  } else if (theme === "desert") {
    s += `<ellipse cx="150" cy="430" rx="220" ry="60" fill="#d97706" opacity="0.5"/><ellipse cx="620" cy="435" rx="260" ry="55" fill="#b45309" opacity="0.45"/>`;
  }
  // sun + clouds
  s += `<circle cx="660" cy="110" r="42" fill="#fef9c3" opacity="0.95"/><circle cx="660" cy="110" r="60" fill="#fef9c3" opacity="0.25"/>`;
  s += `<g fill="#ffffff" opacity="0.85"><ellipse cx="180" cy="120" rx="70" ry="22"/><ellipse cx="230" cy="108" rx="55" ry="20"/><ellipse cx="420" cy="80" rx="60" ry="18"/></g>`;
  // road
  s += `<rect y="440" width="800" height="160" fill="#334155"/><rect y="440" width="800" height="8" fill="#475569"/><g fill="#f8fafc">`;
  for (let x = 20; x < 800; x += 90) s += `<rect x="${x}" y="516" width="48" height="8" rx="4"/>`;
  s += `</g>`;
  return s;
}

function wheel(cx, cy, r) {
  let spokes = "";
  for (let i = 0; i < 5; i++) {
    const a = (i * 72 * Math.PI) / 180;
    spokes += `<line x1="${cx}" y1="${cy}" x2="${(cx + Math.cos(a) * r * 0.55).toFixed(1)}" y2="${(cy + Math.sin(a) * r * 0.55).toFixed(1)}" stroke="#94a3b8" stroke-width="${(r * 0.14).toFixed(0)}"/>`;
  }
  return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="#0f172a"/><circle cx="${cx}" cy="${cy}" r="${(r * 0.62).toFixed(0)}" fill="#cbd5e1"/>${spokes}<circle cx="${cx}" cy="${cy}" r="${(r * 0.16).toFixed(0)}" fill="#475569"/>`;
}

function glass(points) {
  return `<polygon points="${points}" fill="#0f2a4a"/><polygon points="${points}" fill="#ffffff" opacity="0.12"/>`;
}

function carBody({ color, cabin, lamps = true }) {
  return `
  <ellipse cx="400" cy="452" rx="300" ry="26" fill="#000000" opacity="0.30"/>
  ${wheel(250, 420, 62)}${wheel(560, 420, 62)}
  <rect x="120" y="330" width="560" height="92" rx="26" fill="${color}"/>
  <rect x="120" y="398" width="560" height="24" rx="12" fill="#000000" opacity="0.22"/>
  <rect x="120" y="344" width="560" height="10" rx="5" fill="#ffffff" opacity="0.25"/>
  <polygon points="${cabin}" fill="${color}"/>
  ${glass(cabinGlass(cabin))}
  <rect x="150" y="368" width="500" height="6" rx="3" fill="#000000" opacity="0.18"/>
  ${lamps ? `<rect x="648" y="360" width="34" height="16" rx="8" fill="#fef08a"/><rect x="648" y="360" width="34" height="16" rx="8" fill="#facc15" opacity="0.5"/><rect x="118" y="360" width="18" height="16" rx="8" fill="#ef4444"/>` : ""}
  <rect x="330" y="372" width="34" height="7" rx="3.5" fill="#0f172a" opacity="0.6"/><rect x="470" y="372" width="34" height="7" rx="3.5" fill="#0f172a" opacity="0.6"/>`;
}

function cabinGlass(cabin) {
  // cabin: "x1,y1 x2,y2 x3,y3 x4,y4" -> inset glass quad
  const p = cabin.split(" ").map((pt) => pt.split(",").map(Number));
  const inset = p.map(([x, y], i) => {
    if (i === 0) return `${x + 22},${y + 4}`;
    if (i === 1) return `${x + 16},${y + 12}`;
    if (i === 2) return `${x - 16},${y + 12}`;
    return `${x - 22},${y + 4}`;
  });
  const mid1 = `${(p[1][0] + p[2][0]) / 2 - 6},${p[1][1]}`;
  const mid2 = `${(p[1][0] + p[2][0]) / 2 - 6},${p[0][1] + 6}`;
  return `${inset[0]} ${inset[1]} ${mid1} ${mid2}|${mid1} ${mid2} ${inset[2]} ${inset[3]}`.replace("|", " ");
}

function vehicle(type, color) {
  switch (type) {
    case "suv":
      return carBody({ color, cabin: "258,332 312,236 492,236 548,332" });
    case "sedan":
      return carBody({ color, cabin: "250,332 320,250 470,250 532,332" });
    case "hatchback":
      return carBody({ color, cabin: "270,332 320,246 460,246 512,332" });
    case "mpv":
      return `<ellipse cx="400" cy="452" rx="300" ry="26" fill="#000000" opacity="0.30"/>${wheel(240, 420, 60)}${wheel(570, 420, 60)}
      <rect x="110" y="250" width="580" height="172" rx="30" fill="${color}"/>
      <rect x="110" y="398" width="580" height="24" rx="12" fill="#000000" opacity="0.22"/>
      ${glass("150,270 620,270 620,340 150,340")}
      <line x1="330" y1="270" x2="330" y2="340" stroke="${color}" stroke-width="10"/>
      <line x1="480" y1="270" x2="480" y2="340" stroke="${color}" stroke-width="10"/>
      <rect x="656" y="330" width="34" height="16" rx="8" fill="#fef08a"/><rect x="108" y="330" width="18" height="16" rx="8" fill="#ef4444"/>`;
    case "pickup":
      return `<ellipse cx="400" cy="452" rx="300" ry="26" fill="#000000" opacity="0.30"/>${wheel(240, 420, 62)}${wheel(570, 420, 62)}
      <rect x="110" y="330" width="580" height="92" rx="20" fill="${color}"/>
      <rect x="380" y="330" width="310" height="52" rx="10" fill="#000000" opacity="0.30"/>
      <polygon points="250,332 300,244 460,244 510,332" fill="${color}"/>
      ${glass("272,332 312,258 448,258 488,332")}
      <rect x="656" y="360" width="34" height="16" rx="8" fill="#fef08a"/><rect x="108" y="360" width="18" height="16" rx="8" fill="#ef4444"/>`;
    case "truck":
      return `<ellipse cx="400" cy="456" rx="320" ry="26" fill="#000000" opacity="0.30"/>${wheel(220, 424, 58)}${wheel(560, 424, 58)}${wheel(640, 424, 58)}
      <rect x="300" y="200" width="330" height="222" rx="14" fill="#f8fafc"/>
      <rect x="300" y="200" width="330" height="222" rx="14" fill="none" stroke="#cbd5e1" stroke-width="6"/>
      ${[0, 1, 2].map((i) => `<line x1="300" y1="${260 + i * 55}" x2="630" y2="${260 + i * 55}" stroke="#e2e8f0" stroke-width="6"/>`).join("")}
      <rect x="120" y="300" width="180" height="122" rx="16" fill="${color}"/>
      ${glass("140,314 260,314 260,352 140,352")}
      <rect x="262" y="360" width="40" height="16" rx="8" fill="#fef08a"/>`;
    case "bus":
      return `<ellipse cx="400" cy="456" rx="330" ry="26" fill="#000000" opacity="0.30"/>${wheel(220, 424, 56)}${wheel(590, 424, 56)}
      <rect x="90" y="230" width="620" height="192" rx="24" fill="${color}"/>
      ${glass("120,252 680,252 680,330 120,330")}
      ${[0, 1, 2, 3, 4].map((i) => `<line x1="${220 + i * 100}" y1="252" x2="${220 + i * 100}" y2="330" stroke="${color}" stroke-width="10"/>`).join("")}
      <rect x="120" y="352" width="560" height="10" rx="5" fill="#ffffff" opacity="0.3"/>
      <rect x="676" y="360" width="34" height="18" rx="9" fill="#fef08a"/><rect x="88" y="360" width="18" height="18" rx="9" fill="#ef4444"/>`;
    case "bike":
      return `<ellipse cx="400" cy="470" rx="260" ry="22" fill="#000000" opacity="0.30"/>${wheel(220, 420, 78)}${wheel(590, 420, 78)}
      <polygon points="300,420 430,300 470,300 360,420" fill="${color}"/>
      <polygon points="430,300 560,300 590,420 470,420" fill="${color}" opacity="0.85"/>
      <ellipse cx="505" cy="285" rx="62" ry="30" fill="${color}"/>
      <rect x="540" y="300" width="70" height="26" rx="13" fill="#0f172a"/>
      <line x1="560" y1="300" x2="620" y2="230" stroke="#0f172a" stroke-width="14" stroke-linecap="round"/>
      <line x1="620" y1="230" x2="660" y2="230" stroke="#0f172a" stroke-width="12" stroke-linecap="round"/>
      <circle cx="632" cy="252" r="20" fill="#fef9c3"/><circle cx="632" cy="252" r="28" fill="#facc15" opacity="0.35"/>
      <rect x="380" y="360" width="90" height="40" rx="12" fill="#334155"/>
      <line x1="300" y1="420" x2="270" y2="480" stroke="#64748b" stroke-width="10" stroke-linecap="round"/>`;
    case "scooter":
      return `<ellipse cx="400" cy="470" rx="230" ry="22" fill="#000000" opacity="0.30"/>${wheel(250, 425, 64)}${wheel(570, 425, 64)}
      <path d="M300,425 L340,300 Q345,280 365,280 L420,280 L400,360 L480,360 L470,425 Z" fill="${color}"/>
      <path d="M470,425 L490,300 Q550,290 560,240 L600,240 L590,300 Q585,380 560,425 Z" fill="${color}"/>
      <ellipse cx="500" cy="330" rx="66" ry="26" fill="#0f172a"/>
      <line x1="585" y1="240" x2="610" y2="180" stroke="#0f172a" stroke-width="12" stroke-linecap="round"/>
      <line x1="610" y1="180" x2="640" y2="180" stroke="#0f172a" stroke-width="10" stroke-linecap="round"/>
      <circle cx="600" cy="205" r="16" fill="#fef9c3"/>
      <rect x="300" y="400" width="180" height="18" rx="9" fill="#0f172a" opacity="0.5"/>`;
    case "bicycle":
      return `<ellipse cx="400" cy="478" rx="250" ry="18" fill="#000000" opacity="0.25"/>
      <circle cx="260" cy="420" r="72" fill="none" stroke="#0f172a" stroke-width="10"/><circle cx="550" cy="420" r="72" fill="none" stroke="#0f172a" stroke-width="10"/>
      <circle cx="260" cy="420" r="8" fill="#64748b"/><circle cx="550" cy="420" r="8" fill="#64748b"/>
      <polyline points="260,420 380,420 430,300 550,420 380,420 340,300" fill="none" stroke="${color}" stroke-width="14" stroke-linejoin="round" stroke-linecap="round"/>
      <line x1="430" y1="300" x2="410" y2="270" stroke="#0f172a" stroke-width="10" stroke-linecap="round"/>
      <line x1="380" y1="270" x2="440" y2="270" stroke="#0f172a" stroke-width="10" stroke-linecap="round"/>
      <line x1="340" y1="300" x2="340" y2="285" stroke="#0f172a" stroke-width="10"/>
      <rect x="305" y="278" width="70" height="16" rx="8" fill="#0f172a"/>
      <line x1="550" y1="420" x2="590" y2="300" stroke="#64748b" stroke-width="8"/>
      <line x1="590" y1="300" x2="620" y2="300" stroke="#0f172a" stroke-width="8" stroke-linecap="round"/>`;
    default:
      return carBody({ color, cabin: "258,332 312,236 492,236 548,332" });
  }
}

const GALLERY = [
  { file: "suv-red.svg", type: "suv", color: "#dc2626", theme: "hills" },
  { file: "suv-black.svg", type: "suv", color: "#1e293b", theme: "city" },
  { file: "suv-blue.svg", type: "suv", color: "#1d4ed8", theme: "day" },
  { file: "sedan-silver.svg", type: "sedan", color: "#94a3b8", theme: "city" },
  { file: "sedan-white.svg", type: "sedan", color: "#e2e8f0", theme: "day" },
  { file: "hatch-red.svg", type: "hatchback", color: "#ef4444", theme: "day" },
  { file: "hatch-blue.svg", type: "hatchback", color: "#2563eb", theme: "sunset" },
  { file: "mpv-white.svg", type: "mpv", color: "#f1f5f9", theme: "day" },
  { file: "pickup-orange.svg", type: "pickup", color: "#ea580c", theme: "desert" },
  { file: "bike-green.svg", type: "bike", color: "#166534", theme: "hills" },
  { file: "bike-orange.svg", type: "bike", color: "#ea580c", theme: "sunset" },
  { file: "bike-blue.svg", type: "bike", color: "#1e40af", theme: "day" },
  { file: "bike-black.svg", type: "bike", color: "#1f2937", theme: "city" },
  { file: "scooter-white.svg", type: "scooter", color: "#e2e8f0", theme: "day" },
  { file: "scooter-blue.svg", type: "scooter", color: "#0284c7", theme: "city" },
  { file: "scooter-mint.svg", type: "scooter", color: "#14b8a6", theme: "hills" },
  { file: "ev-blue.svg", type: "scooter", color: "#4f46e5", theme: "city" },
  { file: "truck-white.svg", type: "truck", color: "#0369a1", theme: "desert" },
  { file: "bus-yellow.svg", type: "bus", color: "#eab308", theme: "day" },
  { file: "cycle-blue.svg", type: "bicycle", color: "#2563eb", theme: "hills" },
  { file: "cycle-red.svg", type: "bicycle", color: "#dc2626", theme: "day" },
];

for (const g of GALLERY) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600">${sky(g.theme)}${backdrop(g.theme)}${vehicle(g.type, g.color)}</svg>`;
  writeFileSync(join(out, g.file), svg);
  console.log("wrote", g.file);
}
