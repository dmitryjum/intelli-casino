import { getAuthSession } from "@/lib/nextauth"
import { redirect } from 'next/navigation';
import DashboardClient from './DashboardClient';
import { Role } from '@prisma/client';

export const metadata = {
  title: "Dashboard | Intelli Casino",
}

export default async function Dashboard() {
  const session = await getAuthSession()
  
  if (!session?.user) {
    return redirect("/");
  }

  return <DashboardClient initialRole={session?.user?.role || Role.PLAYER} />
}