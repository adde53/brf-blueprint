export interface BrfAssociation {
  name: string;
  address?: string;
  buildYear?: number;
  apartments?: number;
  totalArea?: number;
  fiscalYear?: string;
}

export interface BrfFinancial {
  totalLoans?: number;
  loanPerSqm?: number;
  totalFees?: number;
  feePerSqmYear?: number;
  maintenanceSavings?: number;
  savingsPerSqmYear?: number;
  solidarity?: number;
  result?: number;
  interestCosts?: number;
  equity?: number;
  totalAssets?: number;
}

export type ComponentStatus = "good" | "warning" | "critical";

export interface BrfTechnicalItem {
  category: string;
  name: string;
  status: ComponentStatus;
  lastMaintained?: number;
  plannedYear?: number;
  materialType?: string;
  notes?: string;
}

export type OverallAssessment = "excellent" | "good" | "normal" | "strained" | "critical";

export interface BrfAnalysisResult {
  association: BrfAssociation;
  financial: BrfFinancial;
  technical: BrfTechnicalItem[];
  overallAssessment: OverallAssessment;
  assessmentReason: string;
  risks?: string[];
  positives?: string[];
  summary: string;
}

// Status colors and labels
export function getStatusColor(status: ComponentStatus): string {
  switch (status) {
    case "good": return "text-risk-low";
    case "warning": return "text-risk-medium";
    case "critical": return "text-risk-high";
  }
}

export function getStatusBgColor(status: ComponentStatus): string {
  switch (status) {
    case "good": return "bg-risk-low-bg";
    case "warning": return "bg-risk-medium-bg";
    case "critical": return "bg-risk-high-bg";
  }
}

export function getStatusEmoji(status: ComponentStatus): string {
  switch (status) {
    case "good": return "🟢";
    case "warning": return "🟡";
    case "critical": return "🔴";
  }
}

export function getStatusLabel(status: ComponentStatus): string {
  switch (status) {
    case "good": return "Bra skick";
    case "warning": return "Behöver uppmärksamhet";
    case "critical": return "Akut åtgärd behövs";
  }
}

// Overall assessment colors and labels
export function getAssessmentColor(assessment: OverallAssessment): string {
  switch (assessment) {
    case "excellent": return "text-risk-low";
    case "good": return "text-risk-low";
    case "normal": return "text-risk-medium";
    case "strained": return "text-risk-medium";
    case "critical": return "text-risk-high";
  }
}

export function getAssessmentBgColor(assessment: OverallAssessment): string {
  switch (assessment) {
    case "excellent": return "bg-risk-low-bg";
    case "good": return "bg-risk-low-bg";
    case "normal": return "bg-risk-medium-bg";
    case "strained": return "bg-risk-medium-bg";
    case "critical": return "bg-risk-high-bg";
  }
}

export function getAssessmentEmoji(assessment: OverallAssessment): string {
  switch (assessment) {
    case "excellent": return "🌟";
    case "good": return "🟢";
    case "normal": return "🟡";
    case "strained": return "🟠";
    case "critical": return "🔴";
  }
}

export function getAssessmentLabel(assessment: OverallAssessment): string {
  switch (assessment) {
    case "excellent": return "Utmärkt förening";
    case "good": return "Bra förening";
    case "normal": return "Normal förening";
    case "strained": return "Ansträngd förening";
    case "critical": return "Kritiskt läge";
  }
}

// Category names and icons
export const categoryNames: Record<string, string> = {
  tak: "Tak",
  fasad: "Fasad",
  stammar: "Stammar & rör",
  grund: "Grund & dränering",
  ventilation: "Ventilation",
  el: "El-system",
  varme: "Värmesystem",
  hissar: "Hissar",
  fonster: "Fönster",
  trapphus: "Trapphus",
  portar: "Portar & lås",
  tvattstuga: "Tvättstuga",
  garage: "Garage & parkering",
  ovrigt: "Övrigt"
};

export const categoryIcons: Record<string, string> = {
  tak: "🏠",
  fasad: "🧱",
  stammar: "🚿",
  grund: "🏗️",
  ventilation: "💨",
  el: "⚡",
  varme: "🔥",
  hissar: "🛗",
  fonster: "🪟",
  trapphus: "🪜",
  portar: "🚪",
  tvattstuga: "🧺",
  garage: "🚗",
  ovrigt: "📋"
};

// Financial risk assessment
export function getFinancialStatus(financial: BrfFinancial): ComponentStatus {
  let riskScore = 0;
  
  if (financial.loanPerSqm && financial.loanPerSqm > 7000) riskScore += 2;
  else if (financial.loanPerSqm && financial.loanPerSqm > 5000) riskScore += 1;
  
  if (financial.savingsPerSqmYear && financial.savingsPerSqmYear < 100) riskScore += 2;
  else if (financial.savingsPerSqmYear && financial.savingsPerSqmYear < 150) riskScore += 1;
  
  if (financial.solidarity && financial.solidarity < 20) riskScore += 2;
  else if (financial.solidarity && financial.solidarity < 30) riskScore += 1;
  
  if (riskScore >= 4) return "critical";
  if (riskScore >= 2) return "warning";
  return "good";
}
