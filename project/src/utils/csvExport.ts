import { format } from 'date-fns'
import { Expense } from '../lib/supabase'

export function exportToCSV(expenses: Expense[], filename = 'expenses.csv') {
  const headers = ['Date', 'Category', 'Description', 'Amount']
  
  const csvContent = [
    headers.join(','),
    ...expenses.map(expense => [
      format(new Date(expense.date), 'yyyy-MM-dd'),
      expense.category,
      `"${expense.description.replace(/"/g, '""')}"`, // Escape quotes in descriptions
      expense.amount.toFixed(2)
    ].join(','))
  ].join('\n')

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)
  link.setAttribute('href', url)
  link.setAttribute('download', filename)
  link.style.visibility = 'hidden'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}