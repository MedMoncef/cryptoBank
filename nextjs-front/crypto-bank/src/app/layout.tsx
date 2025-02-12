import "./globals.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { Sidebar } from "./_components/sidebar"
import { Header } from "./_components/header"
import { Toaster } from "@/components/ui/toaster"
import { Providers } from "./providers"
import type React from "react"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "User Management",
  description: "CRUD operations for users",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <div className="flex flex-col h-screen">
            <Header />
            <div className="flex flex-1 overflow-hidden">
              <Sidebar />
              <main className="flex-1 p-8 overflow-auto">{children}</main>
            </div>
          </div>
          <Toaster />
        </Providers>
      </body>
    </html>
  )
}