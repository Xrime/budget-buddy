import React from 'react'
import { format, startOfDay, startOfWeek, startOfMonth } from 'date-fns'
import { TrendingUp, TrendingDown, DollarSign, Calendar } from 'lucide-react'
import { Expense } from '../../lib/supabase'

interface StatsCardsProps {
  expenses: Expense[]
}

export function StatsCards({ expenses }: StatsCardsProps) {
  const now = new Date()
  const today = startOfDay(now)
  const thisWeek = startOfWeek(now)
  const thisMonth = startOfMonth(now)

  const todayExpenses = expenses.filter(expense => 
    new Date(expense.date) >= today
  )
  
  const weekExpenses = expenses.filter(expense => 
    new Date(expense.date) >= thisWeek
  )
  
  const monthExpenses = expenses.filter(expense => 
    new Date(expense.date) >= thisMonth
  )

  const todayTotal = todayExpenses.reduce((sum, expense) => sum + expense.amount, 0)
  const weekTotal = weekExpenses.reduce((sum, expense) => sum + expense.amount, 0)
  const monthTotal = monthExpenses.reduce((sum, expense) => sum + expense.amount, 0)

  const stats = [
    {
      title: 'Today',
      amount: todayTotal,
      icon: Calendar,
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-50 dark:bg-blue-900/50',
      change: todayExpenses.length
    },
    {
      title: 'This Week',
      amount: weekTotal,
      icon: TrendingUp,
      color: 'text-emerald-600 dark:text-emerald-400',
      bgColor: 'bg-emerald-50 dark:bg-emerald-900/50',
      change: weekExpenses.length
    },
    {
      title: 'This Month',
      amount: monthTotal,
      icon: DollarSign,
      color: 'text-orange-600 dark:text-orange-400',
      bgColor: 'bg-orange-50 dark:bg-orange-900/50',
      change: monthExpenses.length
    }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {stats.map((stat, index) => (
        <div key={index} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{stat.title}</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                ${stat.amount.toFixed(2)}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {stat.change} transaction{stat.change !== 1 ? 's' : ''}
              </p>
            </div>
            <div className={`p-3 rounded-xl ${stat.bgColor}`}>
              <stat.icon className={`h-6 w-6 ${stat.color}`} />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}