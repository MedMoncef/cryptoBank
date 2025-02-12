"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Home, Users } from "lucide-react"

export function Sidebar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    const token = document.cookie.includes("token=")
    setIsLoggedIn(token)
  }, [])

  if (!isLoggedIn) {
    return null
  }

  return (
    <div className="w-64 bg-gray-800 text-white h-full p-4">
      <nav className="space-y-2">
        <Link href="/" className="flex items-center space-x-2 p-2 hover:bg-gray-700 rounded">
          <Home size={20} />
          <span>Home</span>
        </Link>
        <Link href="/users" className="flex items-center space-x-2 p-2 hover:bg-gray-700 rounded">
          <Users size={20} />
          <span>Users</span>
        </Link>
      </nav>
    </div>
  )
}