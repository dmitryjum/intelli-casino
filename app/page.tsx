import { getAuthSession } from "@/lib/nextauth"
import { redirect } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Brain, Clock, Users, TrendingUp, Coins, Eye, Wallet, Sparkles, Zap, Shield, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export default async function Home() {
  const session = await getAuthSession()
  if (session?.user) {
    redirect("/dashboard")
  }

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 px-6 lg:px-12 h-16 flex items-center justify-between backdrop-blur-md bg-background/80 border-b border-border">
        <Link className="flex items-center gap-2" href="#">
          <div className="relative w-10 h-10">
            <Image
              src="/Intelli-Casino-logo-white.png"
              alt="Intelli Casino Logo"
              fill
              className="object-contain"
            />
          </div>
          <span className="font-bold text-lg">Intelli Casino</span>
        </Link>
        <nav className="hidden md:flex items-center gap-8">
          <Link className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors" href="#features">
            Features
          </Link>
          <Link className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors" href="#how-it-works">
            How It Works
          </Link>
          <Link className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors" href="#betting">
            ETH Betting
          </Link>
        </nav>
        <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground">
          Coming Soon
        </Button>
      </header>

      <main className="flex-1 pt-16">
        {/* Hero Section */}
        <section className="relative min-h-[90vh] flex items-center overflow-hidden">
          {/* Background Effects */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,hsl(var(--secondary)/0.15),transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,hsl(var(--primary)/0.1),transparent_50%)]" />
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-[100px]" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/20 rounded-full blur-[120px]" />
          
          <div className="container mx-auto px-6 lg:px-12 relative z-10">
            <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
              <div className="flex-1 space-y-8 text-center lg:text-left">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-muted border border-border">
                  <Sparkles className="w-4 h-4 text-accent" />
                  <span className="text-sm text-muted-foreground">Beta Release Coming Soon</span>
                </div>
                
                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-balance">
                  Where <span className="text-primary">Knowledge</span> Meets <span className="text-secondary">Fortune</span>
                </h1>
                
                <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                  Create AI-powered quizzes, compete in intellectual challenges, and bet on outcomes with ETH. The future of gaming is here.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                  <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 text-lg px-8 py-6">
                    Join Waitlist
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                  <Button size="lg" variant="outline" className="border-border hover:bg-muted text-lg px-8 py-6">
                    Learn More
                  </Button>
                </div>

                {/* Stats */}
                <div className="flex flex-wrap gap-8 justify-center lg:justify-start pt-8">
                  <div className="text-center lg:text-left">
                    <p className="text-3xl font-bold text-primary">AI</p>
                    <p className="text-sm text-muted-foreground">Generated Quizzes</p>
                  </div>
                  <div className="w-px bg-border hidden sm:block" />
                  <div className="text-center lg:text-left">
                    <p className="text-3xl font-bold text-secondary">ETH</p>
                    <p className="text-sm text-muted-foreground">Smart Contracts</p>
                  </div>
                  <div className="w-px bg-border hidden sm:block" />
                  <div className="text-center lg:text-left">
                    <p className="text-3xl font-bold text-accent">Live</p>
                    <p className="text-sm text-muted-foreground">Spectator Betting</p>
                  </div>
                </div>
              </div>
              
              <div className="flex-1 relative">
                <div className="relative w-full max-w-lg mx-auto">
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/30 to-secondary/30 rounded-3xl blur-3xl" />
                  <div className="relative bg-card border border-border rounded-3xl p-8 backdrop-blur-sm">
                    <div className="relative w-full aspect-square">
                      <Image
                        src="/Intelli-Casino-logo.png"
                        alt="Intelli Casino Logo"
                        fill
                        className="object-contain"
                        priority
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-24 lg:py-32 relative">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,hsl(var(--primary)/0.05),transparent_70%)]" />
          <div className="container mx-auto px-6 lg:px-12 relative z-10">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-balance">
                Game-Changing Features
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Experience the thrill of intellectual competition with cutting-edge features
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <FeatureCard
                icon={<Clock className="h-8 w-8" />}
                title="Timed Challenges"
                description="Race against the clock to maximize your score. Every second counts in our high-stakes trivia battles."
                color="primary"
              />
              <FeatureCard
                icon={<Users className="h-8 w-8" />}
                title="Player & Spectator Roles"
                description="Choose your path. Compete for glory or watch and bet on the action from the sidelines."
                color="secondary"
              />
              <FeatureCard
                icon={<TrendingUp className="h-8 w-8" />}
                title="Real-time Statistics"
                description="Track performance with live analytics. Compare stats, view leaderboards, and improve your game."
                color="accent"
              />
              <FeatureCard
                icon={<Brain className="h-8 w-8" />}
                title="AI-Powered Quizzes"
                description="Our AI generates unique, challenging questions across any topic you can imagine."
                color="primary"
              />
              <FeatureCard
                icon={<Shield className="h-8 w-8" />}
                title="Secure Betting"
                description="Smart contracts ensure transparent, tamper-proof betting with automatic payouts."
                color="secondary"
              />
              <FeatureCard
                icon={<Zap className="h-8 w-8" />}
                title="Instant Payouts"
                description="Winners receive their ETH immediately after games conclude. No waiting, no hassle."
                color="accent"
              />
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="py-24 lg:py-32 bg-muted/30">
          <div className="container mx-auto px-6 lg:px-12">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-balance">
                How It Works
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                From quiz creation to winning big - here&apos;s your journey
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
              <StepCard
                number="01"
                icon={<Brain className="h-6 w-6" />}
                title="Create a Quiz"
                description="Design your own quiz with AI-generated open-ended or multiple-choice questions on any topic."
              />
              <StepCard
                number="02"
                icon={<Coins className="h-6 w-6" />}
                title="Place Your Bets"
                description="Spectators can bet on players using our secure ETH smart contracts during the betting window."
              />
              <StepCard
                number="03"
                icon={<Eye className="h-6 w-6" />}
                title="Play or Watch"
                description="Compete as a player to prove your knowledge, or spectate and earn from your predictions."
              />
            </div>
          </div>
        </section>

        {/* ETH Betting Section */}
        <section id="betting" className="py-24 lg:py-32 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,hsl(var(--accent)/0.1),transparent_50%)]" />
          <div className="container mx-auto px-6 lg:px-12 relative z-10">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-balance">
                <span className="text-accent">ETH</span> Betting System
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Transparent, secure, and automated betting powered by Ethereum blockchain
              </p>
            </div>
            
            <div className="grid lg:grid-cols-2 gap-8">
              <div className="bg-card border border-border rounded-2xl p-8 space-y-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-accent/10">
                    <Wallet className="h-8 w-8 text-accent" />
                  </div>
                  <h3 className="text-2xl font-bold">Smart Contract Betting</h3>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  Our ETH smart contract ensures secure and transparent betting. The contract manages game creation, bet placement, and winnings distribution automatically.
                </p>
                <ul className="space-y-3">
                  <BenefitItem text="Secure transactions using Ethereum blockchain" />
                  <BenefitItem text="Automated winnings distribution" />
                  <BenefitItem text="Fair and transparent betting system" />
                  <BenefitItem text="No intermediaries or hidden fees" />
                </ul>
              </div>
              
              <div className="bg-card border border-border rounded-2xl p-8 space-y-6">
                <h3 className="text-2xl font-bold">How Betting Works</h3>
                <ol className="space-y-4">
                  <BettingStep number={1} text="Connect your Ethereum wallet" />
                  <BettingStep number={2} text="Choose to bet on the player or the house" />
                  <BettingStep number={3} text="Place your bet during the open betting period" />
                  <BettingStep number={4} text="Watch the game unfold in real-time" />
                  <BettingStep number={5} text="Winnings are automatically distributed after the game" />
                  <BettingStep number={6} text="Option to withdraw your bet before the game closes" />
                </ol>
              </div>
            </div>
          </div>
        </section>

        {/* Sample Quiz Section */}
        <section className="py-24 lg:py-32 bg-muted/30">
          <div className="container mx-auto px-6 lg:px-12">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-balance">
                Experience the Challenge
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                See what a live quiz looks like in action
              </p>
            </div>
            
            <div className="max-w-2xl mx-auto">
              <div className="bg-card border border-border rounded-2xl overflow-hidden">
                <div className="p-6 border-b border-border flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
                      cosmos
                    </span>
                    <div className="flex items-center text-muted-foreground">
                      <Clock className="mr-2 h-4 w-4" />
                      <span className="font-mono">00:38</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-4xl font-bold text-primary">1</span>
                    <span className="text-2xl text-muted-foreground">/</span>
                    <span className="text-2xl text-muted-foreground">3</span>
                  </div>
                </div>
                <div className="p-8">
                  <p className="text-xl md:text-2xl font-medium leading-relaxed">
                    What mysteries of the cosmos have yet to be unraveled by humanity?
                  </p>
                </div>
                <div className="px-8 pb-8">
                  <div className="flex items-center gap-4">
                    <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                      <div className="w-1/3 h-full bg-gradient-to-r from-primary to-secondary rounded-full" />
                    </div>
                    <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                      Next
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 lg:py-32 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-secondary/5 to-transparent" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[150px]" />
          
          <div className="container mx-auto px-6 lg:px-12 relative z-10">
            <div className="max-w-3xl mx-auto text-center space-y-8">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-balance">
                Ready to Test Your <span className="text-primary">Intelligence</span>?
              </h2>
              <p className="text-lg text-muted-foreground">
                Join thousands of players competing for glory and ETH. Create quizzes, challenge others, and win big in the ultimate intellectual arena.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 text-lg px-8 py-6">
                  Join the Waitlist
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">
                By signing up, you agree to our{" "}
                <Link className="text-primary hover:underline underline-offset-2" href="/terms">
                  Terms & Conditions
                </Link>
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-muted/20">
        <div className="container mx-auto px-6 lg:px-12 py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <div className="relative w-8 h-8">
                <Image
                  src="/Intelli-Casino-logo-white.png"
                  alt="Intelli Casino Logo"
                  fill
                  className="object-contain"
                />
              </div>
              <span className="font-bold">Intelli Casino</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2026 Intelli Casino. All rights reserved.
            </p>
            <nav className="flex gap-6">
              <Link className="text-sm text-muted-foreground hover:text-foreground transition-colors" href="#">
                Terms of Service
              </Link>
              <Link className="text-sm text-muted-foreground hover:text-foreground transition-colors" href="#">
                Privacy
              </Link>
            </nav>
          </div>
        </div>
      </footer>
    </div>
  )
}

// Feature Card Component
function FeatureCard({
  icon,
  title,
  description,
  color,
}: {
  icon: React.ReactNode
  title: string
  description: string
  color: "primary" | "secondary" | "accent"
}) {
  const colorClasses = {
    primary: "bg-primary/10 text-primary",
    secondary: "bg-secondary/10 text-secondary",
    accent: "bg-accent/10 text-accent",
  }

  return (
    <div className="group bg-card border border-border rounded-2xl p-6 hover:border-primary/50 transition-all duration-300">
      <div className={`inline-flex p-3 rounded-xl ${colorClasses[color]} mb-4`}>
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-muted-foreground leading-relaxed">{description}</p>
    </div>
  )
}

// Step Card Component
function StepCard({
  number,
  icon,
  title,
  description,
}: {
  number: string
  icon: React.ReactNode
  title: string
  description: string
}) {
  return (
    <div className="text-center space-y-4">
      <div className="relative inline-block">
        <span className="absolute -top-2 -right-2 text-6xl font-bold text-primary/10">{number}</span>
        <div className="relative p-4 rounded-full bg-primary text-primary-foreground">
          {icon}
        </div>
      </div>
      <h3 className="text-xl font-bold">{title}</h3>
      <p className="text-muted-foreground leading-relaxed">{description}</p>
    </div>
  )
}

// Benefit Item Component
function BenefitItem({ text }: { text: string }) {
  return (
    <li className="flex items-center gap-3">
      <div className="w-1.5 h-1.5 rounded-full bg-accent" />
      <span className="text-muted-foreground">{text}</span>
    </li>
  )
}

// Betting Step Component
function BettingStep({ number, text }: { number: number; text: string }) {
  return (
    <li className="flex items-start gap-4">
      <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-bold">
        {number}
      </span>
      <span className="text-muted-foreground pt-1">{text}</span>
    </li>
  )
}
