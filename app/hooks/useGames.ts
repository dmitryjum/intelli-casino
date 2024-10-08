import { CLOSE_GAME, FINISH_GAME, GAME_UPDATED, UPDATE_GAME_QUESTION, GET_GAME, OPEN_GAME } from '@/app/api/graphql/operations';
import { useMutation, useSubscription, useQuery } from '@apollo/client';
import { useToast } from '@/components/ui/use-toast';

import { GameStatus, Game, Question, Role } from '@prisma/client';

interface GameData {
  game: Game & { questions: Pick<Question, 'id' | 'question' | 'answer' | 'options'>[] }
}

type Props = {
  gameId: string,
  userRole: Role
};

const useGames = ({ gameId, userRole }: Props) => {
  const {toast} = useToast();
  const { data, loading: queryLoading, error: queryError } = useQuery<GameData, { gameId: string }>(GET_GAME, {
    variables: { gameId },
    fetchPolicy: 'cache-and-network',
  });

  const [openGame, {loading: openGameLoading, error: openGameError}] = useMutation(OPEN_GAME, {
    update(cache, { data }) {
      if(!data) return;
      cache.writeQuery<GameData, { gameId: string}>({
        query: GET_GAME,
        variables: { gameId },
        data: { game: data.openGame}
      });
    }
  })

  const [closeGame, {loading: closeGameLoading, error: closeGameError}] = useMutation(CLOSE_GAME, {
    update(cache, { data }) {
      if(!data) return;
      cache.writeQuery<GameData, { gameId: string}>({
        query: GET_GAME,
        variables: { gameId },
        data: { game: data.closeGame}
      });
    }
  });

  const [finishGame, { loading: finishLoading, error: finishError }] = useMutation(FINISH_GAME, {
    update(cache, { data }) {
      if (!data) return;
      cache.writeQuery<GameData, { gameId: string }>({
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
      cache.writeQuery<GameData, { gameId: string }>({
        query: GET_GAME,
        variables: { gameId },
        data: { game: data.updateGameQuestion },
      });
    },
  });

  useSubscription<{ gameUpdated: Game & { questions: Pick<Question, 'id' | 'question' | 'answer' | 'options'>[] }}>(GAME_UPDATED, {
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
        if (userRole === Role.SPECTATOR) toast({
            title: "Last question correct answer",
            description: updatedGame.questions[updatedGame.currentQuestionIndex]?.answer || 'No answer available',
            variant: "success",
          })
      }
    },
  });

  const isMutating = closeGameLoading || finishLoading || updateLoading || queryLoading || openGameLoading
  const mutationError = closeGameError || finishError || finishError || queryError || openGameError

  return {
    gameData: data?.game,
    loading: isMutating,
    error: mutationError,
    openGame,
    closeGame,
    finishGame,
    updateGameQuestion
  };
}

export { useGames };