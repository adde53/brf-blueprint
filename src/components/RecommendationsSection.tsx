import { recommendations } from "@/data/brfData";
import { AlertTriangle, CheckCircle, Info } from "lucide-react";

const iconMap = {
  warning: AlertTriangle,
  positive: CheckCircle,
  info: Info,
};

const bgMap = {
  warning: "bg-risk-high-bg",
  positive: "bg-risk-low-bg",
  info: "bg-secondary",
};

const colorMap = {
  warning: "text-risk-high",
  positive: "text-risk-low",
  info: "text-primary",
};

export function RecommendationsSection() {
  return (
    <section className="space-y-4">
      <h2 className="text-2xl text-foreground">Rekommendationer</h2>
      <p className="text-sm text-muted-foreground">Konkreta tips baserat på analysen – börja med det som lyser rött!</p>
      
      <div className="space-y-2">
        {recommendations.map((rec, i) => {
          const Icon = iconMap[rec.type];
          return (
            <div key={i} className={`flex items-start gap-3 rounded-xl p-4 ${bgMap[rec.type]}`}>
              <Icon className={`h-5 w-5 mt-0.5 shrink-0 ${colorMap[rec.type]}`} />
              <div>
                <span className={`text-xs font-medium ${colorMap[rec.type]} uppercase tracking-wide`}>{rec.category}</span>
                <p className="text-sm text-foreground mt-0.5">{rec.text}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
