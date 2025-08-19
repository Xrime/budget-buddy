import { useState, useRef, useCallback } from 'react'

export function useVoiceInput() {
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState('')
  const recognitionRef = useRef<SpeechRecognition | null>(null)

  const startListening = useCallback(() => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Speech recognition not supported in this browser')
      return
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    const recognition = new SpeechRecognition()

    recognition.continuous = false
    recognition.interimResults = false
    recognition.lang = 'en-US'

    recognition.onstart = () => {
      setIsListening(true)
    }

    recognition.onresult = (event) => {
      const result = event.results[0][0].transcript
      setTranscript(result)
      parseVoiceInput(result)
    }

    recognition.onend = () => {
      setIsListening(false)
    }

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error)
      setIsListening(false)
    }

    recognitionRef.current = recognition
    recognition.start()
  }, [])

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop()
    }
  }, [])

  const parseVoiceInput = (text: string): { amount?: number; category?: string; description?: string } => {
    const lowerText = text.toLowerCase()
    
    // Extract amount
    const amountMatch = lowerText.match(/(?:spent|cost|paid|₦|naira|\$|dollar)?\s*(\d+(?:\.\d{1,2})?)/)
    const amount = amountMatch ? parseFloat(amountMatch[1]) : undefined

    // Extract category keywords
    const categories = ['food', 'lunch', 'dinner', 'breakfast', 'transport', 'uber', 'taxi', 'bus', 'entertainment', 'movie', 'shopping', 'clothes', 'bills', 'electricity', 'water', 'healthcare', 'hospital', 'medicine', 'other']
    const categoryMap: Record<string, string> = {
      'lunch': 'Food', 'dinner': 'Food', 'breakfast': 'Food', 'food': 'Food',
      'uber': 'Transport', 'taxi': 'Transport', 'bus': 'Transport', 'transport': 'Transport',
      'movie': 'Entertainment', 'entertainment': 'Entertainment',
      'clothes': 'Shopping', 'shopping': 'Shopping',
      'electricity': 'Bills', 'water': 'Bills', 'bills': 'Bills',
      'hospital': 'Healthcare', 'medicine': 'Healthcare', 'healthcare': 'Healthcare'
    }
    
    const category = categories.find(cat => lowerText.includes(cat)) || 'other'
    const mappedCategory = categoryMap[category] || category.charAt(0).toUpperCase() + category.slice(1)

    return {
      amount,
      category: mappedCategory,
      description: text
    }
  }

  return {
    isListening,
    transcript,
    startListening,
    stopListening,
    parseVoiceInput
  }
}