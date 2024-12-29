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
      playedGames: {
        id: string
      }[];
    } & DefaultSession['user']
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    role?: Role;
  }
}

export const authOptions: NextAuthOptions = {
  session: {
    strategy: 'jwt'
  },
  callbacks: {
    jwt: async({token}) => {
      const db_user = await prisma.user.findFirst({
        where: {
          email: token?.email
        },
        include: {
          playedGames: {
            select: {
              id: true
            }
          }
        }
      });
      if(db_user) {
        token.id = db_user.id
        token.role = db_user.role as Role
        token.playedGames = db_user.playedGames
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
        session.user.playedGames = token.playedGames as []
      }
      return session
    }
  },
  secret: process.env.NEXTAUTH_SECRET,
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      profile(profile) {
        console.log(profile)
        return {
          id: profile.sub,
          name: profile.name || '',
          email: profile.email || '',
          image: profile.picture || '',
          playedGames: profile.playedGames || [],
          role: Role.PLAYER,
        };
      },
    })
  ]
}

export const getAuthSession = () => {
  return  getServerSession(authOptions);
}