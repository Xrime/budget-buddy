import React from 'react'
import { 
  Home, 
  Plus, 
  BarChart3, 
  Settings, 
  LogOut, 
  DollarSign,
  Moon,
  Sun,
  X
} from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { useTheme } from '../../contexts/ThemeContext'

interface SidebarProps {
  currentView: string
  onViewChange: (view: string) => void
  isOpen: boolean
  onClose: () => void
}

export function Sidebar({ currentView, onViewChange, isOpen, onClose }: SidebarProps) {
  const { signOut } = useAuth()
  const { isDark, toggleTheme } = useTheme()

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'add-expense', label: 'Add Expense', icon: Plus },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings },
  ]

  const handleItemClick = (view: string) => {
    onViewChange(view)
    onClose()
  }

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed top-0 left-0 h-full w-64 bg-white dark:bg-gray-800 shadow-xl z-50 transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:relative lg:shadow-none
      `}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-2">
            <DollarSign className="h-8 w-8 text-blue-600" />
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">Budget Buddy</h1>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6">
          <div className="space-y-2">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleItemClick(item.id)}
                className={`
                  w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors duration-200
                  ${currentView === item.id
                    ? 'bg-blue-50 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 border-r-2 border-blue-600'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }
                `}
              >
                <item.icon className="h-5 w-5" />
                <span className="font-medium">{item.label}</span>
              </button>
            ))}
          </div>
        </nav>

        {/* Footer Actions */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 space-y-2">
          <button
            onClick={toggleTheme}
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
          >
            {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            <span className="font-medium">{isDark ? 'Light Mode' : 'Dark Mode'}</span>
          </button>
          
          <button
            onClick={signOut}
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/50 transition-colors duration-200"
          >
            <LogOut className="h-5 w-5" />
            <span className="font-medium">Sign Out</span>
          </button>
        </div>
      </div>
    </>
  )
}