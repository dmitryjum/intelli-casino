import { getAuthSession } from '@/lib/nextauth'
import { redirect } from 'next/navigation';
import React from 'react'
import QuizMeCard from './QuizMeCard';
import HistoryCard from './HistoryCard';
import HotTopicsCard from './HotTopicsCard';
import RecentActivities from './RecentActivities';

type Props = {}

export const metadata = {
  title: "Dashboard | Intelli Casino",
}

const Dashboard = async (props: Props) => {
  const session = await getAuthSession();
  if(!session?.user) {
    return redirect("/");
  }
  return (
    <main className="p-8 mx-auto max-w-7xl">
      <div className="flex items-center">
        <h2 className="mr-2 text-3xl font-bold tracking-tight">Dashboard</h2>
      </div>
      <div className="grid gap-4 mt-4 md:grid-cols-2">
        {session?.user.role === "PLAYER" && <QuizMeCard />}
        <HistoryCard />
      </div>
      <div className="grid gap-4 mt-4 md:grid-cols-2 lg:grid-cols-7">
        <HotTopicsCard />
        <RecentActivities />
      </div>
    </main>
  )
}

export default Dashboard