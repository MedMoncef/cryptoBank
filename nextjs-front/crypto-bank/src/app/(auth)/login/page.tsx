"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { useMutation } from "@tanstack/react-query"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useRouter } from "next/navigation"
import { api, type LoginCredentials, type LoginResponse } from "@/lib/api"

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginCredentials>()

  const mutation = useMutation<LoginResponse, Error, LoginCredentials>({
    mutationFn: api.login,
    onSuccess: (data: any) => {
      // Save token in cookie with 24h expiration
      document.cookie = `token=${data.token}; path=/; max-age=${60 * 60 * 24}; SameSite=Strict; ${process.env.NODE_ENV === "production" ? "Secure" : ""}`

      // Redirect to home page
      router.push("/")
    },
    onError: (error: Error) => {
      setError(error.message)
    },
  })

  const onSubmit = (data: LoginCredentials) => {
    setError(null)
    mutation.mutate(data)
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md">
        <CardHeader>
          <h1 className="text-2xl font-bold text-center">Login</h1>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  {...register("email", {
                    required: "Email is required",
                  })}
                />
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
              </div>
              <div>
                <Label htmlFor="motDePasse">Password</Label>
                <Input
                  id="motDePasse"
                  type="password"
                  {...register("motDePasse", {
                    required: "Password is required",
                  })}
                />
                {errors.motDePasse && <p className="text-red-500 text-sm mt-1">{errors.motDePasse.message}</p>}
              </div>
            </div>
            {error && (
              <Alert variant="destructive" className="mt-4">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <CardFooter className="flex justify-end mt-4">
              <Button type="submit" disabled={mutation.isPending}>
                {mutation.isPending ? "Logging in..." : "Login"}
              </Button>
            </CardFooter>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}