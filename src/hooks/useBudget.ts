import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'

export interface Budget {
  id: string
  user_id: string
  monthly_limit: number
  created_at: string
  updated_at: string
}

export function useBudget() {
  const [budget, setBudget] = useState<Budget | null>(null)
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()

  const getStorageKey = () => `budget-buddy-budget-${user?.id}`

  const fetchBudget = async () => {
    if (!user) return

    try {
      const storageKey = getStorageKey()
      const savedBudget = localStorage.getItem(storageKey)
      const userBudget = savedBudget ? JSON.parse(savedBudget) : null
      setBudget(userBudget)
    } catch (error) {
      console.error('Error fetching budget:', error)
    } finally {
      setLoading(false)
    }
  }

  const setBudgetLimit = async (monthlyLimit: number) => {
    if (!user) return { success: false, error: 'User not authenticated' }

    try {
      const now = new Date().toISOString()
      const budgetData: Budget = {
        id: budget?.id || Date.now().toString(),
        user_id: user.id,
        monthly_limit: monthlyLimit,
        created_at: budget?.created_at || now,
        updated_at: now
      }

      setBudget(budgetData)
      
      const storageKey = getStorageKey()
      localStorage.setItem(storageKey, JSON.stringify(budgetData))
      
      return { success: true }
    } catch (error) {
      console.error('Error setting budget:', error)
      return { success: false, error }
    }
  }

  useEffect(() => {
    fetchBudget()
  }, [user])

  return { budget, loading, setBudgetLimit, refetch: fetchBudget }
}