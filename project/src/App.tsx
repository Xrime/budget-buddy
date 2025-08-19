import React, { useState } from 'react'
import { useEffect } from 'react'
import { ThemeProvider } from './contexts/ThemeContext'
import { Sidebar } from './components/Layout/Sidebar'
import { Header } from './components/Layout/Header'
import { StatsCards } from './components/Dashboard/StatsCards'
import { BudgetOverview } from './components/Dashboard/BudgetOverview'
import { RecentExpenses } from './components/Dashboard/RecentExpenses'
import { ExpenseForm } from './components/AddExpense/ExpenseForm'
import { ExpenseCharts } from './components/Analytics/ExpenseCharts'
import { SettingsPanel } from './components/Settings/SettingsPanel'
import { useExpenses } from './hooks/useExpenses'
import { exportToCSV } from './utils/csvExport'

function AuthScreen() {
  const [isLogin, setIsLogin] = useState(true)
  const [showEmailConfirmation, setShowEmailConfirmation] = useState(false)

  useEffect(() => {
    // Check if user came from email confirmation
    const urlParams = new URLSearchParams(window.location.search)
    if (urlParams.get('type') === 'signup') {
      setShowEmailConfirmation(true)
      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname)
    }
  }, [])

  if (showEmailConfirmation) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 text-center">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/50 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Email Confirmed!</h1>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Your account has been successfully confirmed. You can now sign in to Budget Buddy.
            </p>
            <button
              onClick={() => {
                setShowEmailConfirmation(false)
                setIsLogin(true)
              }}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition duration-200"
            >
              Continue to Sign In
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      {isLogin ? (
      ) : (
      )}
    </div>
  )
}

function MainApp() {
  const { user, loading } = {}
  const { expenses, addExpense, deleteExpense, refetch } = useExpenses()
  const [currentView, setCurrentView] = useState('dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(false)

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!user) {
    return <AuthScreen />
  }

  const handleExportCSV = () => {
    exportToCSV(expenses, `expenses-${new Date().toISOString().split('T')[0]}.csv`)
  }

  const getViewTitle = () => {
    switch (currentView) {
      case 'dashboard': return 'Dashboard'
      case 'add-expense': return 'Add Expense'
      case 'analytics': return 'Analytics'
      case 'settings': return 'Settings'
      default: return 'Dashboard'
    }
  }

  const renderContent = () => {
    switch (currentView) {
      case 'dashboard':
        return (
          <div className="space-y-8">
            <StatsCards expenses={expenses} />
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
              <div className="xl:col-span-2">
                <RecentExpenses 
                  expenses={expenses} 
                  onDeleteExpense={deleteExpense}
                  onExportCSV={handleExportCSV}
                />
              </div>
              <div>
                <BudgetOverview expenses={expenses} />
              </div>
            </div>
          </div>
        )
      
      case 'add-expense':
        return <ExpenseForm onAddExpense={addExpense} />
      
      case 'analytics':
        return <ExpenseCharts expenses={expenses} />
      
      case 'settings':
        return <SettingsPanel />
      
      default:
        return <div>View not found</div>
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
      <Sidebar 
        currentView={currentView} 
        onViewChange={setCurrentView}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      
      <div className="flex-1 flex flex-col lg:ml-0">
        <Header 
          onMenuToggle={() => setSidebarOpen(!sidebarOpen)}
          title={getViewTitle()}
        />
        
        <main className="flex-1 p-6">
          {renderContent()}
        </main>
      </div>
    </div>
  )
}

function App() {
  return (
    <ThemeProvider>
      
        <MainApp />
      
    </ThemeProvider>
  )
}

export default App