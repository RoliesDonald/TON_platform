"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Loader2, Truck, Wrench, Users, FileText, MapPin, DollarSign, Settings } from "lucide-react"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const { login, isLoading } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!email || !password) {
      setError("Please fill in all fields")
      return
    }

    const success = await login(email, password)
    if (success) {
      router.push("/dashboard")
    } else {
      setError("Invalid email or password")
    }
  }

  const demoUsers = [
    { email: "admin@ton.com", role: "Admin", icon: Settings, color: "bg-purple-100 text-purple-800" },
    { email: "manager@ton.com", role: "Manager", icon: Users, color: "bg-blue-100 text-blue-800" },
    { email: "accountant@ton.com", role: "Accountant", icon: DollarSign, color: "bg-green-100 text-green-800" },
    { email: "service@ton.com", role: "Service Advisor", icon: Wrench, color: "bg-orange-100 text-orange-800" },
    { email: "mechanic@ton.com", role: "Mechanic", icon: Truck, color: "bg-gray-100 text-gray-800" },
    { email: "driver@ton.com", role: "Driver", icon: MapPin, color: "bg-indigo-100 text-indigo-800" }
  ]

  const selectDemoUser = (demoEmail: string) => {
    setEmail(demoEmail)
    setPassword("password")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-8">
          <div className="flex justify-center items-center gap-2 mb-4">
            <Truck className="h-12 w-12 text-blue-600" />
            <h1 className="text-4xl font-bold text-gray-900">TON Platform</h1>
          </div>
          <p className="text-xl text-gray-600">Fleet Management & Operations System</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Login Form */}
          <Card>
            <CardHeader>
              <CardTitle>Login</CardTitle>
              <CardDescription>
                Enter your credentials to access the platform
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    required
                  />
                </div>

                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <Button
                  type="submit"
                  className="w-full"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    "Sign In"
                  )}
                </Button>
              </form>

              <div className="mt-6 text-center text-sm text-gray-600">
                <p>Demo: Use any email and password "password"</p>
              </div>
            </CardContent>
          </Card>

          {/* Demo Users */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Access</CardTitle>
              <CardDescription>
                Click a role below to login with demo credentials
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {demoUsers.map((demoUser, index) => {
                  const Icon = demoUser.icon
                  return (
                    <Button
                      key={index}
                      variant="outline"
                      className="w-full justify-start h-auto p-3"
                      onClick={() => selectDemoUser(demoUser.email)}
                    >
                      <div className="flex items-center justify-between w-full">
                        <div className="flex items-center gap-3">
                          <Icon className="h-5 w-5" />
                          <div className="text-left">
                            <div className="font-medium">{demoUser.role}</div>
                            <div className="text-sm text-gray-500">{demoUser.email}</div>
                          </div>
                        </div>
                        <Badge className={demoUser.color}>
                          {demoUser.role}
                        </Badge>
                      </div>
                    </Button>
                  )
                })}
              </div>

              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">Role Access:</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• <strong>Admin:</strong> Full system access</li>
                  <li>• <strong>Manager:</strong> Fleet & operations</li>
                  <li>• <strong>Accountant:</strong> Invoices & payments</li>
                  <li>• <strong>Service Advisor:</strong> Work orders & tracking</li>
                  <li>• <strong>Mechanic:</strong> Work order management</li>
                  <li>• <strong>Driver:</strong> Basic access only</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}