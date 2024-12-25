import React from 'react';
import StartTimer from './StartTimer';
import { OPEN_DURATION } from '@/lib/constants';
import { handleCountdownComplete } from '@/lib/utils';
import { useToast } from './ui/use-toast';
import { Timer } from 'lucide-react';

type Props = {
  gameId: string;
  timeStarted: Date;
  openAt: Date | null;
  closeGame: Function;
};

const GameOpenView: React.FC<Props> = ({ gameId, timeStarted, openAt, closeGame }) => {
  const { toast } = useToast();

  const onCountdownComplete = React.useCallback(() => {
    handleCountdownComplete(gameId, closeGame, toast);
  }, [gameId, closeGame, toast]);

  return (
    <div className="absolute flex flex-col justify-center top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
      <div className="px-4 mt-2 font-semibold text-white bg-blue-500 rounded-md whitespace-nowrap">
        Game will start in 1 minute...
      </div>
      <div className="mt-4">
        <StartTimer
          key={new Date(timeStarted).getTime()}
          duration={OPEN_DURATION}
          startAt={openAt}
          onTimerEnd={onCountdownComplete}
        >
          {(timeLeft) => (
            <div className="flex items-center justify-center space-x-2 bg-gray-100 rounded-lg p-4 w-48">
              <Timer className={`h-6 w-6 ${timeLeft === 0 ? 'text-green-500' : 'text-blue-500'}`} />
              <div className="text-2xl font-bold">
                {Math.floor(timeLeft / 60).toString().padStart(2, '0')}:
                {(timeLeft % 60).toString().padStart(2, '0')}
              </div>
            </div>
          )}
        </StartTimer>
      </div>
    </div>
  );
};

export default GameOpenView;