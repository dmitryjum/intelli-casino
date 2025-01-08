import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Brain, Clock, Coins, ArrowRight } from 'lucide-react'
import StartTimer from './StartTimer';
import { OPEN_DURATION } from '@/lib/constants';
import { handleCountdownComplete } from '@/lib/utils';
import { useToast } from './ui/use-toast';

type Props = {
  gameId: string;
  timeStarted: Date;
  openAt: Date | null;
  closeGame: Function;
  gameTopic: string;
};

const GameOpenView: React.FC<Props> = ({ gameId, timeStarted, openAt, closeGame, gameTopic }) => {
  const [betAmount, setBetAmount] = useState(0.1)
  const [betOnPlayer, setBetOnPlayer] = useState(true)
  const { toast } = useToast();

  const onCountdownComplete = React.useCallback(() => {
    handleCountdownComplete(gameId, closeGame, toast);
  }, [gameId, closeGame, toast]);
  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <Card className="w-full">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-2xl font-bold">{gameTopic} Quiz</CardTitle>
            <div className="flex items-center space-x-2 text-muted-foreground">
              <StartTimer
                key={new Date(timeStarted).getTime()}
                duration={OPEN_DURATION}
                startAt={openAt}
                onTimerEnd={onCountdownComplete}
              >
                {(timeLeft) => (
                  <div className="flex items-center justify-center space-x-2 bg-gray-100 rounded-lg p-4 w-48">
                    <Clock className={`h-5 w-5 ${timeLeft === 0 ? 'text-green-500' : 'text-blue-500'}`} />
                    <div className="text-2xl font-bold">
                      <span className="text-2xl font-semibold">
                        {Math.floor(timeLeft / 60).toString().padStart(2, '0')}:
                        {(timeLeft % 60).toString().padStart(2, '0')}
                      </span>
                    </div>
                  </div>
                )}
              </StartTimer>
            </div>
          </div>
          <CardDescription>Place your bets before the game starts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Betting Options</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="bet-target">Bet on Player</Label>
                  <Switch
                    id="bet-target"
                    checked={betOnPlayer}
                    onCheckedChange={setBetOnPlayer}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bet-amount">Bet Amount (ETH)</Label>
                  <div className="flex items-center space-x-2">
                    <Input
                      id="bet-amount"
                      type="number"
                      value={betAmount}
                      onChange={(e) => setBetAmount(Number(e.target.value))}
                      step={0.01}
                      min={0.01}
                      max={10}
                    />
                    <Coins className="h-5 w-5 text-muted-foreground" />
                  </div>
                </div>
                <Slider
                  value={[betAmount]}
                  onValueChange={([value]) => setBetAmount(value)}
                  max={10}
                  step={0.01}
                />
              </CardContent>
              <CardFooter>
                <Button className="w-full" disabled>Place Bet</Button>
              </CardFooter>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Game Info</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Brain className="h-5 w-5 text-muted-foreground" />
                  <span>Topic: {gameTopic}</span>
                </div>
                {/* <div className="flex items-center space-x-2">
                  <ArrowRight className="h-5 w-5 text-muted-foreground" />
                  <span>Difficulty: Intermediate</span>
                </div> */}
                <div className="flex items-center space-x-2">
                  <Coins className="h-5 w-5 text-gray-400 text-muted-foreground" />
                  <span>Total Pool: 2.5 ETH</span>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full" disabled>View Details</Button>
              </CardFooter>
            </Card>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="ghost" disabled>How to Play</Button>
          <Button variant="destructive" disabled>Withdraw Bet</Button>
        </CardFooter>
      </Card>
    </div>
  )
}

export default GameOpenView;