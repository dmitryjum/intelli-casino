'use client'

import { useState, useEffect } from 'react'
import { CircleIcon } from 'lucide-react'

interface StartTimerProps {
  onTimerEnd: () => void
}

export default function StartTimer({ onTimerEnd }: StartTimerProps) {
  const [timeLeft, setTimeLeft] = useState(60)

  useEffect(() => {
    if (timeLeft > 0) {
      const timerId = setTimeout(() => {
        setTimeLeft(prevTime => prevTime - 1)
      }, 1000)
      return () => clearTimeout(timerId)
    } else {
      onTimerEnd() // Call the callback when timer reaches zero
    }
  }, [timeLeft, onTimerEnd])

  const minutes = Math.floor(timeLeft / 60)
  const seconds = timeLeft % 60

  return (
    <div className="flex items-center justify-center space-x-2 bg-gray-100 rounded-lg p-4 w-48">
      <CircleIcon className={`h-6 w-6 ${timeLeft === 0 ? 'text-green-500' : 'text-blue-500'}`} />
      <div className="text-2xl font-bold">
        {minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}
      </div>
    </div>
  )
}