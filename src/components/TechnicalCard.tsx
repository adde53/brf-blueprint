import { useState } from "react";
import { TechnicalCategory, getRiskEmoji, getRiskLabel, getRiskBgColor, getRiskColor } from "@/data/brfData";
import { ChevronDown, ChevronUp } from "lucide-react";

interface TechnicalCardProps {
  category: TechnicalCategory;
}

export function TechnicalCard({ category }: TechnicalCardProps) {
  const [expanded, setExpanded] = useState(false);

  const lifespanPercent = Math.min(100, (category.age / category.lifespanMax) * 100);

  return (
    <div
      className={`rounded-xl border shadow-card transition-all duration-200 hover:shadow-card-hover cursor-pointer ${getRiskBgColor(category.risk)} border-transparent`}
      onClick={() => setExpanded(!expanded)}
    >
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{category.icon}</span>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-foreground font-sans">{category.name}</h3>
              {category.materialNote && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground">
                  {category.materialNote}
                </span>
              )}
            </div>
            <p className="text-sm text-muted-foreground">
              Senast: {category.lastMaintained} · {category.age} år gammal
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className={`text-sm font-medium px-3 py-1 rounded-full ${getRiskBgColor(category.risk)} ${getRiskColor(category.risk)}`}>
            {getRiskEmoji(category.risk)} {getRiskLabel(category.risk)}
          </span>
          {expanded ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
        </div>
      </div>

      {expanded && (
        <div className="px-4 pb-4 space-y-3 border-t border-border/50 pt-3">
          <p className="text-sm text-foreground">{category.description}</p>
          
          {category.humor && (
            <p className="text-sm italic text-muted-foreground">💬 {category.humor}</p>
          )}

          <div className="space-y-1">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Ålder: {category.age} år</span>
              <span>Livslängd: {category.lifespanMin}–{category.lifespanMax} år</span>
            </div>
            <div className="h-2 rounded-full bg-secondary overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  lifespanPercent >= 80 ? "bg-risk-high" : lifespanPercent >= 50 ? "bg-risk-medium" : "bg-risk-low"
                }`}
                style={{ width: `${lifespanPercent}%` }}
              />
            </div>
            {category.remainingYears > 0 ? (
              <p className="text-xs text-muted-foreground">~{category.remainingYears} år kvar (uppskattning)</p>
            ) : (
              <p className="text-xs text-risk-high font-medium">⚠️ Passerat förväntad livslängd!</p>
            )}
          </div>

          <div className="bg-card rounded-lg p-3 border">
            <p className="text-xs text-muted-foreground">
              <span className="font-medium text-foreground">Bra förening: </span>
              {category.goodAssociationRef}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
