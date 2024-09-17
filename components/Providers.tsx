"use client";

import { SessionProvider } from "next-auth/react";
import React from 'react'
import { ThemeProvider as NextThemesProvider, ThemeProvider } from "next-themes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { type ThemeProviderProps } from "next-themes/dist/types"
import { UserProvider } from "@/app/context/UserContext"

const queryClient = new QueryClient();

const Providers = ({ children, ...props }: ThemeProviderProps) => {
  return (
    <QueryClientProvider client={queryClient}>
      {/* we need query provider to cache and reuse data */}
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem {...props}>
        <SessionProvider>
          <UserProvider>
            {children}
          </UserProvider>
        </SessionProvider>
      </ThemeProvider>
    </QueryClientProvider>
  )
}

export default Providers