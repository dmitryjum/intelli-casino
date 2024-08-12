'use client'
import Image from 'next/image'
import React from 'react'
import { Progress } from './ui/progress'

type Props = {
  finished: boolean
}

const loadingTexts = [
  "Sharpen your mind, your next challenge awaits!",
  "Get ready to wager your wisdom—fortune favors the bold!",
  "The stakes are high, but so are the rewards—are you up for it?",
  "Your moment of brilliance is just a question away!",
  "Prepare to bet on your brainpower—let the game begin!",
]

const LoadingQuestions = ({finished}: Props) => {
  const [progress, setProgress] = React.useState(0);
  const [loadingText, setLoadingText] = React.useState(loadingTexts[0]);

  // changes text under the loading image
  React.useEffect(() => {
    const interval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * loadingTexts.length)
      setLoadingText(loadingTexts[randomIndex])
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // changes speed of the progress bar fill in
  React.useEffect(() => {
    // Set up an interval that runs every 100ms
    const interval = setInterval(() => {
      // Update the progress bar's state
      setProgress(prev => {
        if (finished) return 100
        // If the progress bar reaches 100%, reset it back to 0 (could be for looping animation)
        if (prev === 100) {
          return 0;
        }
        // Randomly increase the progress by 2% with a 10% chance
        if (Math.random() < 0.1) {
          return prev + 2;
        }
        // Otherwise, increase the progress by 0.5%
        return prev + 0.5
      });
    }, 100);
    return () => clearInterval(interval);
  }, [finished])

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