import React, { useState } from 'react'
import { AlertTriangle, Target, Edit3, Check, X } from 'lucide-react'
import { Expense } from '../../lib/supabase'
import { useBudget } from '../../hooks/useBudget'
import { startOfMonth } from 'date-fns'

interface BudgetOverviewProps {
  expenses: Expense[]
}

export function BudgetOverview({ expenses }: BudgetOverviewProps) {
  const { budget, setBudgetLimit } = useBudget()
  const [isEditing, setIsEditing] = useState(false)
  const [newLimit, setNewLimit] = useState('')

  const monthStart = startOfMonth(new Date())
  const monthlyExpenses = expenses.filter(expense => 
    new Date(expense.date) >= monthStart
  )
  const monthlySpent = monthlyExpenses.reduce((sum, expense) => sum + expense.amount, 0)
  
  const budgetLimit = budget?.monthly_limit || 0
  const remaining = budgetLimit - monthlySpent
  const percentageUsed = budgetLimit > 0 ? (monthlySpent / budgetLimit) * 100 : 0
  
  const isOverBudget = remaining < 0
  const isNearLimit = percentageUsed > 80 && !isOverBudget

  const handleSaveBudget = async () => {
    if (!newLimit) return
    
    const limit = parseFloat(newLimit)
    if (limit >= 0) {
      const result = await setBudgetLimit(limit)
      if (result?.success) {
        setIsEditing(false)
        setNewLimit('')
      }
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSaveBudget()
    } else if (e.key === 'Escape') {
      handleCancelEdit()
    }
  }

  const handleCancelEdit = () => {
    setIsEditing(false)
    setNewLimit('')
  }

  if (!budget && !isEditing) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="text-center">
          <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Set Monthly Budget</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Track your spending by setting a monthly budget limit
          </p>
          <button
            onClick={() => setIsEditing(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold transition duration-200"
          >
            Set Budget
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Monthly Budget</h3>
        {!isEditing && (
          <button
            onClick={() => {
              setIsEditing(true)
              setNewLimit(budgetLimit.toString())
            }}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <Edit3 className="h-4 w-4" />
          </button>
        )}
      </div>

      {isEditing ? (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Monthly Budget Limit ($)
            </label>
            <input
              type="number"
              value={newLimit}
              onChange={(e) => setNewLimit(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Enter budget limit"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              autoFocus
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Press Enter to save, Escape to cancel
            </p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={handleSaveBudget}
              className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold transition duration-200"
            >
              <Check className="h-4 w-4" />
              <span>Save</span>
            </button>
            <button
              onClick={handleCancelEdit}
              className="flex items-center space-x-2 bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-semibold transition duration-200"
            >
              <X className="h-4 w-4" />
              <span>Cancel</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Alert for overspending or near limit */}
          {isOverBudget && (
            <div className="bg-red-50 dark:bg-red-900/50 border border-red-200 dark:border-red-800 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
                <p className="text-red-800 dark:text-red-300 font-semibold">Over Budget!</p>
              </div>
              <p className="text-red-700 dark:text-red-400 text-sm mt-1">
                You've exceeded your monthly budget by ${Math.abs(remaining).toFixed(2)}
              </p>
            </div>
          )}
          
          {isNearLimit && (
            <div className="bg-yellow-50 dark:bg-yellow-900/50 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                <p className="text-yellow-800 dark:text-yellow-300 font-semibold">Approaching Budget Limit</p>
              </div>
              <p className="text-yellow-700 dark:text-yellow-400 text-sm mt-1">
                You've used {percentageUsed.toFixed(0)}% of your monthly budget
              </p>
            </div>
          )}

          {/* Budget Progress */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Spent this month</span>
              <span className="font-semibold text-gray-900 dark:text-white">${monthlySpent.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Budget limit</span>
              <span className="font-semibold text-gray-900 dark:text-white">${budgetLimit.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm font-semibold">
              <span className={remaining >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}>
                {remaining >= 0 ? 'Remaining' : 'Over budget'}
              </span>
              <span className={remaining >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}>
                ${Math.abs(remaining).toFixed(2)}
              </span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
            <div
              className={`h-3 rounded-full transition-all duration-300 ${
                isOverBudget 
                  ? 'bg-red-500' 
                  : isNearLimit 
                    ? 'bg-yellow-500' 
                    : 'bg-emerald-500'
              }`}
              style={{ width: `${Math.min(percentageUsed, 100)}%` }}
            />
          </div>
          
          <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
            {percentageUsed.toFixed(1)}% of budget used
          </p>
        </div>
      )}
    </div>
  )
}