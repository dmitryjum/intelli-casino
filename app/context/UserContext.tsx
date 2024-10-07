'use client'
import React, { createContext, useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import Navbar from '@/components/Navbar'
import { Role } from '@prisma/client';
import { UserContextType } from './UserContext.d'

export const UserContext = createContext<UserContextType>({
  userRole: Role.PLAYER,
  setUserRole: () => { },
})

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const { data: session } = useSession()
  const [userRole, setUserRole] = useState(session?.user?.role || Role.PLAYER)

  useEffect(() => {
    if (session?.user?.role) {
      setUserRole(session.user.role)
    }
  }, [session])
  return (
    <UserContext.Provider value={{ userRole, setUserRole }}>
      {session?.user && <Navbar user={session?.user} /> }
      {children}
    </UserContext.Provider>
  )
}

export const useUserContext = () => React.useContext(UserContext)