import { useState, useEffect } from 'react'
import { supabase, type Expense } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'

export function useExpenses() {
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()

  const fetchExpenses = async () => {
    if (!user) return

    try {
      const { data, error } = await supabase
        .from('expenses')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false })

      if (error) throw error
      setExpenses(data || [])
    } catch (error) {
      console.error('Error fetching expenses:', error)
    } finally {
      setLoading(false)
    }
  }

  const addExpense = async (expense: Omit<Expense, 'id' | 'user_id' | 'created_at'>) => {
    if (!user) return

    try {
      const { data, error } = await supabase
        .from('expenses')
        .insert([{ ...expense, user_id: user.id }])
        .select()
        .single()

      if (error) throw error
      setExpenses([data, ...expenses])
      return { success: true }
    } catch (error) {
      console.error('Error adding expense:', error)
      return { success: false, error }
    }
  }

  const deleteExpense = async (id: string) => {
    try {
      const { error } = await supabase
        .from('expenses')
        .delete()
        .eq('id', id)

      if (error) throw error
      setExpenses(expenses.filter(expense => expense.id !== id))
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