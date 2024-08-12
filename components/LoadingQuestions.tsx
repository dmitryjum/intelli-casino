'use client'
import Image from 'next/image'
import React from 'react'
import { Progress } from './ui/progress'

type Props = {}

const loadingTexts = [
  "Sharpen your mind, your next challenge awaits!",
  "Get ready to wager your wisdom—fortune favors the bold!",
  "The stakes are high, but so are the rewards—are you up for it?",
  "Your moment of brilliance is just a question away!",
  "Prepare to bet on your brainpower—let the game begin!",
]

const LoadingQuestions = (props: Props) => {
  const [progress, setProgress] = React.useState(0);
  const [loadingText, setLoadingText] = React.useState(loadingTexts[0]);
  React.useEffect(() => {
    const interval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * loadingTexts.length)
      setLoadingText(loadingTexts[randomIndex])
    }, 5000);
    return () => clearInterval(interval);
  })
  return (
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70vw] md:w-[60vw] flex flex-col items-center">
      <Image 
        src={'/loading.gif'}
        width={400}
        height={400}
        alt="loading animation"
       />
       <Progress value={progress} className='w-full mt-4'/>
       <h1 className='mt-2 text-xl'>{loadingText}</h1>
    </div>
  )
}

export default LoadingQuestions