import { useState, useEffect } from 'react'
import { supabase, type Budget } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'

export function useBudget() {
  const [budget, setBudget] = useState<Budget | null>(null)
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()

  const fetchBudget = async () => {
    if (!user) return

    try {
      const { data, error } = await supabase
        .from('budgets')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle()

      if (error) throw error
      setBudget(data || null)
    } catch (error) {
      console.error('Error fetching budget:', error)
    } finally {
      setLoading(false)
    }
  }

  const setBudgetLimit = async (monthlyLimit: number) => {
    if (!user) return

    try {
      const { data, error } = await supabase
        .from('budgets')
        .upsert([{ user_id: user.id, monthly_limit: monthlyLimit }])
        .select()
        .single()

      if (error) throw error
      setBudget(data)
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