"use client"

import { useState, useEffect } from "react"
import { api, type User, type UserSubmissionData } from "@/lib/api"
import { UserTable } from "../_components/user-table"
import { UserForm } from "../_components/user-form"
import { Button } from "@/components/ui/button"
import { PlusIcon } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { DeleteUserDialog } from "../_components/delete-user-dialog"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [deletingUser, setDeletingUser] = useState<User | null>(null)
  const { toast } = useToast()
  const router = useRouter()

  useEffect(() => {
    const token = document.cookie.replace(/(?:(?:^|.*;\s*)token\s*=\s*([^;]*).*$)|^.*$/, "$1")
    if (!token) {
      router.push("/login")
    } else {
      fetchUsers()
    }
  }, [router])

  const fetchUsers = async () => {
    setIsLoading(true)
    try {
      const fetchedUsers = await api.getUsers()
      setUsers(fetchedUsers)
    } catch (error) {
      console.error("Failed to fetch users:", error)
      toast({
        title: "Error",
        description: "Failed to fetch users. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateUser = async (_: any, user: UserSubmissionData) => {
    try {
      const newUser = await api.createUser(user)
      setUsers([...users, newUser])
      setIsCreateDialogOpen(false)
      toast({
        title: "Success",
        description: "User created successfully.",
      })
    } catch (error) {
      console.error("Failed to create user:", error)
      toast({
        title: "Error",
        description: "Failed to create user. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleUpdateUser = async (id: string, user: UserSubmissionData) => {
    try {
      const updatedUser = await api.updateUser(id, user)
      setUsers(users.map((u) => (u._id === id ? updatedUser : u)))
      setEditingUser(null)
      toast({
        title: "Success",
        description: "User updated successfully.",
      })
    } catch (error) {
      console.error("Failed to update user:", error)
      toast({
        title: "Error",
        description: "Failed to update user. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleDeleteUser = async (id: string) => {
    try {
      await api.deleteUser(id)
      setUsers(users.filter((u) => u._id !== id))
      setDeletingUser(null)
      toast({
        title: "Success",
        description: "User deleted successfully.",
      })
    } catch (error) {
      console.error("Failed to delete user:", error)
      toast({
        title: "Error",
        description: "Failed to delete user. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Users</h1>
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogTrigger asChild>
          <Button>
            <PlusIcon className="mr-2 h-4 w-4" /> Add User
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New User</DialogTitle>
          </DialogHeader>
          <UserForm onSubmit={handleCreateUser} onCancel={() => setIsCreateDialogOpen(false)} />
        </DialogContent>
      </Dialog>
      {isLoading ? (
        <p>Loading users...</p>
      ) : (
        <UserTable users={users} onEdit={setEditingUser} onDelete={setDeletingUser} />
      )}
      <Dialog open={!!editingUser} onOpenChange={(open) => !open && setEditingUser(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
          </DialogHeader>
          {editingUser && (
            <UserForm user={editingUser} onSubmit={handleUpdateUser} onCancel={() => setEditingUser(null)} />
          )}
        </DialogContent>
      </Dialog>
      <DeleteUserDialog
        user={deletingUser}
        onConfirm={() => deletingUser && handleDeleteUser(deletingUser._id)}
        onCancel={() => setDeletingUser(null)}
      />
    </div>
  )
}