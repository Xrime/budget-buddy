import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-key'

export const supabase = createClient(supabaseUrl, supabaseKey)

export type Expense = {
  id: string
  user_id: string
  amount: number
  category: string
  description: string
  date: string
  created_at: string
}

export type Budget = {
  id: string
  user_id: string
  monthly_limit: number
  created_at: string
  updated_at: string
}