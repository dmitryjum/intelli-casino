import SignInButton from '@/components/SignInButton';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getAuthSession } from '@/lib/nextauth';
import { redirect } from 'next/navigation';

export default async function Home() {
  const session = await getAuthSession()
  if (session?.user) {
    redirect('/dashboard')
  }
  return (
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
      <Card className='2-[300px]'>
        <CardHeader>
          <CardTitle>Welcome to Intelli Casino</CardTitle>
          <CardDescription>
            Intelli Casino is a quiz app that allows you to place bets on the quiz app as a dealer of the quiz or on the player who's taking it or be the one to play it.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SignInButton text="Sign in with Google!" />
        </CardContent>
      </Card>
    </div>
  )
}
