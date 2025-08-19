import React, { useState } from 'react'
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

function MainApp() {
  const { expenses, addExpense, deleteExpense } = useExpenses()
  const [currentView, setCurrentView] = useState('dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(false)

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
