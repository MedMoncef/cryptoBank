import type React from "react"
import { useState } from "react"
import type { User, UserSubmissionData } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"

interface UserFormProps {
  user?: User | null
  onSubmit: (id: string, user: UserSubmissionData) => void
  onCancel: () => void
}

export function UserForm({ user, onSubmit, onCancel }: UserFormProps) {
  const [includeAddress, setIncludeAddress] = useState(!!user?.address)
  const [formData, setFormData] = useState<UserSubmissionData>({
    nom: user?.nom || "",
    email: user?.email || "",
    telephone: user?.telephone || "",
    motDePasse: "",
    addressData: user?.address
      ? {
          street: user.address.street || "",
          city: user.address.city || "",
          state: "",
          postalCode: user.address.postalCode || "",
          country: "",
        }
      : undefined,
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    setFormData((prev) => ({
      ...prev,
      addressData: {
        ...prev.addressData!,
        [name]: value,
      },
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const submissionData = { ...formData }
    if (user) {
      if (!formData.motDePasse) {
        delete submissionData.motDePasse
      }
    }
    if (!includeAddress) {
      delete submissionData.addressData
    }
    onSubmit(user?._id ?? '1', submissionData)
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
      <div>
        <Label htmlFor="telephone">Telephone</Label>
        <Input id="telephone" name="telephone" value={formData.telephone} onChange={handleChange} />
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
            required={!user}
          />
        </div>
      )}
      <div className="flex items-center space-x-2">
        <Switch id="include-address" checked={includeAddress} onCheckedChange={setIncludeAddress} />
        <Label htmlFor="include-address">Include Address</Label>
      </div>
      {includeAddress && (
        <>
          <div>
            <Label htmlFor="street">Street</Label>
            <Input id="street" name="street" value={formData.addressData?.street} onChange={handleAddressChange} />
          </div>
          <div>
            <Label htmlFor="city">City</Label>
            <Input id="city" name="city" value={formData.addressData?.city} onChange={handleAddressChange} />
          </div>
          <div>
            <Label htmlFor="state">State</Label>
            <Input id="state" name="state" value={formData.addressData?.state} onChange={handleAddressChange} />
          </div>
          <div>
            <Label htmlFor="postalCode">Postal Code</Label>
            <Input
              id="postalCode"
              name="postalCode"
              value={formData.addressData?.postalCode}
              onChange={handleAddressChange}
            />
          </div>
          <div>
            <Label htmlFor="country">Country</Label>
            <Input id="country" name="country" value={formData.addressData?.country} onChange={handleAddressChange} />
          </div>
        </>
      )}
      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">{user ? "Update" : "Create"} User</Button>
      </div>
    </form>
  )
}