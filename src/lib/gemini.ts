import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";

export interface GeminiAnalysisResult {
  budget: string;
  budget_is_estimate: boolean;
  location: string;
  category: string;
  deadline: string;
  description_short: string;
  requirements: string[];
}

const MODEL_NAME = "gemini-2.0-flash";

// Wir definieren das Schema hier, aber TypeScript ist oft zu streng beim Typen-Check.
// Deswegen nutzen wir unten "as any".
const analysisSchema = {
  description: "Analysis of a tender document",
  type: SchemaType.OBJECT,
  properties: {
    budget: {
      type: SchemaType.STRING,
      description: "Exact budget value (e.g. '150.000 €') or estimate (e.g. 'ca. 50.000 - 100.000 € (geschätzt)')",
      nullable: false,
    },
    budget_is_estimate: {
      type: SchemaType.BOOLEAN,
      description: "True if the budget is an estimate, false if it is an exact value found in the text",
      nullable: false,
    },
    location: {
      type: SchemaType.STRING,
      description: "City or location of execution",
      nullable: false,
    },
    category: {
      type: SchemaType.STRING,
      description: "Trade or category (e.g. Dachdecker, Elektro, Tiefbau)",
      nullable: false,
    },
    deadline: {
      type: SchemaType.STRING,
      description: "Submission deadline in YYYY-MM-DD format, or 'k.A.' if not found",
      nullable: false,
    },
    description_short: {
      type: SchemaType.STRING,
      description: "Short professional summary in 1-2 sentences",
      nullable: false,
    },
    requirements: {
      type: SchemaType.ARRAY,
      description: "List of technical requirements, certificates, or qualifications",
      items: {
        type: SchemaType.STRING,
      },
      nullable: false,
    },
  },
  required: ["budget", "budget_is_estimate", "location", "category", "deadline", "description_short", "requirements"],
};

export async function analyzeTenderText(
  fullText: string, 
  apiKey: string
): Promise<GeminiAnalysisResult> {
  if (!apiKey) {
    throw new Error("API key is missing");
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  
  const model = genAI.getGenerativeModel({ 
    model: MODEL_NAME,
    generationConfig: {
      responseMimeType: "application/json",
      // HIER WAR DER FEHLER: Wir casten es zu 'any', um den strikten Type-Check zu umgehen
      responseSchema: analysisSchema as any,
    }
  });

  const prompt = `Analysiere diesen VOLLSTÄNDIGEN Ausschreibungstext für einen Bauauftrag.

${fullText}

AUFGABEN:

1. **GELD/BUDGET:**
   - Suche nach konkreten Auftragswerten (€-Beträge, Summen).
   - Wenn KEINE Zahl im Text steht, schätze das Volumen anhand der Mengenbeschreibung:
     * Gering (kleine Reparaturen, Einzelaufträge): 5.000 - 25.000 €
     * Mittel (mittlere Projekte, Teilsanierungen): 25.000 - 100.000 €
     * Groß (Großprojekte, Neubauten, Jahresverträge): 100.000 - 500.000+ €
   - Markiere KLAR ob es ein exakter Wert oder eine Schätzung ist!

2. **TECHNISCHE ANFORDERUNGEN:**
   - Extrahiere alle technischen Bedingungen: Meisterpflicht, notwendige Maschinen, Zertifikate (ISO, etc.), Versicherungen, Referenzen, Qualifikationen.

3. **DETAILS:**
   - Ort/Stadt der Ausführung
   - Gewerk/Kategorie
   - Abgabefrist
   - Kurzbeschreibung (1-2 Sätze)
`;

  try {
    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    
    // With JSON mode, we can parse directly
    return JSON.parse(responseText) as GeminiAnalysisResult;
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    throw new Error(`Failed to analyze text: ${error instanceof Error ? error.message : String(error)}`);
  }
}
