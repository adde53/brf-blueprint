import { FeeIncludesItem, feeItemLabels, feeItemIcons } from "@/types/brfAnalysis";
import { Receipt } from "lucide-react";

interface FeeSectionProps {
  feeIncludes: FeeIncludesItem[];
  feeAnalysis?: string;
}

function formatNumber(num?: number): string {
  if (num === undefined || num === null) return "–";
  return num.toLocaleString("sv-SE");
}

function FeeCard({ item }: { item: FeeIncludesItem }) {
  return (
    <div className="bg-card rounded-2xl p-5 border shadow-card hover:shadow-card-hover transition-shadow flex items-start gap-4">
      <span className="text-2xl mt-0.5">{feeItemIcons[item.item] || "📋"}</span>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <h3 className="font-semibold text-foreground text-[15px]">
            {feeItemLabels[item.item] || item.name}
          </h3>
          {item.estimatedMonthlyCost && (
            <span className="text-sm font-bold text-risk-low whitespace-nowrap">
              ~{formatNumber(item.estimatedMonthlyCost)} kr/mån
            </span>
          )}
        </div>
        {item.notes && (
          <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed">{item.notes}</p>
        )}
        {!item.notes && item.name !== feeItemLabels[item.item] && (
          <p className="text-sm text-muted-foreground mt-1.5">{item.name}</p>
        )}
      </div>
    </div>
  );
}

export function FeeSection({ feeIncludes, feeAnalysis }: FeeSectionProps) {
  const totalEstimated = feeIncludes.reduce((sum, item) => sum + (item.estimatedMonthlyCost || 0), 0);
  const hasEstimates = feeIncludes.some(item => item.estimatedMonthlyCost);

  return (
    <section className="space-y-5">
      <div className="flex items-center gap-3">
        <Receipt className="h-6 w-6 text-primary" />
        <div>
          <h2 className="text-2xl text-foreground">Vad ingår i avgiften?</h2>
          <p className="text-sm text-muted-foreground">Och vad det annars hade kostat separat</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {feeIncludes.map((item, i) => (
          <FeeCard key={i} item={item} />
        ))}
      </div>

      {hasEstimates && (
        <div className="bg-risk-low-bg rounded-2xl p-5 border border-risk-low/15">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <p className="font-semibold text-foreground">Uppskattat värde av inkluderade tjänster</p>
              <p className="text-sm text-muted-foreground">Om du hade betalat allt separat</p>
            </div>
            <p className="text-3xl font-bold text-risk-low">
              ~{formatNumber(totalEstimated)} <span className="text-lg font-medium">kr/mån</span>
            </p>
          </div>
        </div>
      )}

      {feeAnalysis && (
        <div className="bg-card rounded-2xl p-5 border shadow-card">
          <p className="text-sm text-foreground/80 leading-relaxed">{feeAnalysis}</p>
        </div>
      )}
    </section>
  );
}
