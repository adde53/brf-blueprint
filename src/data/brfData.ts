export type RiskLevel = "low" | "medium" | "high";

export interface TechnicalCategory {
  id: string;
  name: string;
  icon: string;
  lastMaintained: number;
  lifespanMin: number;
  lifespanMax: number;
  materialNote?: string;
  risk: RiskLevel;
  age: number;
  remainingYears: number;
  description: string;
  goodAssociationRef: string;
  humor?: string;
}

export interface FinancialData {
  loanPerSqm: number;
  annualFeePerSqm: number;
  maintenanceSavingsPerSqm: number;
  solidarity: number;
  cashFlowAfterOps: number;
  interestRateImpact: number;
  riskLevel: RiskLevel;
  warnings: string[];
  positives: string[];
}

export interface BrfScores {
  technical: number;
  financial: number;
  feeRisk: number;
  total: number;
}

export interface Recommendation {
  type: "warning" | "positive" | "info";
  text: string;
  category: string;
}

export const technicalCategories: TechnicalCategory[] = [
  {
    id: "tak",
    name: "Tak",
    icon: "🏠",
    lastMaintained: 2008,
    lifespanMin: 30,
    lifespanMax: 50,
    risk: "medium",
    age: 2026 - 2008,
    remainingYears: 50 - (2026 - 2008),
    description: "Taket lades om 2008 med betongpannor. Börjar närma sig halvtid – håll koll på eventuella läckor.",
    goodAssociationRef: "Tak bytt senaste 15 år, regelbunden inspektion",
    humor: "Taket håller – men det är som din vinterjacka från 2008, snart dags att uppgradera."
  },
  {
    id: "fasad",
    name: "Fasad",
    icon: "🧱",
    lastMaintained: 1995,
    lifespanMin: 40,
    lifespanMax: 60,
    materialNote: "Puts",
    risk: "high",
    age: 2026 - 1995,
    remainingYears: Math.max(0, 50 - (2026 - 1995)),
    description: "Putsfasad från 1995 – 31 år gammal. Hög risk för renovering inom 5–10 år. Sprickor och fuktskador bör undersökas.",
    goodAssociationRef: "Fasadrenovering senaste 20 år, fuktutredning genomförd",
    humor: "Fasaden har sett bättre dagar. Den var trendig under Brännbollsyran '95, men nu..."
  },
  {
    id: "stammar",
    name: "Stammar (V/A)",
    icon: "🚿",
    lastMaintained: 1972,
    lifespanMin: 40,
    lifespanMax: 60,
    risk: "high",
    age: 2026 - 1972,
    remainingYears: 0,
    description: "Stammarna är från 1972 – 54 år gamla. Ligger över maximal livslängd! Stambyte bör planeras snarast.",
    goodAssociationRef: "Stambyte genomfört senaste 20 år eller planerat inom 5 år",
    humor: "Dessa stammar har sett allt sedan ABBA vann Eurovision. Dags att pensionera dem."
  },
  {
    id: "grund",
    name: "Grund & dränering",
    icon: "🏗️",
    lastMaintained: 2005,
    lifespanMin: 30,
    lifespanMax: 50,
    risk: "medium",
    age: 2026 - 2005,
    remainingYears: 50 - (2026 - 2005),
    description: "Dräneringen gjordes om 2005. Håller sig bra men bör inspekteras regelbundet.",
    goodAssociationRef: "Dränering utförd senaste 20 år, ingen fukt i källare",
    humor: "Grunden står stadigt – precis som din relation med Hemnet."
  },
  {
    id: "ventilation",
    name: "Ventilation",
    icon: "💨",
    lastMaintained: 2015,
    lifespanMin: 20,
    lifespanMax: 30,
    risk: "low",
    age: 2026 - 2015,
    remainingYears: 30 - (2026 - 2015),
    description: "FTX-system installerat 2015. Relativt nytt och i gott skick.",
    goodAssociationRef: "OVK godkänd, system yngre än 15 år",
    humor: "Frisk luft sedan 2015. Andas lugnt – bokstavligen."
  },
  {
    id: "el",
    name: "El-system",
    icon: "⚡",
    lastMaintained: 2010,
    lifespanMin: 40,
    lifespanMax: 60,
    risk: "low",
    age: 2026 - 2010,
    remainingYears: 60 - (2026 - 2010),
    description: "Elsystemet uppgraderades 2010. Moderna jordfelsbrytare och god kapacitet.",
    goodAssociationRef: "Elrevision senaste 15 år, moderna säkringar",
  },
  {
    id: "varme",
    name: "Värmesystem",
    icon: "🔥",
    lastMaintained: 2018,
    lifespanMin: 20,
    lifespanMax: 30,
    risk: "low",
    age: 2026 - 2018,
    remainingYears: 30 - (2026 - 2018),
    description: "Fjärrvärme med injustering 2018. Fungerar effektivt.",
    goodAssociationRef: "Värmesystem yngre än 10 år, energideklaration godkänd",
    humor: "Varmt och skönt – inget kallt krig här."
  },
  {
    id: "hissar",
    name: "Hissar",
    icon: "🛗",
    lastMaintained: 2012,
    lifespanMin: 25,
    lifespanMax: 30,
    risk: "medium",
    age: 2026 - 2012,
    remainingYears: 30 - (2026 - 2012),
    description: "Hissarna renoverades 2012. Börjar närma sig slutet av sin livslängd inom 5–10 år.",
    goodAssociationRef: "Hissrenovering senaste 10 år, säkerhetsbesiktning godkänd",
    humor: "Hissarna fungerar fortfarande – men de tar det lugnt, precis som alla andra i föreningen."
  },
  {
    id: "fonster",
    name: "Fönster",
    icon: "🪟",
    lastMaintained: 2000,
    lifespanMin: 30,
    lifespanMax: 40,
    materialNote: "Trä",
    risk: "high",
    age: 2026 - 2000,
    remainingYears: Math.max(0, 35 - (2026 - 2000)),
    description: "Träfönster från 2000 – 26 år gamla. Närmar sig maximal livslängd. Kontrollera tätning och röta.",
    goodAssociationRef: "Fönsterbyte senaste 15 år eller planerat",
    humor: "Fönstren har utsikt sedan millennieskiftet. De har sett mycket – kanske lite för mycket."
  },
  {
    id: "trapphus",
    name: "Trapphus",
    icon: "🪜",
    lastMaintained: 2019,
    lifespanMin: 20,
    lifespanMax: 30,
    risk: "low",
    age: 2026 - 2019,
    remainingYears: 30 - (2026 - 2019),
    description: "Trapphusen renoverades 2019 med ny belysning och ytskikt. Fint skick.",
    goodAssociationRef: "Renovering senaste 10 år, rent och fräscht",
  },
  {
    id: "portar",
    name: "Portar & låssystem",
    icon: "🚪",
    lastMaintained: 2020,
    lifespanMin: 20,
    lifespanMax: 30,
    risk: "low",
    age: 2026 - 2020,
    remainingYears: 30 - (2026 - 2020),
    description: "Digitalt låssystem installerat 2020. Moderna porttelefoner.",
    goodAssociationRef: "Digitalt system, bytt senaste 5 år",
    humor: "Ingen kommer in oönskad – utom grannens katt."
  },
  {
    id: "kulvertar",
    name: "Kulvertar",
    icon: "🔧",
    lastMaintained: 1985,
    lifespanMin: 30,
    lifespanMax: 50,
    risk: "high",
    age: 2026 - 1985,
    remainingYears: 0,
    description: "Kulvertarna är från 1985 – 41 år. Passerat livslängden och bör inspekteras/bytas.",
    goodAssociationRef: "Kulvertar inspekterade senaste 10 år, inga läckor",
    humor: "Kulvertarna är äldre än de flesta Netflix-serier. Dags för en reboot."
  },
];

export const financialData: FinancialData = {
  loanPerSqm: 6200,
  annualFeePerSqm: 750,
  maintenanceSavingsPerSqm: 120,
  solidarity: 22,
  cashFlowAfterOps: -180000,
  interestRateImpact: 8.5,
  riskLevel: "medium",
  warnings: [
    "Lån per kvm (6 200 kr) ligger över rekommenderat tak på 5 000 kr/kvm",
    "Sparande till underhåll (120 kr/kvm/år) är under rekommenderade 150 kr/kvm/år",
    "Soliditeten (22%) är under rekommenderade 30%",
    "Negativt kassaflöde – föreningen amorterar inte tillräckligt",
    "En ränteökning på 1% skulle öka avgiften med ca 8,5% – märkbar påverkan"
  ],
  positives: [
    "Avgiften (750 kr/kvm/år) ligger inom normalt spann",
    "Föreningen har en underhållsplan som följs"
  ]
};

export const brfScores: BrfScores = {
  technical: 52,
  financial: 38,
  feeRisk: 45,
  total: 45,
};

export const recommendations: Recommendation[] = [
  { type: "warning", text: "Stambyte behövs akut – stammarna är 54 år! Fråga styrelsen om plan och budget.", category: "Stammar" },
  { type: "warning", text: "Kulvertarna har passerat sin livslängd. Inspektion bör ske omgående.", category: "Kulvertar" },
  { type: "warning", text: "Fönstren närmar sig maximal livslängd – kolla tätningslister och beslag.", category: "Fönster" },
  { type: "warning", text: "Fasaden är 31 år gammal. Planera för renovering inom 5–10 år.", category: "Fasad" },
  { type: "warning", text: "Lågt sparande till underhåll – risk för kraftig avgiftshöjning vid renovering.", category: "Ekonomi" },
  { type: "warning", text: "Negativt kassaflöde – föreningen går back varje år.", category: "Ekonomi" },
  { type: "info", text: "Kolla när nästa stambyte är planerat och om det finns budget avsatt!", category: "Stammar" },
  { type: "info", text: "Be om att se underhållsplanen – hur ser prognosen ut för kommande 10 år?", category: "Underhåll" },
  { type: "positive", text: "Ventilationen är modern och i gott skick – bra jobbat!", category: "Ventilation" },
  { type: "positive", text: "Digitalt låssystem och fräscha trapphus – trivselfaktorn är hög.", category: "Trapphus" },
  { type: "positive", text: "Avgiftsnivån är rimlig givet läge och storlek.", category: "Ekonomi" },
  { type: "positive", text: "Värmesystemet är relativt nytt – inga oväntade kostnader där.", category: "Värme" },
];

export function getScoreColor(score: number): string {
  if (score >= 75) return "text-score-excellent";
  if (score >= 60) return "text-score-good";
  if (score >= 45) return "text-score-fair";
  if (score >= 30) return "text-score-poor";
  return "text-score-bad";
}

export function getScoreBgColor(score: number): string {
  if (score >= 75) return "bg-risk-low-bg";
  if (score >= 60) return "bg-risk-low-bg";
  if (score >= 45) return "bg-risk-medium-bg";
  if (score >= 30) return "bg-risk-medium-bg";
  return "bg-risk-high-bg";
}

export function getScoreLabel(score: number): string {
  if (score >= 75) return "Utmärkt";
  if (score >= 60) return "Bra";
  if (score >= 45) return "Godkänt";
  if (score >= 30) return "Ansträngt";
  return "Kritiskt";
}

export function getRiskColor(risk: RiskLevel): string {
  switch (risk) {
    case "low": return "text-risk-low";
    case "medium": return "text-risk-medium";
    case "high": return "text-risk-high";
  }
}

export function getRiskBgColor(risk: RiskLevel): string {
  switch (risk) {
    case "low": return "bg-risk-low-bg";
    case "medium": return "bg-risk-medium-bg";
    case "high": return "bg-risk-high-bg";
  }
}

export function getRiskLabel(risk: RiskLevel): string {
  switch (risk) {
    case "low": return "Låg risk";
    case "medium": return "Medel risk";
    case "high": return "Hög risk";
  }
}

export function getRiskEmoji(risk: RiskLevel): string {
  switch (risk) {
    case "low": return "🟢";
    case "medium": return "🟡";
    case "high": return "🔴";
  }
}
