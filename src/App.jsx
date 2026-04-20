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
  const dim = (id) => (!activeZone || activeZone === id) ? 1 : 0.28;

  const zones = [
    { id: "fournisseurs", x: 0, y: 0, w: 200, h: 500, color: C.blue },
    { id: "reserve", x: 200, y: 0, w: 175, h: 230, color: C.amber },
    { id: "rayonnages", x: 200, y: 230, w: 175, h: 130, color: C.purple },
    { id: "comptoir", x: 375, y: 0, w: 175, h: 370, color: C.green },
    { id: "caisse", x: 550, y: 0, w: 140, h: 370, color: C.coral },
    { id: "backoffice", x: 0, y: 390, w: 870, h: 65, color: C.green },
  ];

  const products = [C.blue, C.green, C.coral, C.amber, C.purple];

  return (
    <svg viewBox="0 0 870 460" style={{ width: "100%", maxWidth: 870, display: "block", margin: "0 auto" }}>
      <defs>
        <marker id="mG" markerWidth="7" markerHeight="7" refX="3.5" refY="3.5" orient="auto">
          <path d="M0,1 L6,3.5 L0,6Z" fill={C.green} />
        </marker>
        <marker id="mB" markerWidth="7" markerHeight="7" refX="3.5" refY="3.5" orient="auto">
          <path d="M0,1 L6,3.5 L0,6Z" fill={C.blue} />
        </marker>
        <marker id="mW" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
          <path d="M0,1 L5,3 L0,5Z" fill="rgba(255,255,255,0.3)" />
        </marker>
      </defs>

      <rect width="870" height="460" fill={C.navy} rx="14" />
      <rect x="0" y="0" width="200" height="460" fill="#080A24" />
      {[[30, 18], [80, 8], [140, 22], [170, 12], [55, 30], [115, 6]].map(([sx, sy], i) => (
        <circle key={i} cx={sx} cy={sy} r={i % 2 === 0 ? 1.2 : 0.8} fill="#C8D0F0" opacity="0.25" />
      ))}
      <rect x="0" y="398" width="200" height="62" fill="#090B1E" />
      <rect x="0" y="400" width="200" height="58" fill="#0C0D22" />
      {[0, 1, 2, 3, 4].map(i => <rect key={i} x={i * 42 + 6} y="426" width="28" height="2.5" fill="#F5C54215" />)}
      <rect x="0" y="398" width="200" height="3" fill="#121430" />

      <g opacity={dim("fournisseurs")}>
        <rect x="12" y="55" width="92" height="220" fill="#102238" stroke="#183250" strokeWidth="1" rx="2" />
        <rect x="8" y="44" width="100" height="16" fill="#16304A" stroke="#1E3A56" strokeWidth="0.5" rx="2" />
        <rect x="80" y="18" width="16" height="36" fill="#0E1C2E" stroke="#162840" strokeWidth="0.5" />
        <ellipse cx="88" cy="15" rx="8" ry="5" fill="#111B2A" opacity="0.7" />
        <ellipse cx="92" cy="8" rx="6" ry="4" fill="#111B2A" opacity="0.5" />
        <ellipse cx="86" cy="3" rx="5" ry="3" fill="#111B2A" opacity="0.3" />
        {[66, 105, 145].map(wy => [18, 52, 86].map((wx, wi) => (
          <g key={`${wy}${wi}`}>
            <rect x={wx} y={wy} width="26" height="20" fill="#08121E" stroke="#1A2E44" strokeWidth="0.5" rx="1" />
            <line x1={wx + 13} y1={wy} x2={wx + 13} y2={wy + 20} stroke="#122030" strokeWidth="0.4" />
            <line x1={wx} y1={wy + 10} x2={wx + 26} y2={wy + 10} stroke="#122030" strokeWidth="0.4" />
            <rect x={wx + 2} y={wy + 2} width="8" height="6" fill="#4A90E208" />
          </g>
        )))}
        <rect x="44" y="192" width="24" height="7" fill={C.green + "44"} stroke={C.green + "66"} strokeWidth="0.5" />
        <rect x="52" y="184" width="8" height="23" fill={C.green + "44"} stroke={C.green + "66"} strokeWidth="0.5" />
        <rect x="12" y="275" width="92" height="90" fill="#0C1A2E" stroke="#142030" strokeWidth="0.5" />
        <rect x="32" y="284" width="52" height="70" fill="#081018" stroke="#1A2A3C" strokeWidth="0.5" rx="1" />
        <line x1="58" y1="284" x2="58" y2="354" stroke="#101828" strokeWidth="0.4" />
        {[[14, 320, 22, 18], [40, 320, 22, 18], [66, 320, 22, 18], [14, 304, 20, 18], [38, 304, 20, 18]].map(([bx, by, bw, bh], i) => (
          <rect key={i} x={bx} y={by} width={bw} height={bh} fill={C.amber + "1A"} stroke={C.amber + "44"} strokeWidth="0.5" rx="1" />
        ))}
        <circle cx="90" cy="322" r="7" fill="#C8924A22" />
        <rect x="85" y="329" width="10" height="20" fill="#2A4A6A1A" />
        <text x="58" y="372" textAnchor="middle" fill={C.blue} fontSize="8.5" fontWeight="700" letterSpacing="0.3">LABORATOIRES</text>
        <text x="58" y="383" textAnchor="middle" fill={C.gray} fontSize="7.5">& GROSSISTES</text>
      </g>

      <g opacity={dim("fournisseurs")}>
        <rect x="14" y="412" width="82" height="46" fill="#1A2E4A" stroke="#22385A" strokeWidth="1" rx="3" />
        <rect x="26" y="420" width="56" height="28" fill="#0C1420" stroke="#182840" strokeWidth="0.5" rx="2" />
        <rect x="28" y="422" width="18" height="10" fill="#4A90E20C" rx="1" />
        <rect x="18" y="444" width="10" height="7" fill="#F5C54230" rx="1" />
        <rect x="10" y="424" width="7" height="11" fill="#101E2E" stroke="#182430" strokeWidth="0.5" rx="1" />
        <rect x="92" y="420" width="96" height="38" fill="#12243A" stroke="#1A2E48" strokeWidth="1" rx="2" />
        <rect x="96" y="424" width="88" height="30" fill="#0C1A28" rx="1" />
        <rect x="96" y="448" width="88" height="5" fill="#00C89612" />
        {[42, 82, 140, 176].map(wx => (
          <g key={wx}>
            <circle cx={wx} cy="458" r="10" fill="#070919" stroke="#141828" strokeWidth="1.5" />
            <circle cx={wx} cy="458" r="5" fill="#0E1226" />
            <circle cx={wx} cy="458" r="2" fill="#070919" />
          </g>
        ))}
        {[430, 438, 446].map(ly => (
          <line key={ly} x1="10" y1={ly} x2="2" y2={ly} stroke={C.blue + "28"} strokeWidth="1.5" />
        ))}
        <path d="M190 390 Q210 350 220 280" stroke={C.blue + "66"} strokeWidth="1.5" fill="none" strokeDasharray="6 4" markerEnd="url(#mB)" />
      </g>

      <rect x="200" y="0" width="670" height="28" fill="#141650" stroke={C.cardBorder} strokeWidth="1" />
      <rect x="207" y="7" width="12" height="4" fill={C.green + "77"} />
      <rect x="211" y="3" width="4" height="12" fill={C.green + "77"} />
      <text x="485" y="19" textAnchor="middle" fill={C.green} fontSize="11" fontWeight="700" letterSpacing="3">P H A R M A C I E</text>
      <rect x="200" y="28" width="470" height="5" fill="#0D1038" />
      <rect x="200" y="370" width="470" height="10" fill="#101240" />

      <rect x="200" y="33" width="175" height="345" fill="#0A0C28" />
      <rect x="206" y="38" width="5" height="332" fill="#181E50" />
      <rect x="250" y="38" width="5" height="332" fill="#181E50" />
      {[52, 90, 128, 166, 204, 242, 280, 318].map(sy => (
        <rect key={sy} x="206" y={sy} width="49" height="4" fill="#1E2660" />
      ))}
      <g opacity={dim("reserve")}>
        {[[56, [0, 1, 2]], [94, [2, 0, 1]], [132, [1, 2, 0]], [170, [0, 2, 1]], [208, [2, 1, 0]]].map(([sy, ci]) => (
          ci.map((c, i) => (
            <rect key={`A${sy}${i}`} x={208 + i * 14} y={sy} width="12" height="34"
              fill={products[c] + "2E"} stroke={products[c] + "55"} strokeWidth="0.5" rx="1" />
          ))
        ))}
      </g>
      <g opacity={dim("rayonnages")}>
        {[[246, [1, 0, 2]], [284, [2, 1, 0]]].map(([sy, ci]) => (
          ci.map((c, i) => (
            <rect key={`Ar${sy}${i}`} x={208 + i * 14} y={sy} width="12" height="34"
              fill={products[c] + "2E"} stroke={products[c] + "55"} strokeWidth="0.5" rx="1" />
          ))
        ))}
        <rect x="208" y="324" width="46" height="36" fill="#10203A" stroke="#183050" strokeWidth="0.5" rx="2" />
        <rect x="212" y="328" width="38" height="28" fill="#091420" rx="1" />
        <text x="231" y="346" textAnchor="middle" fill="#4A90E240" fontSize="12">❄</text>
      </g>

      <rect x="260" y="38" width="5" height="332" fill="#181E50" />
      <rect x="310" y="38" width="5" height="332" fill="#181E50" />
      {[52, 90, 128, 166, 204, 242, 280, 318].map(sy => (
        <rect key={sy} x="260" y={sy} width="55" height="4" fill="#1E2660" />
      ))}
      <g opacity={dim("reserve")}>
        {[[56, [1, 2, 0, 3]], [94, [3, 0, 2, 1]], [132, [0, 3, 1, 2]], [170, [2, 1, 3, 0]], [208, [1, 0, 3, 2]]].map(([sy, ci]) => (
          ci.map((c, i) => (
            <rect key={`B${sy}${i}`} x={262 + i * 12} y={sy} width="10" height="34"
              fill={products[c] + "2E"} stroke={products[c] + "55"} strokeWidth="0.5" rx="1" />
          ))
        ))}
      </g>
      <g opacity={dim("rayonnages")}>
        {[[246, [0, 3, 1, 2]], [284, [3, 2, 0, 1]]].map(([sy, ci]) => (
          ci.map((c, i) => (
            <rect key={`Br${sy}${i}`} x={262 + i * 12} y={sy} width="10" height="34"
              fill={products[c] + "2E"} stroke={products[c] + "55"} strokeWidth="0.5" rx="1" />
          ))
        ))}
        <rect x="262" y="324" width="46" height="36" fill="#0E1C30" stroke="#162840" strokeWidth="0.5" rx="2" />
        <text x="285" y="347" textAnchor="middle" fill={C.amber + "55"} fontSize="9" fontWeight="600">OTC</text>
      </g>

      <rect x="320" y="38" width="5" height="332" fill="#181E50" />
      <rect x="366" y="38" width="5" height="332" fill="#181E50" />
      {[52, 90, 128, 166, 204].map(sy => (
        <rect key={sy} x="320" y={sy} width="51" height="4" fill="#1E2660" />
      ))}
      <g opacity={dim("reserve")}>
        {[[56, [2, 0, 1]], [94, [0, 1, 2]], [132, [1, 2, 0]], [170, [2, 0, 1]]].map(([sy, ci]) => (
          ci.map((c, i) => (
            <rect key={`C${sy}${i}`} x={322 + i * 14} y={sy} width="12" height="34"
              fill={products[c] + "2E"} stroke={products[c] + "55"} strokeWidth="0.5" rx="1" />
          ))
        ))}
      </g>
      <g opacity={dim("rayonnages")}>
        <rect x="320" y="210" width="51" height="158" fill="#0E1A32" stroke="#162240" strokeWidth="0.5" rx="2" />
        <rect x="324" y="214" width="43" height="150" fill="#09111E" rx="1" />
        <text x="345" y="284" textAnchor="middle" fill="#4A90E240" fontSize="14">❄</text>
        <text x="345" y="298" textAnchor="middle" fill="#4A90E230" fontSize="7">Thermosensible</text>
      </g>

      <rect x="372" y="28" width="5" height="352" fill="#1E2660" />

      <g opacity={dim("comptoir")}>
        <rect x="377" y="33" width="172" height="345" fill="#090B28" />
        <rect x="394" y="33" width="62" height="3" fill="#F5C54218" />
        <rect x="470" y="33" width="62" height="3" fill="#F5C54218" />
        <ellipse cx="425" cy="37" rx="26" ry="5" fill="#F5C54210" />
        <ellipse cx="501" cy="37" rx="26" ry="5" fill="#F5C54210" />
        <rect x="420" y="138" width="72" height="56" fill="#0A1220" stroke="#1A2848" strokeWidth="1" rx="3" />
        <rect x="424" y="142" width="64" height="44" fill="#06101C" rx="2" />
        <rect x="426" y="145" width="30" height="9" fill="#00C89618" rx="1" />
        <rect x="458" y="145" width="28" height="5" fill="#4A90E215" rx="1" />
        <rect x="458" y="152" width="22" height="4" fill="#4A90E210" rx="1" />
        {[[0, 9], [1, 14], [2, 7], [3, 12], [4, 10]].map(([i, h]) => (
          <rect key={i} x={426 + i * 12} y={185 - h} width="9" height={h} fill={products[i % 5] + "55"} rx="1" />
        ))}
        <rect x="453" y="194" width="6" height="8" fill="#162048" />
        <rect x="444" y="201" width="24" height="3" fill="#162048" />
        <rect x="424" y="205" width="68" height="12" fill="#101630" stroke="#182040" strokeWidth="0.5" rx="2" />
        {[0, 1, 2].map(row => [0, 1, 2, 3, 4, 5, 6, 7, 8].map(col => (
          <rect key={`${row}${col}`} x={426 + col * 7} y={207 + row * 3.5} width="5.5" height="2.5" fill="#192040" rx="0.5" />
        )))}
        <rect x="382" y="220" width="160" height="12" fill="#16204C" />
        <rect x="382" y="232" width="160" height="5" fill="#101538" />
        <rect x="497" y="206" width="22" height="14" fill={C.green + "22"} stroke={C.green + "44"} strokeWidth="0.5" rx="2" />
        <rect x="521" y="208" width="16" height="12" fill={C.amber + "22"} stroke={C.amber + "44"} strokeWidth="0.5" rx="2" />
        <rect x="382" y="295" width="160" height="75" fill="#080A20" />
        {[0, 1, 2].map(i => (
          <g key={i}>
            <rect x={384 + i * 52} y="303" width="48" height="28" fill="#0D1232" stroke="#162040" strokeWidth="0.5" rx="2" />
            <circle cx={408 + i * 52} cy="317" r="3" fill="#1A2260" />
          </g>
        ))}
        <circle cx="422" cy="115" r="20" fill="#C48850" />
        <ellipse cx="422" cy="98" rx="20" ry="12" fill="#2E1808" />
        <ellipse cx="441" cy="116" rx="4" ry="5" fill="#B47840" />
        <ellipse cx="403" cy="116" rx="4" ry="5" fill="#B47840" />
        <circle cx="416" cy="114" r="2.5" fill="#4A2808" opacity="0.7" />
        <circle cx="428" cy="114" r="2.5" fill="#4A2808" opacity="0.7" />
        <path d="M417 123 Q422 127 427 123" fill="none" stroke="#6A3818" strokeWidth="1" opacity="0.6" />
        <rect x="403" y="135" width="38" height="88" fill="#E8EEF8" rx="5" />
        <path d="M410,135 L422,148 L434,135" fill="#D5DCF0" stroke="#C0C8E0" strokeWidth="0.5" />
        {[144, 158, 172, 186].map(by => (
          <circle key={by} cx="422" cy={by} r="1.5" fill="#9AA4C0" />
        ))}
        <rect x="405" y="170" width="14" height="18" fill="none" stroke="#C0C8E0" strokeWidth="0.5" rx="1" />
        <rect x="408" y="168" width="2" height="10" fill="#4A90E255" rx="1" />
        <rect x="384" y="135" width="21" height="88" fill="#E8EEF8" rx="7" />
        <ellipse cx="394" cy="226" rx="12" ry="7" fill="#C48850" />
        <rect x="437" y="135" width="21" height="88" fill="#E8EEF8" rx="7" />
        <ellipse cx="448" cy="226" rx="12" ry="7" fill="#C48850" />
        <path d="M410,140 Q396,160 394,178" fill="none" stroke="#9A9A9A" strokeWidth="1.5" />
        <circle cx="393" cy="181" r="5" fill="none" stroke="#9A9A9A" strokeWidth="1.5" />
      </g>

      <rect x="377" y="255" width="313" height="26" fill="#006B5A" />
      <rect x="377" y="255" width="313" height="5" fill="#007B6A" />
      <rect x="377" y="276" width="313" height="5" fill="#004A3A" />
      <rect x="460" y="244" width="28" height="13" fill={C.green + "30"} stroke={C.green + "55"} strokeWidth="0.5" rx="2" />
      <rect x="491" y="246" width="18" height="11" fill={C.amber + "28"} stroke={C.amber + "50"} strokeWidth="0.5" rx="2" />
      <rect x="555" y="244" width="22" height="13" fill={C.coral + "22"} stroke={C.coral + "44"} strokeWidth="0.5" rx="2" />

      <rect x="547" y="28" width="5" height="352" fill="#1E2660" />

      <g opacity={dim("caisse")}>
        <rect x="552" y="33" width="138" height="345" fill="#09092A" />
        <rect x="570" y="33" width="54" height="3" fill="#F5C54215" />
        <ellipse cx="597" cy="37" rx="22" ry="5" fill="#F5C54208" />
        <circle cx="588" cy="152" r="18" fill="#D4A090" />
        <ellipse cx="588" cy="136" rx="18" ry="11" fill="#160A04" />
        <ellipse cx="605" cy="153" rx="3.5" ry="4.5" fill="#C49080" />
        <circle cx="583" cy="151" r="2" fill="#5A2810" opacity="0.5" />
        <circle cx="593" cy="151" r="2" fill="#5A2810" opacity="0.5" />
        <path d="M584 160 Q588 164 592 160" fill="none" stroke="#7A3820" strokeWidth="1" opacity="0.5" />
        <rect x="571" y="170" width="34" height="58" fill="#FF7B5440" stroke="#FF7B5460" strokeWidth="0.5" rx="4" />
        <rect x="580" y="168" width="16" height="9" fill="#D4A090" />
        <rect x="554" y="170" width="19" height="46" fill="#FF7B5438" stroke="#FF7B5455" strokeWidth="0.5" rx="5" />
        <ellipse cx="562" cy="218" rx="10" ry="6" fill="#D4A090" />
        <rect x="601" y="170" width="19" height="46" fill="#FF7B5438" stroke="#FF7B5455" strokeWidth="0.5" rx="5" />
        <ellipse cx="611" cy="218" rx="10" ry="6" fill="#D4A090" />
        <rect x="573" y="227" width="14" height="48" fill="#FF7B5430" rx="5" />
        <rect x="591" y="227" width="14" height="48" fill="#FF7B5430" rx="5" />
        <rect x="557" y="238" width="28" height="22" fill="#00C89622" stroke="#00C89644" strokeWidth="0.5" rx="2" />
        <path d="M561 238 Q571 232 581 238" fill="none" stroke="#00C89666" strokeWidth="1.5" />
        <text x="571" y="252" textAnchor="middle" fill={C.green + "88"} fontSize="10">✚</text>
        <rect x="618" y="226" width="58" height="38" fill="#0E1C36" stroke="#182E50" strokeWidth="1" rx="3" />
        <rect x="622" y="230" width="50" height="18" fill="#08121E" stroke="#162840" strokeWidth="0.5" rx="2" />
        <rect x="624" y="232" width="46" height="14" fill="#00C89610" rx="1" />
        <text x="647" y="242" textAnchor="middle" fill={C.green + "77"} fontSize="7.5" fontWeight="600">€ 24.50</text>
        <rect x="622" y="250" width="50" height="8" fill="#0A1428" rx="1" />
        {[0, 1, 2, 3, 4].map(i => (
          <rect key={i} x={624 + i * 9} y="252" width="7" height="5" fill="#121E38" stroke="#1A2848" strokeWidth="0.3" rx="1" />
        ))}
        <rect x="622" y="260" width="50" height="3" fill="#06101C" rx="1" />
        <rect x="632" y="256" width="14" height="16" fill="#E8EEF822" rx="1" />
      </g>

      <rect x="690" y="0" width="180" height="380" fill="#101830" />
      <rect x="698" y="35" width="68" height="272" fill="#0A1224" stroke="#1A2E4A" strokeWidth="0.5" rx="2" />
      <rect x="774" y="35" width="68" height="272" fill="#0A1224" stroke="#1A2E4A" strokeWidth="0.5" rx="2" />
      <rect x="700" y="39" width="14" height="264" fill="#4A90E206" />
      <rect x="776" y="39" width="14" height="264" fill="#4A90E206" />
      <rect x="712" y="160" width="50" height="148" fill="#060E1C" stroke="#162438" strokeWidth="1" />
      <line x1="737" y1="160" x2="737" y2="308" stroke="#101E2E" strokeWidth="0.5" />
      <rect x="755" y="228" width="4" height="22" fill="#1E3050" rx="1" />
      <rect x="720" y="96" width="34" height="9" fill={C.green + "44"} stroke={C.green + "66"} strokeWidth="0.5" />
      <rect x="731" y="85" width="12" height="31" fill={C.green + "44"} stroke={C.green + "66"} strokeWidth="0.5" />
      <text x="737" y="116" textAnchor="middle" fill={C.green + "99"} fontSize="15" fontWeight="700">✚</text>
      <text x="850" y="96" textAnchor="middle" fill={C.green + "55"} fontSize="9" fontWeight="700" transform="rotate(90 850 200)">PHARMACIE</text>

      <circle cx="752" cy="188" r="15" fill="#B09480" />
      <ellipse cx="752" cy="174" rx="15" ry="9" fill="#2A1A0A" />
      <ellipse cx="766" cy="189" rx="3.5" ry="4" fill="#A08470" />
      <rect x="740" y="203" width="26" height="50" fill="#9B72CF33" stroke="#9B72CF50" strokeWidth="0.5" rx="4" />
      <rect x="752" y="201" width="14" height="8" fill="#B09480" />
      <rect x="728" y="203" width="14" height="42" fill="#9B72CF2A" rx="4" />
      <rect x="764" y="207" width="14" height="38" fill="#9B72CF2A" rx="4" />
      <rect x="766" y="228" width="16" height="18" fill="#4A90E222" stroke="#4A90E244" strokeWidth="0.5" rx="2" />
      <path d="M768 228 Q774 222 782 228" fill="none" stroke="#4A90E255" strokeWidth="1.2" />
      <rect x="740" y="252" width="11" height="24" fill="#9B72CF20" rx="4" />
      <rect x="757" y="256" width="11" height="20" fill="#9B72CF20" rx="4" />

      <rect x="200" y="390" width="490" height="65" fill="#080922" />
      <rect x="4" y="390" width="862" height="65" fill="#080922" />
      {[218, 306, 394, 482, 570, 658].map((dx, di) => (
        <g key={di}>
          <rect x={dx} y="400" width="56" height="36" fill="#0D1032" stroke="#161840" strokeWidth="0.5" rx="3" />
          <rect x={dx + 3} y="404" width="50" height="20" fill="#09101E" rx="1" />
          {[0, 1, 2, 3].map(bi => (
            <rect key={bi} x={dx + 5 + bi * 11} y={422 - [5, 9, 4, 7, 6, 10][bi % 6]}
              width="9" height={[5, 9, 4, 7, 6, 10][bi % 6]}
              fill={products[bi % 5] + "50"} rx="1" />
          ))}
          <rect x={dx} y="436" width="56" height="4" fill="#0D1032" rx="2" />
        </g>
      ))}
      <text x="440" y="414" textAnchor="middle" fill={C.green} fontSize="9.5" fontWeight="700" letterSpacing="0.8">🧠 DATATOPIA DASHBOARD</text>
      <text x="440" y="428" textAnchor="middle" fill={C.gray} fontSize="7.5" letterSpacing="0.3">Intelligence • Alertes • Recommandations IA • Rapports automatiques</text>
      {[288, 462, 622].map(ax => (
        <path key={ax} d={`M${ax} 383 L${ax} 391`}
          stroke={C.green} strokeWidth="1.5" strokeDasharray="4 3" markerEnd="url(#mG)" opacity="0.6" />
      ))}
      <text x="440" y="450" textAnchor="middle" fill={C.green + "40"} fontSize="7.5">↑ toutes les données remontent automatiquement vers le dashboard Datatopia ↑</text>

      {zones.map(z => {
        const isActive = activeZone === z.id;
        const isHov = hovered === z.id;
        return (
          <g key={z.id} onClick={() => onZoneClick(z.id)}
            onMouseEnter={() => setHovered(z.id)}
            onMouseLeave={() => setHovered(null)}
            style={{ cursor: "pointer" }}>
            <rect x={z.x} y={z.y} width={z.w} height={z.h}
              fill={isActive ? z.color + "25" : isHov ? z.color + "12" : "transparent"}
              stroke={isActive ? z.color : isHov ? z.color + "77" : z.color + "28"}
              strokeWidth={isActive ? 2 : 1} rx={z.id === "backoffice" ? 0 : 8} />
            {isActive && (
              <rect x={z.x + 2} y={z.y + 2} width={z.w - 4} height={z.h - 4}
                fill="none" stroke={z.color} strokeWidth="1" rx="6" opacity="0.25" />
            )}
          </g>
        );
      })}

      {zones.map(z => {
        const ZD = ZONES.find(zz => zz.id === z.id);
        if (!ZD) return null;
        const dark = z.id === "reserve" || z.id === "backoffice";
        const badgeX = z.id === "backoffice" ? z.x + z.w - 42 : z.x + z.w - 40;
        const badgeY = z.id === "backoffice" ? z.y + 5 : z.y + 6;
        return (
          <g key={z.id + "_l"} style={{ pointerEvents: "none" }}>
            <rect x={badgeX} y={badgeY} width="36" height="15" fill={z.color} rx="7" />
            <text x={badgeX + 18} y={badgeY + 11} textAnchor="middle"
              fill={dark ? C.navy : C.white} fontSize="8.5" fontWeight="700">
              {ZD.prs.length} PRs
            </text>
            <text x={z.x + 13} y={z.y + 20} textAnchor="middle" fontSize="13">{ZD.emoji}</text>
          </g>
        );
      })}
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
  const [active, setActive] = useState(null);
  const layers = [
    { id: "lgo", icon: "🏥", label: "Votre LGO / Logiciel de caisse", color: C.blue, desc: "Votre logiciel officinal (PHARMAofficine, Winpharma, Lgpi, Caduciel…) génère des données à chaque action. Datatopia s'y connecte via un connecteur sécurisé ou une extraction automatique." },
    { id: "bronze", icon: "📥", label: "Collecte brute (Bronze)", color: "#CD7F32", desc: "Les données arrivent telles quelles dans notre couche Bronze. Rien n'est perdu, tout est horodaté et auditable. C'est votre archive immuable — en cas de besoin, on peut tout retracer." },
    { id: "silver", icon: "🔧", label: "Nettoyage & standardisation (Silver)", color: "#A8A9AD", desc: "Un agent IA nettoie, déduplique et standardise vos données. Produits mal orthographiés, codes EAN manquants, prix aberrants… tout est corrigé automatiquement. Vos données deviennent fiables." },
    { id: "gold", icon: "✨", label: "Intelligence business (Gold)", color: "#FFD700", desc: "La couche Gold contient vos KPIs calculés : marges réelles, stock critique, panier moyen, tendances. C'est ici que l'IA opère pour générer vos recommandations personnalisées." },
    { id: "dash", icon: "📱", label: "Votre dashboard Datatopia", color: C.green, desc: "Tout remonte dans votre interface datatopia.care. Tableaux de bord, alertes intelligentes, rapports PDF, recommandations IA. Accessible sur tous vos appareils, en temps réel." },
  ];
  return (
    <div style={{ paddingBottom: 40 }}>
      <div style={{ textAlign: "center", marginBottom: 24 }}>
        <h2 style={{ fontSize: 24, fontWeight: 700, color: C.white, fontFamily: "Georgia,serif", margin: "0 0 6px" }}>Vos données : comment ça marche ?</h2>
        <p style={{ color: C.gray, fontSize: 13, margin: 0 }}>Simple, sécurisé, automatique. Cliquez sur chaque étape pour en savoir plus.</p>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
        {layers.map((l, i) => (
          <div key={l.id}>
            <div onClick={() => setActive(active === l.id ? null : l.id)} style={{ display: "flex", alignItems: "center", gap: 14, background: active === l.id ? l.color + "18" : C.cardBg, border: `1px solid ${active === l.id ? l.color : C.cardBorder}`, borderRadius: active === l.id ? "12px 12px 0 0" : "12px", padding: "14px 20px", cursor: "pointer", transition: "all 0.2s" }}>
              <div style={{ width: 40, height: 40, borderRadius: "50%", background: l.color + "20", border: `1.5px solid ${l.color}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>{l.icon}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: active === l.id ? l.color : C.white }}>{l.label}</div>
                <div style={{ fontSize: 11, color: C.gray, marginTop: 2 }}>Étape {i + 1} sur 5</div>
              </div>
              <span style={{ color: C.gray, fontSize: 13 }}>{active === l.id ? "▲" : "▼"}</span>
            </div>
            {active === l.id && (
              <div style={{ background: l.color + "0D", border: `1px solid ${l.color}33`, borderTop: "none", borderRadius: "0 0 12px 12px", padding: "14px 20px" }}>
                <p style={{ color: C.grayLight, fontSize: 13, lineHeight: 1.7, margin: 0 }}>{l.desc}</p>
              </div>
            )}
            {i < layers.length - 1 && <div style={{ textAlign: "center", color: C.green, fontSize: 15, margin: "2px 0", opacity: 0.7 }}>↓</div>}
          </div>
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(175px,1fr))", gap: 12, marginTop: 22 }}>
        {[
          { icon: "🔐", t: "Azure Key Vault", d: "Vos credentials ne sont jamais stockés en clair." },
          { icon: "🛡️", t: "RGPD compliant", d: "Données hébergées en Europe. Souveraineté totale." },
          { icon: "🔄", t: "Sync automatique", d: "Mise à jour quotidienne ou temps réel selon votre plan." },
          { icon: "🔌", t: "Compatible tous LGOs", d: "Connecteurs pour tous les logiciels du marché belge et français." },
        ].map((item, i) => (
          <div key={i} style={{ background: C.cardBg, border: `1px solid ${C.cardBorder}`, borderRadius: 12, padding: 16 }}>
            <div style={{ fontSize: 20, marginBottom: 8 }}>{item.icon}</div>
            <div style={{ fontSize: 13, fontWeight: 600, color: C.white, marginBottom: 4 }}>{item.t}</div>
            <div style={{ fontSize: 12, color: C.grayLight, lineHeight: 1.5 }}>{item.d}</div>
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
        "Abonnement Starter : 99€/mois HT. Soit €1 188 / an.",
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
          <div style={{ fontSize: 22, fontWeight: 700, color: C.white }}>€1 188<span style={{ fontSize: 13, color: C.gray, fontWeight: 400 }}> / an</span></div>
          <div style={{ fontSize: 11, color: C.green, marginTop: 2 }}>→ ROI estimé × 20 à × 40</div>
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
          <div style={{ fontSize: 13, color: C.grayLight }}>Essai gratuit 14 jours. Aucune carte bancaire. Opérationnel en 5 minutes.</div>
        </div>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <a href="https://datatopia.care" target="_blank" rel="noopener noreferrer" style={{ background: C.green, color: C.navy, border: "none", borderRadius: 10, padding: "11px 22px", fontSize: 13, fontWeight: 700, cursor: "pointer", textDecoration: "none", display: "inline-block" }}>Démarrer l'essai gratuit →</a>
          <button style={{ background: "transparent", color: C.grayLight, border: `1px solid ${C.cardBorder}`, borderRadius: 10, padding: "11px 22px", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>Calculer mon ROI 🤖</button>
        </div>
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
