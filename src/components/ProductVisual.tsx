import type { Product } from "../data/catalog";

interface ProductVisualProps {
  product: Product;
  className?: string;
}

function getToneFromName(name: string): {
  primary: string;
  secondary: string;
  accent: string;
  box: string;
} {
  const n = name.toLowerCase();
  if (n.includes("orange"))
    return { primary: "#ea6a2f", secondary: "#f89b6c", accent: "#c74e16", box: "#fff4ee" };
  if (n.includes("ungu") || n.includes("purple"))
    return { primary: "#6f498f", secondary: "#9f7ec0", accent: "#4c2f66", box: "#f4f0f8" };
  if (n.includes("kuning") || n.includes("pesca"))
    return { primary: "#e5a93b", secondary: "#f6cf78", accent: "#b8821d", box: "#fdf7e9" };
  if (n.includes("biru") || n.includes("blue"))
    return { primary: "#254b8c", secondary: "#6a8ec9", accent: "#17315e", box: "#eef3fb" };
  if (n.includes("pink") || n.includes("sakura") || n.includes("rose"))
    return { primary: "#d97d8e", secondary: "#f0b4bf", accent: "#a84e60", box: "#fbf1f3" };
  if (n.includes("emerald"))
    return { primary: "#1b6b4f", secondary: "#4da080", accent: "#0f4733", box: "#edf6f2" };
  if (n.includes("coral") || n.includes("nude"))
    return { primary: "#d98d76", secondary: "#efc1b2", accent: "#a95e49", box: "#fbf2ef" };
  if (n.includes("grey") || n.includes("abu") || n.includes("silver"))
    return { primary: "#6e747c", secondary: "#a8aeb5", accent: "#3f444b", box: "#f2f3f5" };
  if (n.includes("white"))
    return { primary: "#e6e2da", secondary: "#f6f4ef", accent: "#b6aa94", box: "#f8f7f4" };
  if (n.includes("tobacco") || n.includes("oubaiyah"))
    return { primary: "#5a3222", secondary: "#8d5940", accent: "#3b1e13", box: "#f5efec" };
  if (n.includes("noir"))
    return { primary: "#222226", secondary: "#4d4d55", accent: "#0d0d10", box: "#f1f1f2" };
  return { primary: "#c5a059", secondary: "#e0c483", accent: "#8d6e30", box: "#f8f5ed" };
}

export function ProductVisual({ product, className = "" }: ProductVisualProps) {
  if (product.img) {
    return (
      <img
        src={product.img}
        alt={product.name}
        referrerPolicy="no-referrer"
        className={`h-full w-full object-cover transition-transform duration-300 ease-out group-hover:scale-[1.03] ${className}`}
      />
    );
  }

  const tone = getToneFromName(product.name);
  const cat = product.cat;

  return (
    <div
      className={`relative flex h-full w-full items-center justify-center bg-[#f8f8f7] p-6 transition-transform duration-300 ease-out group-hover:scale-[1.03] ${className}`}
    >
      {/* Subtle studio pedestal shadow */}
      <div
        className="pointer-events-none absolute bottom-5 h-4 w-3/5 rounded-full opacity-55 blur-md"
        style={{ background: "radial-gradient(ellipse at center, rgba(0,0,0,0.22), transparent 70%)" }}
      />

      {cat === "Parfum Ibraq Diamond" && (
        <svg viewBox="0 0 200 200" className="relative h-full w-full max-h-[180px]" aria-hidden="true">
          <defs>
            <linearGradient id={`box-${product.id}`} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor={tone.box} />
              <stop offset="100%" stopColor="#e7e4dc" />
            </linearGradient>
            <linearGradient id={`glass-${product.id}`} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor={tone.secondary} stopOpacity="0.92" />
              <stop offset="55%" stopColor={tone.primary} stopOpacity="0.95" />
              <stop offset="100%" stopColor={tone.accent} />
            </linearGradient>
            <radialGradient id={`cap-${product.id}`} cx="35%" cy="30%" r="65%">
              <stop offset="0%" stopColor="#f5e2ae" />
              <stop offset="55%" stopColor="#c9a34e" />
              <stop offset="100%" stopColor="#7f5f1e" />
            </radialGradient>
          </defs>
          {/* Backing presentation box */}
          <rect x="38" y="34" width="124" height="128" rx="4" fill={`url(#box-${product.id})`} stroke="#dedad0" />
          <rect x="48" y="44" width="104" height="108" rx="2" fill="none" stroke="#d5cfc2" strokeWidth="0.8" />
          {/* Gold neck */}
          <rect x="91" y="54" width="18" height="10" rx="2" fill="#b7913f" />
          {/* Spherical Gold Cap */}
          <circle cx="100" cy="44" r="14" fill={`url(#cap-${product.id})`} />
          {/* Faceted Diamond Perfume Bottle */}
          <rect x="70" y="64" width="60" height="98" rx="6" fill={`url(#glass-${product.id})`} />
          {/* Diamond lattice facets */}
          <path
            d="M70 84 L100 64 L130 84 L100 104 Z M70 116 L100 96 L130 116 L100 136 Z M70 148 L100 128 L130 148 L100 162 Z"
            fill="white"
            fillOpacity="0.16"
          />
          <path
            d="M84 64 L84 162 M116 64 L116 162"
            stroke="white"
            strokeOpacity="0.18"
            strokeWidth="1"
          />
          {/* Minimalist Label Plaque */}
          <rect x="79" y="96" width="42" height="28" rx="2" fill="#ffffff" fillOpacity="0.92" />
          <text
            x="100"
            y="109"
            textAnchor="middle"
            fontSize="6.5"
            fontWeight="700"
            letterSpacing="1.2"
            fill="#141414"
          >
            IBRAQ
          </text>
          <line x1="87" y1="113" x2="113" y2="113" stroke="#c5a059" strokeWidth="0.9" />
          <text
            x="100"
            y="120"
            textAnchor="middle"
            fontSize="4.6"
            letterSpacing="0.8"
            fill="#555555"
          >
            DIAMOND
          </text>
        </svg>
      )}

      {(cat === "Parfum Lainnya" || cat === "Reef Mini") && (
        <svg viewBox="0 0 200 200" className="relative h-full w-full max-h-[180px]" aria-hidden="true">
          <defs>
            <linearGradient id={`pglass-${product.id}`} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor={tone.secondary} stopOpacity="0.9" />
              <stop offset="100%" stopColor={tone.primary} />
            </linearGradient>
            <linearGradient id={`pcap-${product.id}`} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#f3dfa7" />
              <stop offset="100%" stopColor="#9e7a2b" />
            </linearGradient>
          </defs>
          {/* Soft pedestal box behind */}
          <rect x="44" y="38" width="112" height="124" rx="5" fill={tone.box} stroke="#e3ded5" />
          {/* Bottle silhouette */}
          <rect
            x={cat === "Reef Mini" ? "76" : "68"}
            y={cat === "Reef Mini" ? "78" : "68"}
            width={cat === "Reef Mini" ? "48" : "64"}
            height={cat === "Reef Mini" ? "82" : "92"}
            rx="10"
            fill={`url(#pglass-${product.id})`}
          />
          <rect
            x={cat === "Reef Mini" ? "80" : "72"}
            y={cat === "Reef Mini" ? "82" : "72"}
            width="10"
            height={cat === "Reef Mini" ? "74" : "84"}
            rx="4"
            fill="white"
            fillOpacity="0.18"
          />
          {/* Neck & Cap */}
          <rect x="90" y={cat === "Reef Mini" ? "68" : "58"} width="20" height="10" rx="2" fill="#262626" />
          <rect
            x="84"
            y={cat === "Reef Mini" ? "44" : "36"}
            width="32"
            height={cat === "Reef Mini" ? "24" : "22"}
            rx="4"
            fill={`url(#pcap-${product.id})`}
          />
          {/* Label */}
          <rect
            x={cat === "Reef Mini" ? "82" : "77"}
            y="102"
            width={cat === "Reef Mini" ? "36" : "46"}
            height="28"
            rx="2"
            fill="#ffffff"
            fillOpacity="0.94"
          />
          <text
            x="100"
            y="115"
            textAnchor="middle"
            fontSize="6"
            fontWeight="700"
            letterSpacing="1"
            fill="#111111"
          >
            {cat === "Reef Mini" ? "REEF" : "PARFUM"}
          </text>
          <text x="100" y="124" textAnchor="middle" fontSize="4.5" letterSpacing="0.8" fill="#666666">
            {cat === "Reef Mini" ? "MINI EDITION" : "EAU DE PARFUM"}
          </text>
        </svg>
      )}

      {cat === "Tumbler" && (
        <svg viewBox="0 0 200 200" className="relative h-full w-full max-h-[180px]" aria-hidden="true">
          <defs>
            <linearGradient id={`tumb-${product.id}`} x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor={tone.secondary} />
              <stop offset="42%" stopColor={tone.primary} />
              <stop offset="100%" stopColor={tone.accent} />
            </linearGradient>
          </defs>
          {/* Carry loop */}
          <path
            d="M84 40 C84 26, 116 26, 116 40"
            fill="none"
            stroke="#222222"
            strokeWidth="5"
            strokeLinecap="round"
          />
          {/* Cap */}
          <rect x="74" y="38" width="52" height="16" rx="4" fill="#1b1b1b" />
          <rect x="76" y="54" width="48" height="5" fill="#d4d4d4" />
          {/* Insulated Body */}
          <path
            d="M72 59 L128 59 L124 158 C124 163 120 167 115 167 L85 167 C80 167 76 163 76 158 Z"
            fill={`url(#tumb-${product.id})`}
          />
          {/* Gloss highlight */}
          <rect x="81" y="64" width="9" height="96" rx="4" fill="white" fillOpacity="0.22" />
          {/* Minimalist mark */}
          <circle cx="100" cy="112" r="11" fill="none" stroke="white" strokeOpacity="0.55" strokeWidth="1.2" />
          <text
            x="100"
            y="114.5"
            textAnchor="middle"
            fontSize="6"
            fontWeight="700"
            letterSpacing="0.8"
            fill="white"
          >
            1L
          </text>
        </svg>
      )}

      {cat === "Sajadah" && (
        <svg viewBox="0 0 200 200" className="relative h-full w-full max-h-[180px]" aria-hidden="true">
          <defs>
            <linearGradient id={`saj-${product.id}`} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#1e3c34" />
              <stop offset="100%" stopColor="#0f221d" />
            </linearGradient>
          </defs>
          {/* Gift Box */}
          <rect x="38" y="42" width="124" height="118" rx="6" fill="#ede8dd" stroke="#d9d1c1" />
          {/* Folded Prayer Mat */}
          <rect x="52" y="52" width="96" height="98" rx="4" fill={`url(#saj-${product.id})`} />
          {/* Gold Mihrab Arch */}
          <path
            d="M68 138 L68 92 C68 75, 100 64, 100 64 C100 64, 132 75, 132 92 L132 138 Z"
            fill="none"
            stroke="#d4af5a"
            strokeWidth="2"
          />
          <path
            d="M78 134 L78 96 C78 84, 100 76, 100 76 C100 76, 122 84, 122 96 L122 134"
            fill="none"
            stroke="#d4af5a"
            strokeOpacity="0.65"
            strokeWidth="1.2"
          />
          {/* Tassels */}
          <path d="M58 150 L58 159 M70 150 L70 159 M82 150 L82 159 M94 150 L94 159 M106 150 L106 159 M118 150 L118 159 M130 150 L130 159 M142 150 L142 159" stroke="#c5a059" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      )}

      {cat === "Coklat" && (
        <svg viewBox="0 0 200 200" className="relative h-full w-full max-h-[180px]" aria-hidden="true">
          <defs>
            <linearGradient id={`choc-${product.id}`} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#5a3420" />
              <stop offset="100%" stopColor="#351b0e" />
            </linearGradient>
          </defs>
          {/* Luxury Tin / Box */}
          <rect x="34" y="52" width="132" height="96" rx="8" fill="#f4efe5" stroke="#d8ccb6" strokeWidth="1.5" />
          <rect x="44" y="62" width="112" height="76" rx="4" fill={`url(#choc-${product.id})`} />
          {/* Gold Ribbon */}
          <rect x="44" y="95" width="112" height="10" fill="#d4af5a" />
          <rect x="95" y="62" width="10" height="76" fill="#d4af5a" />
          {/* Center Medallion */}
          <circle cx="100" cy="100" r="18" fill="#fffdf8" stroke="#c5a059" strokeWidth="1.5" />
          <text x="100" y="98" textAnchor="middle" fontSize="6" fontWeight="700" letterSpacing="1" fill="#351b0e">
            DUBAI
          </text>
          <text x="100" y="106" textAnchor="middle" fontSize="4.5" letterSpacing="0.8" fill="#8b6b2b">
            1 KG
          </text>
        </svg>
      )}
    </div>
  );
}
