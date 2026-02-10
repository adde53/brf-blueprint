import { BrfAnalysisResult, getAssessmentBgColor, getAssessmentColor, getAssessmentEmoji, getAssessmentLabel } from "@/types/brfAnalysis";
import { Building2, MapPin, Calendar, Home } from "lucide-react";

interface HeroSectionProps {
  analysis: BrfAnalysisResult;
}

export function HeroSection({ analysis }: HeroSectionProps) {
  const currentYear = new Date().getFullYear();
  const buildingAge = analysis.association.buildYear
    ? currentYear - analysis.association.buildYear
    : null;

  return (
    <section className="relative overflow-hidden rounded-3xl bg-gradient-hero p-8 md:p-12 shadow-hero">
      {/* Decorative shapes */}
      <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-primary-foreground/5" />
      <div className="absolute -bottom-16 -left-16 w-48 h-48 rounded-full bg-primary-foreground/5" />
      <div className="absolute top-1/2 right-1/4 w-24 h-24 rounded-full bg-primary-foreground/3" />

      <div className="relative z-10 space-y-6">
        {/* Label */}
        <div className="flex items-center gap-2">
          <Building2 className="h-5 w-5 text-primary-foreground/70" />
          <span className="text-sm font-medium text-primary-foreground/70 uppercase tracking-wider">
            BRF Analys
          </span>
        </div>

        {/* Title */}
        <h1 className="text-3xl md:text-5xl text-primary-foreground leading-tight">
          {analysis.association.name}
        </h1>

        {/* Meta info pills */}
        <div className="flex flex-wrap gap-3">
          {analysis.association.address && (
            <span className="inline-flex items-center gap-1.5 text-sm text-primary-foreground/80 bg-primary-foreground/10 px-3 py-1.5 rounded-full">
              <MapPin className="h-3.5 w-3.5" />
              {analysis.association.address}
            </span>
          )}
          {analysis.association.buildYear && (
            <span className="inline-flex items-center gap-1.5 text-sm text-primary-foreground/80 bg-primary-foreground/10 px-3 py-1.5 rounded-full">
              <Calendar className="h-3.5 w-3.5" />
              {analysis.association.buildYear} ({buildingAge} år)
            </span>
          )}
          {analysis.association.apartments && (
            <span className="inline-flex items-center gap-1.5 text-sm text-primary-foreground/80 bg-primary-foreground/10 px-3 py-1.5 rounded-full">
              <Home className="h-3.5 w-3.5" />
              {analysis.association.apartments} lägenheter
            </span>
          )}
        </div>

        {/* Assessment badge */}
        <div className={`inline-flex items-center gap-4 px-6 py-4 rounded-2xl backdrop-blur-sm ${getAssessmentBgColor(analysis.overallAssessment)} border border-primary-foreground/10`}>
          <span className="text-4xl">{getAssessmentEmoji(analysis.overallAssessment)}</span>
          <div>
            <p className={`text-xl font-bold ${getAssessmentColor(analysis.overallAssessment)}`}>
              {getAssessmentLabel(analysis.overallAssessment)}
            </p>
            <p className="text-sm text-foreground/60 max-w-md">{analysis.assessmentReason}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
