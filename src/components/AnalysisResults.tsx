import { BrfAnalysisResult, calculateRiskLevel, calculateFinancialRisk, calculateScores, RiskLevel } from "@/types/brfAnalysis";
import { Building2, ArrowLeft, AlertTriangle, CheckCircle, Info } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AnalysisResultsProps {
  analysis: BrfAnalysisResult;
  onBack: () => void;
}

function getRiskColor(risk: RiskLevel): string {
  switch (risk) {
    case "low": return "text-risk-low";
    case "medium": return "text-risk-medium";
    case "high": return "text-risk-high";
  }
}

function getRiskBgColor(risk: RiskLevel): string {
  switch (risk) {
    case "low": return "bg-risk-low-bg";
    case "medium": return "bg-risk-medium-bg";
    case "high": return "bg-risk-high-bg";
  }
}

function getRiskEmoji(risk: RiskLevel): string {
  switch (risk) {
    case "low": return "🟢";
    case "medium": return "🟡";
    case "high": return "🔴";
  }
}

function getRiskLabel(risk: RiskLevel): string {
  switch (risk) {
    case "low": return "Låg risk";
    case "medium": return "Medel risk";
    case "high": return "Hög risk";
  }
}

function getScoreLabel(score: number): string {
  if (score >= 75) return "Utmärkt";
  if (score >= 60) return "Bra";
  if (score >= 45) return "Godkänt";
  if (score >= 30) return "Ansträngt";
  return "Kritiskt";
}

function getScoreColor(score: number): string {
  if (score >= 75) return "text-risk-low";
  if (score >= 60) return "text-risk-low";
  if (score >= 45) return "text-risk-medium";
  if (score >= 30) return "text-risk-medium";
  return "text-risk-high";
}

function formatNumber(num?: number): string {
  if (num === undefined || num === null) return "Ej angivet";
  return num.toLocaleString("sv-SE");
}

const categoryNames: Record<string, string> = {
  tak: "Tak",
  fasad: "Fasad",
  stammar: "Stammar (V/A)",
  grund: "Grund & dränering",
  ventilation: "Ventilation",
  el: "El-system",
  varme: "Värmesystem",
  hissar: "Hissar",
  fonster: "Fönster",
  trapphus: "Trapphus",
  portar: "Portar & lås",
  kulvertar: "Kulvertar",
  ovrigt: "Övrigt"
};

const categoryIcons: Record<string, string> = {
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
  kulvertar: "🔧",
  ovrigt: "📋"
};

export function AnalysisResults({ analysis, onBack }: AnalysisResultsProps) {
  const scores = calculateScores(analysis);
  const financialRisk = calculateFinancialRisk(analysis.financial);

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
        {/* Back button */}
        <Button variant="ghost" onClick={onBack} className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Ny analys
        </Button>

        {/* Hero */}
        <section className="relative overflow-hidden rounded-3xl bg-gradient-hero p-8 md:p-12 text-primary-foreground">
          <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-white/5" />
          <div className="absolute -bottom-10 -left-10 w-40 h-40 rounded-full bg-white/5" />
          
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-2">
              <Building2 className="h-6 w-6" />
              <span className="text-sm font-medium opacity-80">BRF Analysen</span>
            </div>
            
            <h1 className="text-3xl md:text-4xl mb-2 text-primary-foreground">
              {analysis.association.name}
            </h1>
            {analysis.association.address && (
              <p className="text-primary-foreground/70 mb-2">{analysis.association.address}</p>
            )}
            <p className="text-primary-foreground/70 mb-6 max-w-lg">
              {analysis.summary}
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-5 text-center">
                <p className="text-4xl font-bold">{scores.total}</p>
                <p className="text-xs mt-1 opacity-70">Totalpoäng</p>
                <p className="text-sm font-medium mt-1">{getScoreLabel(scores.total)}</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-5 text-center">
                <p className="text-4xl font-bold">{scores.technical}</p>
                <p className="text-xs mt-1 opacity-70">Tekniskt</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-5 text-center">
                <p className="text-4xl font-bold">{scores.financial}</p>
                <p className="text-xs mt-1 opacity-70">Ekonomi</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-5 text-center">
                <p className="text-4xl font-bold">{scores.feeRisk}</p>
                <p className="text-xs mt-1 opacity-70">Avgiftsrisk</p>
              </div>
            </div>
          </div>
        </section>

        {/* Building info */}
        {(analysis.association.buildYear || analysis.association.apartments || analysis.association.fiscalYear) && (
          <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {analysis.association.buildYear && (
              <div className="bg-card rounded-xl p-4 border">
                <p className="text-sm text-muted-foreground">Byggnadsår</p>
                <p className="text-2xl font-bold">{analysis.association.buildYear}</p>
              </div>
            )}
            {analysis.association.apartments && (
              <div className="bg-card rounded-xl p-4 border">
                <p className="text-sm text-muted-foreground">Lägenheter</p>
                <p className="text-2xl font-bold">{analysis.association.apartments}</p>
              </div>
            )}
            {analysis.association.totalArea && (
              <div className="bg-card rounded-xl p-4 border">
                <p className="text-sm text-muted-foreground">Total yta</p>
                <p className="text-2xl font-bold">{formatNumber(analysis.association.totalArea)} kvm</p>
              </div>
            )}
            {analysis.association.fiscalYear && (
              <div className="bg-card rounded-xl p-4 border">
                <p className="text-sm text-muted-foreground">Räkenskapsår</p>
                <p className="text-2xl font-bold">{analysis.association.fiscalYear}</p>
              </div>
            )}
          </section>
        )}

        {/* Financial */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl text-foreground">Ekonomi</h2>
            <span className={`text-sm font-medium px-4 py-1.5 rounded-full ${getRiskBgColor(financialRisk)} ${getRiskColor(financialRisk)}`}>
              {getRiskEmoji(financialRisk)} {getRiskLabel(financialRisk)}
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            <FinancialMetric
              label="Lån per kvm"
              value={analysis.financial.loanPerSqm ? `${formatNumber(analysis.financial.loanPerSqm)} kr` : undefined}
              benchmark="< 5 000 kr/kvm"
              isGood={!analysis.financial.loanPerSqm || analysis.financial.loanPerSqm < 5000}
            />
            <FinancialMetric
              label="Avgift per kvm/år"
              value={analysis.financial.feePerSqmYear ? `${formatNumber(analysis.financial.feePerSqmYear)} kr` : undefined}
              benchmark="600–800 kr/kvm/år"
              isGood={!analysis.financial.feePerSqmYear || (analysis.financial.feePerSqmYear >= 500 && analysis.financial.feePerSqmYear <= 900)}
            />
            <FinancialMetric
              label="Sparande underhåll"
              value={analysis.financial.savingsPerSqmYear ? `${formatNumber(analysis.financial.savingsPerSqmYear)} kr/kvm/år` : undefined}
              benchmark="150–300 kr/kvm/år"
              isGood={!analysis.financial.savingsPerSqmYear || analysis.financial.savingsPerSqmYear >= 150}
            />
            <FinancialMetric
              label="Soliditet"
              value={analysis.financial.solidarity ? `${analysis.financial.solidarity}%` : undefined}
              benchmark="> 30%"
              isGood={!analysis.financial.solidarity || analysis.financial.solidarity > 30}
            />
            <FinancialMetric
              label="Totala lån"
              value={analysis.financial.totalLoans ? `${formatNumber(analysis.financial.totalLoans)} kr` : undefined}
              benchmark="Varierar"
              isGood={true}
            />
            <FinancialMetric
              label="Resultat"
              value={analysis.financial.result ? `${formatNumber(analysis.financial.result)} kr` : undefined}
              benchmark="Positivt"
              isGood={!analysis.financial.result || analysis.financial.result >= 0}
            />
          </div>
        </section>

        {/* Technical */}
        {analysis.technical.length > 0 && (
          <section className="space-y-4">
            <h2 className="text-2xl text-foreground">Tekniskt skick</h2>
            <div className="space-y-2">
              {analysis.technical.map((item, i) => {
                const risk = calculateRiskLevel(item.category, item.lastMaintained);
                const currentYear = new Date().getFullYear();
                const age = item.lastMaintained ? currentYear - item.lastMaintained : null;

                return (
                  <div
                    key={i}
                    className={`rounded-xl p-4 ${getRiskBgColor(risk)} border border-transparent`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{categoryIcons[item.category] || "📋"}</span>
                        <div>
                          <h3 className="font-semibold text-foreground">
                            {categoryNames[item.category] || item.name}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {item.lastMaintained ? `Senast: ${item.lastMaintained}` : "År ej angivet"}
                            {age ? ` · ${age} år gammal` : ""}
                            {item.materialType ? ` · ${item.materialType}` : ""}
                          </p>
                        </div>
                      </div>
                      <span className={`text-sm font-medium px-3 py-1 rounded-full ${getRiskBgColor(risk)} ${getRiskColor(risk)}`}>
                        {getRiskEmoji(risk)} {getRiskLabel(risk)}
                      </span>
                    </div>
                    {item.notes && (
                      <p className="text-sm text-muted-foreground mt-2 ml-11">{item.notes}</p>
                    )}
                    {item.plannedYear && (
                      <p className="text-sm text-primary mt-1 ml-11">
                        📅 Planerad åtgärd: {item.plannedYear}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Risks and positives */}
        {((analysis.risks && analysis.risks.length > 0) || (analysis.positives && analysis.positives.length > 0)) && (
          <section className="space-y-4">
            <h2 className="text-2xl text-foreground">Sammanfattning</h2>
            <div className="space-y-2">
              {analysis.risks?.map((risk, i) => (
                <div key={`risk-${i}`} className="flex items-start gap-3 bg-risk-high-bg rounded-xl p-4">
                  <AlertTriangle className="h-5 w-5 text-risk-high mt-0.5 shrink-0" />
                  <p className="text-sm text-foreground">{risk}</p>
                </div>
              ))}
              {analysis.positives?.map((pos, i) => (
                <div key={`pos-${i}`} className="flex items-start gap-3 bg-risk-low-bg rounded-xl p-4">
                  <CheckCircle className="h-5 w-5 text-risk-low mt-0.5 shrink-0" />
                  <p className="text-sm text-foreground">{pos}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Footer */}
        <footer className="text-center text-xs text-muted-foreground pb-8 pt-4 border-t">
          <p>BRF Analysen – baserat på uppladdade årsredovisningar med AI-analys.</p>
        </footer>
      </div>
    </div>
  );
}

function FinancialMetric({ label, value, benchmark, isGood }: {
  label: string;
  value?: string;
  benchmark: string;
  isGood: boolean;
}) {
  return (
    <div className={`rounded-xl p-4 border ${value ? (isGood ? "bg-risk-low-bg border-transparent" : "bg-risk-high-bg border-transparent") : "bg-secondary border-transparent"}`}>
      <p className="text-sm text-muted-foreground mb-1">{label}</p>
      <p className={`text-xl font-bold font-sans ${value ? (isGood ? "text-risk-low" : "text-risk-high") : "text-muted-foreground"}`}>
        {value || "Ej angivet"}
      </p>
      <p className="text-xs text-muted-foreground mt-1">Bra: {benchmark}</p>
    </div>
  );
}
