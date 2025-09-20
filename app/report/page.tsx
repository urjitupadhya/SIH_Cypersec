"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Shield,
  ArrowLeft,
  Search,
  FileText,
  Send,
  CheckCircle,
  Upload,
  Eye,
  AlertTriangle,
  Users,
  Clock,
  Loader2,
  X,
  File,
  ImageIcon,
  FileType,
} from "lucide-react"
import Link from "next/link"

interface FormData {
  fullName: string
  email: string
  phone: string
  crimeType: string
  description: string
  files: File[]
}

export default function ReportPage() {
  const [currentStep, setCurrentStep] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    email: "",
    phone: "",
    crimeType: "",
    description: "",
    files: [],
  })

  const steps = [
    {
      icon: <Search className="h-6 w-6" />,
      title: "Identify the Scam",
      description: "Recognize suspicious activity or fraudulent behavior",
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: <FileText className="h-6 w-6" />,
      title: "Collect Evidence",
      description: "Gather screenshots, emails, and relevant documentation",
      color: "from-purple-500 to-pink-500",
    },
    {
      icon: <Send className="h-6 w-6" />,
      title: "Submit Report",
      description: "Fill out the form with detailed information",
      color: "from-orange-500 to-red-500",
    },
    {
      icon: <Eye className="h-6 w-6" />,
      title: "Authorities Review",
      description: "Our team and authorities will investigate your report",
      color: "from-green-500 to-emerald-500",
    },
  ]

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    setFormData((prev) => ({ ...prev, files: [...prev.files, ...files] }))
  }

  const removeFile = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      files: prev.files.filter((_, i) => i !== index),
    }))
  }

  const getFileIcon = (file: File) => {
    if (file.type.startsWith("image/")) return <ImageIcon className="h-4 w-4" />
    if (file.type === "application/pdf") return <FileType className="h-4 w-4" />
    return <File className="h-4 w-4" />
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false)
      setShowConfirmation(true)
    }, 3000)
  }

  const isFormValid = () => {
    return formData.fullName.trim() && formData.email.trim() && formData.crimeType && formData.description.trim()
  }

  if (showConfirmation) {
    return (
      <div className="min-h-screen gradient-surface flex items-center justify-center p-4">
        <Card className="max-w-2xl w-full shadow-2xl border-0 bg-card/80 backdrop-blur-xl">
          <CardContent className="p-12 text-center space-y-8">
            <div className="relative">
              <div className="w-24 h-24 gradient-primary rounded-full flex items-center justify-center mx-auto shadow-glow animate-pulse-slow">
                <CheckCircle className="h-12 w-12 text-primary-foreground" />
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-accent rounded-full flex items-center justify-center animate-bounce">
                <Shield className="h-4 w-4 text-accent-foreground" />
              </div>
            </div>

            <div className="space-y-4">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Report Submitted Successfully!
              </h1>
              <p className="text-xl text-muted-foreground text-balance leading-relaxed">
                Your cybercrime report has been submitted successfully. Our team will guide you further and work with
                appropriate authorities to investigate your case.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="p-4 bg-primary/10 rounded-xl">
                <div className="flex items-center gap-2 text-primary font-semibold mb-1">
                  <Clock className="h-4 w-4" />
                  Response Time
                </div>
                <div className="text-muted-foreground">24-48 hours</div>
              </div>
              <div className="p-4 bg-secondary/10 rounded-xl">
                <div className="flex items-center gap-2 text-secondary font-semibold mb-1">
                  <Users className="h-4 w-4" />
                  Case ID
                </div>
                <div className="text-xs text-muted-foreground font-mono">#CR{Math.floor(Math.random() * 100000)}</div>
              </div>
              <div className="p-4 bg-accent/10 rounded-xl">
                <div className="flex items-center gap-2 text-accent font-semibold mb-1">
                  <Shield className="h-4 w-4" />
                  Status
                </div>
                <div className="text-muted-foreground">Under Review</div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/">
                <Button
                  size="lg"
                  className="gradient-primary shadow-glow hover:shadow-glow-secondary transition-all duration-300"
                >
                  Return to Home
                </Button>
              </Link>
              <Link href="/profile">
                <Button
                  variant="outline"
                  size="lg"
                  className="hover:bg-secondary/10 hover:text-secondary transition-colors bg-transparent"
                >
                  View My Reports
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen gradient-surface">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="icon" className="hover:bg-primary/10">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 gradient-primary rounded-xl shadow-glow">
                <Shield className="w-6 h-6 text-primary-foreground" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-xl bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  Cybercrime Reporting
                </span>
                <span className="text-xs text-muted-foreground">Secure & Confidential</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="space-y-12">
          {/* Introduction */}
          <div className="text-center space-y-6 animate-slide-up">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium animate-bounce-subtle">
              <Shield className="h-4 w-4" />
              Secure Reporting System
            </div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent text-balance">
              Report Cybercrime Safely
            </h1>
            <p className="text-xl text-muted-foreground text-balance max-w-3xl mx-auto leading-relaxed">
              Help protect yourself and others by reporting cybercrime incidents. Our secure system ensures your
              information is handled confidentially and forwarded to appropriate authorities.
            </p>
          </div>

          {/* Step-by-Step Guide */}
          <section className="space-y-8 animate-fade-in">
            <div className="text-center">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent mb-4">
                How It Works
              </h2>
              <p className="text-muted-foreground text-lg">
                Follow these simple steps to report cybercrime effectively
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {steps.map((step, index) => (
                <Card
                  key={index}
                  className={`group hover:shadow-xl transition-all duration-500 hover:-translate-y-2 border-border/50 bg-card/50 backdrop-blur-sm animate-scale-in overflow-hidden relative`}
                  style={{ animationDelay: `${index * 150}ms` }}
                >
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${step.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}
                  />
                  <CardHeader className="text-center pb-4">
                    <div
                      className={`w-16 h-16 bg-gradient-to-br ${step.color} rounded-2xl flex items-center justify-center mx-auto shadow-glow group-hover:shadow-glow-secondary transition-all duration-300 group-hover:scale-110`}
                    >
                      <div className="text-white">{step.icon}</div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-center gap-2">
                        <span className="text-2xl font-bold text-muted-foreground/50">0{index + 1}</span>
                        <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent flex-1" />
                      </div>
                      <CardTitle className="text-lg group-hover:text-primary transition-colors">{step.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="text-center">
                    <CardDescription className="text-base leading-relaxed">{step.description}</CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Report Form */}
          <section className="animate-slide-up">
            <Card className="shadow-2xl border-0 bg-card/80 backdrop-blur-xl">
              <CardHeader className="text-center pb-8">
                <CardTitle className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  Submit Your Report
                </CardTitle>
                <CardDescription className="text-lg">
                  Please provide detailed information about the cybercrime incident
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-8">
                  {/* Personal Information */}
                  <div className="space-y-6">
                    <h3 className="text-xl font-semibold flex items-center gap-2">
                      <Users className="h-5 w-5 text-primary" />
                      Personal Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="fullName" className="text-base font-medium">
                          Full Name *
                        </Label>
                        <Input
                          id="fullName"
                          value={formData.fullName}
                          onChange={(e) => handleInputChange("fullName", e.target.value)}
                          placeholder="Enter your full name"
                          className="h-12 text-base"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-base font-medium">
                          Email Address *
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => handleInputChange("email", e.target.value)}
                          placeholder="Enter your email address"
                          className="h-12 text-base"
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-base font-medium">
                        Phone Number <span className="text-muted-foreground">(Optional)</span>
                      </Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => handleInputChange("phone", e.target.value)}
                        placeholder="Enter your phone number"
                        className="h-12 text-base"
                      />
                    </div>
                  </div>

                  {/* Incident Details */}
                  <div className="space-y-6">
                    <h3 className="text-xl font-semibold flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5 text-secondary" />
                      Incident Details
                    </h3>
                    <div className="space-y-2">
                      <Label htmlFor="crimeType" className="text-base font-medium">
                        Type of Cybercrime *
                      </Label>
                      <Select
                        value={formData.crimeType}
                        onValueChange={(value) => handleInputChange("crimeType", value)}
                      >
                        <SelectTrigger className="h-12 text-base">
                          <SelectValue placeholder="Select the type of cybercrime" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="phishing">Phishing</SelectItem>
                          <SelectItem value="scam-email">Scam Email</SelectItem>
                          <SelectItem value="identity-theft">Identity Theft</SelectItem>
                          <SelectItem value="online-fraud">Online Fraud</SelectItem>
                          <SelectItem value="ransomware">Ransomware</SelectItem>
                          <SelectItem value="social-engineering">Social Engineering</SelectItem>
                          <SelectItem value="fake-website">Fake Website</SelectItem>
                          <SelectItem value="others">Others</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="description" className="text-base font-medium">
                        Detailed Description *
                      </Label>
                      <Textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) => handleInputChange("description", e.target.value)}
                        placeholder="Please provide a detailed description of the incident, including when it happened, how you were contacted, what information was requested, and any other relevant details..."
                        className="min-h-[150px] text-base resize-none"
                        required
                      />
                      <div className="text-sm text-muted-foreground">{formData.description.length}/1000 characters</div>
                    </div>
                  </div>

                  {/* Evidence Upload */}
                  <div className="space-y-6">
                    <h3 className="text-xl font-semibold flex items-center gap-2">
                      <FileText className="h-5 w-5 text-accent" />
                      Evidence Upload
                    </h3>
                    <div className="space-y-4">
                      <div className="border-2 border-dashed border-border/50 rounded-xl p-8 text-center hover:border-primary/50 transition-colors">
                        <input
                          type="file"
                          id="file-upload"
                          multiple
                          accept=".jpg,.jpeg,.png,.pdf,.doc,.docx,.txt"
                          onChange={handleFileUpload}
                          className="hidden"
                        />
                        <label htmlFor="file-upload" className="cursor-pointer">
                          <div className="space-y-4">
                            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto">
                              <Upload className="h-8 w-8 text-primary" />
                            </div>
                            <div>
                              <p className="text-lg font-medium">Upload Evidence Files</p>
                              <p className="text-muted-foreground">
                                Screenshots, emails, documents (JPG, PNG, PDF, DOC, TXT)
                              </p>
                              <p className="text-sm text-muted-foreground mt-2">
                                Click to browse or drag and drop files here
                              </p>
                            </div>
                          </div>
                        </label>
                      </div>

                      {formData.files.length > 0 && (
                        <div className="space-y-3">
                          <h4 className="font-medium">Uploaded Files ({formData.files.length})</h4>
                          <div className="space-y-2">
                            {formData.files.map((file, index) => (
                              <div
                                key={index}
                                className="flex items-center justify-between p-3 bg-muted/50 rounded-lg border"
                              >
                                <div className="flex items-center gap-3">
                                  {getFileIcon(file)}
                                  <div>
                                    <div className="font-medium text-sm">{file.name}</div>
                                    <div className="text-xs text-muted-foreground">
                                      {(file.size / 1024 / 1024).toFixed(2)} MB
                                    </div>
                                  </div>
                                </div>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => removeFile(index)}
                                  className="hover:bg-destructive/10 hover:text-destructive"
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-6 border-t border-border/50">
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      <Button
                        type="submit"
                        size="lg"
                        disabled={!isFormValid() || isSubmitting}
                        className="gradient-primary shadow-glow hover:shadow-glow-secondary transition-all duration-300 px-12 h-14 text-lg font-semibold"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="mr-3 h-5 w-5 animate-spin" />
                            Submitting Report...
                          </>
                        ) : (
                          <>
                            <Send className="mr-3 h-5 w-5" />
                            Submit Report
                          </>
                        )}
                      </Button>
                      <Link href="/">
                        <Button variant="outline" size="lg" className="px-8 h-14 text-lg bg-transparent">
                          Cancel
                        </Button>
                      </Link>
                    </div>
                    <p className="text-center text-sm text-muted-foreground mt-4">
                      By submitting this report, you agree that the information provided is accurate and may be shared
                      with law enforcement agencies.
                    </p>
                  </div>
                </form>
              </CardContent>
            </Card>
          </section>

          {/* Security Notice */}
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <div className="space-y-2">
                  <h3 className="font-semibold text-lg">Your Privacy & Security</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    All information submitted through this form is encrypted and stored securely. Your personal details
                    will only be shared with authorized law enforcement agencies and cybersecurity professionals as
                    necessary for investigation purposes. We are committed to protecting your privacy while helping
                    combat cybercrime.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
