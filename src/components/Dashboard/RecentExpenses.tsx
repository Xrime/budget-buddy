import React from 'react'
import { format } from 'date-fns'
import { Trash2, FileDown } from 'lucide-react'
import { Expense } from '../../hooks/useExpenses'

interface RecentExpensesProps {
  expenses: Expense[]
  onDeleteExpense: (id: string) => void
  onExportCSV: () => void
}

export function RecentExpenses({ expenses, onDeleteExpense, onExportCSV }: RecentExpensesProps) {
  const recentExpenses = expenses.slice(0, 10) // Show latest 10 expenses

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'Food': 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300',
      'Transport': 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300',
      'Entertainment': 'bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300',
      'Shopping': 'bg-pink-100 text-pink-800 dark:bg-pink-900/50 dark:text-pink-300',
      'Bills': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300',
      'Healthcare': 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300',
      'Other': 'bg-gray-100 text-gray-800 dark:bg-gray-900/50 dark:text-gray-300'
    }
    return colors[category] || colors['Other']
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Expenses</h3>
        {expenses.length > 0 && (
          <button
            onClick={onExportCSV}
            className="flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-semibold transition duration-200"
          >
            <FileDown className="h-4 w-4" />
            <span>Export CSV</span>
          </button>
        )}
      </div>

      {recentExpenses.length === 0 ? (
        <div className="p-8 text-center">
          <p className="text-gray-500 dark:text-gray-400">No expenses yet. Add your first expense to get started!</p>
        </div>
      ) : (
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {recentExpenses.map((expense) => (
            <div key={expense.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-3">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(expense.category)}`}>
                      {expense.category}
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {format(new Date(expense.date), 'MMM dd, yyyy')}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-gray-900 dark:text-white font-medium">
                    {expense.description}
                  </p>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-lg font-semibold text-gray-900 dark:text-white">
                    ${expense.amount.toFixed(2)}
                  </span>
                  <button
                    onClick={() => onDeleteExpense(expense.id)}
                    className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 p-1"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}