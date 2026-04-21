import { useState } from "react";
import logo from "./assets/logo.png";

const C = {
  navy: "#0B0C35", navyMid: "#141567", navyLight: "#1E2070",
  green: "#00C896", greenGlow: "#00E5A8",
  white: "#FFFFFF", offWhite: "#E8ECFF",
  gray: "#7B83C0", grayLight: "#B0B8E8",
  cardBg: "#111340", cardBorder: "#1E2680",
  amber: "#F5C542", coral: "#FF7B54", blue: "#4A90E2", purple: "#9B72CF",
};

const ZONES = [
  {
    id: "fournisseurs", label: "Fournisseurs & Commandes", emoji: "🚚", color: C.blue,
    description: "Chaque commande passée auprès d'un grossiste ou d'un labo génère des données. Datatopia les centralise pour analyser vos performances achats et optimiser chaque décision d'approvisionnement.",
    prs: [
      { icon: "📋", title: "Optimisation des commandes", impact: "+15% efficacité achats", desc: "Recommande les quantités idéales selon vos historiques de vente, saisonnalité et niveaux de stock actuels." },
      { icon: "🏭", title: "Performance fournisseurs", impact: "Meilleurs accords négociés", desc: "Évalue chaque fournisseur : délais, taux de service, conditions. Négociez avec des données concrètes." },
    ]
  },
  {
    id: "reserve", label: "Réserve & Stockage", emoji: "📦", color: C.amber,
    description: "La réserve est votre capital immobilisé. 10 000 à 15 000 références, des mouvements permanents, des risques de péremption et de surstock. C'est ici que se jouent des milliers d'euros chaque mois.",
    prs: [
      { icon: "💀", title: "Détection stock mort", impact: "−30% stock dormant", desc: "Identifie les produits immobilisés depuis trop longtemps et propose des actions correctives concrètes." },
      { icon: "📉", title: "Réduction du surstock", impact: "−25% capital immobilisé", desc: "Repère les situations de surstock chronique et génère un plan de résorption progressif et intelligent." },
      { icon: "⚠️", title: "Alertes ruptures & péremptions", impact: "0 rupture non anticipée", desc: "Notifications proactives sur les produits en tension ou proches de leur date limite. Zéro mauvaise surprise." },
    ]
  },
  {
    id: "rayonnages", label: "Rayonnages & Officine", emoji: "🗃️", color: C.purple,
    description: "Les rayonnages sont votre vitrine commerciale. La disposition, les prix affichés et les promotions impactent directement votre CA. Datatopia vous aide à maximiser chaque mètre linéaire.",
    prs: [
      { icon: "🏷️", title: "Veille prix concurrents", impact: "Prix optimisés en temps réel", desc: "Compare automatiquement vos prix avec les onliners et concurrents pour rester compétitif sans effort." },
      { icon: "🎯", title: "Moteur de promotions", impact: "+20% efficacité promos", desc: "Créez des promotions basées sur vos données réelles (stock, marge, rotation). Mesurez l'impact en temps réel." },
    ]
  },
  {
    id: "comptoir", label: "Comptoir & Dispensation", emoji: "💊", color: C.green,
    description: "Le comptoir est le cœur de votre officine. Chaque échange avec un patient est une donnée précieuse. Datatopia transforme ces interactions en intelligence commerciale et en recommandations personnalisées.",
    prs: [
      { icon: "👥", title: "Analyse patientèle", impact: "Meilleure fidélisation", desc: "Segmente votre clientèle, identifie les habitudes d'achat et anticipe les besoins récurrents." },
      { icon: "🤖", title: "Recommandations IA", impact: "Actions concrètes / semaine", desc: "L'IA détecte vos points de douleur et génère des recommandations personnalisées chaque semaine. Zéro effort." },
    ]
  },
  {
    id: "caisse", label: "Caisse & Ventes", emoji: "🛒", color: C.coral,
    description: "Chaque transaction est une mine d'or. Taille du panier, produits associés, heures de pointe, mix OTC/ordonnance... Datatopia transforme vos tickets de caisse en intelligence commerciale actionnable.",
    prs: [
      { icon: "📊", title: "Rapport ventes & panier", impact: "Décisions basées sur data", desc: "Vue complète : évolution CA, taille panier, produits stars, tendances. Préparez vos réunions en 2 minutes." },
      { icon: "💰", title: "Analyse des marges", impact: "+8% marge moyenne", desc: "Vue granulaire des marges par produit, laboratoire et fournisseur. Identifiez vos vrais contributeurs de rentabilité." },
      { icon: "📋", title: "Règles de pricing", impact: "Cohérence prix garantie", desc: "Automatisez vos stratégies de prix : marges minimales, règles par famille, ajustements dynamiques." },
    ]
  },
  {
    id: "backoffice", label: "Dashboard Datatopia", emoji: "🧠", color: C.green,
    description: "Toutes les données de votre officine, centralisées, nettoyées et transformées en intelligence. Le dashboard Datatopia agrège chaque flux pour vous donner une vision 360° de votre performance en temps réel.",
    prs: [
      { icon: "📈", title: "Dashboard global temps réel", impact: "Vision 360° instantanée", desc: "Tous vos KPIs au même endroit : stock, ventes, marges, promos. Accessible sur tous vos appareils." },
      { icon: "🔔", title: "Alertes intelligentes", impact: "0 problème non détecté", desc: "Le système surveille en continu et vous alerte automatiquement sur chaque anomalie ou opportunité." },
      { icon: "📄", title: "Rapports PDF automatiques", impact: "Gain de temps hebdomadaire", desc: "Rapports générés automatiquement pour vos réunions fournisseurs, votre comptable ou votre groupement." },
    ]
  }
];


function PharmacyMap({ activeZone, onZoneClick }) {
  const [hovered, setHovered] = useState(null);
  const dim = (id) => (!activeZone || activeZone === id) ? 1 : 0.32;

  // Projection isométrique aplatie (~22°) pour limiter la "descente" verticale
  const ANGLE = Math.PI / 8.2;
  const COS = Math.cos(ANGLE);
  const SIN = Math.sin(ANGLE);
  const iso = (x, y, z = 0) => ({
    X: (x - y) * COS,
    Y: (x + y) * SIN - z,
  });

  const isoBox = (x, y, w, d, h, z) => {
    const p000 = iso(x, y, z);
    const p100 = iso(x + w, y, z);
    const p010 = iso(x, y + d, z);
    const p110 = iso(x + w, y + d, z);
    const p001 = iso(x, y, z + h);
    const p101 = iso(x + w, y, z + h);
    const p011 = iso(x, y + d, z + h);
    const p111 = iso(x + w, y + d, z + h);
    return {
      top: `${p001.X},${p001.Y} ${p101.X},${p101.Y} ${p111.X},${p111.Y} ${p011.X},${p011.Y}`,
      left: `${p001.X},${p001.Y} ${p011.X},${p011.Y} ${p010.X},${p010.Y} ${p000.X},${p000.Y}`,
      right: `${p101.X},${p101.Y} ${p111.X},${p111.Y} ${p110.X},${p110.Y} ${p100.X},${p100.Y}`,
      front: `${p001.X},${p001.Y} ${p101.X},${p101.Y} ${p100.X},${p100.Y} ${p000.X},${p000.Y}`,
      back: `${p011.X},${p011.Y} ${p111.X},${p111.Y} ${p110.X},${p110.Y} ${p010.X},${p010.Y}`,
      topCenter: iso(x + w / 2, y + d / 2, z + h),
      bottomCenter: iso(x + w / 2, y + d / 2, z),
      backTopCenter: iso(x + w / 2, y, z + h),
      frontTopCenter: iso(x + w / 2, y + d, z + h),
    };
  };

  const shade = (hex, lighter = false) => {
    const h = hex.startsWith("#") ? hex.slice(1) : hex;
    const num = parseInt(h, 16);
    const r = (num >> 16) & 0xff;
    const g = (num >> 8) & 0xff;
    const b = num & 0xff;
    const factor = lighter ? 1.18 : 0.65;
    const nr = Math.min(255, Math.max(0, Math.round(r * factor)));
    const ng = Math.min(255, Math.max(0, Math.round(g * factor)));
    const nb = Math.min(255, Math.max(0, Math.round(b * factor)));
    return `rgb(${nr},${ng},${nb})`;
  };

  const TILE_D = 100;
  const TILE_H = 10;
  const GAP = 18;

  const tiles = [
    { id: "fournisseurs", x: 0,                          w: 130, label: "FOURNISSEURS", color: "#4A90E2" },
    { id: "reserve",      x: 130 + GAP,                  w: 110, label: "RÉSERVE",       color: "#F5C542" },
    { id: "rayonnages",   x: 130 + GAP + 110 + GAP,      w: 110, label: "RAYONNAGES",   color: "#9B72CF" },
    { id: "comptoir",     x: 130 + 2*GAP + 220 + GAP,    w: 110, label: "COMPTOIR",     color: "#00C896" },
    { id: "caisse",       x: 130 + 3*GAP + 330 + GAP,    w: 100, label: "CAISSE",        color: "#FF7B54" },
  ];

  const totalW = tiles[tiles.length - 1].x + tiles[tiles.length - 1].w;

  // HUB Dashboard : très haut au-dessus, décalé pour ne pas chevaucher les labels
  const hubW = 130;
  const hubD = 55;
  const hubH = 18;
  const hubX = totalW / 2 - hubW / 2;
  const hubY = TILE_D / 2 - hubD / 2;
  const hubZ = 220; // élévation très haute pour éviter chevauchement
  const hubBox = isoBox(hubX, hubY, hubW, hubD, hubH, hubZ);

  const tileBoxes = tiles.map(t => ({
    ...t,
    box: isoBox(t.x, 0, t.w, TILE_D, TILE_H, 0),
  }));

  // Calcul du viewBox
  const allPts = [];
  const collect = (box) => {
    Object.entries(box).forEach(([k, v]) => {
      if (typeof v === "string" && v.includes(",")) {
        v.split(" ").forEach(pair => {
          const [px, py] = pair.split(",").map(Number);
          if (!isNaN(px) && !isNaN(py)) allPts.push([px, py]);
        });
      }
    });
  };
  tileBoxes.forEach(t => collect(t.box));
  collect(hubBox);

  const xs = allPts.map(p => p[0]);
  const ys = allPts.map(p => p[1]);
  const PAD_X = 110; // plus large pour ne plus couper les badges
  const PAD_TOP = 90;
  const PAD_BOTTOM = 100;
  const minX = Math.min(...xs) - PAD_X;
  const maxX = Math.max(...xs) + PAD_X;
  const minY = Math.min(...ys) - PAD_TOP;
  const maxY = Math.max(...ys) + PAD_BOTTOM;
  const vbW = maxX - minX;
  const vbH = maxY - minY;

  const FLOOR_TOP = "#161A4A";
  const FLOOR_LEFT = "#0A0C30";
  const FLOOR_RIGHT = "#1E2270";

  const PRODUCT_COLORS = ["#4A90E2", "#00C896", "#FF7B54", "#F5C542", "#9B72CF"];

  const renderTile = (t) => {
    const isActive = activeZone === t.id;
    const isHov = hovered === t.id;
    const opacity = dim(t.id);
    // Tons subtils pour le sol actif (ne pas écraser le contenu)
    const useColorOverlay = isActive || isHov;
    const overlayOpacity = isActive ? 0.08 : isHov ? 0.04 : 0;
    const topStroke = isActive ? t.color : isHov ? t.color : "#2A2D6A";
    const sideStrokeColor = isActive ? t.color : "#2A2D6A";

    return (
      <g key={t.id} opacity={opacity} style={{ cursor: "pointer" }}
         onClick={() => onZoneClick(t.id)}
         onMouseEnter={() => setHovered(t.id)}
         onMouseLeave={() => setHovered(null)}>
        <polygon points={t.box.right} fill={FLOOR_RIGHT} stroke={sideStrokeColor} strokeWidth={isActive ? 1.5 : 0.4} />
        <polygon points={t.box.left} fill={FLOOR_LEFT} stroke={sideStrokeColor} strokeWidth={isActive ? 1.5 : 0.4} />
        <polygon points={t.box.top} fill={FLOOR_TOP} stroke={topStroke} strokeWidth={isActive ? 3 : 0.8}
                 strokeOpacity={isHov && !isActive ? 0.6 : 1} />
        {/* Overlay coloré subtil quand actif/hover */}
        {useColorOverlay && (
          <polygon points={t.box.top} fill={t.color} fillOpacity={overlayOpacity} pointerEvents="none" />
        )}
      </g>
    );
  };

  // Personnage stylisé plus grand et lisible
  const renderPerson = (x, y, color, accent, opts = {}) => {
    const baseZ = TILE_H;
    const head = iso(x, y, baseZ + 42);
    const shoulder = iso(x, y, baseZ + 33);
    const waist = iso(x, y, baseZ + 19);
    const feet = iso(x, y, baseZ);
    const headR = 7;
    const bodyW = 13;

    return (
      <g>
        <ellipse cx={feet.X} cy={feet.Y + 2.5} rx="9" ry="2.8" fill="rgba(0,0,0,0.55)" />
        <rect x={waist.X - bodyW/2 + 1.5} y={waist.Y} width={bodyW - 3} height={feet.Y - waist.Y}
              fill={shade(color, false)} stroke={accent} strokeWidth="0.5" rx="1.5" />
        <rect x={shoulder.X - bodyW/2} y={shoulder.Y} width={bodyW} height={waist.Y - shoulder.Y + 2}
              fill={color} stroke={accent} strokeWidth="0.7" rx="2.5" />
        <rect x={head.X - 2.5} y={head.Y + headR - 1} width="5" height="3.5" fill={shade(color, true)} />
        <circle cx={head.X} cy={head.Y} r={headR} fill={color} stroke={accent} strokeWidth="0.7" />
        {opts.badge && (
          <g>
            <circle cx={head.X + 8} cy={head.Y - 6} r="4" fill={opts.badgeColor} stroke="#fff" strokeWidth="0.6" />
            <text x={head.X + 8} y={head.Y - 4.5} textAnchor="middle" fontSize="5.5" fill="#fff" fontWeight="700">+</text>
          </g>
        )}
      </g>
    );
  };

  // Étagère : produits VISIBLES sur la face avant (visible côté observateur)
  // En projection iso avec observateur en haut-droite, la face "right" est très visible
  // Donc on place les produits collés contre la face arrière de l'étagère, visibles depuis le devant
  const renderShelf = (x, y, w, d, h, shelves, frameColor, productColors, key) => {
    const frame = isoBox(x, y, w, d, h, 0);
    const elements = [
      <g key={`fr_${key}`}>
        <polygon points={frame.left} fill={shade(frameColor, false)} stroke={shade(frameColor, true)} strokeWidth="0.4" />
        <polygon points={frame.right} fill={shade(frameColor, true)} stroke={shade(frameColor, true)} strokeWidth="0.4" />
        <polygon points={frame.top} fill={frameColor} stroke={shade(frameColor, true)} strokeWidth="0.4" />
      </g>
    ];
    const shelfH = h / shelves;
    const productCount = Math.max(3, Math.floor(w / 5));
    for (let s = 0; s < shelves; s++) {
      const shelfZ = s * shelfH + 1;
      const productH = shelfH - 2.5;
      for (let p = 0; p < productCount; p++) {
        const pw = (w - 4) / productCount * 0.88;
        const px = x + 2 + p * (w - 4) / productCount;
        // Produits placés à l'avant de l'étagère pour être visibles
        const prodBox = isoBox(px, y + d - 5, pw, 4, productH, shelfZ);
        const pcolor = productColors[(s * 2 + p) % productColors.length];
        elements.push(
          <g key={`p_${key}_${s}_${p}`}>
            <polygon points={prodBox.left} fill={shade(pcolor, false)} opacity="0.85" />
            <polygon points={prodBox.right} fill={shade(pcolor, true)} opacity="0.95" />
            <polygon points={prodBox.top} fill={pcolor} />
          </g>
        );
      }
    }
    return elements;
  };

  const renderZoneContent = (t) => {
    const opacity = dim(t.id);

    if (t.id === "fournisseurs") {
      const elems = [];
      const bldX = t.x + 20;
      const bldY = 10;
      const bldW = 45;
      const bldD = 35;
      const bldH = 60;
      const bldBox = isoBox(bldX, bldY, bldW, bldD, bldH, TILE_H);
      elems.push(
        <g key="bld">
          <polygon points={bldBox.left} fill="#1A2A4A" stroke="#243A60" strokeWidth="0.4" />
          <polygon points={bldBox.right} fill="#243A60" stroke="#2E4880" strokeWidth="0.4" />
          <polygon points={bldBox.top} fill="#2E4880" stroke="#3A5BA0" strokeWidth="0.4" />
        </g>
      );
      // Fenêtres - certaines allumées pour donner vie
      for (let row = 0; row < 5; row++) {
        for (let col = 0; col < 3; col++) {
          const wx = bldX + bldW;
          const wy = bldY + 6 + col * 9;
          const wz = TILE_H + 8 + row * 12;
          const winBox = isoBox(wx, wy, 0.3, 5, 6, wz);
          const lit = (row * 3 + col) % 4 !== 0;
          elems.push(
            <polygon key={`w_${row}_${col}`} points={winBox.right}
                     fill={lit ? "#F5C54260" : "#1a2640"} stroke="#0a1224" strokeWidth="0.2" />
          );
        }
      }
      // Croix verte sur le toit
      const crossPos = iso(bldX + bldW/2, bldY + bldD/2, TILE_H + bldH + 1);
      elems.push(
        <g key="cross">
          <rect x={crossPos.X - 10} y={crossPos.Y - 3} width="20" height="6" fill="#00C896" rx="0.5" />
          <rect x={crossPos.X - 3} y={crossPos.Y - 10} width="6" height="20" fill="#00C896" rx="0.5" />
        </g>
      );

      // Camion en avant - bien grand pour être lisible
      const truckX = t.x + 8;
      const truckY = TILE_D - 50;
      const cabBox = isoBox(truckX, truckY, 30, 32, 30, TILE_H);
      const trailerBox = isoBox(truckX + 32, truckY, 70, 32, 38, TILE_H);
      elems.push(
        <g key="truck">
          <polygon points={trailerBox.left} fill="#0d3a2e" stroke="#00C896" strokeWidth="0.5" />
          <polygon points={trailerBox.right} fill="#1a604a" stroke="#00C896" strokeWidth="0.5" />
          <polygon points={trailerBox.top} fill="#15604c" stroke="#00C896" strokeWidth="0.5" />
          <polygon points={cabBox.left} fill="#0a2a4a" stroke="#2a6aaa" strokeWidth="0.5" />
          <polygon points={cabBox.right} fill="#1a4a7a" stroke="#2a6aaa" strokeWidth="0.5" />
          <polygon points={cabBox.top} fill="#15406a" stroke="#2a6aaa" strokeWidth="0.5" />
          {/* Pare-brise (face right de la cabine) */}
          {(() => {
            const wsBox = isoBox(truckX + 30, truckY + 4, 0.3, 24, 12, TILE_H + 16);
            return <polygon points={wsBox.right} fill="#4A90E2aa" stroke="#7AB0E2" strokeWidth="0.4" />;
          })()}
        </g>
      );
      // Croix sur la remorque (face right - visible)
      const crX = iso(truckX + 70 + 32, truckY + 32, TILE_H + 19);
      elems.push(
        <g key="trcross">
          <rect x={crX.X - 9} y={crX.Y - 2.5} width="18" height="5" fill="#00C896" />
          <rect x={crX.X - 2.5} y={crX.Y - 9} width="5" height="18" fill="#00C896" />
        </g>
      );
      // Roues - bien grosses
      [truckX + 6, truckX + 24, truckX + 40, truckX + 65, truckX + 90].forEach((rx, i) => {
        const wpos = iso(rx, truckY + 32, TILE_H + 3);
        elems.push(
          <ellipse key={`whl_${i}`} cx={wpos.X} cy={wpos.Y + 3} rx="5" ry="2.8"
                   fill="#0a0a1a" stroke="#3a3a4a" strokeWidth="0.6" />
        );
      });

      return <g opacity={opacity} pointerEvents="none">{elems}</g>;
    }

    if (t.id === "reserve") {
      const elems = [];
      // 3 grandes étagères de stockage
      [12, 44, 76].forEach((sx, i) => {
        elems.push(
          <g key={`shelf_${i}`}>
            {renderShelf(t.x + sx, 10, 22, 78, 80, 5, "#0E1138", PRODUCT_COLORS, `r${i}`)}
          </g>
        );
      });
      return <g opacity={opacity} pointerEvents="none">{elems}</g>;
    }

    if (t.id === "rayonnages") {
      const elems = [];
      // 2 étagères basses au fond
      [12, 60].forEach((sx, i) => {
        elems.push(
          <g key={`disp_${i}`}>
            {renderShelf(t.x + sx, 14, 38, 28, 38, 3, "#1A1D4A", PRODUCT_COLORS, `ry${i}`)}
          </g>
        );
      });
      // Présentoir OTC à l'avant
      const otcBox = isoBox(t.x + 14, 55, 84, 28, 14, TILE_H);
      elems.push(
        <g key="otc">
          <polygon points={otcBox.left} fill="#2A1D4A" stroke="#9B72CF" strokeWidth="0.4" />
          <polygon points={otcBox.right} fill="#4A3D6A" stroke="#9B72CF" strokeWidth="0.4" />
          <polygon points={otcBox.top} fill="#3A2D5A" stroke="#9B72CF" strokeWidth="0.5" />
        </g>
      );
      // Petits produits sur le présentoir
      for (let i = 0; i < 7; i++) {
        const px = t.x + 18 + i * 11;
        const pBox = isoBox(px, 60, 7, 7, 10, TILE_H + 14);
        const pc = PRODUCT_COLORS[i % PRODUCT_COLORS.length];
        elems.push(
          <g key={`otcprod_${i}`}>
            <polygon points={pBox.left} fill={shade(pc, false)} />
            <polygon points={pBox.right} fill={shade(pc, true)} />
            <polygon points={pBox.top} fill={pc} />
          </g>
        );
      }
      return <g opacity={opacity} pointerEvents="none">{elems}</g>;
    }

    if (t.id === "comptoir") {
      const elems = [];
      // Comptoir en travers
      const counterBox = isoBox(t.x + 8, 42, 95, 18, 22, TILE_H);
      elems.push(
        <g key="counter">
          <polygon points={counterBox.left} fill="#0a3a2a" stroke="#00C896" strokeWidth="0.4" />
          <polygon points={counterBox.right} fill="#1a604a" stroke="#00C896" strokeWidth="0.4" />
          <polygon points={counterBox.top} fill="#15604c" stroke="#00C896" strokeWidth="0.5" />
        </g>
      );
      // Écran sur le comptoir
      const screenBox = isoBox(t.x + 75, 45, 16, 4, 13, TILE_H + 22);
      elems.push(
        <g key="screen">
          <polygon points={screenBox.left} fill="#0a0a1a" />
          <polygon points={screenBox.right} fill="#0F1A2A" stroke="#00C896" strokeWidth="0.4" />
          <polygon points={screenBox.top} fill="#1a1a2a" />
        </g>
      );
      // Flacons
      for (let i = 0; i < 5; i++) {
        const fx = t.x + 14 + i * 10;
        const flacon = isoBox(fx, 47, 4.5, 4.5, 7, TILE_H + 22);
        elems.push(
          <g key={`flacon_${i}`}>
            <polygon points={flacon.left} fill="#9B72CF80" />
            <polygon points={flacon.right} fill="#B090E0" />
            <polygon points={flacon.top} fill="#C0A0F0" />
          </g>
        );
      }
      // Praticien derrière
      elems.push(
        <g key="praticien">
          {renderPerson(t.x + 50, 25, "#E8ECFF", "#9CA3D0", { badge: true, badgeColor: "#00C896" })}
        </g>
      );
      return <g opacity={opacity} pointerEvents="none">{elems}</g>;
    }

    if (t.id === "caisse") {
      const elems = [];
      // Comptoir caisse
      const cashBox = isoBox(t.x + 12, 22, 32, 24, 18, TILE_H);
      elems.push(
        <g key="cash">
          <polygon points={cashBox.left} fill="#3a1a0a" stroke="#FF7B54" strokeWidth="0.4" />
          <polygon points={cashBox.right} fill="#5a2a1a" stroke="#FF7B54" strokeWidth="0.4" />
          <polygon points={cashBox.top} fill="#4a2515" stroke="#FF7B54" strokeWidth="0.5" />
        </g>
      );
      // TPE
      const tpeBox = isoBox(t.x + 18, 27, 14, 10, 7, TILE_H + 18);
      elems.push(
        <g key="tpe">
          <polygon points={tpeBox.left} fill="#0a0a1a" />
          <polygon points={tpeBox.right} fill="#1a1a2a" stroke="#00C896" strokeWidth="0.3" />
          <polygon points={tpeBox.top} fill="#2a2a3a" />
        </g>
      );
      // Prix au-dessus du TPE
      const pricePos = iso(t.x + 25, 32, TILE_H + 28);
      elems.push(
        <text key="price" x={pricePos.X} y={pricePos.Y + 1} textAnchor="middle"
              fill="#00C896" fontSize="6.5" fontWeight="700" fontFamily="ui-monospace,monospace">€24.50</text>
      );
      // Patient en avant
      elems.push(
        <g key="patient">
          {renderPerson(t.x + 60, 70, "#3a4A8A", "#5A6AAA")}
        </g>
      );
      // Petit panier à côté du patient
      const basketBox = isoBox(t.x + 50, 76, 10, 9, 5, TILE_H);
      elems.push(
        <g key="basket">
          <polygon points={basketBox.left} fill="#5a2a1a" />
          <polygon points={basketBox.right} fill="#7a3a2a" />
          <polygon points={basketBox.top} fill="#3a1a0a" stroke="#FF7B54" strokeWidth="0.3" />
        </g>
      );
      return <g opacity={opacity} pointerEvents="none">{elems}</g>;
    }

    return null;
  };

  // Label de zone : DEVANT le tile (en bas) au lieu de derrière (où le hub gêne)
  const renderLabel = (t) => {
    const opacity = dim(t.id);
    const labelPos = iso(t.x + t.w / 2, TILE_D + 8, 0);
    const isActive = activeZone === t.id;
    return (
      <g key={`lbl_${t.id}`} opacity={opacity} pointerEvents="none">
        <text x={labelPos.X} y={labelPos.Y + 14} textAnchor="middle"
              fill={isActive ? t.color : "#9CA3D0"}
              fontSize="11" fontWeight="700" letterSpacing="2.2">
          {t.label}
        </text>
      </g>
    );
  };

  // Badge "X PRs" : SOUS le label (et non plus à l'arrière du tile)
  const renderBadge = (t, prCount) => {
    const opacity = dim(t.id);
    const isActive = activeZone === t.id;
    const isHov = hovered === t.id;
    const labelPos = iso(t.x + t.w / 2, TILE_D + 8, 0);
    return (
      <g key={`badge_${t.id}`} opacity={opacity} pointerEvents="none">
        <rect x={labelPos.X - 24} y={labelPos.Y + 22} width="48" height="16" rx="8"
              fill={t.color} opacity={isActive || isHov ? 1 : 0.85} />
        {isActive && (
          <rect x={labelPos.X - 24} y={labelPos.Y + 22} width="48" height="16" rx="8"
                fill="none" stroke="#fff" strokeWidth="0.8" opacity="0.6" />
        )}
        <text x={labelPos.X} y={labelPos.Y + 33} textAnchor="middle"
              fill={t.id === "reserve" ? "#0B0C35" : "#fff"}
              fontSize="9.5" fontWeight="700">
          {prCount} PRs
        </text>
      </g>
    );
  };

  return (
    <svg viewBox={`${minX} ${minY} ${vbW} ${vbH}`}
         style={{ width: "100%", maxWidth: 1000, display: "block", margin: "0 auto" }}>
      <defs>
        <linearGradient id="hubGradTop" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#00E5A8" />
          <stop offset="100%" stopColor="#00805a" />
        </linearGradient>
        <linearGradient id="hubGradLeft" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#005c40" />
          <stop offset="100%" stopColor="#00805a" />
        </linearGradient>
        <linearGradient id="hubGradRight" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#00805a" />
          <stop offset="100%" stopColor="#00b080" />
        </linearGradient>
        <filter id="hubGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Fond */}
      <rect x={minX} y={minY} width={vbW} height={vbH} fill="#0B0C35" />
      <g opacity="0.06">
        {Array.from({ length: 25 }).map((_, i) => (
          <line key={`gh_${i}`} x1={minX} y1={minY + i * 22} x2={maxX} y2={minY + i * 22}
                stroke="#4A90E2" strokeWidth="0.3" />
        ))}
      </g>

      {/* Lignes de flux du hub vers chaque tile */}
      {tileBoxes.map((t, i) => {
        const tCenter = iso(t.x + t.w / 2, TILE_D / 2, TILE_H);
        return (
          <g key={`flow_${t.id}`} opacity={dim(t.id) * 0.7}>
            <line x1={hubBox.bottomCenter.X} y1={hubBox.bottomCenter.Y}
                  x2={tCenter.X} y2={tCenter.Y}
                  stroke={t.color} strokeWidth="1.3" strokeDasharray="3 4"
                  opacity="0.5">
              <animate attributeName="stroke-dashoffset"
                       from="0" to="-14" dur={`${1.8 + i * 0.25}s`}
                       repeatCount="indefinite" />
            </line>
            <circle r="2.8" fill={t.color} opacity="0.95">
              <animateMotion dur={`${2.2 + i * 0.3}s`} repeatCount="indefinite"
                             path={`M${tCenter.X},${tCenter.Y} L${hubBox.bottomCenter.X},${hubBox.bottomCenter.Y}`} />
              <animate attributeName="opacity" values="0;1;1;0" dur={`${2.2 + i * 0.3}s`} repeatCount="indefinite" />
            </circle>
          </g>
        );
      })}

      {/* Tiles (sols) */}
      {tileBoxes.map(renderTile)}

      {/* Contenu des zones */}
      {tileBoxes.map(t => (
        <g key={`content_${t.id}`}>
          {renderZoneContent(t)}
        </g>
      ))}

      {/* Labels (devant les tiles) */}
      {tileBoxes.map(renderLabel)}

      {/* Badges PRs */}
      {tileBoxes.map(t => {
        const ZD = ZONES.find(zz => zz.id === t.id);
        if (!ZD) return null;
        return renderBadge(t, ZD.prs.length);
      })}

      {/* HUB DASHBOARD */}
      <g style={{ cursor: "pointer" }}
         onClick={() => onZoneClick("backoffice")}
         onMouseEnter={() => setHovered("backoffice")}
         onMouseLeave={() => setHovered(null)}
         opacity={dim("backoffice")}>
        <ellipse cx={hubBox.bottomCenter.X} cy={hubBox.bottomCenter.Y + 12}
                 rx="95" ry="14" fill="#00C896" opacity="0.18" />
        <polygon points={hubBox.left} fill="url(#hubGradLeft)" stroke="#00E5A8" strokeWidth="0.7" />
        <polygon points={hubBox.right} fill="url(#hubGradRight)" stroke="#00E5A8" strokeWidth="0.7" />
        <polygon points={hubBox.top} fill="url(#hubGradTop)" stroke="#00E5A8"
                 strokeWidth={activeZone === "backoffice" ? 2.5 : 1.2} />

        {/* Mini barres dashboard sur le dessus */}
        {[0, 1, 2, 3, 4, 5].map(i => {
          const barX = hubX + 14 + i * 17;
          const barH = [12, 16, 9, 18, 13, 11][i];
          const barBox = isoBox(barX, hubY + 20, 9, 9, barH, hubZ + hubH);
          const barColor = ["#4A90E2", "#F5C542", "#9B72CF", "#FF7B54", "#fff", "#00C896"][i];
          return (
            <g key={`bar_${i}`}>
              <polygon points={barBox.left} fill={shade(barColor, false)} opacity="0.85" />
              <polygon points={barBox.right} fill={shade(barColor, true)} opacity="0.95" />
              <polygon points={barBox.top} fill={barColor} />
            </g>
          );
        })}

        {/* Label DASHBOARD - haut */}
        <g pointerEvents="none">
          <text x={hubBox.topCenter.X} y={hubBox.topCenter.Y - 32}
                textAnchor="middle" fill="#fff" fontSize="13" fontWeight="700" letterSpacing="2">
            🧠 DASHBOARD DATATOPIA
          </text>
          <text x={hubBox.topCenter.X} y={hubBox.topCenter.Y - 18}
                textAnchor="middle" fill="#B0F0D8" fontSize="8" letterSpacing="0.5">
            Intelligence • Alertes • Recommandations IA
          </text>
        </g>

        {/* Badge PRs à droite du label */}
        <g pointerEvents="none">
          <rect x={hubBox.topCenter.X + 110} y={hubBox.topCenter.Y - 42} width="46" height="16" rx="8"
                fill="#00C896" />
          {activeZone === "backoffice" && (
            <rect x={hubBox.topCenter.X + 110} y={hubBox.topCenter.Y - 42} width="46" height="16" rx="8"
                  fill="none" stroke="#fff" strokeWidth="0.8" opacity="0.6" />
          )}
          <text x={hubBox.topCenter.X + 133} y={hubBox.topCenter.Y - 31} textAnchor="middle"
                fill="#0B0C35" fontSize="9.5" fontWeight="700">
            {ZONES.find(z => z.id === "backoffice")?.prs.length} PRs
          </text>
        </g>
      </g>

      {/* Indicateurs AMONT / AVAL */}
      <g pointerEvents="none">
        {(() => {
          const startPos = iso(tiles[0].x, TILE_D + 50, 0);
          const endPos = iso(tiles[tiles.length - 1].x + tiles[tiles.length - 1].w, TILE_D + 50, 0);
          return (
            <>
              <text x={startPos.X - 10} y={startPos.Y + 32} textAnchor="start" fill="#7B83C0"
                    fontSize="9.5" fontWeight="600" letterSpacing="2" opacity="0.7">← AMONT</text>
              <text x={endPos.X + 10} y={endPos.Y + 32} textAnchor="end" fill="#7B83C0"
                    fontSize="9.5" fontWeight="600" letterSpacing="2" opacity="0.7">AVAL →</text>
            </>
          );
        })()}
      </g>
    </svg>
  );
}


function PRPanel({ zone, onClose }) {
  if (!zone) return null;
  return (
    <div style={{ background: zone.color + "0D", border: `1px solid ${zone.color}33`, borderTop: "none", borderRadius: "0 0 16px 16px", padding: "22px 22px 20px", animation: "slideDown 0.25s ease" }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 14 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
            <span style={{ fontSize: 20 }}>{zone.emoji}</span>
            <h3 style={{ fontSize: 15, fontWeight: 700, color: zone.color, margin: 0, fontFamily: "Georgia,serif" }}>{zone.label}</h3>
          </div>
          <p style={{ fontSize: 13, color: C.grayLight, margin: 0, lineHeight: 1.65, maxWidth: 620 }}>{zone.description}</p>
        </div>
        <button onClick={onClose} style={{ background: "none", border: `1px solid ${C.cardBorder}`, color: C.gray, borderRadius: 8, padding: "4px 10px", cursor: "pointer", fontSize: 12, flexShrink: 0, marginLeft: 16 }}>✕ Fermer</button>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(230px,1fr))", gap: 10 }}>
        {zone.prs.map((pr, i) => (
          <div key={i} style={{ background: C.cardBg, border: `1px solid ${zone.color}28`, borderRadius: 12, padding: "14px 16px", borderLeft: `3px solid ${zone.color}` }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
              <span style={{ fontSize: 17 }}>{pr.icon}</span>
              <span style={{ fontSize: 12, fontWeight: 600, color: C.white }}>{pr.title}</span>
            </div>
            <p style={{ fontSize: 12, color: C.grayLight, margin: "0 0 10px", lineHeight: 1.6 }}>{pr.desc}</p>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ width: 5, height: 5, borderRadius: "50%", background: zone.color, display: "inline-block", flexShrink: 0 }} />
              <span style={{ fontSize: 11, color: zone.color, fontWeight: 600 }}>{pr.impact}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AIChat({ onClose }) {
  const [messages, setMessages] = useState([{ role: "assistant", content: "Bonjour ! Je suis l'assistant Datatopia. Des questions sur nos solutions, notre technologie ou nos tarifs ? Je suis là." }]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const send = async () => {
    if (!input.trim() || loading) return;
    const userMsg = input.trim();
    setInput("");
    const newMsgs = [...messages, { role: "user", content: userMsg }];
    setMessages(newMsgs);
    setLoading(true);
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514", max_tokens: 1000,
          system: `Tu es l'assistant commercial de Datatopia, SaaS data pour pharmacies. Réponds en français, simple, direct, 3-4 phrases max.
PRODUIT: connecte les LGOs pharmacy pour centraliser données → PRs activables: stock mort, commandes, marges, prix, promos, patientèle, IA.
TECH: Azure lakehouse Bronze→Silver→Gold, sync auto, RGPD, hébergement Europe.
TARIFS: à partir de 99€/mois, essai 14j, freemium IQVIA.
RÉSULTATS: -30% stock dormant, +8% marges, NPS 7.2, déploiement < 5 min.`,
          messages: newMsgs.map(m => ({ role: m.role, content: m.content }))
        })
      });
      const data = await res.json();
      const text = data.content?.find(b => b.type === "text")?.text || "Je n'ai pas pu répondre.";
      setMessages(prev => [...prev, { role: "assistant", content: text }]);
    } catch {
      setMessages(prev => [...prev, { role: "assistant", content: "Une erreur s'est produite. Réessayez." }]);
    }
    setLoading(false);
  };

  return (
    <div style={{ position: "fixed", bottom: 96, right: 24, width: 350, background: C.navy, border: `1px solid ${C.cardBorder}`, borderRadius: 20, boxShadow: "0 20px 60px rgba(0,0,0,0.6)", display: "flex", flexDirection: "column", zIndex: 1000, overflow: "hidden", maxHeight: 460 }}>
      <div style={{ background: C.navyMid, padding: "12px 16px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: `1px solid ${C.cardBorder}` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 30, height: 30, borderRadius: "50%", background: C.green + "22", border: `1.5px solid ${C.green}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15 }}>🤖</div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: C.white }}>Assistant Datatopia</div>
            <div style={{ fontSize: 10, color: C.green }}>● Disponible</div>
          </div>
        </div>
        <button onClick={onClose} style={{ background: "none", border: "none", color: C.gray, fontSize: 16, cursor: "pointer" }}>✕</button>
      </div>
      <div style={{ flex: 1, overflowY: "auto", padding: 14, display: "flex", flexDirection: "column", gap: 10, maxHeight: 310 }}>
        {messages.map((m, i) => (
          <div key={i} style={{ display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start" }}>
            <div style={{ maxWidth: "88%", background: m.role === "user" ? C.green : C.cardBg, color: m.role === "user" ? C.navy : C.grayLight, borderRadius: m.role === "user" ? "16px 16px 4px 16px" : "16px 16px 16px 4px", padding: "9px 13px", fontSize: 13, lineHeight: 1.6, border: m.role === "assistant" ? `1px solid ${C.cardBorder}` : "none", fontWeight: m.role === "user" ? 600 : 400 }}>{m.content}</div>
          </div>
        ))}
        {loading && <div style={{ display: "flex", gap: 5, padding: "8px 12px" }}>{[0, 1, 2].map(i => <div key={i} style={{ width: 7, height: 7, borderRadius: "50%", background: C.green, animation: `bounce 1s ${i * 0.2}s infinite` }} />)}</div>}
      </div>
      <div style={{ padding: "10px 14px", borderTop: `1px solid ${C.cardBorder}`, display: "flex", gap: 8 }}>
        <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && send()} placeholder="Votre question..." style={{ flex: 1, background: C.cardBg, border: `1px solid ${C.cardBorder}`, borderRadius: 12, padding: "9px 14px", fontSize: 13, color: C.white, outline: "none" }} />
        <button onClick={send} disabled={loading} style={{ width: 38, height: 38, borderRadius: "50%", background: C.green, border: "none", cursor: "pointer", fontSize: 16, opacity: loading ? 0.5 : 1 }}>↑</button>
      </div>
    </div>
  );
}

function TabPharmacy() {
  const [activeZone, setActiveZone] = useState(null);
  const zone = ZONES.find(z => z.id === activeZone);
  const handleClick = (id) => setActiveZone(prev => prev === id ? null : id);

  return (
    <div>
      <div style={{ textAlign: "center", marginBottom: 20 }}>
        <h2 style={{ fontSize: 24, fontWeight: 700, color: C.white, fontFamily: "Georgia,serif", margin: "0 0 6px" }}>Comment tourne votre officine ?</h2>
        <p style={{ color: C.gray, fontSize: 13, margin: 0 }}>Cliquez sur chaque zone du plan pour découvrir les solutions Datatopia qui interviennent à cet endroit précis.</p>
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center", marginBottom: 16 }}>
        {ZONES.map(z => (
          <button key={z.id} onClick={() => handleClick(z.id)} style={{ display: "flex", alignItems: "center", gap: 6, background: activeZone === z.id ? z.color + "22" : "transparent", border: `1px solid ${activeZone === z.id ? z.color : C.cardBorder}`, borderRadius: 20, padding: "5px 12px", cursor: "pointer", transition: "all 0.2s" }}>
            <span style={{ fontSize: 13 }}>{z.emoji}</span>
            <span style={{ fontSize: 12, color: activeZone === z.id ? z.color : C.grayLight, fontWeight: activeZone === z.id ? 600 : 400 }}>{z.label}</span>
            <span style={{ fontSize: 10, background: z.color, color: ["reserve", "backoffice"].includes(z.id) ? C.navy : "white", borderRadius: 10, padding: "1px 7px", fontWeight: 700, lineHeight: 1.6 }}>{z.prs.length}</span>
          </button>
        ))}
      </div>
      <div style={{ background: C.cardBg, border: `1px solid ${activeZone ? ZONES.find(z => z.id === activeZone)?.color + "55" : C.cardBorder}`, borderRadius: 16, overflow: "hidden", transition: "border-color 0.3s" }}>
        <div style={{ padding: 14 }}>
          <PharmacyMap activeZone={activeZone} onZoneClick={handleClick} />
        </div>
        {zone ? <PRPanel zone={zone} onClose={() => setActiveZone(null)} /> : (
          <div style={{ padding: "10px 18px 14px", borderTop: `1px solid ${C.cardBorder}`, textAlign: "center" }}>
            <span style={{ fontSize: 12, color: C.gray }}>👆 Cliquez sur une zone du schéma ou sur un bouton ci-dessus pour voir les solutions Datatopia associées</span>
          </div>
        )}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(155px,1fr))", gap: 12, marginTop: 18 }}>
        {[
          { c: C.amber, e: "💸", s: "−30%", l: "de stock dormant dès les premières semaines" },
          { c: C.green, e: "⚡", s: "< 5 min", l: "pour déployer le premier dashboard" },
          { c: C.coral, e: "📊", s: "+8%", l: "de marge moyenne constatée par nos clients" },
          { c: C.blue, e: "🔗", s: "Tous LGOs", l: "compatibles belges et français" },
        ].map((item, i) => (
          <div key={i} style={{ background: C.cardBg, border: `1px solid ${C.cardBorder}`, borderRadius: 12, padding: "14px 15px", textAlign: "center" }}>
            <div style={{ fontSize: 18 }}>{item.e}</div>
            <div style={{ fontSize: 18, fontWeight: 700, color: item.c, margin: "5px 0 4px" }}>{item.s}</div>
            <div style={{ fontSize: 11, color: C.grayLight, lineHeight: 1.4 }}>{item.l}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function TabData() {
  const [activePillar, setActivePillar] = useState(null);
  const [activeStage, setActiveStage] = useState(null);
  const [openTech, setOpenTech] = useState({});

  const pillars = [
    {
      id: "compliance",
      icon: "🛡️",
      label: "Compliance & Infra",
      tagline: "Robustesse by design",
      color: C.blue,
      angle: 270, // en haut
      summary: "Une infrastructure pensée pour la conformité, pas adaptée après coup. Chaque flux est tracé, chaque décision est justifiable, chaque donnée est isolée.",
      points: [
        { icon: "🇪🇺", t: "Hébergement souverain Europe", d: "Azure EU + data residency Belgique. Vos données ne quittent jamais le territoire européen." },
        { icon: "🔐", t: "Chiffrement & isolation", d: "Azure Key Vault pour les credentials. Réseau virtuel isolé (VNET privé). Aucun accès externe." },
        { icon: "📜", t: "RGPD & EU AI Act by design", d: "Conforme par architecture, pas par patch. Justification écrite article 6(1) RGPD, EU AI Act Art. 10." },
        { icon: "🔄", t: "Disaster recovery permanent", d: "Backup quotidien sur 7 jours. Système de versioning par client pour reprise instantanée en cas d'incident." },
        { icon: "📋", t: "Traçabilité totale", d: "Chaque modification, chaque accès, chaque calcul est journalisé. Audit AFMPS / INAMI / commissaire aux comptes : tout est exportable." },
      ],
    },
    {
      id: "radar",
      icon: "📡",
      label: "RADAR",
      tagline: "Veille marché autonome",
      color: C.coral,
      angle: 30, // en bas-droite
      summary: "8 agents spécialisés scannent en continu votre écosystème (régulateurs, presse, publications, concurrents). Les insights anonymisés sont injectés directement dans vos modules.",
      points: [
        { icon: "🛰️", t: "Veille permanente multi-sources", d: "Régulateurs (AFMPS, INAMI, EMA), publications scientifiques, presse spécialisée, données concurrentielles. Tout est captés et qualifié." },
        { icon: "👮", t: "Double garde-fou éthique", d: "Compliance Navigator + Ethics Navigator. Chaque insight est validé ou rejeté avec justification écrite. Aucune PII ne traverse le pipeline." },
        { icon: "🔬", t: "Anonymisation systématique", d: "Les benchmarks sectoriels (consortium santé, groupements pharmacie) sont validés par les acteurs participants et 100% anonymisés." },
        { icon: "🧬", t: "Insights actionnables, pas du bruit", d: "Plutôt qu'une newsletter de plus, RADAR pondère vos commandes en temps réel : alertes pré-rupture fournisseur, tendances sectorielles, repositionnement prix." },
      ],
    },
    {
      id: "ai",
      icon: "🧠",
      label: "IA prédictive",
      tagline: "Modèles éprouvés en production",
      color: C.green,
      angle: 150, // en bas-gauche
      summary: "Moteur LightGBM entraîné spécifiquement sur vos données. Forecasts à 30/60/90 jours, classification automatique des produits, recommandations Min/Max — le tout avec un Quality Gate qui valide la fiabilité avant publication.",
      points: [
        { icon: "📈", t: "Forecast LightGBM 30/60/90j", d: "Modèle entraîné spécifiquement sur votre catalogue, votre saisonnalité, votre historique. Pas un modèle générique appliqué à l'aveugle." },
        { icon: "🏷️", t: "Classification automatique", d: "Chaque produit est classé : ML-ready, Rule-based, Cold start, Inactive. Vous savez en un coup d'œil ce sur quoi l'IA peut s'appuyer ou pas." },
        { icon: "✅", t: "Quality Gate intégré", d: "Métriques de qualité (MAE, RMSE, MAPE, R²) calculées automatiquement. Si le modèle ne dépasse pas le seuil, on bascule en méthode rule-based. Pas de bullshit prédictif." },
        { icon: "🎯", t: "Diffusé là où c'est utile", d: "Les prévisions n'apparaissent pas dans un onglet 'IA'. Elles apparaissent en colonne dans vos tableaux de stocks, ventes, commandes — exactement où vous prenez vos décisions." },
      ],
    },
  ];

  const stages = [
    { id: "ingest", icon: "📥", label: "Ingestion", color: C.blue,
      desc: "Vos données (LGO, ERP, fichiers Excel, flux APO...) sont collectées via un connecteur sécurisé ou un upload manuel. Validation de schéma automatique." },
    { id: "bronze", icon: "🥉", label: "Bronze", color: "#CD7F32",
      desc: "Couche d'archive immuable. Les données arrivent telles quelles, horodatées, auditables. Rien n'est jamais perdu. C'est votre filet de sécurité." },
    { id: "silver", icon: "🥈", label: "Silver", color: "#C0C5D0",
      desc: "Couche de standardisation. Nettoyage, déduplication, enrichissement (codes ATC/CNK, classifications). Vos données deviennent fiables et exploitables." },
    { id: "gold", icon: "🥇", label: "Gold", color: "#F5C542",
      desc: "Couche métier. KPIs calculés, agrégations, recommandations. C'est ici que l'IA opère et que les insights RADAR s'intègrent. C'est ce que vous voyez dans le produit." },
    { id: "serve", icon: "🚀", label: "Dashboard", color: C.green,
      desc: "Servir l'utilisateur final. Frontend datatopia.care, alertes, rapports automatiques. Accessible sur tous appareils, en temps réel, sécurisé." },
  ];

  const techDetails = [
    { id: "infra", icon: "🏗️", title: "Architecture lakehouse Databricks",
      content: "Stockage Delta Lake optimisé colonnaire, traitement distribué Apache PySpark, orchestration Azure Data Factory. Unity Catalog pour la gouvernance fine. Auto-scaling natif via Azure Container Registry. Métadonnées centralisées avec lineage tracking complet (de la source brute au KPI final)." },
    { id: "ml", icon: "⚙️", title: "Pipeline ML : LightGBM + Quality Gate",
      content: "Feature Store Databricks pour la réutilisation des features. Entraînement automatisé via Databricks AutoML. Quality Gate interne basé sur 4 métriques (MAE, RMSE, MAPE, R²) : si le modèle ne dépasse pas le seuil, on bascule sur une méthode rule-based plus simple mais plus fiable. Re-training programmable selon vos cycles métier." },
    { id: "radar", icon: "🛰️", title: "Pipeline RADAR : 8 agents + 2 guardrails",
      content: "Industry Agent, Data Agent, Data Extractor Agent, Masking Agent, Quality Navigator, Roadmap Agent, plus deux gardiens transverses : Compliance Navigator (RGPD, AI Act, sectoriel) et Ethics Navigator. Chaque insight passe par les 2 guardrails — rejet possible avec justification écrite (article RGPD, etc.). Les sources : régulateurs, presse, publications, marketplaces, scraping qualifié, partenariats consortiums." },
    { id: "security", icon: "🔒", title: "Sécurité & disaster recovery",
      content: "VNET privé Azure (10.0.0.0/16) avec sous-réseaux isolés (data, backend, agents). Azure Key Vault pour tous les secrets. Authentication via secure gateway. Backup quotidien sur les 7 derniers jours. Système de versioning par client : en cas de défaillance d'une connexion source, le système alerte automatiquement (Slack, email, admin pharmacy) avec flag écrit." },
  ];

  // Position des piliers en cercle autour du centre
  const HUB_CX = 350;
  const HUB_CY = 200;
  const ORBIT_R = 120;
  const computePillarPos = (angle) => ({
    x: HUB_CX + ORBIT_R * Math.cos(angle * Math.PI / 180),
    y: HUB_CY + ORBIT_R * Math.sin(angle * Math.PI / 180),
  });

  return (
    <div style={{ paddingBottom: 40 }}>
      {/* Style pour les animations */}
      <style>{`
        @keyframes pulse-core {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.06); opacity: 0.92; }
        }
        @keyframes orbit-rotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes flow-dash {
          to { stroke-dashoffset: -16; }
        }
        @keyframes float-particle {
          0% { transform: translate(0, 0); opacity: 0; }
          15% { opacity: 1; }
          85% { opacity: 1; }
          100% { transform: translate(var(--tx), var(--ty)); opacity: 0; }
        }
        .core-pulse { animation: pulse-core 3s ease-in-out infinite; transform-origin: center; transform-box: fill-box; }
        .orbit-line { animation: flow-dash 1.6s linear infinite; }
        .data-particle { animation: float-particle 3s linear infinite; }
      `}</style>

      {/* HEADER */}
      <div style={{ textAlign: "center", marginBottom: 24 }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: C.green + "15", border: `1px solid ${C.green}44`, borderRadius: 30, padding: "6px 18px", marginBottom: 14 }}>
          <span style={{ fontSize: 13, color: C.green, fontWeight: 600 }}>🔄 Architecture & Traitement</span>
        </div>
        <h2 style={{ fontSize: 26, fontWeight: 700, color: C.white, fontFamily: "Georgia,serif", margin: "0 0 8px" }}>
          Vos données : qu'est-ce qu'on en fait, vraiment ?
        </h2>
        <p style={{ color: C.gray, fontSize: 13, margin: "0 auto", maxWidth: 580, lineHeight: 1.7 }}>
          Datatopia n'est pas qu'un dashboard. C'est une infrastructure data complète + une couche d'intelligence qui s'infuse dans tous vos modules.
          Cliquez sur chaque pilier pour découvrir ce qui tourne en arrière-plan.
        </p>
      </div>

      {/* ========================== CERVEAU DATATOPIA ========================== */}
      <div style={{ background: `radial-gradient(ellipse at center, ${C.navyMid} 0%, ${C.navy} 70%)`, border: `1px solid ${C.cardBorder}`, borderRadius: 20, padding: "24px 16px 12px", marginBottom: 24, position: "relative", overflow: "hidden" }}>

        {/* Légende au-dessus */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 14, marginBottom: 12, flexWrap: "wrap" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, color: C.gray }}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: C.blue }} /> Vos données
          </div>
          <span style={{ color: C.gray, fontSize: 11 }}>→</span>
          <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, color: C.gray }}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: C.green }} /> Le cerveau Datatopia
          </div>
          <span style={{ color: C.gray, fontSize: 11 }}>→</span>
          <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, color: C.gray }}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: C.amber }} /> Insights dans votre produit
          </div>
        </div>

        <svg viewBox="0 0 700 400" style={{ width: "100%", maxWidth: 700, display: "block", margin: "0 auto" }}>
          <defs>
            <radialGradient id="coreGrad">
              <stop offset="0%" stopColor={C.greenGlow} stopOpacity="1" />
              <stop offset="55%" stopColor={C.green} stopOpacity="0.95" />
              <stop offset="100%" stopColor="#005c40" stopOpacity="0.7" />
            </radialGradient>
            <radialGradient id="coreGlow">
              <stop offset="0%" stopColor={C.greenGlow} stopOpacity="0.35" />
              <stop offset="100%" stopColor={C.greenGlow} stopOpacity="0" />
            </radialGradient>
            <linearGradient id="dataInGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor={C.blue} stopOpacity="0.1" />
              <stop offset="100%" stopColor={C.blue} stopOpacity="0.9" />
            </linearGradient>
            <linearGradient id="dataOutGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor={C.amber} stopOpacity="0.9" />
              <stop offset="100%" stopColor={C.amber} stopOpacity="0.1" />
            </linearGradient>
          </defs>

          {/* ===== ENTRÉES (sources de données client à gauche) ===== */}
          <g>
            {[
              { y: 80, icon: "🏥", label: "LGO" },
              { y: 160, icon: "🏨", label: "Hôpital" },
              { y: 240, icon: "📊", label: "ERP" },
              { y: 320, icon: "📑", label: "Excel" },
            ].map((src, i) => (
              <g key={i}>
                <rect x="20" y={src.y - 18} width="80" height="36" rx="18"
                      fill={C.navyMid} stroke={C.blue + "55"} strokeWidth="1" />
                <text x="38" y={src.y + 5} fontSize="14">{src.icon}</text>
                <text x="58" y={src.y + 4} fontSize="11" fill={C.grayLight} fontWeight="600">{src.label}</text>
              </g>
            ))}
            <text x="60" y="48" textAnchor="middle" fill={C.blue} fontSize="10" fontWeight="700" letterSpacing="1.5">
              VOS SOURCES
            </text>
          </g>

          {/* Lignes d'entrée animées vers le hub central, AVEC particules */}
          {[80, 160, 240, 320].map((y, i) => (
            <g key={i}>
              <line x1="100" y1={y} x2={HUB_CX - 58} y2={HUB_CY + (y - HUB_CY) * 0.2}
                    stroke="url(#dataInGrad)" strokeWidth="1.5" strokeDasharray="4 4" className="orbit-line" />
              <circle r="3" fill={C.blue}>
                <animateMotion dur={`${2.5 + i * 0.3}s`} repeatCount="indefinite"
                               path={`M100,${y} L${HUB_CX - 58},${HUB_CY + (y - HUB_CY) * 0.2}`} />
                <animate attributeName="opacity" values="0;1;1;0" dur={`${2.5 + i * 0.3}s`} repeatCount="indefinite" />
              </circle>
            </g>
          ))}

          {/* ===== HUB CENTRAL = LE CERVEAU ===== */}
          <g transform={`translate(${HUB_CX}, ${HUB_CY})`}>
            {/* Halo extérieur diffus */}
            <circle r="100" fill="url(#coreGlow)" />
            {/* Anneau orbital subtil */}
            <circle r={ORBIT_R - 20} fill="none" stroke={C.green + "20"} strokeWidth="0.8" strokeDasharray="2 4" />
            {/* Hub principal */}
            <g className="core-pulse">
              <circle r="58" fill="url(#coreGrad)" stroke={C.greenGlow} strokeWidth="2"
                      style={{ filter: `drop-shadow(0 0 12px ${C.green}88)` }} />
              {/* Pattern de "neurones" à l'intérieur */}
              <circle r="30" fill="none" stroke={C.navy} strokeWidth="1" opacity="0.4" />
              <circle r="18" fill={C.navy} opacity="0.3" />
              {[0, 60, 120, 180, 240, 300].map(a => {
                const r = 22;
                const px = r * Math.cos(a * Math.PI / 180);
                const py = r * Math.sin(a * Math.PI / 180);
                return <circle key={a} cx={px} cy={py} r="2.2" fill={C.navy} opacity="0.7" />;
              })}
              {/* Texte central */}
              <text textAnchor="middle" y="-2" fontSize="11" fill={C.navy} fontWeight="800" letterSpacing="1">DATATOPIA</text>
              <text textAnchor="middle" y="11" fontSize="8.5" fill={C.navy} fontWeight="700" letterSpacing="2" opacity="0.85">CORE</text>
            </g>

            {/* ===== LES 3 PILIERS EN ORBITE ===== */}
            {pillars.map((p) => {
              const pos = computePillarPos(p.angle);
              const isActive = activePillar === p.id;
              // Position relative au hub center
              const dx = pos.x - HUB_CX;
              const dy = pos.y - HUB_CY;
              return (
                <g key={p.id} transform={`translate(${dx}, ${dy})`}
                   style={{ cursor: "pointer" }}
                   onClick={() => setActivePillar(prev => prev === p.id ? null : p.id)}>
                  {/* Ligne du hub vers le pilier */}
                  <line x1={-dx} y1={-dy} x2="0" y2="0"
                        stroke={p.color} strokeWidth={isActive ? 2 : 1}
                        strokeDasharray="3 3" opacity={isActive ? 0.85 : 0.4}
                        className={isActive ? "orbit-line" : ""} />
                  {/* Petit point de connexion */}
                  <circle r="3" fill={p.color} opacity={isActive ? 1 : 0.5}>
                    <animate attributeName="opacity" values="0.3;1;0.3" dur="2s" repeatCount="indefinite" />
                  </circle>
                  {/* Cercle pilier */}
                  <circle r={isActive ? 42 : 36}
                          fill={isActive ? p.color : C.navyMid}
                          stroke={p.color} strokeWidth={isActive ? 2.5 : 1.5}
                          opacity={activePillar && !isActive ? 0.55 : 1}
                          style={{ transition: "all 0.25s" }} />
                  {/* Anneau intérieur */}
                  <circle r={isActive ? 36 : 30} fill="none"
                          stroke={isActive ? "rgba(255,255,255,0.3)" : p.color + "44"} strokeWidth="1" />
                  {/* Icône */}
                  <text textAnchor="middle" y="-3" fontSize={isActive ? 19 : 17}>{p.icon}</text>
                  {/* Label */}
                  <text textAnchor="middle" y="13" fontSize="8.5" fontWeight="800"
                        fill={isActive ? C.navy : C.white} letterSpacing="0.5">
                    {p.label.toUpperCase()}
                  </text>
                </g>
              );
            })}
          </g>

          {/* ===== SORTIES (insights à droite) ===== */}
          <g transform="translate(610, 0)">
            {[
              { y: 80, icon: "📈", label: "Forecasts" },
              { y: 160, icon: "⚠️", label: "Alertes" },
              { y: 240, icon: "🎯", label: "Recos IA" },
              { y: 320, icon: "🌡️", label: "Benchmarks" },
            ].map((out, i) => (
              <g key={i}>
                <rect x="-78" y={out.y - 18} width="78" height="36" rx="18"
                      fill={C.navyMid} stroke={C.amber + "55"} strokeWidth="1" />
                <text x="-66" y={out.y + 5} fontSize="13">{out.icon}</text>
                <text x="-46" y={out.y + 4} fontSize="10.5" fill={C.grayLight} fontWeight="600">{out.label}</text>
              </g>
            ))}
            <text x="-39" y="48" textAnchor="middle" fill={C.amber} fontSize="10" fontWeight="700" letterSpacing="1.5">
              DANS VOS MODULES
            </text>
          </g>

          {/* Lignes de sortie animées */}
          {[80, 160, 240, 320].map((y, i) => (
            <g key={i}>
              <line x1={HUB_CX + 58} y1={HUB_CY + (y - HUB_CY) * 0.15} x2="532" y2={y}
                    stroke="url(#dataOutGrad)" strokeWidth="1.5" strokeDasharray="4 4" className="orbit-line"
                    style={{ animationDirection: "reverse" }} />
              <circle r="3" fill={C.amber}>
                <animateMotion dur={`${2.2 + i * 0.3}s`} repeatCount="indefinite"
                               path={`M${HUB_CX + 58},${HUB_CY + (y - HUB_CY) * 0.15} L532,${y}`} />
                <animate attributeName="opacity" values="0;1;1;0" dur={`${2.2 + i * 0.3}s`} repeatCount="indefinite" />
              </circle>
            </g>
          ))}
        </svg>

        {/* Petite note en dessous */}
        <p style={{ textAlign: "center", color: C.gray, fontSize: 11, margin: "8px 0 4px", fontStyle: "italic" }}>
          👆 Cliquez sur les piliers Compliance, RADAR ou IA pour voir le détail de chaque couche
        </p>
      </div>

      {/* ========================== PILIER ACTIF (panneau détaillé) ========================== */}
      {activePillar && (() => {
        const p = pillars.find(pi => pi.id === activePillar);
        return (
          <div style={{ background: `linear-gradient(155deg, ${C.cardBg}, ${p.color}10)`, border: `1.5px solid ${p.color}66`, borderRadius: 16, padding: "20px 22px", marginBottom: 24 }}>
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16, marginBottom: 16, flexWrap: "wrap" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <div style={{ width: 52, height: 52, borderRadius: "50%", background: p.color + "22", border: `2px solid ${p.color}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24 }}>
                  {p.icon}
                </div>
                <div>
                  <h3 style={{ fontSize: 20, fontWeight: 700, color: p.color, margin: 0, fontFamily: "Georgia,serif" }}>{p.label}</h3>
                  <div style={{ fontSize: 12, color: C.grayLight, marginTop: 2, fontStyle: "italic" }}>{p.tagline}</div>
                </div>
              </div>
              <button onClick={() => setActivePillar(null)} style={{ background: "none", border: `1px solid ${C.cardBorder}`, color: C.gray, borderRadius: 8, padding: "5px 12px", cursor: "pointer", fontSize: 12 }}>✕ Fermer</button>
            </div>
            <p style={{ fontSize: 13, color: C.grayLight, lineHeight: 1.7, margin: "0 0 16px", maxWidth: 720 }}>
              {p.summary}
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(240px,1fr))", gap: 10 }}>
              {p.points.map((pt, i) => (
                <div key={i} style={{ background: C.cardBg, border: `1px solid ${p.color}33`, borderRadius: 12, padding: "12px 14px", borderLeft: `3px solid ${p.color}` }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                    <span style={{ fontSize: 16 }}>{pt.icon}</span>
                    <span style={{ fontSize: 12.5, fontWeight: 700, color: C.white }}>{pt.t}</span>
                  </div>
                  <p style={{ fontSize: 11.5, color: C.grayLight, margin: 0, lineHeight: 1.55 }}>{pt.d}</p>
                </div>
              ))}
            </div>
          </div>
        );
      })()}

      {/* ========================== PRINCIPE DIRECTEUR : "L'INTELLIGENCE INVISIBLE" ========================== */}
      <div style={{ background: `linear-gradient(135deg, ${C.navyMid}, ${C.cardBg})`, border: `1px solid ${C.green}55`, borderRadius: 16, padding: "20px 24px", marginBottom: 24 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
          <span style={{ fontSize: 24 }}>👁️‍🗨️</span>
          <h3 style={{ fontSize: 17, fontWeight: 700, color: C.white, margin: 0, fontFamily: "Georgia,serif" }}>
            Notre principe : l'intelligence doit être <span style={{ color: C.green, fontStyle: "italic" }}>invisible</span>
          </h3>
        </div>
        <p style={{ fontSize: 13, color: C.grayLight, lineHeight: 1.7, margin: "0 0 14px", maxWidth: 720 }}>
          Le pharmacien n'a pas à comprendre « c'est du machine learning » ou « c'est de la veille marché ».
          Il voit juste des prévisions là où il en a besoin, des alertes secteur là où il prend une décision,
          des benchmarks là où il négocie. Le moteur IA et le pipeline RADAR travaillent en arrière-plan.
        </p>
        {/* Mini démo visuelle : un tableau d'articles avec colonnes "Forecast 30j" + bannière RADAR */}
        <div style={{ background: C.navy, border: `1px solid ${C.cardBorder}`, borderRadius: 10, padding: "10px 14px", marginTop: 12 }}>
          {/* Bannière RADAR */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 10px", background: C.coral + "15", border: `1px solid ${C.coral}55`, borderRadius: 6, marginBottom: 10, fontSize: 11 }}>
            <span style={{ fontSize: 12 }}>📡</span>
            <span style={{ color: C.coral, fontWeight: 700, fontSize: 10, letterSpacing: 0.5 }}>TENDANCE SECTEUR</span>
            <span style={{ color: C.grayLight }}>+42% d'indisponibilités pharma hospitalière BE en 2 ans</span>
            <span style={{ color: C.gray, fontSize: 10, marginLeft: "auto" }}>· source AFMPS</span>
          </div>
          {/* Mini tableau */}
          <div style={{ display: "grid", gridTemplateColumns: "1.4fr 0.8fr 0.9fr 0.7fr", gap: 8, fontSize: 11, padding: "5px 0", borderBottom: `1px solid ${C.cardBorder}`, color: C.gray, fontWeight: 600 }}>
            <span>Article</span><span>Stock</span>
            <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
              Prévision 30j <span style={{ background: C.green + "22", color: C.green, fontSize: 8, padding: "1px 4px", borderRadius: 3, fontWeight: 700 }}>ML</span>
            </span>
            <span>Action</span>
          </div>
          {[
            { name: "Doliprane 1g x16", stock: "12", forecast: "48", action: "Commander" },
            { name: "Spasfon Lyoc x10", stock: "34", forecast: "29", action: "OK" },
            { name: "Dafalgan 500 x16", stock: "8", forecast: "62", action: "Urgent ⚠️" },
          ].map((row, i) => (
            <div key={i} style={{ display: "grid", gridTemplateColumns: "1.4fr 0.8fr 0.9fr 0.7fr", gap: 8, fontSize: 11, padding: "6px 0", borderBottom: i < 2 ? `1px solid ${C.cardBorder}88` : "none", color: C.grayLight, alignItems: "center" }}>
              <span>{row.name}</span>
              <span>{row.stock}</span>
              <span style={{ color: C.green, fontWeight: 700, fontFamily: "ui-monospace,monospace" }}>{row.forecast}</span>
              <span style={{ color: row.action.includes("Urgent") ? C.coral : row.action === "OK" ? C.green : C.amber, fontWeight: 600, fontSize: 10.5 }}>{row.action}</span>
            </div>
          ))}
          <div style={{ fontSize: 10, color: C.gray, fontStyle: "italic", marginTop: 8, textAlign: "center" }}>
            ↑ Exemple : la prévision IA et la tendance RADAR apparaissent <strong style={{ color: C.grayLight }}>directement dans votre vue stocks</strong>, pas dans un onglet à part.
          </div>
        </div>
      </div>

      {/* ========================== PIPELINE SIMPLIFIÉ ========================== */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ textAlign: "center", marginBottom: 18 }}>
          <h3 style={{ fontSize: 18, fontWeight: 700, color: C.white, fontFamily: "Georgia,serif", margin: "0 0 6px" }}>
            Le voyage de vos données, étape par étape
          </h3>
          <p style={{ fontSize: 12, color: C.gray, margin: 0 }}>
            Architecture lakehouse Bronze → Silver → Gold. Cliquez sur une étape pour la décrire.
          </p>
        </div>
        {/* Pipeline horizontal */}
        <div style={{ display: "flex", alignItems: "stretch", gap: 0, flexWrap: "wrap", justifyContent: "center" }}>
          {stages.map((s, i) => (
            <div key={s.id} style={{ display: "flex", alignItems: "center", flex: "1 1 140px", minWidth: 130, maxWidth: 180 }}>
              <div onClick={() => setActiveStage(activeStage === s.id ? null : s.id)}
                   style={{
                     flex: 1,
                     background: activeStage === s.id ? s.color + "1f" : C.cardBg,
                     border: `1.5px solid ${activeStage === s.id ? s.color : C.cardBorder}`,
                     borderRadius: 12, padding: "14px 8px",
                     cursor: "pointer", textAlign: "center",
                     transition: "all 0.2s",
                   }}>
                <div style={{ width: 40, height: 40, margin: "0 auto 8px", borderRadius: "50%",
                              background: s.color + "22", border: `1.5px solid ${s.color}`,
                              display: "flex", alignItems: "center", justifyContent: "center", fontSize: 19 }}>{s.icon}</div>
                <div style={{ fontSize: 11.5, fontWeight: 700, color: activeStage === s.id ? s.color : C.white, letterSpacing: 0.5 }}>{s.label.toUpperCase()}</div>
                <div style={{ fontSize: 9.5, color: C.gray, marginTop: 4 }}>Étape {i + 1}/5</div>
              </div>
              {i < stages.length - 1 && (
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 18, color: C.gray, fontSize: 14, flexShrink: 0 }}>→</div>
              )}
            </div>
          ))}
        </div>
        {/* Description de l'étape active */}
        {activeStage && (() => {
          const s = stages.find(x => x.id === activeStage);
          return (
            <div style={{ marginTop: 14, background: s.color + "10", border: `1px solid ${s.color}55`, borderRadius: 10, padding: "12px 16px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                <span style={{ fontSize: 16 }}>{s.icon}</span>
                <span style={{ fontSize: 13, color: s.color, fontWeight: 700 }}>{s.label}</span>
              </div>
              <p style={{ fontSize: 12.5, color: C.grayLight, margin: 0, lineHeight: 1.65 }}>{s.desc}</p>
            </div>
          );
        })()}
      </div>

      {/* ========================== DÉTAILS TECHNIQUES (DÉPLIABLES) ========================== */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
          <span style={{ fontSize: 14 }}>⚙️</span>
          <h3 style={{ fontSize: 14, fontWeight: 700, color: C.white, margin: 0, letterSpacing: 0.3 }}>
            Pour les CTO & DSI : la stack technique
          </h3>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {techDetails.map(td => (
            <div key={td.id}>
              <div onClick={() => setOpenTech(prev => ({ ...prev, [td.id]: !prev[td.id] }))}
                   style={{
                     display: "flex", alignItems: "center", gap: 12,
                     background: openTech[td.id] ? C.navyMid : C.cardBg,
                     border: `1px solid ${openTech[td.id] ? C.green + "55" : C.cardBorder}`,
                     borderRadius: openTech[td.id] ? "10px 10px 0 0" : 10,
                     padding: "11px 16px", cursor: "pointer", transition: "all 0.2s",
                   }}>
                <span style={{ fontSize: 16, flexShrink: 0 }}>{td.icon}</span>
                <span style={{ fontSize: 13, fontWeight: 600, color: openTech[td.id] ? C.green : C.white, flex: 1 }}>{td.title}</span>
                <span style={{ color: C.gray, fontSize: 11 }}>{openTech[td.id] ? "▲" : "▼"}</span>
              </div>
              {openTech[td.id] && (
                <div style={{ background: C.navyMid + "55", border: `1px solid ${C.green}33`, borderTop: "none", borderRadius: "0 0 10px 10px", padding: "12px 16px" }}>
                  <p style={{ fontSize: 12.5, color: C.grayLight, margin: 0, lineHeight: 1.7 }}>{td.content}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ========================== BADGES SÉCURITÉ FINAUX ========================== */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(170px,1fr))", gap: 12, marginTop: 16 }}>
        {[
          { icon: "🔐", t: "Azure Key Vault", d: "Vos credentials ne sont jamais stockés en clair." },
          { icon: "🛡️", t: "RGPD compliant", d: "Données hébergées en Europe. Souveraineté totale." },
          { icon: "🔄", t: "Sync automatique", d: "Mise à jour quotidienne ou temps réel selon votre plan." },
          { icon: "🔌", t: "Compatible tous LGOs", d: "Connecteurs pour tous les logiciels du marché belge et français." },
        ].map((item, i) => (
          <div key={i} style={{ background: C.cardBg, border: `1px solid ${C.cardBorder}`, borderRadius: 12, padding: 14 }}>
            <div style={{ fontSize: 20, marginBottom: 6 }}>{item.icon}</div>
            <div style={{ fontSize: 12.5, fontWeight: 600, color: C.white, marginBottom: 4 }}>{item.t}</div>
            <div style={{ fontSize: 11, color: C.grayLight, lineHeight: 1.55 }}>{item.d}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

const ROI_PAIRS = [
  {
    id: "stock",
    value: {
      icon: "📦", keyword: "Cash immobilisé", tag: "Gestion du stock", color: C.amber,
      pitch: "Votre stock dort. Votre cash aussi.",
      bullets: [
        "Une pharmacie moyenne a 8 à 12% de son stock en produits dormants depuis plus de 6 mois",
        "Sur €150k de stock total, c'est €12 000 à €18 000 de capital qui ne tourne pas et qui pèse sur votre trésorerie",
        "Datatopia détecte chaque produit immobilisé, calcule son coût réel et vous propose un plan d'action concret",
        "Résultat : vous libérez du cash sans avoir à passer des heures dans votre réserve",
      ]
    },
    roi: {
      icon: "💰", figure: "€8k – €20k", label: "libérés la 1ère année", color: C.amber,
      pitch: "Cash récupéré sur le stock dormant",
      bullets: [
        "Base de calcul : pharmacie avec €150k de stock, 10% de stock mort identifié = €15 000 immobilisés",
        "Réduction de 50% du stock dormant via déstockage intelligent = €7 500 récupérés en trésorerie",
        "Réduction des commandes inutiles grâce aux alertes préventives = €2 000 à €5 000 / an supplémentaires",
        "Cas client réel : 'Ça m'a ouvert les yeux sur le stock mort et libéré du cash' (pharmacien belge, 2024)",
      ]
    }
  },
  {
    id: "marges",
    value: {
      icon: "📊", keyword: "Marges invisibles", tag: "Analyse financière", color: C.green,
      pitch: "Vos marges s'érodent sans que vous le voyiez.",
      bullets: [
        "Sans outil dédié, il est impossible de savoir quels produits ou quels labos détruisent votre marge nette",
        "Des conditions commerciales mal négociées, des prix sous-optimaux ou des promos mal calibrées coûtent en silence",
        "Datatopia calcule en temps réel la marge réelle par produit, par famille et par fournisseur",
        "70% de nos clients utilisent le rapport marges pour préparer leurs réunions fournisseurs et renégocier",
      ]
    },
    roi: {
      icon: "📈", figure: "+€12k – €18k", label: "de marge additionnelle / an", color: C.green,
      pitch: "Gain sur optimisation marges OTC & para",
      bullets: [
        "Sur un CA OTC & parapharmacie de €200k, une amélioration de +6 à +9% = €12k à €18k / an",
        "Renégociation fournisseurs avec données concrètes : gain moyen de 2 à 4% sur les conditions",
        "Ajustement prix sur produits mal positionnés : +1 à +2% de marge nette globale identifiés en moyenne",
        "Résultat mesuré en production sur notre base de 200 clients actifs en Belgique",
      ]
    }
  },
  {
    id: "temps",
    value: {
      icon: "⏱️", keyword: "Temps perdu", tag: "Productivité", color: C.blue,
      pitch: "Combien d'heures passez-vous sur Excel ?",
      bullets: [
        "Préparer une réunion fournisseur, analyser les ventes du mois, évaluer l'impact d'une promo : tout ça prend des heures",
        "Sans outil, les décisions reposent sur l'intuition ou sur des fichiers Excel périmés",
        "Datatopia génère vos rapports automatiquement, en temps réel, accessibles en 1 clic depuis n'importe quel appareil",
        "Vos réunions fournisseurs se préparent en 2 minutes au lieu de 2 heures",
      ]
    },
    roi: {
      icon: "🕐", figure: "3h / semaine", label: "gagnées sur le pilotage", color: C.blue,
      pitch: "Temps valorisé = €7 800 / an minimum",
      bullets: [
        "3h de temps pharmacien récupérées par semaine (reporting, analyse, préparation réunions)",
        "Valorisation conservative à €50/h = €7 800 / an de productivité retrouvée",
        "Temps réinvesti dans le conseil patient, le développement commercial ou tout simplement la qualité de vie",
        "80% de nos utilisateurs consultent le dashboard stock au moins une fois par semaine spontanément",
      ]
    }
  },
  {
    id: "ruptures",
    value: {
      icon: "⚠️", keyword: "Ruptures & pertes", tag: "Continuité de service", color: C.coral,
      pitch: "Chaque rupture est une vente perdue. Et un client déçu.",
      bullets: [
        "Une rupture non anticipée coûte en moyenne €80 de CA par événement (panier moyen + fidélisation)",
        "Une pharmacie subit en moyenne 80 à 120 ruptures évitables par an, souvent sur les mêmes produits",
        "Datatopia surveille en continu vos niveaux de stock et vous alerte avant que la rupture arrive",
        "Les péremptions sont aussi trackées : plus jamais de produit expiré découvert par hasard",
      ]
    },
    roi: {
      icon: "🚫", figure: "−€8k / an", label: "de CA perdu sur ruptures", color: C.coral,
      pitch: "Ruptures évitées = ventes récupérées",
      bullets: [
        "100 ruptures / an × €80 de CA moyen par rupture = €8 000 de CA récupérable",
        "Sans compter l'impact fidélisation : un patient qui ne trouve pas son produit peut changer de pharmacie",
        "Réduction des péremptions : €500 à €2 000 / an de produits sauvés selon la taille de l'officine",
        "Résultat combiné : entre €8 500 et €10 000 de valeur générée sur ce seul axe",
      ]
    }
  },
  {
    id: "prix",
    value: {
      icon: "🏷️", keyword: "Prix & compétitivité", tag: "Veille marché", color: C.purple,
      pitch: "Les onliners grignotent votre clientèle. Soyez aussi agile qu'eux.",
      bullets: [
        "Les pharmacies en ligne pratiquent des prix jusqu'à 20% inférieurs sur la parapharmacie et les produits OTC courants",
        "Sans veille prix, vous n'avez aucune visibilité sur votre positionnement réel dans votre zone de chalandise",
        "Datatopia compare automatiquement vos prix avec les onliners et vous indique les produits à risque",
        "Vous pouvez ajuster votre stratégie prix avec des règles automatiques : marge min, prix plafond, ajustement famille",
      ]
    },
    roi: {
      icon: "🎯", figure: "+€5k – €10k", label: "de CA protégé / an", color: C.purple,
      pitch: "CA préservé face à la concurrence online",
      bullets: [
        "Sur un CA parapharmacie de €80k, chaque % de clients gardés grâce au bon positionnement = €800",
        "Ajustement prix sur 50 références à risque → réduction de l'attrition sur ces produits de 15 à 30%",
        "Promotions ciblées sur les produits sous pression concurrentielle : +20% d'efficacité vs promo non ciblée",
        "Impact indirect : renforcement de la fidélité client sur l'OTC favorise le retour sur l'ordonnance",
      ]
    }
  },
  {
    id: "retour",
    value: {
      icon: "🚀", keyword: "Rentabilité immédiate", tag: "Investissement & retour", color: C.green,
      pitch: "Opérationnel en 5 minutes. Rentable en 6 semaines.",
      bullets: [
        "Contrairement aux LGOs classiques qui nécessitent des mois d'intégration, Datatopia est actif immédiatement",
        "La version R2 (light) ne nécessite aucune connexion technique : vous uploadez un fichier, le dashboard est prêt",
        "Pas de frais de mise en place, pas de consultant, pas de délai : vous voyez vos données dès le premier jour",
        "Essai de 14 jours gratuit, sans engagement, sans carte bancaire requise",
      ]
    },
    roi: {
      icon: "⚡", figure: "< 6 semaines", label: "de payback moyen", color: C.green,
      pitch: "Retour sur investissement ultra-rapide",
      bullets: [
        "Abonnement Starter : 400€/mois HT. Soit €4 800 / an.",
        "Premier gain identifié en moyenne dès le 1er mois : €600 à €800 sur le stock mort seul",
        "Cumul des gains année 1 (stock + marges + temps) : entre €25 000 et €50 000 selon la taille de l'officine",
        "ROI année 1 estimé : entre 20x et 40x l'investissement dans la plateforme",
      ]
    }
  },
];

function ROICard({ data, side, isOpen, onClick }) {
  const c = data.color;
  return (
    <div style={{ flex: 1, minWidth: 0 }}>
      <div
        onClick={onClick}
        style={{
          background: isOpen ? c + "20" : C.cardBg,
          border: `${isOpen ? "2px" : "1px"} solid ${isOpen ? c : C.cardBorder}`,
          borderRadius: isOpen ? "12px 12px 0 0" : 12,
          padding: "18px 20px",
          cursor: "pointer",
          transition: "all 0.2s",
          position: "relative",
        }}
        onMouseEnter={e => { if (!isOpen) { e.currentTarget.style.borderColor = c + "88"; e.currentTarget.style.background = c + "0F"; } }}
        onMouseLeave={e => { if (!isOpen) { e.currentTarget.style.borderColor = C.cardBorder; e.currentTarget.style.background = C.cardBg; } }}
      >
        {side === "value" && (
          <span style={{ fontSize: 10, background: c + "22", color: c, border: `1px solid ${c}44`, borderRadius: 20, padding: "2px 9px", fontWeight: 600, display: "inline-block", marginBottom: 10 }}>
            {data.tag}
          </span>
        )}
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
          <span style={{ fontSize: 22, lineHeight: 1 }}>{data.icon}</span>
          <span style={{
            fontSize: side === "roi" ? 22 : 17,
            fontWeight: 700,
            color: side === "roi" ? c : C.white,
            fontFamily: side === "roi" ? "Georgia,serif" : "inherit",
            lineHeight: 1.1
          }}>
            {side === "roi" ? data.figure : data.keyword}
          </span>
        </div>
        <div style={{ fontSize: 12, color: side === "roi" ? c : C.grayLight, fontWeight: side === "roi" ? 600 : 400, lineHeight: 1.4 }}>
          {side === "roi" ? data.label : data.pitch}
        </div>
        <div style={{ position: "absolute", top: 12, right: 14, width: 20, height: 20, borderRadius: "50%", background: isOpen ? c + "33" : C.cardBorder + "88", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <span style={{ fontSize: 9, color: isOpen ? c : C.gray, fontWeight: 700 }}>{isOpen ? "▲" : "▼"}</span>
        </div>
      </div>
      {isOpen && (
        <div style={{ background: c + "0D", border: `2px solid ${c}`, borderTop: "none", borderRadius: "0 0 12px 12px", padding: "16px 20px", animation: "slideDown 0.2s ease" }}>
          <p style={{ fontSize: 12, color: c, fontWeight: 600, margin: "0 0 10px", fontStyle: "italic" }}>{data.pitch}</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
            {data.bullets.map((b, i) => (
              <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                <span style={{ width: 5, height: 5, borderRadius: "50%", background: c, flexShrink: 0, marginTop: 6 }} />
                <span style={{ fontSize: 12, color: C.grayLight, lineHeight: 1.65 }}>{b}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function ROICalculator() {
  const [inputs, setInputs] = useState({
    caAnnuel: 1500000,
    caOtc: 200000,
    valeurStock: 150000,
    tauxMarge: 28,
    panierMoyen: 18,
    nbRuptures: 100,
  });

  const update = (key, value) => {
    setInputs(prev => ({ ...prev, [key]: value }));
  };

  // ===== CALCULS =====
  // Coefficient de marge (taux saisi / 100)
  const margeCoef = inputs.tauxMarge / 100;

  // 1. Stock dormant libéré : ~10% du stock immobilisé, dont 50% récupérable
  const stockDormant = Math.round(inputs.valeurStock * 0.10 * 0.50);
  // 2. Commandes inutiles évitées : 2% du stock total / an
  const commandesEvitees = Math.round(inputs.valeurStock * 0.02);
  // 3. Marges optimisées : +20% d'amélioration de la marge actuelle sur le CA OTC
  //    => caOtc × tauxMarge × 20%   (un meilleur taux de marge = plus de gain)
  const margesGain = Math.round(inputs.caOtc * margeCoef * 0.20);
  // 4. Ruptures évitées : 90% des ruptures × panier moyen × marge réelle
  //    (le gain par rupture évitée = marge récupérée, pas le CA brut)
  const rupturesGain = Math.round(inputs.nbRuptures * inputs.panierMoyen * margeCoef * 0.90);
  // 5. Péremptions évitées : 0.5% du stock / an
  const peremptionsGain = Math.round(inputs.valeurStock * 0.005);
  // 6. CA protégé face à la concurrence online (veille prix) : 0.3% du CA annuel total
  //    => plus l'officine est grosse, plus la veille prix protège de CA
  const prixGain = Math.round(inputs.caAnnuel * 0.003);
  // 7. Temps gagné : 3h/sem × 52 × 50€/h = 7800€/an (constante)
  const tempsGain = 7800;

  const totalGain = stockDormant + commandesEvitees + margesGain + rupturesGain + peremptionsGain + prixGain + tempsGain;
  const abonnementAnnuel = 4800;
  const beneficNet = totalGain - abonnementAnnuel;
  const roiMultiple = (totalGain / abonnementAnnuel).toFixed(1);

  const formatEur = (n) => new Intl.NumberFormat('fr-FR').format(n);

  // Configuration des inputs
  const inputConfigs = [
    { key: "caAnnuel", label: "CA annuel total", suffix: "€", min: 200000, max: 5000000, step: 50000, color: C.blue, icon: "💰",
      help: "Chiffre d'affaires annuel de votre officine, toutes catégories confondues." },
    { key: "caOtc", label: "CA OTC & parapharmacie", suffix: "€", min: 20000, max: 800000, step: 10000, color: C.green, icon: "🛍️",
      help: "Votre CA sur les produits hors ordonnance (para, OTC, diététique...). C'est là que se joue l'essentiel de vos marges." },
    { key: "valeurStock", label: "Valeur totale du stock", suffix: "€", min: 30000, max: 500000, step: 5000, color: C.amber, icon: "📦",
      help: "Valeur totale immobilisée dans votre réserve + rayonnages. Plus c'est élevé, plus Datatopia a de leviers à activer." },
    { key: "tauxMarge", label: "Taux de marge moyen", suffix: "%", min: 15, max: 45, step: 1, color: C.purple, icon: "📈",
      help: "Taux de marge brute moyen sur votre activité. En Belgique/France, la moyenne se situe autour de 25-30%." },
    { key: "panierMoyen", label: "Panier moyen", suffix: "€", min: 8, max: 50, step: 1, color: C.coral, icon: "🛒",
      help: "Montant moyen par ticket de caisse. Sert à estimer l'impact des ruptures sur votre CA." },
    { key: "nbRuptures", label: "Nombre de ruptures / an", suffix: "", min: 20, max: 400, step: 10, color: C.coral, icon: "⚠️",
      help: "Estimation du nombre de ruptures de stock évitables par an. Une pharmacie moyenne en subit 80 à 120." },
  ];

  return (
    <div style={{ marginTop: 50 }}>
      {/* Header de la section */}
      <div style={{ textAlign: "center", marginBottom: 28, paddingTop: 28, borderTop: `1px dashed ${C.cardBorder}` }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: C.blue + "18", border: `1px solid ${C.blue}44`, borderRadius: 30, padding: "6px 18px", marginBottom: 14 }}>
          <span style={{ fontSize: 13, color: C.blue, fontWeight: 600 }}>🧮 Calculateur personnalisé</span>
        </div>
        <h2 style={{ fontSize: 26, fontWeight: 700, color: C.white, fontFamily: "Georgia,serif", margin: "0 0 8px" }}>
          Et pour votre officine concrètement ?
        </h2>
        <p style={{ color: C.gray, fontSize: 13, margin: "0 auto", maxWidth: 560, lineHeight: 1.7 }}>
          Renseignez vos chiffres réels (ou estimés) pour obtenir une projection de ROI personnalisée.
          Les résultats se mettent à jour en temps réel.
        </p>
      </div>

      {/* Style responsive pour le split view (media query CSS pure - plus fiable que JS) */}
      <style>{`
        .roi-split { display: grid; gap: 14px; align-items: start; grid-template-columns: 1fr; }
        .roi-split > .roi-results { position: relative; top: 0; }
        @media (min-width: 920px) {
          .roi-split { grid-template-columns: minmax(0, 1fr) 320px; gap: 20px; }
          .roi-split > .roi-results { position: sticky; top: 16px; }
        }
      `}</style>

      {/* Split view : desktop = inputs + résultats sticky droite | mobile = inputs puis résultats en dessous */}
      <div className="roi-split">

        {/* ----- INPUTS ----- */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {inputConfigs.map(cfg => {
            const value = inputs[cfg.key];
            const pct = ((value - cfg.min) / (cfg.max - cfg.min)) * 100;
            return (
              <div key={cfg.key} style={{ background: C.cardBg, border: `1px solid ${C.cardBorder}`, borderRadius: 14, padding: "16px 18px" }}>
                {/* Ligne : label + valeur (wrap naturel si trop étroit) */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6, gap: 10, flexWrap: "wrap" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, flex: "1 1 160px", minWidth: 0 }}>
                    <span style={{ fontSize: 16, flexShrink: 0 }}>{cfg.icon}</span>
                    <span style={{ fontSize: 13, fontWeight: 600, color: C.white, lineHeight: 1.3 }}>{cfg.label}</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 4, flexShrink: 0 }}>
                    <input
                      type="number"
                      value={value}
                      onChange={e => update(cfg.key, Math.max(cfg.min, Math.min(cfg.max, Number(e.target.value) || 0)))}
                      style={{ width: 90, background: C.navy, border: `1px solid ${cfg.color}55`, borderRadius: 6, padding: "4px 8px", color: cfg.color, fontSize: 14, fontWeight: 700, textAlign: "right", outline: "none", fontFamily: "ui-monospace,monospace" }}
                    />
                    <span style={{ fontSize: 12, color: cfg.color, fontWeight: 600 }}>{cfg.suffix}</span>
                  </div>
                </div>
                {/* Slider custom */}
                <div style={{ position: "relative", height: 24, display: "flex", alignItems: "center" }}>
                  <input
                    type="range"
                    min={cfg.min}
                    max={cfg.max}
                    step={cfg.step}
                    value={value}
                    onChange={e => update(cfg.key, Number(e.target.value))}
                    style={{
                      width: "100%",
                      height: 6,
                      WebkitAppearance: "none",
                      appearance: "none",
                      background: `linear-gradient(to right, ${cfg.color} 0%, ${cfg.color} ${pct}%, ${C.navyMid} ${pct}%, ${C.navyMid} 100%)`,
                      borderRadius: 3,
                      outline: "none",
                      cursor: "pointer",
                    }}
                  />
                </div>
                {/* Min / Max / Help */}
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: 5 }}>
                  <span style={{ fontSize: 10, color: C.gray }}>{formatEur(cfg.min)}{cfg.suffix}</span>
                  <span style={{ fontSize: 10, color: C.gray }}>{formatEur(cfg.max)}{cfg.suffix}</span>
                </div>
                <p style={{ fontSize: 11, color: C.gray, margin: "8px 0 0", lineHeight: 1.5, fontStyle: "italic" }}>
                  {cfg.help}
                </p>
              </div>
            );
          })}
        </div>

        {/* ----- RÉSULTATS (droite sticky en desktop, en dessous en mobile) ----- */}
        <div className="roi-results">
          <div style={{ background: `linear-gradient(155deg, ${C.navyMid}, ${C.green}12)`, border: `1.5px solid ${C.green}66`, borderRadius: 16, padding: "20px 22px", boxShadow: `0 8px 30px rgba(0,0,0,0.4)` }}>
            {/* Header résultat */}
            <div style={{ textAlign: "center", paddingBottom: 16, borderBottom: `1px solid ${C.cardBorder}`, marginBottom: 16 }}>
              <div style={{ fontSize: 11, color: C.gray, letterSpacing: 1.5, fontWeight: 600, marginBottom: 6 }}>VOTRE ROI ESTIMÉ</div>
              <div style={{ fontSize: 32, fontWeight: 800, color: C.green, fontFamily: "Georgia,serif", lineHeight: 1.1, margin: "4px 0" }}>
                €{formatEur(totalGain)}
              </div>
              <div style={{ fontSize: 12, color: C.grayLight, marginTop: 4 }}>de gains identifiés / an</div>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: C.green + "22", border: `1px solid ${C.green}`, borderRadius: 20, padding: "4px 12px", marginTop: 10 }}>
                <span style={{ fontSize: 11, color: C.green, fontWeight: 700 }}>ROI × {roiMultiple}</span>
              </div>
            </div>

            {/* Détail des gains */}
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {[
                { label: "Stock dormant libéré", value: stockDormant, color: C.amber, icon: "💀" },
                { label: "Commandes inutiles évitées", value: commandesEvitees, color: C.amber, icon: "📋" },
                { label: "Marges optimisées", value: margesGain, color: C.green, icon: "📈" },
                { label: "Ruptures évitées", value: rupturesGain, color: C.coral, icon: "⚠️" },
                { label: "Péremptions évitées", value: peremptionsGain, color: C.amber, icon: "⏰" },
                { label: "CA protégé (veille prix)", value: prixGain, color: C.purple, icon: "🏷️" },
                { label: "Temps valorisé (3h/sem)", value: tempsGain, color: C.blue, icon: "⏱️" },
              ].map((item, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, padding: "6px 0" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 0 }}>
                    <span style={{ fontSize: 13, flexShrink: 0 }}>{item.icon}</span>
                    <span style={{ fontSize: 11, color: C.grayLight, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.label}</span>
                  </div>
                  <span style={{ fontSize: 12, color: item.color, fontWeight: 700, fontFamily: "ui-monospace,monospace", flexShrink: 0 }}>
                    +€{formatEur(item.value)}
                  </span>
                </div>
              ))}
            </div>

            {/* Séparateur + coût */}
            <div style={{ borderTop: `1px dashed ${C.cardBorder}`, marginTop: 14, paddingTop: 12 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: 11, color: C.gray, marginBottom: 6 }}>
                <span>Abonnement Datatopia</span>
                <span style={{ fontFamily: "ui-monospace,monospace" }}>−€{formatEur(abonnementAnnuel)}</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: C.green + "18", border: `1px solid ${C.green}44`, borderRadius: 8, padding: "10px 12px", marginTop: 6 }}>
                <span style={{ fontSize: 12, color: C.white, fontWeight: 600 }}>Bénéfice net / an</span>
                <span style={{ fontSize: 16, color: C.green, fontWeight: 800, fontFamily: "ui-monospace,monospace" }}>
                  €{formatEur(beneficNet)}
                </span>
              </div>
            </div>

            {/* CTA */}
            <a href="https://datatopia.care" target="_blank" rel="noopener noreferrer"
               style={{ display: "block", marginTop: 16, background: C.green, color: C.navy, textDecoration: "none",
                        borderRadius: 10, padding: "11px 18px", fontSize: 13, fontWeight: 700, textAlign: "center" }}>
              Démarrer l'essai gratuit →
            </a>
            <p style={{ fontSize: 10, color: C.gray, textAlign: "center", margin: "10px 0 0", lineHeight: 1.5 }}>
              Essai 14 jours · Aucune CB requise · Opérationnel en 5 min
            </p>
          </div>

          {/* Disclaimer */}
          <p style={{ fontSize: 10, color: C.gray, textAlign: "center", margin: "12px 4px 0", lineHeight: 1.6, fontStyle: "italic" }}>
            Estimations basées sur les ratios observés chez nos clients actifs.
            Résultats réels variables selon votre contexte.
          </p>
        </div>
      </div>
    </div>
  );
}
function TabROI() {
  const [openCards, setOpenCards] = useState({});
  const toggle = (id) => setOpenCards(prev => ({ ...prev, [id]: !prev[id] }));

  return (
    <div style={{ paddingBottom: 50 }}>
      <div style={{ textAlign: "center", marginBottom: 32 }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: C.green + "15", border: `1px solid ${C.green}44`, borderRadius: 30, padding: "6px 18px", marginBottom: 16 }}>
          <span style={{ fontSize: 13, color: C.green, fontWeight: 600 }}>💡 Valeur ajoutée & ROI</span>
        </div>
        <h2 style={{ fontSize: 26, fontWeight: 700, color: C.white, fontFamily: "Georgia,serif", margin: "0 0 8px" }}>Pourquoi choisir Datatopia ?</h2>
        <p style={{ color: C.gray, fontSize: 13, margin: "0 auto", maxWidth: 540, lineHeight: 1.7 }}>Cliquez sur chaque proposition de valeur ou sur le chiffre ROI pour voir le détail du calcul. Tout est basé sur nos données clients réelles.</p>
      </div>

      <div style={{ background: `linear-gradient(135deg, ${C.navyMid}, ${C.green}18)`, border: `1px solid ${C.green}44`, borderRadius: 16, padding: "18px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16, marginBottom: 32 }}>
        <div>
          <div style={{ fontSize: 12, color: C.gray, marginBottom: 4 }}>Gain total estimé — pharmacie standard (€150k stock, €400k CA)</div>
          <div style={{ fontSize: 28, fontWeight: 800, color: C.green, fontFamily: "Georgia,serif" }}>€25 000 – €50 000<span style={{ fontSize: 14, fontWeight: 400, color: C.grayLight }}> / an identifiés</span></div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: 12, color: C.gray, marginBottom: 4 }}>Pour un abonnement de</div>
          <div style={{ fontSize: 22, fontWeight: 700, color: C.white }}>€4 800<span style={{ fontSize: 13, color: C.gray, fontWeight: 400 }}> / an</span></div>
          <div style={{ fontSize: 11, color: C.green, marginTop: 2 }}>→ ROI estimé × 10 à × 30</div>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        {ROI_PAIRS.map(pair => {
          const vKey = pair.id + "_v";
          const rKey = pair.id + "_r";
          return (
            <div key={pair.id}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: 0 }}>
                <ROICard data={pair.value} side="value" isOpen={!!openCards[vKey]} onClick={() => toggle(vKey)} />
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "0 8px", paddingTop: openCards[vKey] || openCards[rKey] ? "28px" : "26px", flexShrink: 0, transition: "padding 0.2s" }}>
                  <svg width="52" height="24" viewBox="0 0 52 24">
                    <defs>
                      <linearGradient id={`grad-${pair.id}`} x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor={pair.value.color} />
                        <stop offset="100%" stopColor={pair.roi.color} />
                      </linearGradient>
                    </defs>
                    <line x1="0" y1="12" x2="40" y2="12" stroke={`url(#grad-${pair.id})`} strokeWidth="2" />
                    <path d="M38,7 L48,12 L38,17" fill="none" stroke={pair.roi.color} strokeWidth="2" strokeLinejoin="round" />
                    <text x="26" y="9" textAnchor="middle" fill={pair.value.color} fontSize="7" fontWeight="600">ROI</text>
                  </svg>
                </div>
                <ROICard data={pair.roi} side="roi" isOpen={!!openCards[rKey]} onClick={() => toggle(rKey)} />
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ marginTop: 36, background: C.cardBg, border: `1px solid ${C.cardBorder}`, borderRadius: 16, padding: "24px 28px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 20 }}>
        <div>
          <div style={{ fontSize: 16, fontWeight: 700, color: C.white, marginBottom: 6, fontFamily: "Georgia,serif" }}>Prêt à mesurer votre propre ROI ?</div>
          <div style={{ fontSize: 13, color: C.grayLight }}>Saisissez vos chiffres ci-dessous pour une estimation personnalisée.</div>
        </div>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <a href="https://datatopia.care" target="_blank" rel="noopener noreferrer" style={{ background: C.green, color: C.navy, border: "none", borderRadius: 10, padding: "11px 22px", fontSize: 13, fontWeight: 700, cursor: "pointer", textDecoration: "none", display: "inline-block" }}>Démarrer l'essai gratuit →</a>
          <button onClick={() => document.getElementById("roi-calculator")?.scrollIntoView({ behavior: "smooth", block: "start" })} style={{ background: "transparent", color: C.grayLight, border: `1px solid ${C.cardBorder}`, borderRadius: 10, padding: "11px 22px", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>Calculer mon ROI ↓</button>
        </div>
      </div>

      {/* Calculateur ROI personnalisé */}
      <div id="roi-calculator">
        <ROICalculator />
      </div>
    </div>
  );
}

export default function App() {
  const [tab, setTab] = useState("roi");
  const [chatOpen, setChatOpen] = useState(false);

  return (
    <div style={{ minHeight: "100vh", background: C.navy }}>
      <style>{`
        @keyframes bounce{0%,80%,100%{transform:scale(0.8);opacity:0.5}40%{transform:scale(1);opacity:1}}
        @keyframes slideDown{from{opacity:0;transform:translateY(-6px)}to{opacity:1;transform:translateY(0)}}
        *{box-sizing:border-box}
        ::-webkit-scrollbar{width:5px}::-webkit-scrollbar-track{background:transparent}::-webkit-scrollbar-thumb{background:${C.cardBorder};border-radius:3px}
        input::placeholder{color:${C.gray}}
      `}</style>
      <div style={{ maxWidth: 960, margin: "0 auto", padding: "0 20px" }}>
        <header style={{ padding: "22px 0 18px", borderBottom: `1px solid ${C.cardBorder}`, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <img src={logo} alt="Datatopia" style={{ height: 40 }} />
            <div>
              <div style={{ fontSize: 20, fontWeight: 800, color: C.white, letterSpacing: "-0.5px", fontFamily: "Georgia,serif" }}>Datatopia</div>
              <div style={{ fontSize: 11, color: C.gray }}>Empowering every pharmacist with the power of Data</div>
            </div>
          </div>
          <a href="https://datatopia.care" target="_blank" rel="noopener noreferrer" style={{ fontSize: 12, color: C.green, textDecoration: "none", border: `1px solid ${C.green}44`, borderRadius: 20, padding: "5px 14px" }}>
            datatopia.care ↗
          </a>
        </header>

        <nav style={{ display: "flex", gap: 4, padding: "14px 0 0", borderBottom: `1px solid ${C.cardBorder}`, overflowX: "auto" }}>
          {[{ id: "roi", label: "💡 Pourquoi Datatopia ?" }, { id: "pharmacy", label: "🏥 Votre pharmacie & nos solutions" }, { id: "data", label: "🔄 Comment on traite vos données" }].map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{ background: tab === t.id ? C.green : "transparent", color: tab === t.id ? C.navy : C.grayLight, border: `1px solid ${tab === t.id ? C.green : "transparent"}`, borderRadius: "10px 10px 0 0", padding: "9px 16px", fontSize: 13, fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap", marginBottom: -1, transition: "all 0.2s", flexShrink: 0 }}>
              {t.label}
            </button>
          ))}
        </nav>

        <main style={{ paddingTop: 24 }}>
          {tab === "roi" && <TabROI />}
          {tab === "pharmacy" && <TabPharmacy />}
          {tab === "data" && <TabData />}
        </main>
        <div style={{ height: 80 }} />
      </div>

      <button onClick={() => setChatOpen(!chatOpen)} style={{ position: "fixed", bottom: 28, right: 24, width: 52, height: 52, borderRadius: "50%", background: chatOpen ? C.cardBg : C.green, border: `2px solid ${C.green}`, cursor: "pointer", fontSize: 20, display: "flex", alignItems: "center", justifyContent: "center", zIndex: 999, boxShadow: `0 4px 24px ${C.green}44`, transition: "all 0.2s" }}>
        {chatOpen ? "✕" : "🤖"}
      </button>
      {chatOpen && <AIChat onClose={() => setChatOpen(false)} />}
    </div>
  );
}
