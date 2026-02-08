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

export interface BrfTechnicalItem {
  category: string;
  name: string;
  lastMaintained?: number;
  plannedYear?: number;
  materialType?: string;
  notes?: string;
}

export interface BrfAnalysisResult {
  association: BrfAssociation;
  financial: BrfFinancial;
  technical: BrfTechnicalItem[];
  risks?: string[];
  positives?: string[];
  summary: string;
}

export type RiskLevel = "low" | "medium" | "high";

export function calculateRiskLevel(category: string, lastMaintained?: number): RiskLevel {
  if (!lastMaintained) return "medium";
  
  const currentYear = new Date().getFullYear();
  const age = currentYear - lastMaintained;
  
  const lifespans: Record<string, { warn: number; critical: number }> = {
    tak: { warn: 25, critical: 40 },
    fasad: { warn: 30, critical: 50 },
    stammar: { warn: 35, critical: 50 },
    grund: { warn: 30, critical: 45 },
    ventilation: { warn: 15, critical: 25 },
    el: { warn: 30, critical: 50 },
    varme: { warn: 15, critical: 25 },
    hissar: { warn: 20, critical: 28 },
    fonster: { warn: 25, critical: 35 },
    trapphus: { warn: 15, critical: 25 },
    portar: { warn: 15, critical: 25 },
    kulvertar: { warn: 30, critical: 45 },
  };

  const lifespan = lifespans[category] || { warn: 20, critical: 35 };
  
  if (age >= lifespan.critical) return "high";
  if (age >= lifespan.warn) return "medium";
  return "low";
}

export function calculateFinancialRisk(financial: BrfFinancial): RiskLevel {
  let riskScore = 0;
  
  if (financial.loanPerSqm && financial.loanPerSqm > 7000) riskScore += 2;
  else if (financial.loanPerSqm && financial.loanPerSqm > 5000) riskScore += 1;
  
  if (financial.savingsPerSqmYear && financial.savingsPerSqmYear < 100) riskScore += 2;
  else if (financial.savingsPerSqmYear && financial.savingsPerSqmYear < 150) riskScore += 1;
  
  if (financial.solidarity && financial.solidarity < 20) riskScore += 2;
  else if (financial.solidarity && financial.solidarity < 30) riskScore += 1;
  
  if (riskScore >= 4) return "high";
  if (riskScore >= 2) return "medium";
  return "low";
}

export function calculateScores(analysis: BrfAnalysisResult): {
  technical: number;
  financial: number;
  feeRisk: number;
  total: number;
} {
  // Technical score
  let techScore = 70;
  analysis.technical.forEach(item => {
    const risk = calculateRiskLevel(item.category, item.lastMaintained);
    if (risk === "high") techScore -= 8;
    else if (risk === "medium") techScore -= 3;
  });
  techScore = Math.max(0, Math.min(100, techScore));

  // Financial score
  let finScore = 70;
  const fin = analysis.financial;
  if (fin.loanPerSqm) {
    if (fin.loanPerSqm > 7000) finScore -= 20;
    else if (fin.loanPerSqm > 5000) finScore -= 10;
    else if (fin.loanPerSqm < 3000) finScore += 10;
  }
  if (fin.savingsPerSqmYear) {
    if (fin.savingsPerSqmYear < 100) finScore -= 15;
    else if (fin.savingsPerSqmYear < 150) finScore -= 8;
    else if (fin.savingsPerSqmYear > 200) finScore += 10;
  }
  if (fin.solidarity) {
    if (fin.solidarity < 20) finScore -= 15;
    else if (fin.solidarity < 30) finScore -= 8;
    else if (fin.solidarity > 40) finScore += 10;
  }
  finScore = Math.max(0, Math.min(100, finScore));

  // Fee risk score (inverted - lower is higher risk)
  let feeRisk = 60;
  if (fin.loanPerSqm && fin.loanPerSqm > 5000) feeRisk -= 15;
  if (fin.savingsPerSqmYear && fin.savingsPerSqmYear < 150) feeRisk -= 10;
  const highRiskTech = analysis.technical.filter(t => 
    calculateRiskLevel(t.category, t.lastMaintained) === "high"
  ).length;
  feeRisk -= highRiskTech * 5;
  feeRisk = Math.max(0, Math.min(100, feeRisk));

  const total = Math.round((techScore + finScore + feeRisk) / 3);

  return { technical: techScore, financial: finScore, feeRisk, total };
}
