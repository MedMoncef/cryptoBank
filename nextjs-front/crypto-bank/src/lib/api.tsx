import axios from "axios"

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/api/users/api/users`

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

export interface LoginCredentials {
  email: string
  motDePasse: string
}

export interface RegisterData {
  nom: string
  email: string
  telephone: string
  motDePasse: string
}

export interface LoginResponse {
  token: string
  user: {
    id: string
    email: string
    nom: string
    statut: string
    statutVerificationEmail: boolean
    statutVerificationTelephone: boolean
  }
}

export interface RegisterResponse {
  message: string
  verificationToken: string
}

export interface UserStatistics {
  totalUsers: number
  activeUsers: number
  inactiveUsers: number
  verifiedEmailUsers: number
  verifiedPhoneUsers: number
}

export const api = {
  getUsers: async (): Promise<User[]> => {
    const response = await axios.get<User[]>(`${API_URL}/users`)
    return response.data
  },

  createUser: async (user: UserSubmissionData): Promise<User> => {
    const response = await axios.post<User>(API_URL, user)
    return response.data
  },

  updateUser: async (id: string, user: UserSubmissionData): Promise<User> => {
    const response = await axios.patch<User>(`${API_URL}/${id}`, user)
    return response.data
  },

  deleteUser: async (id: string): Promise<void> => {
    await axios.delete(`${API_URL}/${id}`)
  },

  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    const response = await axios.post<LoginResponse>(`${API_URL}/login`, credentials)
    return response.data
  },

  register: async (userData: RegisterData): Promise<RegisterResponse> => {
    const response = await axios.post<RegisterResponse>(`${API_URL}/register`, userData)
    return response.data
  },

  getUserStatistics: async (): Promise<UserStatistics> => {
    const response = await axios.get<UserStatistics>(`${API_URL}/statistics`)
    return response.data
  },
}