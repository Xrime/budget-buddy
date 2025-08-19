import React, { useState } from 'react'
import { format } from 'date-fns'
import { Mic, MicOff, Plus } from 'lucide-react'
import { useVoiceInput } from '../../hooks/useVoiceInput'

interface ExpenseFormProps {
  onAddExpense: (expense: {
    amount: number
    category: string
    description: string
    date: string
  }) => Promise<{ success: boolean }>
}

const categories = [
  'Food',
  'Transport',
  'Entertainment',
  'Shopping',
  'Bills',
  'Healthcare',
  'Other'
]

export function ExpenseForm({ onAddExpense }: ExpenseFormProps) {
  const [amount, setAmount] = useState('')
  const [category, setCategory] = useState('Food')
  const [description, setDescription] = useState('')
  const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'))
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState('')

  const { isListening, transcript, startListening, stopListening, parseVoiceInput } = useVoiceInput()

  const handleVoiceInput = () => {
    if (isListening) {
      stopListening()
    } else {
      startListening()
    }
  }

  // Parse voice input when transcript changes
  React.useEffect(() => {
    if (transcript) {
      const parsed = parseVoiceInput(transcript)
      if (parsed.amount) setAmount(parsed.amount.toString())
      if (parsed.category) setCategory(parsed.category)
      if (parsed.description) setDescription(parsed.description)
    }
  }, [transcript, parseVoiceInput])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!amount || parseFloat(amount) <= 0) {
      return
    }
    
    setLoading(true)
    setSuccess('')

    const result = await onAddExpense({
      amount: parseFloat(amount),
      category,
      description,
      date
    })

    if (result.success) {
      setAmount('')
      setDescription('')
      setDate(format(new Date(), 'yyyy-MM-dd'))
      setSuccess('Expense added successfully!')
      setTimeout(() => setSuccess(''), 3000)
    }

    setLoading(false)
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Add New Expense</h2>
        <button
          type="button"
          onClick={handleVoiceInput}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-semibold transition duration-200 ${
            isListening
              ? 'bg-red-600 hover:bg-red-700 text-white'
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
        >
          {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
          <span>{isListening ? 'Stop Recording' : 'Voice Input'}</span>
        </button>
      </div>

      {isListening && (
        <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/50 border border-blue-200 dark:border-blue-800 rounded-lg">
          <div className="flex items-center space-x-2">
            <div className="animate-pulse h-3 w-3 bg-red-500 rounded-full"></div>
            <p className="text-blue-800 dark:text-blue-300 font-semibold">Listening...</p>
          </div>
          <p className="text-blue-700 dark:text-blue-400 text-sm mt-1">
            Say something like: "Spent $25 on lunch today" or "₦2000 for transport yesterday"
          </p>
        </div>
      )}

      {transcript && (
        <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/50 border border-green-200 dark:border-green-800 rounded-lg">
          <p className="text-green-800 dark:text-green-300 font-semibold">Voice Input Detected:</p>
          <p className="text-green-700 dark:text-green-400 text-sm mt-1">"{transcript}"</p>
        </div>
      )}

      {success && (
        <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/50 border border-green-200 dark:border-green-800 rounded-lg">
          <p className="text-green-600 dark:text-green-400 font-semibold">{success}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Amount ($)
            </label>
            <input
              id="amount"
              type="number"
              step="0.01"
              min="0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="0.00"
              required
            />
          </div>

          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Category
            </label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Description
          </label>
          <input
            id="description"
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            placeholder="What did you spend on?"
            required
          />
        </div>

        <div>
          <label htmlFor="date" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Date
          </label>
          <input
            id="date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading || !amount || !description}
          className="w-full flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-3 px-4 rounded-lg transition duration-200"
        >
          <Plus className="h-5 w-5" />
          <span>{loading ? 'Adding Expense...' : 'Add Expense'}</span>
        </button>
      </form>
    </div>
  )
}