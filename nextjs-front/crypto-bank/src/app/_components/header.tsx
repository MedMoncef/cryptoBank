"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

export function Header() {
  const router = useRouter()
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    const token = document.cookie.includes("token=")
    setIsLoggedIn(token)
  }, [])

  const handleLogout = () => {
    document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"
    setIsLoggedIn(false)
    router.push("/login")
  }

  return (
    <header className="bg-gray-800 text-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <Link href="/" className="text-xl font-bold">
          CryptoBank
        </Link>
        <nav>
          <ul className="flex space-x-4">
            {isLoggedIn ? (
              <li>
                <Button variant="ghost" className="text-white hover:text-black" onClick={handleLogout}>
                  Logout
                </Button>
              </li>
            ) : (
              <>
                <li>
                  <Link href="/login">
                    <Button variant="ghost" className="text-white hover:text-black">
                      Login
                    </Button>
                  </Link>
                </li>
                <li>
                  <Link href="/register">
                    <Button variant="ghost" className="text-white hover:text-black">
                      Register
                    </Button>
                  </Link>
                </li>
              </>
            )}
          </ul>
        </nav>
      </div>
    </header>
  )
}