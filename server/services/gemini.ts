import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize the Gemini API client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function analyzeImage(imageBuffer: Buffer) {
  try {
    // Using the newer Gemini 2.0 Flash model instead of the deprecated pro-vision
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

    const prompt = `Analyze this artwork and provide:
    1. The artistic style
    2. Historical period
    3. Key insights about the composition, technique, and meaning
    4. Related artists who might have influenced this work
    5. Art movements this piece connects to
    Format the response as JSON with these fields:
    {
      "style": "string",
      "period": "string",
      "insights": ["string"],
      "connections": {
        "artists": ["string"],
        "movements": ["string"]
      }
    }`;

    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          data: imageBuffer.toString("base64"),
          mimeType: "image/jpeg",
        },
      },
    ]);

    const response = result.response;
    let jsonResponse;
    try {
      const text = response.text();
      // Remove markdown code block if present
      const jsonStr = text.replace(/^```json\n|\n```$/g, '').trim();
      jsonResponse = JSON.parse(jsonStr);
    } catch (parseError) {
      // If JSON parsing fails, return a structured error response
      console.error("Failed to parse Gemini response:", response.text());
      throw new Error("Invalid response format from Gemini API");
    }

    return jsonResponse;
  } catch (error) {
    console.error("Gemini API error:", error);
    throw new Error("Failed to analyze image with Gemini API");
  }
}
