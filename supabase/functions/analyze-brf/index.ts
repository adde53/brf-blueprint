import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { pdfBase64, fileName } = await req.json();

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    console.log("Analyzing PDF:", fileName);

    const systemPrompt = `Du är en expert på att analysera svenska bostadsrättsföreningars årsredovisningar.

Din uppgift är att:
1. Extrahera all relevant data från årsredovisningen
2. Bedöma varje byggnadsdels skick baserat på byggnadsår och underhållshistorik
3. Ge en övergripande bedömning av föreningen
4. Analysera vad som ingår i avgiften

EKONOMISKA NYCKELTAL att leta efter:
- Föreningens namn, adress, byggnadsår, antal lägenheter
- Totala skulder (lån) och total bostadsarea → beräkna lån per kvm
- Årsavgifter → beräkna avgift per kvm/år  
- Avsättning till underhållsfond → beräkna sparande per kvm/år
- Soliditet, resultat, räntekostnader

VAD INGÅR I AVGIFTEN (viktig för köpare!):
Leta efter information om vad som ingår i månadsavgiften:
- Värme (fjärrvärme, bergvärme, etc.) - typiskt värde ~300-600 kr/mån
- Vatten (kallvatten, varmvatten) - typiskt värde ~200-400 kr/mån  
- El i gemensamma utrymmen
- Bredband/TV om det ingår - typiskt värde ~300-500 kr/mån
- Parkering om det ingår - typiskt värde ~500-1500 kr/mån
- Försäkring (bostadsrättstillägg) - typiskt värde ~100-300 kr/mån
- Sophantering
- Underhållsfond

BYGGNADSTEKNISKA KOMPONENTER att bedöma (ange status grön/gul/röd baserat på ålder och underhåll):
- Tak (livslängd ~40-50 år)
- Fasad (livslängd ~40-60 år) 
- Stammar/rör (livslängd ~50-60 år)
- Fönster (livslängd ~30-40 år)
- El-system (livslängd ~40-50 år)
- Ventilation (livslängd ~20-30 år)
- Värmesystem (livslängd ~20-30 år)
- Hissar om finns (livslängd ~25-35 år)
- Grund/dränering (livslängd ~40-50 år)
- Trapphus, portar, tvättstuga etc.

HELHETSBEDÖMNING:
Ge en samlad bedömning: "utmärkt", "bra", "normal", "ansträngd" eller "kritisk" baserat på:
- Ekonomisk styrka (låg skuldsättning, bra sparande, god soliditet)
- Tekniskt skick (välskött underhåll, inga akuta behov)
- Framtidsutsikter (planerade åtgärder, risk för avgiftshöjningar)

Var noggrann och extrahera bara information som faktiskt finns. Om något saknas, hoppa över det.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          {
            role: "user",
            content: [
              {
                type: "text",
                text: "Analysera denna årsredovisning och extrahera all relevant information för BRF-analys."
              },
              {
                type: "image_url",
                image_url: {
                  url: `data:application/pdf;base64,${pdfBase64}`
                }
              }
            ]
          }
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "extract_brf_data",
              description: "Extrahera strukturerad data från en BRF årsredovisning",
              parameters: {
                type: "object",
                properties: {
                  association: {
                    type: "object",
                    properties: {
                      name: { type: "string", description: "Föreningens namn" },
                      address: { type: "string", description: "Adress" },
                      buildYear: { type: "number", description: "Byggnadsår" },
                      apartments: { type: "number", description: "Antal lägenheter" },
                      totalArea: { type: "number", description: "Total bostadsarea i kvm" },
                      fiscalYear: { type: "string", description: "Räkenskapsår" }
                    },
                    required: ["name"]
                  },
                  financial: {
                    type: "object",
                    properties: {
                      totalLoans: { type: "number", description: "Totala lån i kr" },
                      loanPerSqm: { type: "number", description: "Lån per kvm" },
                      totalFees: { type: "number", description: "Totala årsavgifter" },
                      feePerSqmYear: { type: "number", description: "Avgift per kvm/år" },
                      maintenanceSavings: { type: "number", description: "Avsättning underhållsfond per år" },
                      savingsPerSqmYear: { type: "number", description: "Sparande per kvm/år" },
                      solidarity: { type: "number", description: "Soliditet i procent" },
                      result: { type: "number", description: "Resultat efter finansiella poster" },
                      interestCosts: { type: "number", description: "Räntekostnader" },
                      equity: { type: "number", description: "Eget kapital" },
                      totalAssets: { type: "number", description: "Totala tillgångar" }
                    }
                  },
                  technical: {
                    type: "array",
                    description: "Lista över byggnadstekniska komponenter och deras status",
                    items: {
                      type: "object",
                      properties: {
                        category: { 
                          type: "string", 
                          enum: ["tak", "fasad", "stammar", "grund", "ventilation", "el", "varme", "hissar", "fonster", "trapphus", "portar", "tvattstuga", "garage", "ovrigt"]
                        },
                        name: { type: "string", description: "Beskrivande namn" },
                        status: {
                          type: "string",
                          enum: ["good", "warning", "critical"],
                          description: "Bedömt skick: good (grön), warning (gul), critical (röd)"
                        },
                        lastMaintained: { type: "number", description: "År för senaste underhåll/renovering" },
                        plannedYear: { type: "number", description: "Planerat år för nästa åtgärd" },
                        materialType: { type: "string", description: "Materialtyp om relevant" },
                        notes: { type: "string", description: "Övriga noteringar om skick, åtgärder etc." }
                      },
                      required: ["category", "name", "status"]
                    }
                  },
                  feeIncludes: {
                    type: "array",
                    description: "Vad som ingår i månadsavgiften",
                    items: {
                      type: "object",
                      properties: {
                        item: { 
                          type: "string", 
                          enum: ["heating", "water", "electricity", "internet_tv", "parking", "insurance", "waste", "maintenance_fund", "other"],
                          description: "Typ av kostnad som ingår"
                        },
                        name: { type: "string", description: "Beskrivning på svenska" },
                        estimatedMonthlyCost: { type: "number", description: "Uppskattad månadskostnad om det betalades separat (kr/mån)" },
                        notes: { type: "string", description: "Detaljer, t.ex. fjärrvärme, bergvärme etc." }
                      },
                      required: ["item", "name"]
                    }
                  },
                  feeAnalysis: {
                    type: "string",
                    description: "Analys av avgiften: Är den hög/låg givet vad som ingår? Finns risk för höjning?"
                  },
                  overallAssessment: {
                    type: "string",
                    enum: ["excellent", "good", "normal", "strained", "critical"],
                    description: "Övergripande bedömning av föreningen: excellent (utmärkt), good (bra), normal, strained (ansträngd), critical (kritisk)"
                  },
                  assessmentReason: {
                    type: "string",
                    description: "Kort motivering till helhetsbedömningen"
                  },
                  risks: {
                    type: "array",
                    items: { type: "string" },
                    description: "Identifierade risker och varningar"
                  },
                  positives: {
                    type: "array",
                    items: { type: "string" },
                    description: "Positiva aspekter"
                  },
                  summary: {
                    type: "string",
                    description: "Kort sammanfattning av föreningens status"
                  }
                },
                required: ["association", "financial", "technical", "overallAssessment", "assessmentReason", "summary"]
              }
            }
          }
        ],
        tool_choice: { type: "function", function: { name: "extract_brf_data" } }
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "För många förfrågningar, försök igen om en stund." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI-krediter slut, vänligen fyll på." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error(`AI-fel: ${response.status}`);
    }

    const data = await response.json();
    console.log("AI response received");

    // Extract the tool call result
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall) {
      // Fallback to content if no tool call
      const content = data.choices?.[0]?.message?.content;
      return new Response(
        JSON.stringify({ success: true, rawAnalysis: content }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const extractedData = JSON.parse(toolCall.function.arguments);
    console.log("Extracted data:", JSON.stringify(extractedData, null, 2));

    return new Response(
      JSON.stringify({ success: true, data: extractedData }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Analysis error:", error);
    const errorMessage = error instanceof Error ? error.message : "Okänt fel";
    return new Response(
      JSON.stringify({ success: false, error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
