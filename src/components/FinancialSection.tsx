import { financialData, getRiskEmoji, getRiskLabel, getRiskColor, getRiskBgColor } from "@/data/brfData";
import { AlertTriangle, CheckCircle, TrendingDown } from "lucide-react";

interface MetricProps {
  label: string;
  value: string;
  benchmark: string;
  isGood: boolean;
}

function Metric({ label, value, benchmark, isGood }: MetricProps) {
  return (
    <div className={`rounded-xl p-4 border ${isGood ? "bg-risk-low-bg border-transparent" : "bg-risk-high-bg border-transparent"}`}>
      <p className="text-sm text-muted-foreground mb-1">{label}</p>
      <p className={`text-2xl font-bold font-sans ${isGood ? "text-risk-low" : "text-risk-high"}`}>{value}</p>
      <p className="text-xs text-muted-foreground mt-1">Bra: {benchmark}</p>
    </div>
  );
}

export function FinancialSection() {
  const d = financialData;

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl text-foreground">Ekonomi & Avgift</h2>
        <span className={`text-sm font-medium px-4 py-1.5 rounded-full ${getRiskBgColor(d.riskLevel)} ${getRiskColor(d.riskLevel)}`}>
          {getRiskEmoji(d.riskLevel)} Ansträngd ekonomi
        </span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        <Metric label="Lån per kvm" value={`${d.loanPerSqm.toLocaleString("sv-SE")} kr`} benchmark="< 5 000 kr/kvm" isGood={d.loanPerSqm < 5000} />
        <Metric label="Avgift per kvm/år" value={`${d.annualFeePerSqm} kr`} benchmark="600–800 kr/kvm/år" isGood={d.annualFeePerSqm >= 600 && d.annualFeePerSqm <= 800} />
        <Metric label="Sparande underhåll" value={`${d.maintenanceSavingsPerSqm} kr/kvm/år`} benchmark="150–300 kr/kvm/år" isGood={d.maintenanceSavingsPerSqm >= 150} />
        <Metric label="Soliditet" value={`${d.solidarity}%`} benchmark="> 30%" isGood={d.solidarity > 30} />
        <Metric label="Kassaflöde" value={`${d.cashFlowAfterOps < 0 ? "-" : ""}${Math.abs(d.cashFlowAfterOps).toLocaleString("sv-SE")} kr`} benchmark="Positivt" isGood={d.cashFlowAfterOps > 0} />
        <Metric label="Ränterisk (+1%)" value={`+${d.interestRateImpact}% avgift`} benchmark="< 5%" isGood={d.interestRateImpact < 5} />
      </div>

      <div className="space-y-2">
        {d.warnings.map((w, i) => (
          <div key={i} className="flex items-start gap-2 bg-risk-high-bg rounded-lg p-3">
            <AlertTriangle className="h-4 w-4 text-risk-high mt-0.5 shrink-0" />
            <p className="text-sm text-foreground">{w}</p>
          </div>
        ))}
        {d.positives.map((p, i) => (
          <div key={i} className="flex items-start gap-2 bg-risk-low-bg rounded-lg p-3">
            <CheckCircle className="h-4 w-4 text-risk-low mt-0.5 shrink-0" />
            <p className="text-sm text-foreground">{p}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
