-- CreateEnum
CREATE TYPE "Role" AS ENUM ('PLAYER', 'SPECTATOR');

-- CreateEnum
CREATE TYPE "GameType" AS ENUM ('mcq', 'open_ended');

-- CreateEnum
CREATE TYPE "GameStatus" AS ENUM ('OPEN', 'CLOSED', 'FINISHED');

-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT,
    "role" "Role" NOT NULL DEFAULT 'PLAYER',
    "emailVerified" TIMESTAMP(3),
    "image" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Quiz" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "topic" TEXT NOT NULL,
    "gameType" "GameType" NOT NULL,

    CONSTRAINT "Quiz_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Game" (
    "id" TEXT NOT NULL,
    "quizId" TEXT NOT NULL,
    "playerId" TEXT NOT NULL,
    "status" "GameStatus" NOT NULL DEFAULT 'OPEN',
    "openAt" TIMESTAMP(3),
    "timeStarted" TIMESTAMP(3) NOT NULL,
    "timeEnded" TIMESTAMP(3),
    "currentQuestionIndex" INTEGER NOT NULL DEFAULT 0,
    "currentQuestionStartTime" TIMESTAMP(3),

    CONSTRAINT "Game_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Question" (
    "id" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "answer" TEXT NOT NULL,
    "blankedAnswer" TEXT NOT NULL DEFAULT '',
    "quizId" TEXT NOT NULL,
    "options" JSONB,
    "questionType" "GameType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Question_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserAnswer" (
    "id" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "gameId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "answer" TEXT NOT NULL,
    "percentageCorrect" DOUBLE PRECISION,
    "isCorrect" BOOLEAN,

    CONSTRAINT "UserAnswer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TopicCount" (
    "id" TEXT NOT NULL,
    "topic" TEXT NOT NULL,
    "count" INTEGER NOT NULL,

    CONSTRAINT "TopicCount_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_SpectatorsOfGame" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_SpectatorsOfGame_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "account_userId_idx" ON "Account"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "Session"("sessionToken");

-- CreateIndex
CREATE INDEX "session_userId_idx" ON "Session"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Quiz_topic_key" ON "Quiz"("topic");

-- CreateIndex
CREATE INDEX "quiz_userId_idx" ON "Quiz"("userId");

-- CreateIndex
CREATE INDEX "quiz_topic_idx" ON "Quiz"("topic");

-- CreateIndex
CREATE INDEX "game_quizId_idx" ON "Game"("quizId");

-- CreateIndex
CREATE INDEX "game_playerId_idx" ON "Game"("playerId");

-- CreateIndex
CREATE INDEX "question_quizId_idx" ON "Question"("quizId");

-- CreateIndex
CREATE INDEX "userAnswer_questionId_idx" ON "UserAnswer"("questionId");

-- CreateIndex
CREATE INDEX "userAnswer_gameId_idx" ON "UserAnswer"("gameId");

-- CreateIndex
CREATE INDEX "userAnswer_userId_idx" ON "UserAnswer"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "TopicCount_topic_key" ON "TopicCount"("topic");

-- CreateIndex
CREATE INDEX "_SpectatorsOfGame_B_index" ON "_SpectatorsOfGame"("B");

