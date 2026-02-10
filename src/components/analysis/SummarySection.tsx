import { BrfAnalysisResult } from "@/types/brfAnalysis";
import { AlertTriangle, CheckCircle } from "lucide-react";

interface SummarySectionProps {
  analysis: BrfAnalysisResult;
}

export function SummarySection({ analysis }: SummarySectionProps) {
  const hasObservations = (analysis.risks && analysis.risks.length > 0) || (analysis.positives && analysis.positives.length > 0);

  return (
    <section className="space-y-4">
      <h2 className="text-2xl text-foreground">Sammanfattning</h2>
      <div className="bg-card rounded-2xl p-6 border shadow-card">
        <p className="text-foreground/80 leading-relaxed text-[15px]">{analysis.summary}</p>
      </div>

      {hasObservations && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {analysis.positives?.map((pos, i) => (
            <div key={`pos-${i}`} className="flex items-start gap-3 bg-risk-low-bg rounded-xl p-4 border border-risk-low/10">
              <CheckCircle className="h-5 w-5 text-risk-low mt-0.5 shrink-0" />
              <p className="text-sm text-foreground/80">{pos}</p>
            </div>
          ))}
          {analysis.risks?.map((risk, i) => (
            <div key={`risk-${i}`} className="flex items-start gap-3 bg-risk-high-bg rounded-xl p-4 border border-risk-high/10">
              <AlertTriangle className="h-5 w-5 text-risk-high mt-0.5 shrink-0" />
              <p className="text-sm text-foreground/80">{risk}</p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
