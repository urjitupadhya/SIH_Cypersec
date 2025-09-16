"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Shield,
  AlertTriangle,
  TrendingUp,
  Plus,
  Bell,
  Search,
  User,
  Calculator,
  Home,
  Menu,
  X,
  Sparkles,
  Zap,
  Eye,
} from "lucide-react"
import Link from "next/link"

// Mock data for the feed
const scamAlerts = [
  {
    id: 1,
    title: "Fake Amazon Prime Renewal Email",
    description: "Phishing emails claiming your Amazon Prime membership needs renewal with suspicious payment links.",
    date: "2 hours ago",
    riskLevel: "High",
    category: "Phishing",
    reports: 127,
  },
  {
    id: 2,
    title: "Cryptocurrency Investment Scam",
    description: "Fraudulent investment opportunities promising unrealistic returns on cryptocurrency investments.",
    date: "5 hours ago",
    riskLevel: "Critical",
    category: "Investment Fraud",
    reports: 89,
  },
  {
    id: 3,
    title: "Tech Support Phone Scam",
    description: "Cold calls claiming to be from Microsoft or Apple offering to fix computer problems.",
    date: "1 day ago",
    riskLevel: "Medium",
    category: "Phone Scam",
    reports: 156,
  },
]

const securityTips = [
  {
    id: 1,
    title: "Verify Email Senders",
    description: "Always check the sender's email address carefully before clicking any links.",
    icon: "🔍",
  },
  {
    id: 2,
    title: "Use Two-Factor Authentication",
    description: "Enable 2FA on all your important accounts for an extra layer of security.",
    icon: "🔐",
  },
  {
    id: 3,
    title: "Keep Software Updated",
    description: "Regular updates patch security vulnerabilities that scammers exploit.",
    icon: "🔄",
  },
]

export default function HomePage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "Critical":
        return "!bg-red-700 !text-white !border-red-600 shadow-glow"
      case "High":
        return "!bg-orange-700 !text-white !border-orange-600 shadow-lg"
      case "Medium":
        return "!bg-yellow-700 !text-white !border-yellow-600 shadow-md"
      default:
        return "bg-secondary text-secondary-foreground"
    }
  }

  return (
    <div className="min-h-screen gradient-surface">
      <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden hover:bg-primary/10"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 gradient-primary rounded-xl shadow-glow animate-pulse-slow">
                <Shield className="w-6 h-6 text-primary-foreground" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-xl bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  AI Scam Shield
                </span>
                <span className="text-xs text-muted-foreground">Stay Protected</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-3 bg-card/50 backdrop-blur-sm rounded-xl px-4 py-2.5 w-72 border border-border/50 hover:border-primary/30 transition-all duration-200">
              <Search className="h-4 w-4 text-primary" />
              <input
                type="text"
                placeholder="Search scam alerts..."
                className="bg-transparent border-none outline-none flex-1 text-sm placeholder:text-muted-foreground"
              />
              <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                ⌘K
              </kbd>
            </div>
            <div className="relative">
              <Button variant="ghost" size="icon" className="hover:bg-primary/10 hover:text-primary transition-colors">
                <Bell className="h-5 w-5" />
              </Button>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-destructive rounded-full animate-pulse"></div>
            </div>
            <Avatar className="h-9 w-9 border-2 border-primary/20 hover:border-primary/40 transition-colors">
              <AvatarImage src="/diverse-user-avatars.png" />
              <AvatarFallback className="bg-gradient-primary text-primary-foreground font-semibold">JD</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </header>

      <div className="flex">
        <aside
          className={`fixed inset-y-0 left-0 z-40 w-64 bg-card/80 backdrop-blur-xl border-r border-border/50 transform transition-all duration-300 ease-out md:relative md:translate-x-0 ${
            sidebarOpen ? "translate-x-0 shadow-xl" : "-translate-x-full"
          }`}
        >
          <div className="flex flex-col h-full pt-16 md:pt-0">
            <nav className="flex-1 px-4 py-6 space-y-2">
              <Link
                href="/"
                className="flex items-center gap-3 px-4 py-3 rounded-xl gradient-primary text-primary-foreground shadow-glow animate-scale-in"
              >
                <Home className="h-5 w-5" />
                <span className="font-medium">Home</span>
              </Link>
              <Link
                href="/calculator"
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-muted-foreground hover:bg-primary/10 hover:text-primary transition-all duration-200 group"
              >
                <Calculator className="h-5 w-5 group-hover:scale-110 transition-transform" />
                <span className="font-medium">Risk Calculator</span>
                <Sparkles className="h-4 w-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
              <Link
                href="/profile"
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-muted-foreground hover:bg-secondary/10 hover:text-secondary transition-all duration-200 group"
              >
                <User className="h-5 w-5 group-hover:scale-110 transition-transform" />
                <span className="font-medium">Profile</span>
                <Eye className="h-4 w-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
            </nav>

            <div className="p-4 border-t border-border/50">
              <div className="bg-gradient-to-r from-accent/10 to-primary/10 rounded-xl p-3">
                <div className="flex items-center gap-2 text-sm">
                  <Zap className="h-4 w-4 text-accent" />
                  <span className="font-medium">Protection Active</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">127 threats blocked today</p>
              </div>
            </div>
          </div>
        </aside>

        {sidebarOpen && (
          <div
            className="fixed inset-0 z-30 bg-black/20 backdrop-blur-sm md:hidden animate-fade-in"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className="flex-1 p-6 md:ml-0">
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="text-center space-y-6 animate-slide-up">
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium animate-bounce-subtle">
                <Sparkles className="h-4 w-4" />
                AI-Powered Protection
              </div>
              <h1 className="text-5xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent text-balance">
                Stay Protected from Scams
              </h1>
              <p className="text-xl text-muted-foreground text-balance max-w-2xl mx-auto leading-relaxed">
                Get real-time alerts, analyze suspicious content with AI, and learn how to stay safe online with our
                comprehensive protection suite
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in">
              <Card className="group hover:shadow-xl hover:shadow-primary/10 transition-all duration-300 hover:-translate-y-1 border-border/50 bg-card/50 backdrop-blur-sm">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3">
                    <div className="p-3 gradient-primary rounded-xl shadow-glow group-hover:shadow-glow-secondary transition-all duration-300">
                      <Calculator className="h-6 w-6 text-primary-foreground group-hover:scale-110 transition-transform" />
                    </div>
                    <div>
                      <CardTitle className="text-lg group-hover:text-primary transition-colors">
                        Analyze Content
                      </CardTitle>
                      <div className="flex items-center gap-1 text-xs text-accent">
                        <Sparkles className="h-3 w-3" />
                        AI Powered
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base leading-relaxed">
                    Check if an email or message is a scam using advanced AI analysis and machine learning
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="group hover:shadow-xl hover:shadow-secondary/10 transition-all duration-300 hover:-translate-y-1 border-border/50 bg-card/50 backdrop-blur-sm">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3">
                    <div className="p-3 gradient-secondary rounded-xl shadow-glow-secondary group-hover:shadow-glow-accent transition-all duration-300">
                      <TrendingUp className="h-6 w-6 text-secondary-foreground group-hover:scale-110 transition-transform" />
                    </div>
                    <div>
                      <CardTitle className="text-lg group-hover:text-secondary transition-colors">
                        Latest Trends
                      </CardTitle>
                      <div className="flex items-center gap-1 text-xs text-primary">
                        <Zap className="h-3 w-3" />
                        Real-time
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base leading-relaxed">
                    Stay updated on the newest scam patterns, techniques, and emerging threats in real-time
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="group hover:shadow-xl hover:shadow-accent/10 transition-all duration-300 hover:-translate-y-1 border-border/50 bg-card/50 backdrop-blur-sm">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3">
                    <div className="p-3 gradient-accent rounded-xl shadow-glow-accent group-hover:shadow-glow transition-all duration-300">
                      <Plus className="h-6 w-6 text-accent-foreground group-hover:scale-110 transition-transform" />
                    </div>
                    <div>
                      <CardTitle className="text-lg group-hover:text-accent transition-colors">Report Scam</CardTitle>
                      <div className="flex items-center gap-1 text-xs text-secondary">
                        <Shield className="h-3 w-3" />
                        Community
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base leading-relaxed">
                    Help protect the community by reporting new scams and suspicious activities you encounter
                  </CardDescription>
                </CardContent>
              </Card>
            </div>

            <section className="space-y-6 animate-slide-up">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <h2 className="text-3xl font-bold bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
                    Recent Scam Alerts
                  </h2>
                  <Badge className="bg-destructive/10 text-destructive border-destructive/20 animate-pulse">Live</Badge>
                </div>
                <Button
                  variant="outline"
                  className="hover:bg-primary hover:text-primary-foreground transition-colors bg-transparent"
                >
                  View All
                </Button>
              </div>

              <div className="space-y-4">
                {scamAlerts.map((alert, index) => (
                  <Card
                    key={alert.id}
                    className={`group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-border/50 bg-card/50 backdrop-blur-sm animate-slide-up`}
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="space-y-3 flex-1">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-destructive/10 rounded-lg group-hover:bg-destructive/20 transition-colors">
                              <AlertTriangle className="h-5 w-5 text-destructive group-hover:scale-110 transition-transform" />
                            </div>
                            <CardTitle className="text-lg group-hover:text-primary transition-colors">
                              {alert.title}
                            </CardTitle>
                          </div>
                          <CardDescription className="text-base leading-relaxed">{alert.description}</CardDescription>
                        </div>
                        <div
                          className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ml-4 animate-pulse ${getRiskColor(alert.riskLevel)}`}
                        >
                          {alert.riskLevel}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-4">
                          <span className="text-muted-foreground">{alert.date}</span>
                          <Badge
                            variant="outline"
                            className="border-primary/20 text-primary hover:bg-primary/10 transition-colors"
                          >
                            {alert.category}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Eye className="h-4 w-4" />
                          <span className="font-medium">{alert.reports} reports</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>

            <section className="space-y-6 animate-slide-up">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
                Security Tips
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {securityTips.map((tip, index) => (
                  <Card
                    key={tip.id}
                    className={`group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-border/50 bg-card/50 backdrop-blur-sm animate-scale-in`}
                    style={{ animationDelay: `${index * 150}ms` }}
                  >
                    <CardHeader>
                      <div className="flex items-center gap-4">
                        <div className="text-3xl p-3 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-xl group-hover:scale-110 transition-transform">
                          {tip.icon}
                        </div>
                        <CardTitle className="text-lg group-hover:text-primary transition-colors">
                          {tip.title}
                        </CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-base leading-relaxed">{tip.description}</CardDescription>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          </div>
        </main>
      </div>

      <Button
        size="lg"
        className="fixed bottom-6 right-6 h-16 w-16 rounded-2xl gradient-primary shadow-xl hover:shadow-2xl hover:shadow-primary/20 transition-all duration-300 hover:scale-110 animate-float group"
      >
        <Plus className="h-7 w-7 group-hover:rotate-90 transition-transform duration-300" />
      </Button>
    </div>
  )
}
