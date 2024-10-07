import SignInButton from '@/components/SignInButton';
import { getAuthSession } from '@/lib/nextauth';
import { redirect } from 'next/navigation';
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Brain, Clock, Users, TrendingUp, Coins, Eye } from "lucide-react"

export default async function Home() {
  const session = await getAuthSession()
  if (session?.user) {
    redirect('/dashboard')
  }

  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-4 lg:px-6 h-14 flex items-center">
        <Link className="flex items-center justify-center" href="#">
          <Brain className="h-6 w-6 mr-2" />
          <span className="font-bold">Intelli Casino</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="#features">
            Features
          </Link>
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="#how-it-works">
            How It Works
          </Link>
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="#join">
            Join Now
          </Link>
        </nav>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-black text-white">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                  Welcome to Intelli Casino
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-400 md:text-xl">
                  Where knowledge meets excitement. Create quizzes, play games, and bet on intellectual challenges.
                </p>
              </div>
              <div className="space-x-4">
                <SignInButton text={"Sign In"} variant={"secondary"} />
                <Button asChild>
                  Sign UP
                </Button>
              </div>
            </div>
          </div>
        </section>
        <section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-gray-100">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12">Game Features</h2>
            <div className="grid gap-6 lg:grid-cols-3 lg:gap-12">
              <Card>
                <CardHeader>
                  <Clock className="h-8 w-8 mb-2" />
                  <CardTitle>Timed Challenges</CardTitle>
                </CardHeader>
                <CardContent>
                  Answer questions quickly to maximize your score and keep the excitement high.
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <Users className="h-8 w-8 mb-2" />
                  <CardTitle>Player & Spectator Roles</CardTitle>
                </CardHeader>
                <CardContent>
                  Choose to play or watch. Spectators can bet on outcomes for added thrill.
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <TrendingUp className="h-8 w-8 mb-2" />
                  <CardTitle>Real-time Statistics</CardTitle>
                </CardHeader>
                <CardContent>
                  Track your performance and compare with others through detailed game statistics.
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
        <section id="how-it-works" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12">How It Works</h2>
            <div className="grid gap-6 lg:grid-cols-3 lg:gap-12">
              <div className="flex flex-col items-center text-center">
                <div className="mb-4 rounded-full bg-primary p-2 text-white">
                  <Brain className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold">1. Create a Quiz</h3>
                <p className="text-gray-500">Design your own quiz with open-ended or multiple-choice questions.</p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="mb-4 rounded-full bg-primary p-2 text-white">
                  <Coins className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold">2. Place Your Bets</h3>
                <p className="text-gray-500">Spectators can bet on players using our ETH smart contract.</p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="mb-4 rounded-full bg-primary p-2 text-white">
                  <Eye className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold">3. Play or Watch</h3>
                <p className="text-gray-500">Participate as a player or enjoy the game as a spectator.</p>
              </div>
            </div>
          </div>
        </section>
        <section id="join" className="w-full py-12 md:py-24 lg:py-32 bg-gray-100">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Ready to Join?</h2>
                <p className="mx-auto max-w-[600px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Start your intellectual journey now. Create quizzes, challenge others, and win big!
                </p>
              </div>
              <div className="w-full max-w-sm space-y-2">
                <Button className="w-full" asChild>
                  <Link href="/signup">Sign Up Now</Link>
                </Button>
                <p className="text-xs text-gray-500">
                  By signing up, you agree to our{" "}
                  <Link className="underline underline-offset-2" href="/terms">
                    Terms & Conditions
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-gray-500">© 2024 Intelli Casino. All rights reserved.</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Terms of Service
          </Link>
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Privacy
          </Link>
        </nav>
      </footer>
    </div>
  )
}
