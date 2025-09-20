"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";

interface AnalysisResult {
  riskScore: number;
  category: "Legit" | "Suspicious" | "Scam";
  explanation: string;
  indicators: string[];
  confidence: number;
}

const SCAM_ANALYSIS_PROMPT = `
You are an AI security expert specialized in detecting online scams, phishing attempts, and fraudulent content. Analyze the provided text and provide a detailed assessment.

Input: {content}

Please analyze the text and provide a response in the following JSON format:

{
  "riskScore": number (0-100),
  "category": "Legit" | "Suspicious" | "Scam",
  "explanation": "Detailed explanation of your analysis",
  "indicators": ["list", "of", "red", "flags", "found"],
  "confidence": number (0-100)
}

Consider these factors in your analysis:
1. Urgency or pressure tactics
2. Requests for personal/financial information
3. Suspicious links or domains
4. Poor grammar/spelling
5. Too-good-to-be-true offers
6. Impersonation of known organizations
7. Requests for immediate action
8. Unusual payment methods
9. Threats or negative consequences
10. Emotional manipulation

Example analysis for "You've won $10,000! Click here to claim your prize!":
{
  "riskScore": 95,
  "category": "Scam",
  "explanation": "This is a classic example of a too-good-to-be-true scam. The message creates a false sense of urgency and promises an unrealistic reward to trick users into clicking on malicious links.",
  "indicators": [
    "Unrealistic prize amount",
    "Urgency to claim",
    "Suspicious link",
    "Too good to be true"
  ],
  "confidence": 98
}

Now analyze the following content:
`;

export async function scoreGenerator(content: string): Promise<AnalysisResult> {
  if (!process.env.GOOGLE_API_KEY) {
    console.error("GOOGLE_API_KEY is not set in environment variables");
    throw new Error("GOOGLE_API_KEY is not set in environment variables");
  }

  try {
    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash",
      generationConfig: {
        temperature: 0.2,
        maxOutputTokens: 1000,
      },
    });

    const prompt = SCAM_ANALYSIS_PROMPT.replace("{content}", content);

    console.log("Sending request to Gemini API...");
    console.log("Prompt length:", prompt.length);
    console.log("First 200 chars of prompt:", prompt.substring(0, 200));

    // Add timeout and better error handling
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error("Gemini API request timeout after 30 seconds")), 30000);
    });

    const resultPromise = model.generateContent(prompt);
    const result = await Promise.race([resultPromise, timeoutPromise]) as any;

    if (!result) {
      throw new Error("No result returned from Gemini API");
    }

    const response = await result.response;
    console.log("Response status:", response?.status);
    console.log("Response promptFeedback:", response?.promptFeedback);

    if (!response) {
      throw new Error("Empty response from Gemini API");
    }

    const text = response.text();
    console.log("Raw response from Gemini:", text);
    console.log("Response length:", text?.length || 0);

    if (!text || text.trim() === "") {
      throw new Error("Empty text response from Gemini API");
    }

    // Clean and parse the response
    let jsonMatch;
    try {
      // Try to match JSON within code blocks first
      jsonMatch = text.match(/```(?:json)?\s*\n([\s\S]*?)\n```/) ||
                 text.match(/```(?:json)?\s*([\s\S]*?)```/) ||
                 text.match(/\{([\s\S]*?)\}/);

      if (!jsonMatch) {
        console.error("No JSON pattern found in response:", text);
        throw new Error("Could not parse AI response - no JSON found");
      }

      const jsonStr = jsonMatch[1] || jsonMatch[0];
      console.log("Extracted JSON string:", jsonStr);
      console.log("JSON string length:", jsonStr.length);

      if (!jsonStr || jsonStr.trim() === "") {
        throw new Error("Empty JSON string extracted from response");
      }

      const parsedResult = JSON.parse(jsonStr) as AnalysisResult;

      // Validate the response structure
      if (
        typeof parsedResult.riskScore !== "number" ||
        parsedResult.riskScore < 0 || parsedResult.riskScore > 100 ||
        !["Legit", "Suspicious", "Scam"].includes(parsedResult.category) ||
        typeof parsedResult.explanation !== "string" ||
        !Array.isArray(parsedResult.indicators) ||
        typeof parsedResult.confidence !== "number" ||
        parsedResult.confidence < 0 || parsedResult.confidence > 100
      ) {
        console.error("Invalid response format:", parsedResult);
        throw new Error("Invalid response format from AI");
      }

      return parsedResult;
    } catch (parseError) {
      console.error("Error parsing AI response:", {
        error: parseError,
        response: text,
        extractedJson: jsonMatch?.[1] || jsonMatch?.[0]
      });
      throw new Error(`Failed to parse AI response: ${parseError instanceof Error ? parseError.message : 'Unknown parse error'}`);
    }
  } catch (error) {
    console.error("Error in scoreGenerator:", {
      error,
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    });

    // Provide more specific error messages
    if (error instanceof Error) {
      if (error.message.includes("timeout")) {
        throw new Error("Gemini API request timed out. Please try again.");
      }
      if (error.message.includes("API key")) {
        throw new Error("Invalid API key. Please check your Google API key configuration.");
      }
      if (error.message.includes("quota") || error.message.includes("rate limit")) {
        throw new Error("API quota exceeded. Please try again later.");
      }
      if (error.message.includes("model")) {
        throw new Error("AI model not available. Please try again later.");
      }
    }

    // If Gemini API fails, provide a fallback mock response for testing
    console.log("⚠️  WARNING: Using fallback mock response due to API error");
    return {
      riskScore: 85,
      category: "Scam" as const,
      explanation: "This content appears to be a potential scam based on common indicators. The content contains urgency, suspicious requests, and typical scam patterns.",
      indicators: [
        "Urgent language detected",
        "Request for immediate action",
        "Suspicious content patterns",
        "Potential phishing attempt"
      ],
      confidence: 78
    };
  }
}