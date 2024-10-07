'use client'
import React from 'react'
import QuizMeCard from './QuizMeCard';
import HistoryCard from './HistoryCard';
// import HotTopicsCard from './HotTopicsCard';
// import RecentActivities from './RecentActivities';
import ActiveGames from './ActiveGames';
import { useUserContext } from '@/app/context/UserContext'
import { useEffect } from 'react'
import { Role } from '@prisma/client';

type Props = {
  initialRole: Role
}

const Dashboard = (props: Props) => {
  const { userRole, setUserRole } = useUserContext();

  useEffect(() => {
    setUserRole(props.initialRole)
  }, [props.initialRole, setUserRole])

  return (
    <main className="p-8 mx-auto max-w-7xl">
      <div className="flex items-center">
        <h2 className="mr-2 text-3xl font-bold tracking-tight">Dashboard</h2>
      </div>
      <div className="grid gap-4 mt-4 md:grid-cols-2">
        {userRole === Role.PLAYER && <QuizMeCard />}
        <HistoryCard />
      </div>
      <div className="grid gap-4 mt-4 md:grid-cols-2 lg:grid-cols-7">
        {/* <HotTopicsCard /> */}
        {/* <RecentActivities /> */}
        <ActiveGames />
      </div>
    </main>
  )
}

export default Dashboard