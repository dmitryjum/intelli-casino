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
    const initialTimeLeft: number = calculateTimeLeft();
    setTimeLeft(initialTimeLeft);

    if (initialTimeLeft <= 0) {
      onTimerEnd();
      return; // Exit early if the timer has already ended
    }

    const intervalId: ReturnType<typeof setInterval> = setInterval(() => {
      setTimeLeft((prevTimeLeft: number) => {
        const newTimeLeft: number = calculateTimeLeft();
        if(newTimeLeft <= 0) {
          clearInterval(intervalId);
          onTimerEnd()
        }
        return newTimeLeft;
      });
    }, 1000);
    
    return () => clearInterval(intervalId) // Clear interval on unmount
  }, [calculateTimeLeft, onTimerEnd])

  const minutes: number = Math.floor(timeLeft / 60)
  const seconds: number = timeLeft % 60

  // Format time with leading zeros
  const formattedTime: string = `${minutes.toString().padStart(2, '0')}:${seconds
    .toString()
    .padStart(2, '0')}`;

  return (
    <div className="flex items-center justify-center space-x-2 bg-gray-100 rounded-lg p-4 w-48">
      <Timer className={`h-6 w-6 ${timeLeft === 0 ? 'text-green-500' : 'text-blue-500'}`} />
      <div className="text-2xl font-bold">
        {formattedTime}
      </div>
    </div>
  )
}