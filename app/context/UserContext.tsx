'use client'
import React, { createContext, useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import Navbar from '@/components/Navbar'
import { Role } from '@prisma/client';
import { UserContextType } from './UserContext.d'

export const UserContext = createContext<UserContextType>({
  userRole: Role.SPECTATOR,
  setUserRole: () => { },
  userId: '',
})

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const { data: session } = useSession()
  const [userRole, setUserRole] = useState(session?.user?.role || Role.SPECTATOR)
  const userId = session?.user?.id || ''

  useEffect(() => {
    if (session?.user?.role) {
      setUserRole(session.user.role)
    }
  }, [session])
  return (
    <UserContext.Provider value={{ userRole, setUserRole, userId }}>
      {session?.user && <Navbar user={session?.user} /> }
      <main className={session?.user && "mt-16"}>{children}</main>
    </UserContext.Provider>
  )
}

export const useUserContext = () => React.useContext(UserContext)