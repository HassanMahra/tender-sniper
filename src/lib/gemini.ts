import { GoogleGenerativeAI } from "@google/generative-ai";

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

export async function analyzeTenderText(
  fullText: string, 
  apiKey: string
): Promise<GeminiAnalysisResult> {
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: MODEL_NAME });

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

Antworte NUR mit einem validen JSON-Objekt:
{
  "budget": "Exakter Wert z.B. '150.000 €' ODER Schätzung z.B. 'ca. 50.000 - 100.000 € (geschätzt)'",
  "budget_is_estimate": true/false,
  "location": "Stadt/Ort",
  "category": "Gewerk (z.B. Dachdecker, Elektro, Tiefbau, Sanitär, Maler)",
  "deadline": "YYYY-MM-DD oder 'k.A.'",
  "description_short": "Professionelle Kurzbeschreibung in 1-2 Sätzen",
  "requirements": ["Meisterbrief erforderlich", "Haftpflichtversicherung min. 1 Mio €", "ISO 9001 Zertifizierung", "..."]
}`;

  const result = await model.generateContent(prompt);
  const responseText = result.response.text();

  const jsonMatch = responseText.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error("Kein JSON in Gemini-Antwort gefunden");
  }

  return JSON.parse(jsonMatch[0]) as GeminiAnalysisResult;
}
