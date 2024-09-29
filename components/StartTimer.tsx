'use client'

import { useState, useEffect } from 'react'
import { Timer } from 'lucide-react'
import { differenceInSeconds } from 'date-fns';

interface StartTimerProps {
  timeStarted: Date;
  duration: number;
  onTimerEnd: () => void
}

export default function StartTimer({ timeStarted, duration, onTimerEnd }: StartTimerProps) {
  const calculateTimeLeft = () => {
    const now = new Date();
    const timeElapsed = differenceInSeconds(now, timeStarted);
    return Math.max(0, duration - timeElapsed);
  }

  const [timeLeft, setTimeLeft] = useState<number>(calculateTimeLeft());

  useEffect(() => {
    const intervalId = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000)
    if (timeLeft === 0) {
      clearInterval(intervalId);
      onTimerEnd();
    }
    return () => clearInterval(intervalId) // Clear interval on unmount
  }, [timeLeft, duration, onTimerEnd])

  const minutes = Math.floor(timeLeft / 60)
  const seconds = timeLeft % 60

  return (
    <div className="flex items-center justify-center space-x-2 bg-gray-100 rounded-lg p-4 w-48">
      <Timer className={`h-6 w-6 ${timeLeft === 0 ? 'text-green-500' : 'text-blue-500'}`} />
      <div className="text-2xl font-bold">
        {minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}
      </div>
    </div>
  )
}