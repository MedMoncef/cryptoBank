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
import { api, type RegisterData, type RegisterResponse } from "@/lib/api"

export default function RegisterPage() {
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterData>()

  const mutation = useMutation<RegisterResponse, Error, RegisterData>({
    mutationFn: api.register,
    onSuccess: (data: any) => {
      // Show success message and redirect to login page
      alert(data.message)
      router.push("/login")
    },
    onError: (error: Error) => {
      setError(error.message)
    },
  })

  const onSubmit = (data: RegisterData) => {
    setError(null)
    mutation.mutate(data)
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md">
        <CardHeader>
          <h1 className="text-2xl font-bold text-center">Register</h1>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-4">
              <div>
                <Label htmlFor="nom">Name</Label>
                <Input
                  id="nom"
                  type="text"
                  {...register("nom", {
                    required: "Name is required",
                  })}
                />
                {errors.nom && <p className="text-red-500 text-sm mt-1">{errors.nom.message}</p>}
              </div>
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
                <Label htmlFor="telephone">Telephone</Label>
                <Input
                  id="telephone"
                  type="tel"
                  {...register("telephone", {
                    required: "Telephone is required",
                  })}
                />
                {errors.telephone && <p className="text-red-500 text-sm mt-1">{errors.telephone.message}</p>}
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
                {mutation.isPending ? "Registering..." : "Register"}
              </Button>
            </CardFooter>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}