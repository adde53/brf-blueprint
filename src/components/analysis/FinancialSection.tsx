import { BrfFinancial, ComponentStatus, getStatusBgColor, getStatusColor, getStatusEmoji, getStatusLabel, getFinancialStatus } from "@/types/brfAnalysis";
import { TrendingUp, TrendingDown, Minus, Wallet } from "lucide-react";

interface FinancialSectionProps {
  financial: BrfFinancial;
}

function formatNumber(num?: number): string {
  if (num === undefined || num === null) return "–";
  return num.toLocaleString("sv-SE");
}

function FinancialMetric({ label, value, unit, benchmark, isGood }: {
  label: string;
  value?: number;
  unit: string;
  benchmark: string;
  isGood: boolean | null;
}) {
  const hasValue = value !== undefined && value !== null;
  const status: ComponentStatus = isGood === null ? "warning" : (isGood ? "good" : "critical");

  return (
    <div className={`rounded-2xl p-5 border border-transparent transition-shadow hover:shadow-card-hover ${hasValue ? getStatusBgColor(status) : "bg-secondary"}`}>
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        {hasValue && (
          isGood === null
            ? <Minus className="h-4 w-4 text-muted-foreground" />
            : isGood
              ? <TrendingUp className="h-4 w-4 text-risk-low" />
              : <TrendingDown className="h-4 w-4 text-risk-high" />
        )}
      </div>
      <p className={`text-2xl font-bold font-sans ${hasValue ? (isGood ? "text-risk-low" : isGood === false ? "text-risk-high" : "text-foreground") : "text-muted-foreground"}`}>
        {hasValue ? `${formatNumber(value)} ${unit}` : "Ej angivet"}
      </p>
      {benchmark && (
        <p className="text-xs text-muted-foreground mt-2 opacity-70">{benchmark}</p>
      )}
    </div>
  );
}

export function FinancialSection({ financial }: FinancialSectionProps) {
  const financialStatus = getFinancialStatus(financial);

  return (
    <section className="space-y-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Wallet className="h-6 w-6 text-primary" />
          <h2 className="text-2xl text-foreground">Ekonomisk översikt</h2>
        </div>
        <span className={`text-sm font-medium px-4 py-1.5 rounded-full ${getStatusBgColor(financialStatus)} ${getStatusColor(financialStatus)}`}>
          {getStatusEmoji(financialStatus)} {getStatusLabel(financialStatus)}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <FinancialMetric
          label="Lån per m²"
          value={financial.loanPerSqm}
          unit="kr"
          benchmark="Under 5 000 kr = bra"
          isGood={financial.loanPerSqm ? financial.loanPerSqm < 5000 : null}
        />
        <FinancialMetric
          label="Avgift per m²/år"
          value={financial.feePerSqmYear}
          unit="kr"
          benchmark="600–800 kr = normalt"
          isGood={financial.feePerSqmYear ? (financial.feePerSqmYear >= 500 && financial.feePerSqmYear <= 900) : null}
        />
        <FinancialMetric
          label="Sparande per m²/år"
          value={financial.savingsPerSqmYear}
          unit="kr"
          benchmark="Över 150 kr = bra"
          isGood={financial.savingsPerSqmYear ? financial.savingsPerSqmYear >= 150 : null}
        />
        <FinancialMetric
          label="Soliditet"
          value={financial.solidarity}
          unit="%"
          benchmark="Över 30% = bra"
          isGood={financial.solidarity ? financial.solidarity > 30 : null}
        />
        <FinancialMetric
          label="Totala lån"
          value={financial.totalLoans}
          unit="kr"
          benchmark=""
          isGood={null}
        />
        <FinancialMetric
          label="Årsresultat"
          value={financial.result}
          unit="kr"
          benchmark="Positivt = bra"
          isGood={financial.result ? financial.result >= 0 : null}
        />
      </div>
    </section>
  );
}
