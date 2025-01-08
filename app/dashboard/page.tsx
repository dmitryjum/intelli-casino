import { getAuthSession } from "@/lib/nextauth"
import { redirect } from 'next/navigation';
import DashboardClient from './DashboardClient';
import { prisma } from "@/lib/db";

export const metadata = {
  title: "Dashboard | Intelli Casino",
}

export default async function Dashboard() {
  const session = await getAuthSession()
  if (!session?.user) {
    return redirect("/");
  };

  const userCount = await prisma.user.count();

  const trendingTopic = await prisma.topicCount.findFirst({
    orderBy: {
      count: 'desc',
    },
  });

  const userScores = await prisma.userAnswer.groupBy({
    by: ['userId'],
    _avg: {
      percentageCorrect: true,
    },
    orderBy: {
      _avg: {
        percentageCorrect: 'desc',
      },
    },
  });

  const userRank = userScores.findIndex(user => user.userId === session.user.id) + 1;

  const topics = await prisma.topicCount.findMany({})
  const formattedTopics = topics.map(topic => {
    return {
      text: topic.topic,
      value: topic.count
    }
  })
  return <DashboardClient userRank={userRank} topics={formattedTopics} userCount={userCount} trendingTopic={trendingTopic?.topic} />
}