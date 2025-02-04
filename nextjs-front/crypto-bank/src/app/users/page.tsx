"use client"

import { useState, useEffect } from "react"
import { api, type User } from "@/lib/api"
import { UserTable } from "../_components/user-table"
import { UserForm } from "../_components/user-form"
import { Button } from "@/components/ui/button"
import { PlusIcon } from "lucide-react"

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    setIsLoading(true)
    try {
      const fetchedUsers = await api.getUsers()
      setUsers(fetchedUsers)
    } catch (error) {
      console.error("Failed to fetch users:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateUser = async (user: Partial<User>) => {
    try {
      const newUser = await api.createUser(user)
      setUsers([...users, newUser])
      setIsFormOpen(false)
    } catch (error) {
      console.error("Failed to create user:", error)
    }
  }

  const handleUpdateUser = async (id: string, user: Partial<User>) => {
    try {
      const updatedUser = await api.updateUser(id, user)
      setUsers(users.map((u) => (u._id === id ? updatedUser : u)))
      setEditingUser(null)
    } catch (error) {
      console.error("Failed to update user:", error)
    }
  }

  const handleDeleteUser = async (id: string) => {
    try {
      await api.deleteUser(id)
      setUsers(users.filter((u) => u._id !== id))
    } catch (error) {
      console.error("Failed to delete user:", error)
    }
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Users</h1>
      <Button onClick={() => setIsFormOpen(true)}>
        <PlusIcon className="mr-2 h-4 w-4" /> Add User
      </Button>
      {isLoading ? (
        <p>Loading users...</p>
      ) : (
        <UserTable users={users} onEdit={setEditingUser} onDelete={handleDeleteUser} />
      )}
      {(isFormOpen || editingUser) && (
        <UserForm
          user={editingUser}
          onSubmit={editingUser ? handleUpdateUser : handleCreateUser}
          onCancel={() => {
            setIsFormOpen(false)
            setEditingUser(null)
          }}
        />
      )}
    </div>
  )
}