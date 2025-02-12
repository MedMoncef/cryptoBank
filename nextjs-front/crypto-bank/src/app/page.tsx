"use client"

import { useState, useEffect } from "react"
import { api, type UserStatistics } from "@/lib/api"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { Users, UserCheck, UserMinus, Mail, Phone } from "lucide-react"
import type React from "react" // Added import for React

export default function HomePage() {
  const [statistics, setStatistics] = useState<UserStatistics | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        const data = await api.getUserStatistics()
        setStatistics(data)
      } catch (error) {
        console.error("Failed to fetch statistics:", error)
        toast({
          title: "Error",
          description: "Failed to fetch statistics. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchStatistics()
  }, [toast])

  const StatCard = ({ title, value, icon: Icon }: { title: string; value: number; icon: React.ElementType }) => (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
      </CardContent>
    </Card>
  )

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">CryptoBank Dashboard</h1>
      {isLoading ? (
        <p>Loading statistics...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <StatCard title="Total Users" value={statistics?.totalUsers || 0} icon={Users} />
          <StatCard title="Active Users" value={statistics?.activeUsers || 0} icon={UserCheck} />
          <StatCard title="Inactive Users" value={statistics?.inactiveUsers || 0} icon={UserMinus} />
          <StatCard title="Verified Email Users" value={statistics?.verifiedEmailUsers || 0} icon={Mail} />
          <StatCard title="Verified Phone Users" value={statistics?.verifiedPhoneUsers || 0} icon={Phone} />
        </div>
      )}
    </div>
  )
}