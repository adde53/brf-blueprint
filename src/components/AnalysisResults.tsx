import { 
  BrfAnalysisResult, 
  getStatusColor, 
  getStatusBgColor, 
  getStatusEmoji, 
  getStatusLabel,
  getAssessmentColor,
  getAssessmentBgColor,
  getAssessmentEmoji,
  getAssessmentLabel,
  getFinancialStatus,
  categoryNames,
  categoryIcons,
  ComponentStatus
} from "@/types/brfAnalysis";
import { Building2, ArrowLeft, AlertTriangle, CheckCircle, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AnalysisResultsProps {
  analysis: BrfAnalysisResult;
  onBack: () => void;
}

function formatNumber(num?: number): string {
  if (num === undefined || num === null) return "–";
  return num.toLocaleString("sv-SE");
}

function getFinancialIcon(isGood: boolean | null) {
  if (isGood === null) return <Minus className="h-4 w-4 text-muted-foreground" />;
  return isGood 
    ? <TrendingUp className="h-4 w-4 text-risk-low" />
    : <TrendingDown className="h-4 w-4 text-risk-high" />;
}

export function AnalysisResults({ analysis, onBack }: AnalysisResultsProps) {
  const financialStatus = getFinancialStatus(analysis.financial);
  const currentYear = new Date().getFullYear();
  const buildingAge = analysis.association.buildYear 
    ? currentYear - analysis.association.buildYear 
    : null;

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
        {/* Back button */}
        <Button variant="ghost" onClick={onBack} className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Ny analys
        </Button>

        {/* Hero with overall assessment */}
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
              <p className="text-primary-foreground/70 mb-4">{analysis.association.address}</p>
            )}

            {/* Overall assessment badge */}
            <div className={`inline-flex items-center gap-3 px-6 py-3 rounded-2xl ${getAssessmentBgColor(analysis.overallAssessment)}`}>
              <span className="text-3xl">{getAssessmentEmoji(analysis.overallAssessment)}</span>
              <div>
                <p className={`text-lg font-bold ${getAssessmentColor(analysis.overallAssessment)}`}>
                  {getAssessmentLabel(analysis.overallAssessment)}
                </p>
                <p className="text-sm text-foreground/70">{analysis.assessmentReason}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Building info cards */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {analysis.association.buildYear && (
            <div className="bg-card rounded-xl p-4 border">
              <p className="text-sm text-muted-foreground">Byggnadsår</p>
              <p className="text-2xl font-bold">{analysis.association.buildYear}</p>
              {buildingAge && (
                <p className="text-xs text-muted-foreground">{buildingAge} år gammal</p>
              )}
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
              <p className="text-2xl font-bold">{formatNumber(analysis.association.totalArea)} m²</p>
            </div>
          )}
          {analysis.association.fiscalYear && (
            <div className="bg-card rounded-xl p-4 border">
              <p className="text-sm text-muted-foreground">Räkenskapsår</p>
              <p className="text-2xl font-bold">{analysis.association.fiscalYear}</p>
            </div>
          )}
        </section>

        {/* Summary */}
        <section className="bg-card rounded-2xl p-6 border">
          <p className="text-foreground leading-relaxed">{analysis.summary}</p>
        </section>

        {/* Financial overview */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl text-foreground">Ekonomi</h2>
            <span className={`text-sm font-medium px-4 py-1.5 rounded-full ${getStatusBgColor(financialStatus)} ${getStatusColor(financialStatus)}`}>
              {getStatusEmoji(financialStatus)} {getStatusLabel(financialStatus)}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            <FinancialCard
              label="Lån per m²"
              value={analysis.financial.loanPerSqm}
              unit="kr"
              benchmark="Under 5 000 kr = bra"
              isGood={analysis.financial.loanPerSqm ? analysis.financial.loanPerSqm < 5000 : null}
            />
            <FinancialCard
              label="Avgift per m²/år"
              value={analysis.financial.feePerSqmYear}
              unit="kr"
              benchmark="600–800 kr = normalt"
              isGood={analysis.financial.feePerSqmYear ? (analysis.financial.feePerSqmYear >= 500 && analysis.financial.feePerSqmYear <= 900) : null}
            />
            <FinancialCard
              label="Sparande per m²/år"
              value={analysis.financial.savingsPerSqmYear}
              unit="kr"
              benchmark="Över 150 kr = bra"
              isGood={analysis.financial.savingsPerSqmYear ? analysis.financial.savingsPerSqmYear >= 150 : null}
            />
            <FinancialCard
              label="Soliditet"
              value={analysis.financial.solidarity}
              unit="%"
              benchmark="Över 30% = bra"
              isGood={analysis.financial.solidarity ? analysis.financial.solidarity > 30 : null}
            />
            <FinancialCard
              label="Totala lån"
              value={analysis.financial.totalLoans}
              unit="kr"
              benchmark=""
              isGood={null}
            />
            <FinancialCard
              label="Årsresultat"
              value={analysis.financial.result}
              unit="kr"
              benchmark="Positivt = bra"
              isGood={analysis.financial.result ? analysis.financial.result >= 0 : null}
            />
          </div>
        </section>

        {/* Technical components */}
        {analysis.technical.length > 0 && (
          <section className="space-y-4">
            <h2 className="text-2xl text-foreground">Tekniskt skick</h2>
            <p className="text-muted-foreground text-sm">
              Bedömning baserat på byggnadsår ({analysis.association.buildYear || "okänt"}) och underhållshistorik
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {analysis.technical.map((item, i) => (
                <TechnicalCard key={i} item={item} />
              ))}
            </div>
          </section>
        )}

        {/* Risks and positives */}
        {((analysis.risks && analysis.risks.length > 0) || (analysis.positives && analysis.positives.length > 0)) && (
          <section className="space-y-4">
            <h2 className="text-2xl text-foreground">Observationer</h2>
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
          <p>BRF Analysen – AI-analys av årsredovisningar. Alltid dubbelkolla mot originaldokumentet.</p>
        </footer>
      </div>
    </div>
  );
}

function FinancialCard({ label, value, unit, benchmark, isGood }: {
  label: string;
  value?: number;
  unit: string;
  benchmark: string;
  isGood: boolean | null;
}) {
  const status: ComponentStatus = isGood === null ? "warning" : (isGood ? "good" : "critical");
  const hasValue = value !== undefined && value !== null;
  
  return (
    <div className={`rounded-xl p-4 border ${hasValue ? getStatusBgColor(status) : "bg-secondary"} border-transparent`}>
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm text-muted-foreground">{label}</p>
        {hasValue && getFinancialIcon(isGood)}
      </div>
      <p className={`text-xl font-bold font-sans ${hasValue ? (isGood ? "text-risk-low" : isGood === false ? "text-risk-high" : "text-foreground") : "text-muted-foreground"}`}>
        {hasValue ? `${formatNumber(value)} ${unit}` : "Ej angivet"}
      </p>
      {benchmark && (
        <p className="text-xs text-muted-foreground mt-1">{benchmark}</p>
      )}
    </div>
  );
}

function TechnicalCard({ item }: { item: BrfAnalysisResult["technical"][0] }) {
  const currentYear = new Date().getFullYear();
  const age = item.lastMaintained ? currentYear - item.lastMaintained : null;
  
  return (
    <div className={`rounded-xl p-4 ${getStatusBgColor(item.status)} border border-transparent`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <span className="text-2xl">{categoryIcons[item.category] || "📋"}</span>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-foreground">
              {categoryNames[item.category] || item.name}
            </h3>
            <div className="flex flex-wrap gap-2 mt-1">
              {item.lastMaintained && (
                <span className="text-xs bg-background/50 px-2 py-0.5 rounded-full">
                  Senast: {item.lastMaintained}
                </span>
              )}
              {age !== null && (
                <span className="text-xs bg-background/50 px-2 py-0.5 rounded-full">
                  {age} år sedan
                </span>
              )}
              {item.materialType && (
                <span className="text-xs bg-background/50 px-2 py-0.5 rounded-full">
                  {item.materialType}
                </span>
              )}
            </div>
          </div>
        </div>
        <span className={`text-sm font-medium px-3 py-1 rounded-full whitespace-nowrap ${getStatusBgColor(item.status)} ${getStatusColor(item.status)}`}>
          {getStatusEmoji(item.status)}
        </span>
      </div>
      {item.notes && (
        <p className="text-sm text-muted-foreground mt-3 ml-11">{item.notes}</p>
      )}
      {item.plannedYear && (
        <p className="text-sm text-primary mt-1 ml-11">
          📅 Planerad åtgärd: {item.plannedYear}
        </p>
      )}
    </div>
  );
}
