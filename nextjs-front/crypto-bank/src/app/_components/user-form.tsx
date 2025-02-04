import { useState } from "react"
import type { User } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface UserFormProps {
  user?: User | null
  onSubmit: (id: string | undefined, user: Partial<User>) => void
  onCancel: () => void
}

export function UserForm({ user, onSubmit, onCancel }: UserFormProps) {
  const [formData, setFormData] = useState<Partial<User>>(
    user || {
      nom: "",
      email: "",
      motDePasse: "",
      statut: "ACTIVE",
      address: {
        street: "",
        city: "",
        postalCode: "",
      },
    },
  )

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      address: {
        ...prev.address,
        [name]: value,
      },
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(user?._id, formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="nom">Name</Label>
        <Input id="nom" name="nom" value={formData.nom} onChange={handleChange} required />
      </div>
      <div>
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} required />
      </div>
      {!user && (
        <div>
          <Label htmlFor="motDePasse">Password</Label>
          <Input
            id="motDePasse"
            name="motDePasse"
            type="password"
            value={formData.motDePasse}
            onChange={handleChange}
            required
          />
        </div>
      )}
      <div>
        <Label htmlFor="statut">Status</Label>
        <Select
          name="statut"
          value={formData.statut}
          onValueChange={(value) => setFormData((prev) => ({ ...prev, statut: value as "ACTIVE" | "INACTIVE" }))}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ACTIVE">Active</SelectItem>
            <SelectItem value="INACTIVE">Inactive</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="street">Street</Label>
        <Input id="street" name="street" value={formData.address?.street} onChange={handleAddressChange} />
      </div>
      <div>
        <Label htmlFor="city">City</Label>
        <Input id="city" name="city" value={formData.address?.city} onChange={handleAddressChange} />
      </div>
      <div>
        <Label htmlFor="postalCode">Postal Code</Label>
        <Input id="postalCode" name="postalCode" value={formData.address?.postalCode} onChange={handleAddressChange} />
      </div>
      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">{user ? "Update" : "Create"} User</Button>
      </div>
    </form>
  )
}