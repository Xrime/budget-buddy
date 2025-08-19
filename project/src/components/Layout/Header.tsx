import React from 'react'
import { Menu, User } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'

interface HeaderProps {
  onMenuToggle: () => void
  title: string
}

export function Header({ onMenuToggle, title }: HeaderProps) {
  const { user } = useAuth()

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center space-x-4">
          <button
            onClick={onMenuToggle}
            className="lg:hidden text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
          >
            <Menu className="h-6 w-6" />
          </button>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">{title}</h1>
        </div>

        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-2 bg-gray-100 dark:bg-gray-700 rounded-full px-3 py-2">
            <User className="h-4 w-4 text-gray-600 dark:text-gray-300" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300 truncate max-w-32">
              {user?.email}
            </span>
          </div>
        </div>
      </div>
    </header>
  )
}