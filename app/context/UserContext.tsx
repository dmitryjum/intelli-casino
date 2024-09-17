'use client'
import React, { createContext, useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'

export const UserContext = createContext({
  userRole: 'PLAYER',
  setUserRole: (role: string) => { },
})

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const { data: session } = useSession()
  const [userRole, setUserRole] = useState(session?.user?.role || 'PLAYER')

  useEffect(() => {
    if (session?.user?.role) {
      setUserRole(session.user.role)
    }
  }, [session])

  return (
    <UserContext.Provider value={{ userRole, setUserRole }}>
      {children}
    </UserContext.Provider>
  )
}

export const useUserContext = () => React.useContext(UserContext)