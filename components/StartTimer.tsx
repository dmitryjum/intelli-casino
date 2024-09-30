'use client'

import { useState, useEffect, ReactNode, useRef } from 'react'
import { differenceInSeconds } from 'date-fns';

interface StartTimerProps {
  duration: number;
  onTimerEnd: () => void;
  children: (timeLeft: number) => ReactNode;
}

export default function StartTimer({ duration, onTimerEnd, children }: StartTimerProps) {
  const endTimeRef = useRef<Date | null>(null);

  const calculateTimeLeft = () => {
    if (!endTimeRef.current) {
      endTimeRef.current = new Date(new Date().getTime() + duration * 1000);
    }

    const now = new Date();
    return Math.max(0, differenceInSeconds(endTimeRef.current, now));
  }

  const [timeLeft, setTimeLeft] = useState<number>(calculateTimeLeft());

  useEffect(() => {
    const intervalId: ReturnType<typeof setInterval> = setInterval(() => {
      const newTimeLeft = calculateTimeLeft();
      setTimeLeft(newTimeLeft);

      if (newTimeLeft <= 0) {
        clearInterval(intervalId);
        onTimerEnd();
      }
    }, 1000);
    
    return () => clearInterval(intervalId)
  }, [onTimerEnd])

  return <>{children(timeLeft)}</>
}