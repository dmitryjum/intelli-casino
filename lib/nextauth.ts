import { DefaultSession, NextAuthOptions, getServerSession } from 'next-auth';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { prisma } from './db';
import GoogleProvider from 'next-auth/providers/google'
import { Role } from '@prisma/client'

declare module 'next-auth' {
  interface Session extends DefaultSession {
    user: {
      id: string;
      role?: Role;
    } & DefaultSession['user']
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    role?: Role;
  }
}

const nextAuthUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';

export const authOptions: NextAuthOptions = {
  session: {
    strategy: 'jwt'
  },
  callbacks: {
    jwt: async({token}) => {
      const db_user = await prisma.user.findFirst({
        where: {
          email: token?.email
        }
      });
      if(db_user) {
        token.id = db_user.id
        token.role = db_user.role as Role
      }
      return token
    },
    session: ({session, token}) => {
      if (token) {
        session.user.id = token.id
        session.user.name = token.name
        session.user.email = token.email
        session.user.image = token.picture
        session.user.role = token.role
      }
      return session
    }
  },
  cookies: {
    sessionToken: {
      name: `${nextAuthUrl.startsWith('https://') ? '__Secure-' : ''}next-auth.session-token`,
      options: {
        domain: nextAuthUrl.includes('localhost') ? 'localhost' : '.' + new URL(nextAuthUrl).hostname,
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: nextAuthUrl.startsWith('https://'),
      },
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name || '',
          email: profile.email || '',
          image: profile.picture || '',
          role: Role.PLAYER,
        };
      },
    })
  ]
}

export const getAuthSession = () => {
  return  getServerSession(authOptions);
}