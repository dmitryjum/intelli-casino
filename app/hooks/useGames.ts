import { CLOSE_GAME, FINISH_GAME, GAME_UPDATED, UPDATE_GAME_QUESTION, GET_GAME, OPEN_GAME } from '@/app/api/graphql/operations';
import { useMutation, useSubscription, useQuery } from '@apollo/client';
import { useToast } from '@/components/ui/use-toast';

import { GameStatus, Game, GameType, Question, Role } from '@prisma/client';

interface GameData {
  game: Game & { questions: Pick<Question, 'id' | 'question' | 'answer' | 'options' | 'userAnswer'>[] }
}

interface GetGameQueryArgs {
  gameId: string
}

type Props = {
  gameId: string,
  userRole: Role
};

const useGames = ({ gameId, userRole }: Props) => {
  const {toast} = useToast();
  const { data, loading: queryLoading, error: queryError } = useQuery<GameData, GetGameQueryArgs>(GET_GAME, {
    variables: { gameId },
    fetchPolicy: 'cache-and-network',
  });

  const game = {
    id: data?.game.id || '',
    userId: data?.game.userId || '',
    status: data?.game.status || GameStatus.OPEN,
    openAt: data?.game.openAt || null,
    timeStarted: data?.game.timeStarted || new Date(),
    topic: data?.game.topic || '',
    timeEnded: data?.game.timeEnded || null,
    gameType: data?.game.gameType || GameType.open_ended,
    currentQuestionIndex: data?.game.currentQuestionIndex || 0,
    currentQuestionStartTime: data?.game.currentQuestionStartTime || null,
    questions: data?.game.questions || []
  };

  const [openGame, {loading: openGameLoading, error: openGameError}] = useMutation(OPEN_GAME, {
    update(cache, { data }) {
      if(!data) return;
      cache.writeQuery<GameData, GetGameQueryArgs>({
        query: GET_GAME,
        variables: { gameId },
        data: { game: data.openGame}
      });
    }
  })

  const [closeGame, {loading: closeGameLoading, error: closeGameError}] = useMutation(CLOSE_GAME, {
    update(cache, { data }) {
      if(!data) return;
      cache.writeQuery<GameData, GetGameQueryArgs>({
        query: GET_GAME,
        variables: { gameId },
        data: { game: data.closeGame}
      });
    }
  });

  const [finishGame, { loading: finishLoading, error: finishError }] = useMutation(FINISH_GAME, {
    update(cache, { data }) {
      if (!data) return;
      cache.writeQuery<GameData, GetGameQueryArgs>({
        query: GET_GAME,
        variables: { gameId },
        data: { game: data.finishGame },
      });
    },
  });

  // Mutation to update the game question
  const [updateGameQuestion, { loading: updateLoading, error: updateError }] = useMutation(UPDATE_GAME_QUESTION, {
    update(cache, { data }) {
      if (!data) return;
      cache.writeQuery<GameData, GetGameQueryArgs>({
        query: GET_GAME,
        variables: { gameId },
        data: { game: data.updateGameQuestion },
      });
    },
  });

  useSubscription<{ gameUpdated: Game & { questions: Pick<Question, 'id' | 'question' | 'answer' | 'options' | 'userAnswer'>[] }}>(GAME_UPDATED, {
    variables: { gameId },
    onData: ({ client, data }) => {
      if (!data) return;
      const updatedGame = data.data?.gameUpdated;
      // no need to update anything if the game has just switched from open to closed
      if (updatedGame && (updatedGame.status !== GameStatus.OPEN)) {
        client.writeQuery({
          query: GET_GAME,
          data: {
            game: updatedGame
          }
        });
        if (userRole === Role.SPECTATOR) {
          // check the first and the last questions, because the index doesn't change
          toast({
            title: "Player's last question answer",
            description: updatedGame.questions[updatedGame.currentQuestionIndex - 1]?.userAnswer || 'No answer available',
            titleTwo: "Correct Answer",
            descriptionTwo: updatedGame.questions[updatedGame.currentQuestionIndex - 1]?.answer || 'No answer available',
            toastremovedelay: 7000
          })
        }
      }
    },
  });

  const isMutating = closeGameLoading || finishLoading || updateLoading || queryLoading || openGameLoading
  const mutationError = closeGameError || finishError || finishError || queryError || openGameError

  return {
    game,
    loading: isMutating,
    error: mutationError,
    openGame,
    closeGame,
    finishGame,
    updateGameQuestion
  };
}

export { useGames };