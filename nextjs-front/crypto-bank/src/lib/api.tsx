import axios from "axios"

const API_URL = process.env.NEXT_PUBLIC_API_URL

export interface User {
  _id: string
  nom: string
  email: string
  motDePasse: string
  statut: "ACTIVE" | "INACTIVE"
  statutVerificationEmail: boolean
  statutVerificationTelephone: boolean
  address: {
    userId: string | null
    _id: string
    street: string
    city: string
    postalCode: string
    __v: number
    id: string
  } | null
  __v: number
  id: string
  telephone?: string
}

export interface UserSubmissionData {
  nom: string
  email: string
  telephone?: string
  motDePasse?: string
  addressData?: {
    street: string
    city: string
    state: string
    postalCode: string
    country: string
  }
}

export const api = {
  getUsers: async (): Promise<User[]> => {
    const response = await axios.get<User[]>(`${API_URL}/users`)
    return response.data
  },

  createUser: async (user: UserSubmissionData): Promise<User> => {
    const response = await axios.post<User>(`${API_URL}`, user)
    return response.data
  },

  updateUser: async (id: string, user: UserSubmissionData): Promise<User> => {
    const response = await axios.patch<User>(`${API_URL}/${id}`, user)
    return response.data
  },

  deleteUser: async (id: string): Promise<void> => {
    await axios.delete(`${API_URL}/${id}`)
  },
}