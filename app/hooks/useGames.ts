import { CLOSE_GAME, FINISH_GAME, GAME_UPDATED, UPDATE_GAME_QUESTION, GET_GAME, OPEN_GAME, ADD_SPECTATOR_TO_GAME } from '@/app/api/graphql/operations';
import { useMutation, useSubscription, useQuery } from '@apollo/client';
import { useToast } from '@/components/ui/use-toast';
import { GameData } from '../types/gameData';
import { GameStatus, GameType, Role} from '@prisma/client';

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
    playerId: data?.game.playerId || '',
    status: data?.game.status || GameStatus.OPEN,
    openAt: data?.game.openAt || null,
    timeStarted: data?.game.timeStarted || new Date(),
    topic: data?.game.quiz.topic || '',
    timeEnded: data?.game.timeEnded || null,
    gameType: data?.game.quiz.gameType || GameType.open_ended,
    currentQuestionIndex: data?.game.currentQuestionIndex || 0,
    currentQuestionStartTime: data?.game.currentQuestionStartTime || null,
    questions: data?.game.quiz.questions || [],
    totalQuestionsCount: data?.game.quiz._count.questions || 0,
    userAnswers: data?.game.userAnswers || [],
    quiz: data?.game.quiz || {questions: []},
    spectators: data?.game.spectators || []
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

  const [addSpectatorToGame, { loading: addSpectatorLoading, error: addSpectatorError }] = useMutation(ADD_SPECTATOR_TO_GAME, {
    update(cache, { data }) {
      if (!data) return;
      cache.writeQuery<GameData, GetGameQueryArgs>({
        query: GET_GAME,
        variables: { gameId },
        data: { game: data.addSpectatorToGame },
      });
    },
  }) 

  useSubscription<{ gameUpdated: GameData['game'] }>(GAME_UPDATED, {
    variables: { gameId },
    onData: ({ client, data}) => {
      if (!data?.data?.gameUpdated) return;
      const updatedGame = data.data.gameUpdated

      // Update the cache with the new game data
      client.writeQuery({
        query: GET_GAME,
        data: {
          game: updatedGame
        }
      });

      // Logic for Spectator role
      if (userRole === Role.SPECTATOR) {
        let previousQuestion;

        // Determine if the game has just finished
        if (updatedGame.status === GameStatus.FINISHED) {
          previousQuestion = updatedGame.quiz.questions[updatedGame.currentQuestionIndex];
        } else if (updatedGame.currentQuestionIndex > 0 && updatedGame.status === GameStatus.CLOSED) {
          // If the currentQuestionIndex is greater than 0, a question has been answered
          previousQuestion = updatedGame.quiz.questions[updatedGame.currentQuestionIndex - 1];
        }

        // Show toast with correct answer and user answer for the previous question
        if (previousQuestion) {
          const userAnswer = updatedGame.userAnswers.find(
            (ua) => ua.questionId === previousQuestion.id
          )?.answer;
          const correct: boolean = userAnswer == previousQuestion.answer
          toast({
            title: "Player's last question answer",
            description: userAnswer || 'No answer available',
            titleTwo: "Correct Answer",
            descriptionTwo: previousQuestion.answer || 'No answer available',
            toastremovedelay: 7000,
            variant: correct ? "success" : "destructive"
          });
        }
      }
    },
  });

  const isMutating = closeGameLoading || finishLoading || updateLoading || queryLoading || openGameLoading || addSpectatorLoading
  const mutationError = closeGameError || finishError || updateError || queryError || openGameError || addSpectatorError

  return {
    game,
    loading: isMutating,
    error: mutationError,
    openGame,
    closeGame,
    finishGame,
    updateGameQuestion,
    addSpectatorToGame
  };
}

export { useGames };