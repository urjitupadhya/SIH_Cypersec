import { scoreGenerator } from "@/lib/actions";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { content } = await request.json();

    if (!content || typeof content !== "string") {
      return NextResponse.json(
        {
          error: "Content is required and must be a string",
          details: "No content provided or invalid format"
        },
        { status: 400 }
      );
    }

    // Validate content length
    if (content.trim().length === 0) {
      return NextResponse.json(
        {
          error: "Content cannot be empty",
          details: "Please provide some text to analyze"
        },
        { status: 400 }
      );
    }

    // Validate content is not too long (Gemini has token limits)
    if (content.length > 10000) {
      return NextResponse.json(
        {
          error: "Content is too long",
          details: "Please provide content with less than 10,000 characters"
        },
        { status: 400 }
      );
    }

    console.log("API route: Received content for analysis, length:", content.length);

    const result = await scoreGenerator(content);
    console.log("API route: Analysis completed successfully");
    return NextResponse.json(result);

  } catch (error) {
    console.error("API Error:", {
      error,
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    });

    // More specific error responses based on error type
    if (error instanceof Error) {
      if (error.message.includes("GOOGLE_API_KEY")) {
        return NextResponse.json(
          {
            error: "API Configuration Error",
            details: "Google API key is not configured. Please check your environment variables."
          },
          { status: 500 }
        );
      }
      if (error.message.includes("Invalid API key")) {
        return NextResponse.json(
          {
            error: "Authentication Error",
            details: "Invalid Google API key. Please check your API key configuration."
          },
          { status: 401 }
        );
      }
      if (error.message.includes("quota") || error.message.includes("rate limit")) {
        return NextResponse.json(
          {
            error: "Service Temporarily Unavailable",
            details: "API quota exceeded. Please try again in a few minutes."
          },
          { status: 429 }
        );
      }
      if (error.message.includes("timeout")) {
        return NextResponse.json(
          {
            error: "Request Timeout",
            details: "The analysis request took too long. Please try again."
          },
          { status: 408 }
        );
      }
      if (error.message.includes("model")) {
        return NextResponse.json(
          {
            error: "Service Error",
            details: "AI model is temporarily unavailable. Please try again later."
          },
          { status: 503 }
        );
      }
      if (error.message.includes("Failed to get response")) {
        return NextResponse.json(
          {
            error: "AI Service Error",
            details: "Failed to get response from AI service. This might be due to content restrictions or service issues."
          },
          { status: 503 }
        );
      }
    }

    // Generic error response
    return NextResponse.json(
      {
        error: "Analysis Failed",
        details: error instanceof Error ? error.message : "An unexpected error occurred during analysis"
      },
      { status: 500 }
    );
  }
}