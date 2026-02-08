import { useState } from "react";
import { Building2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ReportUploader } from "@/components/ReportUploader";
import { HeroSummary } from "@/components/HeroSummary";
import { ScoreGauge } from "@/components/ScoreGauge";
import { TechnicalCard } from "@/components/TechnicalCard";
import { FinancialSection } from "@/components/FinancialSection";
import { RecommendationsSection } from "@/components/RecommendationsSection";
import { technicalCategories, brfScores } from "@/data/brfData";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const { toast } = useToast();

  const handleAnalyze = async (files: File[]) => {
    setIsAnalyzing(true);
    
    // Simulate analysis time (in real app, would send to edge function with AI)
    await new Promise((resolve) => setTimeout(resolve, 2500));
    
    toast({
      title: "Analys klar!",
      description: `${files.length} ${files.length === 1 ? "årsredovisning analyserad" : "årsredovisningar analyserade"}.`,
    });
    
    setIsAnalyzing(false);
    setShowResults(true);
  };

  const handleBack = () => {
    setShowResults(false);
  };

  if (showResults) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-4xl mx-auto px-4 py-8 space-y-10">
          {/* Back button */}
          <Button variant="ghost" onClick={handleBack} className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Ny analys
          </Button>

          {/* Hero */}
          <HeroSummary />

          {/* Score Gauges */}
          <section>
            <h2 className="text-2xl text-foreground mb-4">Poängöversikt</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <ScoreGauge
                score={brfScores.total}
                label="Totalpoäng"
                tooltip="Genomsnitt av alla delpoäng. Under 50 innebär att föreningen har flertalet riskområden som bör hanteras."
                size="lg"
              />
              <ScoreGauge
                score={brfScores.technical}
                label="Tekniskt skick"
                tooltip="Baserat på ålder och underhållsstatus för tak, stammar, fasad med mera."
              />
              <ScoreGauge
                score={brfScores.financial}
                label="Ekonomi"
                tooltip="Beräknat utifrån lån, sparande, soliditet och kassaflöde."
              />
              <ScoreGauge
                score={brfScores.feeRisk}
                label="Avgiftsrisk"
                tooltip="Risk att avgiften höjs kraftigt de kommande åren."
              />
            </div>
          </section>

          {/* Technical Condition */}
          <section>
            <h2 className="text-2xl text-foreground mb-2">Tekniskt skick</h2>
            <p className="text-sm text-muted-foreground mb-4">
              Klicka på en kategori för att se detaljer.
            </p>
            <div className="space-y-2">
              {technicalCategories.map((cat) => (
                <TechnicalCard key={cat.id} category={cat} />
              ))}
            </div>
          </section>

          {/* Financial */}
          <FinancialSection />

          {/* Recommendations */}
          <RecommendationsSection />

          {/* Footer */}
          <footer className="text-center text-xs text-muted-foreground pb-8 pt-4 border-t">
            <p>BRF Analysen – baserat på uppladdade årsredovisningar.</p>
          </footer>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-hero mb-4">
            <Building2 className="h-8 w-8 text-primary-foreground" />
          </div>
          <h1 className="text-3xl text-foreground mb-2">BRF Analysen</h1>
          <p className="text-muted-foreground">
            Ladda upp årsredovisningar och få en komplett analys av föreningens ekonomi och tekniska skick.
          </p>
        </div>

        {/* Uploader */}
        <ReportUploader onAnalyze={handleAnalyze} isAnalyzing={isAnalyzing} />

        {/* Info */}
        <p className="text-xs text-center text-muted-foreground mt-8">
          Ladda upp en eller flera årsredovisningar (PDF) så analyserar vi ekonomi, lån, underhållsbehov och risker.
        </p>
      </div>
    </div>
  );
};

export default Index;
