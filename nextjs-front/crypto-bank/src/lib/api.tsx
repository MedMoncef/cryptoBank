import axios from "axios"

const API_URL = "http://localhost:5000/api/users/api/users/users"

export interface User {
  _id: string
  nom: string
  email: string
  motDePasse: string
  statut: "ACTIVE" | "INACTIVE"
  statutVerificationEmail: boolean
  statutVerificationTelephone: boolean
  address: {
    _id: string
    street: string
    city: string
    postalCode: string
  } | null
  telephone?: string
}

export const api = {
  getUsers: async (): Promise<User[]> => {
    const response = await axios.get<User[]>(API_URL)
    return response.data
  },

  createUser: async (user: Partial<User>): Promise<User> => {
    const response = await axios.post<User>(API_URL, user)
    return response.data
  },

  updateUser: async (id: string, user: Partial<User>): Promise<User> => {
    const response = await axios.put<User>(`${API_URL}/${id}`, user)
    return response.data
  },

  deleteUser: async (id: string): Promise<void> => {
    await axios.delete(`${API_URL}/${id}`)
  },
}