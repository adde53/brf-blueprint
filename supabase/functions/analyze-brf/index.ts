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

Din uppgift är att extrahera följande information från årsredovisningen:

EKONOMISKA NYCKELTAL:
- Föreningens namn
- Räkenskapsår
- Totala skulder (lån)
- Total bostadsarea (kvm)
- Beräkna lån per kvm
- Årsavgifter totalt
- Beräkna avgift per kvm/år
- Avsättning till underhållsfond per år
- Beräkna sparande per kvm/år
- Soliditet (eget kapital / totala tillgångar)
- Resultat efter finansiella poster
- Räntekostnader

TEKNISKT UNDERHÅLL (leta efter information om):
- Tak (senaste renovering, planerad åtgärd)
- Fasad (typ, senaste renovering)
- Stammar/rör (senaste stambyte eller planerat)
- Fönster (typ, ålder)
- Hissar (senaste renovering)
- Ventilation (typ, senaste åtgärd)
- El-system
- Värmesystem
- Grund/dränering
- Övriga planerade underhållsåtgärder

BYGGNADSINFORMATION:
- Byggnadsår
- Antal lägenheter
- Adress

Var noggrann och extrahera bara information som faktiskt finns i dokumentet. Om något saknas, ange "Ej angivet".`;

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
                    items: {
                      type: "object",
                      properties: {
                        category: { 
                          type: "string", 
                          enum: ["tak", "fasad", "stammar", "grund", "ventilation", "el", "varme", "hissar", "fonster", "trapphus", "portar", "kulvertar", "ovrigt"]
                        },
                        name: { type: "string", description: "Beskrivande namn" },
                        lastMaintained: { type: "number", description: "År för senaste underhåll/renovering" },
                        plannedYear: { type: "number", description: "Planerat år för nästa åtgärd" },
                        materialType: { type: "string", description: "Materialtyp om relevant" },
                        notes: { type: "string", description: "Övriga noteringar" }
                      },
                      required: ["category", "name"]
                    }
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
                required: ["association", "financial", "technical", "summary"]
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
