import React from 'react'
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { format, startOfWeek, eachWeekOfInterval, startOfMonth, endOfMonth } from 'date-fns'
import { Expense } from '../../lib/supabase'

interface ExpenseChartsProps {
  expenses: Expense[]
}

const COLORS = {
  'Food': '#EF4444',
  'Transport': '#3B82F6', 
  'Entertainment': '#8B5CF6',
  'Shopping': '#EC4899',
  'Bills': '#F59E0B',
  'Healthcare': '#10B981',
  'Other': '#6B7280'
}

export function ExpenseCharts({ expenses }: ExpenseChartsProps) {
  // Category breakdown for pie chart
  const categoryData = expenses.reduce((acc, expense) => {
    const existing = acc.find(item => item.name === expense.category)
    if (existing) {
      existing.value += expense.amount
    } else {
      acc.push({
        name: expense.category,
        value: expense.amount
      })
    }
    return acc
  }, [] as { name: string; value: number }[])

  // Weekly spending for bar chart
  const now = new Date()
  const monthStart = startOfMonth(now)
  const monthEnd = endOfMonth(now)
  const weeks = eachWeekOfInterval({ start: monthStart, end: monthEnd })

  const weeklyData = weeks.map(weekStart => {
    const weekExpenses = expenses.filter(expense => {
      const expenseDate = new Date(expense.date)
      const weekStartDate = startOfWeek(weekStart)
      const weekEndDate = new Date(weekStartDate)
      weekEndDate.setDate(weekEndDate.getDate() + 6)
      return expenseDate >= weekStartDate && expenseDate <= weekEndDate
    })

    const total = weekExpenses.reduce((sum, expense) => sum + expense.amount, 0)
    
    return {
      week: format(weekStart, 'MMM dd'),
      amount: total
    }
  })

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
          <p className="text-gray-900 dark:text-white font-semibold">{label}</p>
          <p className="text-blue-600 dark:text-blue-400">
            Amount: ${payload[0].value.toFixed(2)}
          </p>
        </div>
      )
    }
    return null
  }

  const PieTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0]
      return (
        <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
          <p className="text-gray-900 dark:text-white font-semibold">{data.name}</p>
          <p className="text-blue-600 dark:text-blue-400">
            ${data.value.toFixed(2)} ({((data.value / expenses.reduce((sum, e) => sum + e.amount, 0)) * 100).toFixed(1)}%)
          </p>
        </div>
      )
    }
    return null
  }

  return (
    <div className="space-y-8">
      {/* Spending by Category */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Spending by Category</h3>
        {categoryData.length > 0 ? (
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={120}
                fill="#8884d8"
                dataKey="value"
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[entry.name as keyof typeof COLORS] || COLORS.Other} />
                ))}
              </Pie>
              <Tooltip content={<PieTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-64 flex items-center justify-center text-gray-500 dark:text-gray-400">
            No expense data available
          </div>
        )}
      </div>

      {/* Weekly Spending Trend */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Weekly Spending Trend</h3>
        {weeklyData.length > 0 ? (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={weeklyData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis 
                dataKey="week" 
                tick={{ fill: 'currentColor' }}
                className="text-gray-600 dark:text-gray-400"
              />
              <YAxis 
                tick={{ fill: 'currentColor' }}
                className="text-gray-600 dark:text-gray-400"
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="amount" fill="#3B82F6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-64 flex items-center justify-center text-gray-500 dark:text-gray-400">
            No expense data available
          </div>
        )}
      </div>

      {/* Category Summary */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Category Summary</h3>
        {categoryData.length > 0 ? (
          <div className="space-y-4">
            {categoryData
              .sort((a, b) => b.value - a.value)
              .map((category) => {
                const percentage = (category.value / expenses.reduce((sum, e) => sum + e.amount, 0)) * 100
                return (
                  <div key={category.name} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: COLORS[category.name as keyof typeof COLORS] || COLORS.Other }}
                      />
                      <span className="font-medium text-gray-900 dark:text-white">{category.name}</span>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-gray-900 dark:text-white">
                        ${category.value.toFixed(2)}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {percentage.toFixed(1)}%
                      </div>
                    </div>
                  </div>
                )
              })}
          </div>
        ) : (
          <div className="text-center text-gray-500 dark:text-gray-400">
            No expense data available
          </div>
        )}
      </div>
    </div>
  )
}