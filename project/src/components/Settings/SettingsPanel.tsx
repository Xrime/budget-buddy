import React, { useState } from 'react'
import { Moon, Sun, User, Shield, Download, Trash2 } from 'lucide-react'
import { useTheme } from '../../contexts/ThemeContext'
import { useAuth } from '../../contexts/AuthContext'
import { useBudget } from '../../hooks/useBudget'

export function SettingsPanel() {
  const { isDark, toggleTheme } = useTheme()
  const { user } = useAuth()
  const { budget, setBudgetLimit } = useBudget()
  const [budgetInput, setBudgetInput] = useState(budget?.monthly_limit?.toString() || '')

  const handleBudgetUpdate = async () => {
    const limit = parseFloat(budgetInput)
    if (limit > 0) {
      await setBudgetLimit(limit)
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Profile Section */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center space-x-4 mb-6">
          <User className="h-8 w-8 text-blue-600" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Profile</h2>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={user?.email || ''}
              disabled
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white cursor-not-allowed"
            />
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Email cannot be changed
            </p>
          </div>
        </div>
      </div>

      {/* Appearance Section */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center space-x-4 mb-6">
          {isDark ? <Moon className="h-8 w-8 text-blue-600" /> : <Sun className="h-8 w-8 text-blue-600" />}
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Appearance</h2>
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium text-gray-900 dark:text-white">Dark Mode</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Switch between light and dark themes
            </p>
          </div>
          <button
            onClick={toggleTheme}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${
              isDark ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition duration-200 ${
                isDark ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Budget Settings */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center space-x-4 mb-6">
          <Shield className="h-8 w-8 text-blue-600" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Budget Settings</h2>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Monthly Budget Limit ($)
            </label>
            <div className="flex space-x-3">
              <input
                type="number"
                value={budgetInput}
                onChange={(e) => setBudgetInput(e.target.value)}
                placeholder="Enter monthly budget"
                className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
              <button
                onClick={handleBudgetUpdate}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition duration-200"
              >
                Update
              </button>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Current budget: ${budget?.monthly_limit || 0}
            </p>
          </div>
        </div>
      </div>

      {/* Data Management */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center space-x-4 mb-6">
          <Download className="h-8 w-8 text-blue-600" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Data Management</h2>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
            <div>
              <h3 className="font-medium text-gray-900 dark:text-white">Export Data</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Download all your expense data as CSV
              </p>
            </div>
            <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-semibold transition duration-200">
              Export CSV
            </button>
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-red-200 dark:border-red-800 p-6">
        <div className="flex items-center space-x-4 mb-6">
          <Trash2 className="h-8 w-8 text-red-600" />
          <h2 className="text-xl font-semibold text-red-600 dark:text-red-400">Danger Zone</h2>
        </div>
        
        <div className="space-y-4">
          <div className="p-4 border border-red-200 dark:border-red-800 rounded-lg bg-red-50 dark:bg-red-900/50">
            <h3 className="font-medium text-red-900 dark:text-red-300 mb-2">Delete Account</h3>
            <p className="text-sm text-red-700 dark:text-red-400 mb-4">
              This action cannot be undone. This will permanently delete your account and all associated data.
            </p>
            <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold transition duration-200">
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}