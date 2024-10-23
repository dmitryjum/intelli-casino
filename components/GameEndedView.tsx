import React from 'react';
import Link from 'next/link';
import { BarChart } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatTimeDelta } from '@/lib/utils';
import { Game } from '@prisma/client';
import { differenceInSeconds } from 'date-fns';
import { buttonVariants } from './ui/button';

type Props = {
  game: Game;
};

const GameEndedView: React.FC<Props> = ({ game }) => {
  return (
    <div className="absolute flex flex-col justify-center top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
      <div className="px-4 mt-2 font-semibold text-white bg-green-500 rounded-md whitespace-nowrap">
        You completed in {formatTimeDelta(differenceInSeconds(new Date().getTime(), game.timeStarted))}
      </div>
      <Link href={`/statistics/${game.id}`} className={cn(buttonVariants(), "mt-2")}>
        View Statistics
        <BarChart className="w-4 h-4 ml-2" />
      </Link>
    </div>
  );
};

export default GameEndedView;