import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'

export interface Expense {
  id: string
  user_id: string
  amount: number
  category: string
  description: string
  date: string
  created_at: string
}

export function useExpenses() {
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()

  const getStorageKey = () => `budget-buddy-expenses-${user?.id}`

  const fetchExpenses = async () => {
    if (!user) return

    try {
      const storageKey = getStorageKey()
      const savedExpenses = localStorage.getItem(storageKey)
      const userExpenses = savedExpenses ? JSON.parse(savedExpenses) : []
      
      // Sort by date descending
      userExpenses.sort((a: Expense, b: Expense) => new Date(b.date).getTime() - new Date(a.date).getTime())
      
      setExpenses(userExpenses)
    } catch (error) {
      console.error('Error fetching expenses:', error)
    } finally {
      setLoading(false)
    }
  }

  const addExpense = async (expense: Omit<Expense, 'id' | 'user_id' | 'created_at'>) => {
    if (!user) return { success: false, error: 'User not authenticated' }

    try {
      const newExpense: Expense = {
        ...expense,
        id: Date.now().toString(),
        user_id: user.id,
        created_at: new Date().toISOString()
      }

      const updatedExpenses = [newExpense, ...expenses]
      setExpenses(updatedExpenses)
      
      const storageKey = getStorageKey()
      localStorage.setItem(storageKey, JSON.stringify(updatedExpenses))
      
      return { success: true }
    } catch (error) {
      console.error('Error adding expense:', error)
      return { success: false, error }
    }
  }

  const deleteExpense = async (id: string) => {
    try {
      const updatedExpenses = expenses.filter(expense => expense.id !== id)
      setExpenses(updatedExpenses)
      
      const storageKey = getStorageKey()
      localStorage.setItem(storageKey, JSON.stringify(updatedExpenses))
      
      return { success: true }
    } catch (error) {
      console.error('Error deleting expense:', error)
      return { success: false, error }
    }
  }

  useEffect(() => {
    fetchExpenses()
  }, [user])

  return { expenses, loading, addExpense, deleteExpense, refetch: fetchExpenses }
}