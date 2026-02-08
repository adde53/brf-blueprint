import { HeroSummary } from "@/components/HeroSummary";
import { ScoreGauge } from "@/components/ScoreGauge";
import { TechnicalCard } from "@/components/TechnicalCard";
import { FinancialSection } from "@/components/FinancialSection";
import { RecommendationsSection } from "@/components/RecommendationsSection";
import { technicalCategories, brfScores } from "@/data/brfData";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-10">
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
              tooltip="Baserat på ålder och underhållsstatus för tak, stammar, fasad med mera. Flera komponenter har passerat sin livslängd."
            />
            <ScoreGauge
              score={brfScores.financial}
              label="Ekonomi"
              tooltip="Beräknat utifrån lån, sparande, soliditet och kassaflöde. Föreningen har höga lån och lågt sparande."
            />
            <ScoreGauge
              score={brfScores.feeRisk}
              label="Avgiftsrisk"
              tooltip="Risk att avgiften höjs kraftigt de kommande åren p.g.a. planerade renoveringar och ränterisker."
            />
          </div>
        </section>

        {/* Technical Condition */}
        <section>
          <h2 className="text-2xl text-foreground mb-2">Tekniskt skick</h2>
          <p className="text-sm text-muted-foreground mb-4">
            Klicka på en kategori för att se detaljer, livslängd och referensvärden. {" "}
            <span className="italic">Spoiler: stammarna behöver terapi.</span>
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
          <p>BRF Analysen – exempeldata för demonstration. Alltid dubbelkolla med årsredovisning och underhållsplan.</p>
          <p className="mt-1">Byggd med ❤️ och lite oro för framtida stambyten.</p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
