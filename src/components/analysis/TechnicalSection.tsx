import { BrfTechnicalItem, getStatusBgColor, getStatusColor, getStatusEmoji, getStatusLabel, categoryNames, categoryIcons } from "@/types/brfAnalysis";
import { Wrench } from "lucide-react";

interface TechnicalSectionProps {
  technical: BrfTechnicalItem[];
  buildYear?: number;
}

function TechCard({ item }: { item: BrfTechnicalItem }) {
  const currentYear = new Date().getFullYear();
  const age = item.lastMaintained ? currentYear - item.lastMaintained : null;

  return (
    <div className={`rounded-2xl p-5 border border-transparent transition-shadow hover:shadow-card-hover ${getStatusBgColor(item.status)}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <span className="text-2xl">{categoryIcons[item.category] || "📋"}</span>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-foreground text-[15px]">
              {categoryNames[item.category] || item.name}
            </h3>
            <div className="flex flex-wrap gap-1.5 mt-2">
              {item.lastMaintained && (
                <span className="text-xs bg-background/60 backdrop-blur-sm px-2.5 py-1 rounded-full font-medium">
                  Senast: {item.lastMaintained}
                </span>
              )}
              {age !== null && (
                <span className="text-xs bg-background/60 backdrop-blur-sm px-2.5 py-1 rounded-full font-medium">
                  {age} år sedan
                </span>
              )}
              {item.materialType && (
                <span className="text-xs bg-background/60 backdrop-blur-sm px-2.5 py-1 rounded-full font-medium">
                  {item.materialType}
                </span>
              )}
            </div>
          </div>
        </div>
        <div className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full whitespace-nowrap ${getStatusBgColor(item.status)} ${getStatusColor(item.status)}`}>
          <span>{getStatusEmoji(item.status)}</span>
          <span className="hidden sm:inline">{getStatusLabel(item.status)}</span>
        </div>
      </div>
      {item.notes && (
        <p className="text-sm text-muted-foreground mt-3 ml-11 leading-relaxed">{item.notes}</p>
      )}
      {item.plannedYear && (
        <p className="text-sm text-primary mt-2 ml-11 font-medium">
          📅 Planerad åtgärd: {item.plannedYear}
        </p>
      )}
    </div>
  );
}

export function TechnicalSection({ technical, buildYear }: TechnicalSectionProps) {
  // Group by status for better visual hierarchy
  const critical = technical.filter(t => t.status === "critical");
  const warning = technical.filter(t => t.status === "warning");
  const good = technical.filter(t => t.status === "good");
  const sorted = [...critical, ...warning, ...good];

  return (
    <section className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <Wrench className="h-6 w-6 text-primary" />
          <div>
            <h2 className="text-2xl text-foreground">Tekniskt skick</h2>
            <p className="text-sm text-muted-foreground">
              Baserat på byggnadsår ({buildYear || "okänt"}) och underhållshistorik
            </p>
          </div>
        </div>

        {/* Status summary pills */}
        <div className="flex gap-2">
          {critical.length > 0 && (
            <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-risk-high-bg text-risk-high">
              🔴 {critical.length}
            </span>
          )}
          {warning.length > 0 && (
            <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-risk-medium-bg text-risk-medium">
              🟡 {warning.length}
            </span>
          )}
          {good.length > 0 && (
            <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-risk-low-bg text-risk-low">
              🟢 {good.length}
            </span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {sorted.map((item, i) => (
          <TechCard key={i} item={item} />
        ))}
      </div>
    </section>
  );
}
