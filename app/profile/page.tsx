"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Shield,
  ArrowLeft,
  Edit,
  Save,
  X,
  Calendar,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Settings,
  Lock,
} from "lucide-react"
import Link from "next/link"

// Mock user data
const userData = {
  name: "John Doe",
  email: "john.doe@example.com",
  joinDate: "March 2024",
  totalAnalyses: 47,
  scamsDetected: 12,
  safeMails: 35,
  streak: 15,
}

// Mock analysis history
const analysisHistory = [
  {
    id: 1,
    content: "Congratulations! You've won $1,000,000...",
    result: "Scam",
    riskScore: 95,
    date: "2024-03-15",
    time: "2:30 PM",
  },
  {
    id: 2,
    content: "Your Amazon order has been shipped...",
    result: "Legit",
    riskScore: 15,
    date: "2024-03-14",
    time: "10:15 AM",
  },
  {
    id: 3,
    content: "Urgent: Verify your bank account...",
    result: "Suspicious",
    riskScore: 78,
    date: "2024-03-13",
    time: "4:45 PM",
  },
  {
    id: 4,
    content: "Meeting reminder for tomorrow...",
    result: "Legit",
    riskScore: 8,
    date: "2024-03-12",
    time: "9:20 AM",
  },
  {
    id: 5,
    content: "Click here to claim your prize...",
    result: "Scam",
    riskScore: 92,
    date: "2024-03-11",
    time: "6:10 PM",
  },
]

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false)
  const [editedName, setEditedName] = useState(userData.name)
  const [editedEmail, setEditedEmail] = useState(userData.email)

  const handleSave = () => {
    // Mock save functionality
    setIsEditing(false)
    alert("Profile updated successfully!")
  }

  const handleCancel = () => {
    setIsEditing(false)
    setEditedName(userData.name)
    setEditedEmail(userData.email)
  }

  const getResultIcon = (result: string) => {
    switch (result) {
      case "Scam":
        return <XCircle className="h-4 w-4 text-destructive" />
      case "Suspicious":
        return <AlertTriangle className="h-4 w-4 text-orange-500" />
      case "Legit":
        return <CheckCircle className="h-4 w-4 text-accent" />
      default:
        return <Shield className="h-4 w-4" />
    }
  }

  const getResultColor = (result: string) => {
    switch (result) {
      case "Scam":
        return "bg-destructive text-destructive-foreground"
      case "Suspicious":
        return "bg-orange-500 text-white"
      case "Legit":
        return "bg-accent text-accent-foreground"
      default:
        return "bg-secondary text-secondary-foreground"
    }
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
              <span className="font-bold text-xl">Profile</span>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="space-y-8">
          {/* Profile Header */}
          <Card className="shadow-lg">
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                <Avatar className="h-24 w-24">
                  <AvatarImage src="/diverse-user-avatars.png" />
                  <AvatarFallback className="text-2xl">JD</AvatarFallback>
                </Avatar>

                <div className="flex-1 space-y-4">
                  {isEditing ? (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="name">Full Name</Label>
                          <Input id="name" value={editedName} onChange={(e) => setEditedName(e.target.value)} />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">Email</Label>
                          <Input
                            id="email"
                            type="email"
                            value={editedEmail}
                            onChange={(e) => setEditedEmail(e.target.value)}
                          />
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button onClick={handleSave} size="sm">
                          <Save className="h-4 w-4 mr-2" />
                          Save Changes
                        </Button>
                        <Button variant="outline" onClick={handleCancel} size="sm">
                          <X className="h-4 w-4 mr-2" />
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <h1 className="text-3xl font-bold">{userData.name}</h1>
                        <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </Button>
                      </div>
                      <p className="text-muted-foreground text-lg">{userData.email}</p>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span>Joined {userData.joinDate}</span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-2">
                  <Badge variant="outline" className="text-center">
                    {userData.streak} day streak
                  </Badge>
                  <Badge className="bg-primary text-primary-foreground text-center">Pro User</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="space-y-2">
                  <TrendingUp className="h-8 w-8 text-primary mx-auto" />
                  <div className="text-2xl font-bold">{userData.totalAnalyses}</div>
                  <div className="text-sm text-muted-foreground">Total Analyses</div>
                </div>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="space-y-2">
                  <XCircle className="h-8 w-8 text-destructive mx-auto" />
                  <div className="text-2xl font-bold">{userData.scamsDetected}</div>
                  <div className="text-sm text-muted-foreground">Scams Detected</div>
                </div>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="space-y-2">
                  <CheckCircle className="h-8 w-8 text-accent mx-auto" />
                  <div className="text-2xl font-bold">{userData.safeMails}</div>
                  <div className="text-sm text-muted-foreground">Safe Emails</div>
                </div>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="space-y-2">
                  <Shield className="h-8 w-8 text-secondary mx-auto" />
                  <div className="text-2xl font-bold">{userData.streak}</div>
                  <div className="text-sm text-muted-foreground">Day Streak</div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tabs Section */}
          <Tabs defaultValue="history" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="history">Analysis History</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
            </TabsList>

            <TabsContent value="history" className="space-y-4">
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle>Recent Analysis History</CardTitle>
                  <CardDescription>Your recent scam detection analyses and results</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analysisHistory.map((analysis) => (
                      <div
                        key={analysis.id}
                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center gap-2">
                            {getResultIcon(analysis.result)}
                            <span className="font-medium truncate max-w-md">
                              {analysis.content.length > 50
                                ? `${analysis.content.substring(0, 50)}...`
                                : analysis.content}
                            </span>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {analysis.date} at {analysis.time}
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="text-right">
                            <div className="text-sm font-medium">{analysis.riskScore}% risk</div>
                          </div>
                          <Badge className={getResultColor(analysis.result)}>{analysis.result}</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-6 text-center">
                    <Button variant="outline">Load More History</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="settings" className="space-y-4">
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    Preferences
                  </CardTitle>
                  <CardDescription>Customize your AI Scam Shield experience</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">Email Notifications</div>
                        <div className="text-sm text-muted-foreground">Receive alerts about new scam patterns</div>
                      </div>
                      <Button variant="outline" size="sm">
                        Configure
                      </Button>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">Auto-Save Analyses</div>
                        <div className="text-sm text-muted-foreground">
                          Automatically save all your analysis results
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        Enabled
                      </Button>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">Dark Mode</div>
                        <div className="text-sm text-muted-foreground">Switch to dark theme</div>
                      </div>
                      <Button variant="outline" size="sm">
                        Toggle
                      </Button>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">Data Export</div>
                        <div className="text-sm text-muted-foreground">Download your analysis history</div>
                      </div>
                      <Button variant="outline" size="sm">
                        Export
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="security" className="space-y-4">
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lock className="h-5 w-5" />
                    Security Settings
                  </CardTitle>
                  <CardDescription>Manage your account security and privacy</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">Change Password</div>
                        <div className="text-sm text-muted-foreground">Update your account password</div>
                      </div>
                      <Button variant="outline" size="sm">
                        Change
                      </Button>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">Two-Factor Authentication</div>
                        <div className="text-sm text-muted-foreground">Add an extra layer of security</div>
                      </div>
                      <Button size="sm">Enable</Button>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">Login Sessions</div>
                        <div className="text-sm text-muted-foreground">Manage active login sessions</div>
                      </div>
                      <Button variant="outline" size="sm">
                        View
                      </Button>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">Privacy Settings</div>
                        <div className="text-sm text-muted-foreground">Control your data privacy</div>
                      </div>
                      <Button variant="outline" size="sm">
                        Manage
                      </Button>
                    </div>

                    <div className="pt-4 border-t">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium text-destructive">Delete Account</div>
                          <div className="text-sm text-muted-foreground">Permanently delete your account and data</div>
                        </div>
                        <Button variant="destructive" size="sm">
                          Delete
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}
