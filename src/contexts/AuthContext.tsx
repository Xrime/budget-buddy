import React, { createContext, useContext, useEffect, useState } from 'react'

interface User {
  id: string
  email: string
}

interface AuthContextType {
  user: User | null
  loading: boolean
  signUp: (email: string, password: string) => Promise<{ data: any; error: any }>
  signIn: (email: string, password: string) => Promise<{ data: any; error: any }>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user is already logged in
    const savedUser = localStorage.getItem('budget-buddy-user')
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
    setLoading(false)
  }, [])

  const signUp = async (email: string, password: string) => {
    try {
      // Get existing users from localStorage
      const existingUsers = JSON.parse(localStorage.getItem('budget-buddy-users') || '{}')
      
      // Check if user already exists
      if (existingUsers[email]) {
        return { data: null, error: { message: 'User already exists' } }
      }

      // Create new user
      const newUser = {
        id: Date.now().toString(),
        email,
        password // In a real app, this would be hashed
      }

      // Save user to localStorage
      existingUsers[email] = newUser
      localStorage.setItem('budget-buddy-users', JSON.stringify(existingUsers))

      // Sign in the user immediately
      const userSession = { id: newUser.id, email: newUser.email }
      setUser(userSession)
      localStorage.setItem('budget-buddy-user', JSON.stringify(userSession))

      return { data: { user: userSession }, error: null }
    } catch (error) {
      return { data: null, error: { message: 'Failed to create account' } }
    }
  }

  const signIn = async (email: string, password: string) => {
    try {
      // Get existing users from localStorage
      const existingUsers = JSON.parse(localStorage.getItem('budget-buddy-users') || '{}')
      
      // Check if user exists
      const existingUser = existingUsers[email]
      
      if (!existingUser) {
        // Auto-create account if user doesn't exist
        return await signUp(email, password)
      }

      // Check password
      if (existingUser.password !== password) {
        return { data: null, error: { message: 'Invalid password' } }
      }

      // Sign in the user
      const userSession = { id: existingUser.id, email: existingUser.email }
      setUser(userSession)
      localStorage.setItem('budget-buddy-user', JSON.stringify(userSession))

      return { data: { user: userSession }, error: null }
    } catch (error) {
      return { data: null, error: { message: 'Failed to sign in' } }
    }
  }

  const signOut = async () => {
    setUser(null)
    localStorage.removeItem('budget-buddy-user')
  }

  return (
    <AuthContext.Provider value={{ user, loading, signUp, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}