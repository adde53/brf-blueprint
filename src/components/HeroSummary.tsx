import { brfScores, getScoreColor, getScoreLabel } from "@/data/brfData";
import { ScoreGauge } from "./ScoreGauge";
import { Building2 } from "lucide-react";

export function HeroSummary() {
  const total = brfScores.total;

  return (
    <section className="relative overflow-hidden rounded-3xl bg-gradient-hero p-8 md:p-12 text-primary-foreground">
      {/* Decorative circles */}
      <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-white/5" />
      <div className="absolute -bottom-10 -left-10 w-40 h-40 rounded-full bg-white/5" />
      
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-2">
          <Building2 className="h-6 w-6" />
          <span className="text-sm font-medium opacity-80">BRF Analysen</span>
        </div>
        
        <h1 className="text-3xl md:text-4xl mb-2 text-primary-foreground">
          BRF Solbacken 2026
        </h1>
        <p className="text-primary-foreground/70 mb-8 max-w-lg">
          En medelstor förening i centrala Sverige. Här är den samlade bedömningen av tekniskt skick, ekonomi och framtida risker.
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-5 text-center">
            <p className="text-4xl font-bold">{total}</p>
            <p className="text-xs mt-1 opacity-70">Totalpoäng</p>
            <p className={`text-sm font-medium mt-1 ${total < 50 ? "text-risk-medium" : ""}`}>
              {getScoreLabel(total)}
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-5 text-center">
            <p className="text-4xl font-bold">{brfScores.technical}</p>
            <p className="text-xs mt-1 opacity-70">Tekniskt</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-5 text-center">
            <p className="text-4xl font-bold">{brfScores.financial}</p>
            <p className="text-xs mt-1 opacity-70">Ekonomi</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-5 text-center">
            <p className="text-4xl font-bold">{brfScores.feeRisk}</p>
            <p className="text-xs mt-1 opacity-70">Avgiftsrisk</p>
          </div>
        </div>

        <p className="text-sm mt-6 text-primary-foreground/60">
          ⚠️ Föreningen har flera tekniska risker och en ansträngd ekonomi. Läs vidare för detaljer och konkreta tips.
        </p>
      </div>
    </section>
  );
}
