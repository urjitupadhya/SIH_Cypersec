"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Shield, AlertTriangle, CheckCircle, XCircle, Loader2, ArrowLeft, Save, Share } from "lucide-react"
import Link from "next/link"

interface AnalysisResult {
  riskScore: number
  category: "Legit" | "Suspicious" | "Scam"
  explanation: string
  indicators: string[]
  confidence: number
}

export default function CalculatorPage() {
  const [content, setContent] = useState("")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [result, setResult] = useState<AnalysisResult | null>(null)

  const analyzeContent = async () => {
    if (!content.trim()) return

    setIsAnalyzing(true)

    // Simulate AI analysis with realistic delay
    setTimeout(() => {
      // Mock AI analysis result based on content
      const mockResult: AnalysisResult = {
        riskScore: Math.floor(Math.random() * 100),
        category: Math.random() > 0.7 ? "Scam" : Math.random() > 0.4 ? "Suspicious" : "Legit",
        explanation:
          "This content contains several red flags commonly associated with phishing attempts, including urgent language, suspicious links, and requests for personal information.",
        indicators: [
          "Urgent language detected",
          "Suspicious domain in links",
          "Request for personal information",
          "Poor grammar and spelling",
          "Generic greeting",
        ],
        confidence: 85 + Math.floor(Math.random() * 15),
      }

      setResult(mockResult)
      setIsAnalyzing(false)
    }, 3000)
  }

  const getRiskColor = (score: number) => {
    if (score >= 70) return "text-destructive"
    if (score >= 40) return "text-orange-500"
    return "text-accent"
  }

  const getRiskBgColor = (score: number) => {
    if (score >= 70) return "bg-destructive"
    if (score >= 40) return "bg-orange-500"
    return "bg-accent"
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Scam":
        return <XCircle className="h-6 w-6 text-destructive" />
      case "Suspicious":
        return <AlertTriangle className="h-6 w-6 text-orange-500" />
      case "Legit":
        return <CheckCircle className="h-6 w-6 text-accent" />
      default:
        return <Shield className="h-6 w-6" />
    }
  }

  const saveAnalysis = () => {
    // Mock save functionality
    alert("Analysis saved to your profile!")
  }

  const shareAnalysis = () => {
    // Mock share functionality
    navigator.clipboard.writeText(`AI Scam Shield Analysis: ${result?.category} (${result?.riskScore}% risk)`)
    alert("Analysis copied to clipboard!")
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center w-8 h-8 bg-primary rounded-lg">
                <Shield className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="font-bold text-xl">AI Risk Calculator</span>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="space-y-8">
          {/* Introduction */}
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold text-balance">Analyze Suspicious Content</h1>
            <p className="text-xl text-muted-foreground text-balance">
              Paste any email, message, or text content below and our AI will analyze it for potential scam indicators
            </p>
          </div>

          {/* Input Section */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                Content Analysis
              </CardTitle>
              <CardDescription>
                Paste the suspicious email content, message, or any text you want to analyze
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="Paste your suspicious email or message content here..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="min-h-[200px] text-base"
              />
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">{content.length} characters</span>
                <Button onClick={analyzeContent} disabled={!content.trim() || isAnalyzing} className="px-8">
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    "Analyze Content"
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Analysis Loading */}
          {isAnalyzing && (
            <Card className="shadow-lg">
              <CardContent className="py-12">
                <div className="text-center space-y-4">
                  <div className="flex justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                  </div>
                  <h3 className="text-xl font-semibold">AI Analysis in Progress</h3>
                  <p className="text-muted-foreground">Our AI is examining the content for scam indicators...</p>
                  <div className="max-w-md mx-auto">
                    <Progress value={33} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Results Section */}
          {result && !isAnalyzing && (
            <div className="space-y-6">
              {/* Risk Score Card */}
              <Card className="shadow-lg border-2">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      {getCategoryIcon(result.category)}
                      Analysis Results
                    </CardTitle>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={saveAnalysis}>
                        <Save className="h-4 w-4 mr-2" />
                        Save
                      </Button>
                      <Button variant="outline" size="sm" onClick={shareAnalysis}>
                        <Share className="h-4 w-4 mr-2" />
                        Share
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Risk Score */}
                  <div className="text-center space-y-4">
                    <div className="space-y-2">
                      <div className={`text-6xl font-bold ${getRiskColor(result.riskScore)}`}>{result.riskScore}%</div>
                      <div className="text-2xl font-semibold text-muted-foreground">Risk Score</div>
                    </div>
                    <div className="max-w-md mx-auto">
                      <Progress value={result.riskScore} className="h-4" />
                    </div>
                  </div>

                  {/* Category and Confidence */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-muted rounded-lg">
                      <div className="text-sm text-muted-foreground mb-1">Category</div>
                      <Badge
                        className={`text-lg px-4 py-2 ${
                          result.category === "Scam"
                            ? "bg-destructive text-destructive-foreground"
                            : result.category === "Suspicious"
                              ? "bg-orange-500 text-white"
                              : "bg-accent text-accent-foreground"
                        }`}
                      >
                        {result.category}
                      </Badge>
                    </div>
                    <div className="text-center p-4 bg-muted rounded-lg">
                      <div className="text-sm text-muted-foreground mb-1">Confidence</div>
                      <div className="text-2xl font-bold">{result.confidence}%</div>
                    </div>
                  </div>

                  {/* Explanation */}
                  <div className="space-y-2">
                    <h4 className="font-semibold text-lg">AI Explanation</h4>
                    <p className="text-muted-foreground leading-relaxed">{result.explanation}</p>
                  </div>

                  {/* Risk Indicators */}
                  <div className="space-y-3">
                    <h4 className="font-semibold text-lg">Risk Indicators Found</h4>
                    <div className="space-y-2">
                      {result.indicators.map((indicator, index) => (
                        <div key={index} className="flex items-center gap-2 p-2 bg-muted rounded-lg">
                          <AlertTriangle className="h-4 w-4 text-orange-500 flex-shrink-0" />
                          <span className="text-sm">{indicator}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Recommendations */}
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle>Recommendations</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {result.category === "Scam" && (
                      <>
                        <div className="flex items-start gap-2 p-3 bg-destructive/10 rounded-lg">
                          <XCircle className="h-5 w-5 text-destructive mt-0.5 flex-shrink-0" />
                          <div>
                            <div className="font-medium text-destructive">Do not interact with this content</div>
                            <div className="text-sm text-muted-foreground">
                              Delete the message and do not click any links or provide personal information.
                            </div>
                          </div>
                        </div>
                        <div className="flex items-start gap-2 p-3 bg-orange-500/10 rounded-lg">
                          <AlertTriangle className="h-5 w-5 text-orange-500 mt-0.5 flex-shrink-0" />
                          <div>
                            <div className="font-medium text-orange-500">Report this scam</div>
                            <div className="text-sm text-muted-foreground">
                              Help others by reporting this to the appropriate authorities.
                            </div>
                          </div>
                        </div>
                      </>
                    )}
                    {result.category === "Suspicious" && (
                      <div className="flex items-start gap-2 p-3 bg-orange-500/10 rounded-lg">
                        <AlertTriangle className="h-5 w-5 text-orange-500 mt-0.5 flex-shrink-0" />
                        <div>
                          <div className="font-medium text-orange-500">Proceed with caution</div>
                          <div className="text-sm text-muted-foreground">
                            Verify the sender through official channels before taking any action.
                          </div>
                        </div>
                      </div>
                    )}
                    {result.category === "Legit" && (
                      <div className="flex items-start gap-2 p-3 bg-accent/10 rounded-lg">
                        <CheckCircle className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
                        <div>
                          <div className="font-medium text-accent">Content appears legitimate</div>
                          <div className="text-sm text-muted-foreground">
                            However, always remain vigilant and verify important requests independently.
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Tips Section */}
          {!result && !isAnalyzing && (
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>How It Works</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center space-y-2">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                      <span className="text-primary font-bold">1</span>
                    </div>
                    <h4 className="font-semibold">Paste Content</h4>
                    <p className="text-sm text-muted-foreground">Copy and paste the suspicious email or message</p>
                  </div>
                  <div className="text-center space-y-2">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                      <span className="text-primary font-bold">2</span>
                    </div>
                    <h4 className="font-semibold">AI Analysis</h4>
                    <p className="text-sm text-muted-foreground">Our AI examines patterns and red flags</p>
                  </div>
                  <div className="text-center space-y-2">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                      <span className="text-primary font-bold">3</span>
                    </div>
                    <h4 className="font-semibold">Get Results</h4>
                    <p className="text-sm text-muted-foreground">
                      Receive detailed risk assessment and recommendations
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  )
}
