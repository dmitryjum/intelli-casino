/*
  Warnings:

  - You are about to drop the column `gameType` on the `Game` table. All the data in the column will be lost.
  - You are about to drop the column `topic` on the `Game` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Game` table. All the data in the column will be lost.
  - You are about to drop the column `gameId` on the `Question` table. All the data in the column will be lost.
  - You are about to drop the column `isCorrect` on the `Question` table. All the data in the column will be lost.
  - You are about to drop the column `percentageCorrect` on the `Question` table. All the data in the column will be lost.
  - You are about to drop the column `userAnswer` on the `Question` table. All the data in the column will be lost.
  - Added the required column `playerId` to the `Game` table without a default value. This is not possible if the table is not empty.
  - Added the required column `quizId` to the `Game` table without a default value. This is not possible if the table is not empty.
  - Added the required column `quizId` to the `Question` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "game_userId_idx";

-- DropIndex
DROP INDEX "question_gameId_idx";

-- AlterTable
ALTER TABLE "Game" DROP COLUMN "gameType",
DROP COLUMN "topic",
DROP COLUMN "userId",
ADD COLUMN     "playerId" TEXT NOT NULL,
ADD COLUMN     "quizId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Question" DROP COLUMN "gameId",
DROP COLUMN "isCorrect",
DROP COLUMN "percentageCorrect",
DROP COLUMN "userAnswer",
ADD COLUMN     "quizId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "Quiz" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "topic" TEXT NOT NULL,
    "gameType" "GameType" NOT NULL,

    CONSTRAINT "Quiz_pkey" PRIMARY KEY ("id")
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
CREATE TABLE "_SpectatorsOfGame" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Quiz_topic_key" ON "Quiz"("topic");

-- CreateIndex
CREATE INDEX "quiz_userId_idx" ON "Quiz"("userId");

-- CreateIndex
CREATE INDEX "quiz_topic_idx" ON "Quiz"("topic");

-- CreateIndex
CREATE INDEX "userAnswer_questionId_idx" ON "UserAnswer"("questionId");

-- CreateIndex
CREATE INDEX "userAnswer_gameId_idx" ON "UserAnswer"("gameId");

-- CreateIndex
CREATE INDEX "userAnswer_userId_idx" ON "UserAnswer"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "_SpectatorsOfGame_AB_unique" ON "_SpectatorsOfGame"("A", "B");

-- CreateIndex
CREATE INDEX "_SpectatorsOfGame_B_index" ON "_SpectatorsOfGame"("B");

-- CreateIndex
CREATE INDEX "game_quizId_idx" ON "Game"("quizId");

-- CreateIndex
CREATE INDEX "game_playerId_idx" ON "Game"("playerId");

-- CreateIndex
CREATE INDEX "question_quizId_idx" ON "Question"("quizId");
