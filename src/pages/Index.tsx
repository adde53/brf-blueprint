import { useState } from "react";
import { Building2 } from "lucide-react";
import { ReportUploader } from "@/components/ReportUploader";
import { AnalysisResults } from "@/components/AnalysisResults";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { BrfAnalysisResult } from "@/types/brfAnalysis";

const Index = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<BrfAnalysisResult | null>(null);
  const { toast } = useToast();

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const result = reader.result as string;
        const base64 = result.split(",")[1];
        resolve(base64);
      };
      reader.onerror = reject;
    });
  };

  const handleAnalyze = async (files: File[]) => {
    setIsAnalyzing(true);
    
    try {
      // Analyze the first PDF (can be extended for multiple)
      const file = files[0];
      const base64 = await fileToBase64(file);

      toast({
        title: "Analyserar...",
        description: `Läser ${file.name} med AI. Detta kan ta en stund.`,
      });

      const { data, error } = await supabase.functions.invoke("analyze-brf", {
        body: { pdfBase64: base64, fileName: file.name },
      });

      if (error) {
        throw new Error(error.message);
      }

      if (!data.success) {
        throw new Error(data.error || "Analys misslyckades");
      }

      if (data.data) {
        setAnalysisResult(data.data);
        toast({
          title: "Analys klar!",
          description: `${data.data.association.name} har analyserats.`,
        });
      } else if (data.rawAnalysis) {
        // Fallback if structured extraction failed
        toast({
          title: "Delvis analys",
          description: "Kunde inte extrahera strukturerad data. Försök med en annan årsredovisning.",
          variant: "destructive",
        });
      }

    } catch (error) {
      console.error("Analysis error:", error);
      toast({
        title: "Fel vid analys",
        description: error instanceof Error ? error.message : "Något gick fel",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleBack = () => {
    setAnalysisResult(null);
  };

  if (analysisResult) {
    return <AnalysisResults analysis={analysisResult} onBack={handleBack} />;
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
            Ladda upp årsredovisningar så analyserar AI:n ekonomi och tekniskt skick.
          </p>
        </div>

        {/* Uploader */}
        <ReportUploader onAnalyze={handleAnalyze} isAnalyzing={isAnalyzing} />

        {/* Info */}
        <p className="text-xs text-center text-muted-foreground mt-8">
          Ladda upp en eller flera årsredovisningar (PDF). AI:n extraherar lån, avgifter, underhållsplan och risker automatiskt.
        </p>
      </div>
    </div>
  );
};

export default Index;
