// import SignInButton from '@/components/SignInButton';
import { getAuthSession } from '@/lib/nextauth';
import { redirect } from 'next/navigation';
import Link from "next/link"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Brain, Clock, Users, TrendingUp, Coins, Eye, Wallet } from "lucide-react"
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';

export default async function Home() {
  const session = await getAuthSession()
  if (session?.user) {
    redirect('/dashboard')
  }

  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-4 lg:px-6 h-14 flex items-center">
        <Link className="flex items-center justify-center" href="#">
          <div className="relative w-14 h-14 mt-3">
            <Image
              src="/Intelli-Casino-logo-white.png"
              alt="Intelli Casino Logo"
              layout="fill"
              objectFit="contain"
              objectPosition="center"
            />
          </div>
          <span className="font-bold">Intelli Casino</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          {/* <Link className="text-sm font-medium hover:underline underline-offset-4" href="#features">
            Features
          </Link>
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="#how-it-works">
            How It Works
          </Link> */}
          {/* <SignInButton text={"Sign In"}  variant="ghost"/> */}
        </nav>
      </header>
      <main className="flex-1">
        <section className="sm:pt-14 md:pt-0 bg-black text-white">
          <div className="container pt-4 md:pt-0 px-4 md:pr-2 md:pl-9">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="space-y-4 text-center md:text-left md:w-1/2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                  Welcome to Intelli Casino
                </h1>
                <p className="mx-auto md:mx-0 max-w-[700px] text-gray-400 md:text-xl">
                  Where knowledge meets excitement. Create quizzes, play games, and bet on intellectual challenges.
                </p>
                <Button className="w-full md:w-auto" variant="secondary">Beta release is expected soon</Button>
              </div>
              <div className="-mb-28 md:w-1/2 flex justify-center items-center">
                <div className="relative w-[600px] h-[600px] md:w-[600px] md:h-[600px]">
                  <Image
                    src="/Intelli-Casino-logo.png"
                    alt="Intelli Casino Logo"
                    layout="fill"
                    objectFit="contain"
                    objectPosition="center"
                  />
                </div>
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
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-100">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12">ETH Betting System</h2>
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12">
              <Card>
                <CardHeader>
                  <Wallet className="h-8 w-8 mb-2" />
                  <CardTitle>Smart Contract Betting</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Our ETH smart contract ensures secure and transparent betting. The contract manages game creation, bet placement, and winnings distribution.</p>
                  <ul className="list-disc list-inside mt-4">
                    <li>Secure transactions using Ethereum blockchain</li>
                    <li>Automated winnings distribution</li>
                    <li>Fair and transparent betting system</li>
                  </ul>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>How Betting Works</CardTitle>
                </CardHeader>
                <CardContent>
                  <ol className="list-decimal list-inside space-y-2">
                    <li>Connect your Ethereum wallet</li>
                    <li>Choose to bet on the player or the house</li>
                    <li>Place your bet during the open betting period</li>
                    <li>Watch the game unfold</li>
                    <li>Winnings are automatically distributed after the game</li>
                    <li>Option to withdraw your bet before the game closes</li>
                  </ol>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12">Sample Quizzes</h2>
            <Card className="w-full max-w-3xl mx-auto">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="flex items-center space-x-2">
                  <Badge variant="secondary" className="bg-gray-900 text-white hover:bg-gray-900">
                    cosmos
                  </Badge>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Clock className="mr-1 h-4 w-4" />
                    <span>38s</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-4xl font-bold">1</span>
                    <span className="text-2xl text-muted-foreground">/</span>
                    <span className="text-2xl text-muted-foreground">3</span>
                  </div>
                  <p className="text-xl">
                    What mysteries of the cosmos have yet to be unraveled by humanity?
                  </p>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between items-center">
                <div className="w-full h-1 bg-gray-200 rounded-full">
                  <div className="w-1/3 h-full bg-primary rounded-full" />
                </div>
                <Button className="ml-4">Next</Button>
              </CardFooter>
            </Card>
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
                {/* <SignInButton text={"Sign Up with Google now"} className="w-full" /> */}
                <Button className="w-full">You will be able to join soon!</Button>
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
