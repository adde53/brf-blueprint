import { BrfAnalysisResult } from "@/types/brfAnalysis";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HeroSection } from "@/components/analysis/HeroSection";
import { SummarySection } from "@/components/analysis/SummarySection";
import { FinancialSection } from "@/components/analysis/FinancialSection";
import { FeeSection } from "@/components/analysis/FeeSection";
import { TechnicalSection } from "@/components/analysis/TechnicalSection";

interface AnalysisResultsProps {
  analysis: BrfAnalysisResult;
  onBack: () => void;
}

export function AnalysisResults({ analysis, onBack }: AnalysisResultsProps) {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-10">
        {/* Back button */}
        <Button variant="ghost" onClick={onBack} className="gap-2 text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" />
          Ny analys
        </Button>

        {/* Hero */}
        <HeroSection analysis={analysis} />

        {/* Divider line */}
        <div className="border-t" />

        {/* Summary + observations */}
        <SummarySection analysis={analysis} />

        {/* Financial overview */}
        <div className="border-t" />
        <FinancialSection financial={analysis.financial} />

        {/* Fee breakdown */}
        {analysis.feeIncludes && analysis.feeIncludes.length > 0 && (
          <>
            <div className="border-t" />
            <FeeSection feeIncludes={analysis.feeIncludes} feeAnalysis={analysis.feeAnalysis} />
          </>
        )}

        {/* Technical status */}
        {analysis.technical.length > 0 && (
          <>
            <div className="border-t" />
            <TechnicalSection technical={analysis.technical} buildYear={analysis.association.buildYear} />
          </>
        )}

        {/* Footer */}
        <footer className="text-center text-xs text-muted-foreground pb-8 pt-6 border-t">
          <p>BRF Analysen – AI-analys av årsredovisningar. Dubbelkolla alltid mot originaldokumentet.</p>
        </footer>
      </div>
    </div>
  );
}
