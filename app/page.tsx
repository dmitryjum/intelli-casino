import { getAuthSession } from '@/lib/nextauth';
import { ArrowRight, Coins, Linkedin, Play } from 'lucide-react';
import { Exo_2, Orbitron } from 'next/font/google';
import Image from 'next/image';
import Link from 'next/link';
import { redirect } from 'next/navigation';

const orbitron = Orbitron({
  subsets: ['latin'],
  variable: '--font-orbitron',
});

const exo2 = Exo_2({
  subsets: ['latin'],
  variable: '--font-exo2',
});

const featureCards = [
  {
    imageSrc: '/redesign/icon-clock.png',
    title: 'Timed Challenges',
    description:
      'Answer questions fast and pressure-test your confidence before the clock runs out.',
    glowClass: 'bg-[radial-gradient(circle,rgba(56,189,248,0.4),rgba(56,189,248,0.12)_42%,transparent_72%)]',
  },
  {
    imageSrc: '/redesign/icon-people.png',
    title: 'Player & Spectator Roles',
    description:
      'Switch between competing and spectating while the room follows every move in real time.',
    glowClass: 'bg-[radial-gradient(circle,rgba(56,189,248,0.32),rgba(168,85,247,0.16)_44%,transparent_72%)]',
  },
  {
    imageSrc: '/redesign/icon-bars.png',
    title: 'Real-Time Statistics',
    description:
      'Monitor wagers, performance, and live momentum with instant match telemetry.',
    glowClass: 'bg-[radial-gradient(circle,rgba(125,211,252,0.34),rgba(244,114,182,0.14)_44%,transparent_72%)]',
  },
];

const timelineSteps = [
  {
    title: 'Create Quiz',
    description: 'Create quiz or connect existing knowledge-based questions.',
    glowClass: 'bg-cyan-300/85 shadow-[0_0_26px_rgba(34,211,238,0.9)]',
  },
  {
    title: 'Place Bets',
    description: 'Players test knowledge. Spectators place wagers before locking.',
    glowClass: 'bg-violet-300/85 shadow-[0_0_26px_rgba(196,181,253,0.9)]',
  },
  {
    title: 'Play & Win',
    description: 'Play in real time, resolve the market, and see the payout settle.',
    glowClass: 'bg-fuchsia-300/85 shadow-[0_0_26px_rgba(244,114,182,0.9)]',
  },
];

const answerOptions = [
  { label: 'A', text: 'Bitcoin' },
  { label: 'B', text: 'Ethereum' },
  { label: 'C', text: 'Dogecoin' },
  { label: 'D', text: 'Chainlink' },
];

function neonCardClasses(extra = '') {
  return `relative isolate overflow-hidden rounded-[28px] border border-white/10 bg-[linear-gradient(135deg,rgba(103,232,249,0.16),rgba(91,33,182,0.08)_42%,rgba(244,114,182,0.16))] shadow-[0_18px_80px_rgba(15,10,40,0.52),0_0_30px_rgba(56,189,248,0.08)] before:absolute before:inset-[1px] before:rounded-[27px] before:bg-[linear-gradient(180deg,rgba(16,9,31,0.96),rgba(7,3,19,0.94))] before:content-[''] after:absolute after:left-8 after:top-0 after:h-20 after:w-28 after:bg-[radial-gradient(circle,rgba(56,189,248,0.18),transparent_72%)] after:content-[''] [&>*]:relative [&>*]:z-10 ${extra}`;
}

export default async function Home() {
  if (process.env.DATABASE_URL?.trim()) {
    const [{ getAuthSession }, { redirect }] = await Promise.all([
      import('@/lib/nextauth'),
      import('next/navigation'),
    ]);
    const session = await getAuthSession();

    if (session?.user) {
      redirect('/dashboard');
    }
  }

  return (
    <div
      className={`${orbitron.variable} ${exo2.variable} relative isolate min-h-screen overflow-hidden bg-[#05010f] text-white`}
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(63,33,147,0.55),_transparent_28%),radial-gradient(circle_at_top_right,_rgba(180,34,129,0.38),_transparent_30%),radial-gradient(circle_at_50%_38%,_rgba(43,182,255,0.12),_transparent_24%),linear-gradient(180deg,_#080314_0%,_#03010b_100%)]" />
        <div className="absolute left-[-8%] top-[16%] h-72 w-72 rounded-full bg-[#0ea5e9]/20 blur-3xl" />
        <div className="absolute right-[-5%] top-[10%] h-80 w-80 rounded-full bg-[#ec4899]/20 blur-3xl" />
        <div className="absolute bottom-[18%] left-[-4%] h-80 w-80 rounded-full bg-[#d946ef]/16 blur-3xl" />
        <div className="absolute bottom-[8%] right-[6%] h-72 w-72 rounded-full bg-[#2563eb]/18 blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-[88rem] flex-col px-4 pb-10 pt-4 sm:px-6 lg:px-8">
        <header className="z-20 py-2">
          <div className="mx-auto flex items-center justify-between gap-4 px-1 py-3">
            <Link
              href="#home"
              className="flex items-center gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/80"
            >
              <Image
                src="/redesign/brain-asset.png"
                alt="IntelliCasino logo"
                width={44}
                height={36}
                className="h-9 w-11 object-contain [filter:drop-shadow(0_0_16px_rgba(56,189,248,0.22))_drop-shadow(0_0_24px_rgba(244,114,182,0.14))]"
                priority
              />
              <span className="font-[family:var(--font-orbitron)] text-sm font-semibold tracking-wide text-white/92 sm:text-base">
                IntelliCasino
              </span>
            </Link>

            {/* <div className="flex items-center gap-2 sm:gap-3">
              <Link
                className="inline-flex min-h-11 items-center justify-center rounded-full border border-white/10 bg-white/8 px-4 text-sm font-medium text-white/92 transition hover:border-cyan-300/45 hover:bg-cyan-300/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/80"
              >
                Log In
              </Link>
              <Link
                href="#home"
                className="inline-flex min-h-11 items-center justify-center rounded-full border border-fuchsia-300/35 bg-[linear-gradient(90deg,rgba(99,102,241,0.18),rgba(236,72,153,0.18))] px-4 text-sm font-medium text-white transition hover:border-fuchsia-200/60 hover:shadow-[0_0_24px_rgba(236,72,153,0.28)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-300/80"
              >
                Sign up
              </Link>
            </div> */}
          </div>
        </header>

        <main className="flex-1">
          <section
            id="home"
            className="grid scroll-mt-24 items-center gap-10 pb-16 pt-10 md:pt-12 lg:grid-cols-[1.14fr_0.86fr] lg:gap-8 lg:pb-24"
          >
            <div className="relative mx-auto flex w-full max-w-[38rem] items-center justify-center lg:max-w-none">
              <div className="relative aspect-square w-full max-w-[36rem]">
                <div className="absolute inset-[8%] rounded-full bg-[radial-gradient(circle,_rgba(34,211,238,0.34),_transparent_58%)] blur-3xl" />
                <div className="absolute inset-[12%] rounded-full bg-[radial-gradient(circle,_rgba(217,70,239,0.28),_transparent_62%)] blur-3xl" />
                <div className="absolute inset-0">
                  <Image
                    src="/redesign/brain-asset.png"
                    alt=""
                    aria-hidden="true"
                    fill
                    className="object-contain opacity-95 [filter:drop-shadow(0_0_34px_rgba(34,211,238,0.22))_drop-shadow(0_0_56px_rgba(217,70,239,0.24))]"
                    sizes="(max-width: 768px) 90vw, 720px"
                    priority
                  />
                </div>
              </div>
            </div>

            <div className="mx-auto flex w-full max-w-xl flex-col items-center text-center lg:items-start lg:text-left">
              <h1 className="max-w-[13ch] font-[family:var(--font-orbitron)] text-4xl font-semibold leading-[1.05] tracking-tight text-white sm:text-5xl md:text-6xl">
                Welcome to{' '}
                <span className="bg-[linear-gradient(90deg,#67e8f9,#38bdf8,#f472b6)] bg-clip-text text-transparent">
                  IntelliCasino.
                </span>{' '}
                The Future of Trivia Betting is Here.
              </h1>
              <p className="mt-5 max-w-xl text-base leading-7 text-white/70 sm:text-lg">
                Where knowledge meets excitement. Create quizzes, play games, and bet on intellectual challenges.
              </p>

              <div id="waitlist" className={`${neonCardClasses('mt-8 w-full max-w-md p-5 sm:p-6')}`}>
                <div className="rounded-2xl bg-transparent p-2">
                  <p className="font-[family:var(--font-orbitron)] text-center text-2xl font-medium tracking-wide text-white">
                    Coming Soon
                  </p>
                  <button
                    type="button"
                    className="mt-4 inline-flex h-12 w-full items-center justify-center rounded-xl bg-[linear-gradient(90deg,#d946ef_0%,#38bdf8_100%)] px-4 text-sm font-semibold text-slate-950 transition hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/80"
                  >
                    Beta version is coming soon
                  </button>
                </div>
              </div>
            </div>
          </section>

          <section id="features" className="scroll-mt-24 py-12 sm:py-14">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="font-[family:var(--font-orbitron)] text-3xl font-semibold text-white sm:text-4xl">
                Game Features
              </h2>
            </div>
            <div className="mt-8 grid gap-4 md:grid-cols-3">
              {featureCards.map(({ imageSrc, title, description, glowClass }) => (
                <article
                  key={title}
                  className={neonCardClasses(
                    'p-5 transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_80px_rgba(15,10,40,0.6),0_0_36px_rgba(56,189,248,0.14)]'
                  )}
                >
                  <div className="relative mb-5 flex h-20 w-20 items-start justify-start">
                    <div
                      aria-hidden="true"
                      className={`absolute left-[-1.4rem] top-[-1rem] h-24 w-28 ${glowClass} opacity-95 blur-xl`}
                    />
                    <Image
                      src={imageSrc}
                      alt=""
                      aria-hidden="true"
                      width={72}
                      height={72}
                      className="relative z-10 h-[4.5rem] w-[4.5rem] object-contain"
                    />
                  </div>
                  <h3 className="font-[family:var(--font-orbitron)] text-lg font-medium text-white">
                    {title}
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-white/62">{description}</p>
                </article>
              ))}
            </div>
          </section>

          <section id="how-it-works" className="scroll-mt-24 py-14 sm:py-16">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="font-[family:var(--font-orbitron)] text-3xl font-semibold text-white sm:text-4xl">
                How It Works
              </h2>
              <p className="mt-3 text-sm text-white/55 sm:text-base">
                Stylish, continuous interaction from quiz creation to payout.
              </p>
            </div>

            <div className="relative mt-12">
              <div
                aria-hidden="true"
                className="absolute left-0 right-0 top-7 hidden h-px bg-[linear-gradient(90deg,rgba(34,211,238,0.7),rgba(167,139,250,0.7),rgba(236,72,153,0.7))] md:block"
              />
              <div className="grid gap-6 md:grid-cols-3 md:gap-8">
                {timelineSteps.map((step) => (
                  <div key={step.title} className="relative text-center">
                    <div className="relative mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-white/10 bg-[#130825] shadow-[0_0_26px_rgba(34,211,238,0.22)]">
                      <div aria-hidden="true" className="absolute inset-2 rounded-full bg-white/[0.03]" />
                      <div aria-hidden="true" className={`relative h-3.5 w-3.5 rounded-full ${step.glowClass}`} />
                    </div>
                    <h3 className="mt-5 font-[family:var(--font-orbitron)] text-lg font-medium text-white">
                      {step.title}
                    </h3>
                    <p className="mx-auto mt-2 max-w-xs text-sm leading-6 text-white/55">
                      {step.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="py-14 sm:py-16">
            <div className={`${neonCardClasses('grid items-center gap-8 overflow-hidden p-5 sm:p-6 lg:grid-cols-[1.05fr_0.95fr] lg:p-8')}`}>
              <div className="relative min-h-[23rem] overflow-hidden lg:min-h-[23rem]">
                <Image
                  src="/redesign/eth-chip-new.png"
                  alt=""
                  aria-hidden="true"
                  fill
                  className="object-cover opacity-95"
                  sizes="(max-width: 1024px) 100vw, 520px"
                />
              </div>

              <div className="max-w-md">
                <h2 className="font-[family:var(--font-orbitron)] text-3xl font-semibold text-white sm:text-4xl">
                  ETH Betting System
                </h2>
                <p className="mt-4 text-base leading-7 text-white/68">
                  Our ETH smart contract ensures secure and transparent betting. The contract manages game creation, bet placement, and winnings distribution.
                </p>
                <div className="mt-5 flex flex-wrap gap-3 text-sm text-white/74">
                  <span className="rounded-full border border-white/10 bg-white/5 px-3 py-2">
                    Smart-contract payouts
                  </span>
                  <span className="rounded-full border border-white/10 bg-white/5 px-3 py-2">
                    Spectator wagering
                  </span>
                  <span className="rounded-full border border-white/10 bg-white/5 px-3 py-2">
                    Real-time odds
                  </span>
                </div>
              </div>
            </div>
          </section>

          <section
            id="preview"
            className="grid scroll-mt-24 items-center gap-8 py-14 sm:py-16 lg:grid-cols-[0.8fr_1.2fr]"
          >
            <div className="max-w-sm">
              <h2 className="font-[family:var(--font-orbitron)] text-3xl font-semibold text-white sm:text-4xl">
                Live Preview
              </h2>
              <p className="mt-4 text-base leading-7 text-white/66">
                Sample interface preview with interactive-style states, wagering context, and a
                tight game loop that mirrors the mockup.
              </p>
            </div>

            <div className={`${neonCardClasses('mx-auto w-full max-w-[34rem] p-4 sm:p-5')}`}>
              <div className="rounded-[24px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.03))] p-4 sm:p-5">
                <div className="flex items-center justify-between gap-4 text-[11px] uppercase tracking-[0.22em] text-white/40">
                  <span className="inline-flex items-center gap-2">
                    <Coins className="h-3.5 w-3.5 text-cyan-200" />
                    Wager flow
                  </span>
                  <span>Live 02</span>
                </div>
                <div className="mt-4">
                  <h3 className="max-w-[24ch] text-lg font-medium leading-7 text-white sm:text-xl">
                    What is the latest sustaining innovation inside Intelli Casino?
                  </h3>
                </div>
                <div className="mt-5 h-2 rounded-full bg-white/8">
                  <div className="h-2 w-[62%] rounded-full bg-[linear-gradient(90deg,#67e8f9,#d946ef)] shadow-[0_0_16px_rgba(217,70,239,0.4)]" />
                </div>
                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  {answerOptions.map((option, index) => (
                    <button
                      key={option.label}
                      type="button"
                      className={`flex min-h-[3.25rem] items-center gap-3 rounded-2xl border px-4 text-left text-sm text-white/74 transition ${
                        index === 3
                          ? 'border-fuchsia-300/40 bg-[linear-gradient(90deg,rgba(34,211,238,0.14),rgba(217,70,239,0.18))] text-white shadow-[0_0_24px_rgba(217,70,239,0.18)]'
                          : 'border-white/10 bg-white/[0.04] hover:border-cyan-300/24 hover:bg-white/[0.07]'
                      }`}
                    >
                      <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-white/10 bg-black/20 font-[family:var(--font-orbitron)] text-[11px] text-white/76">
                        {option.label}
                      </span>
                      <span>{option.text}</span>
                    </button>
                  ))}
                </div>
                <div className="mt-5 flex items-center justify-between">
                  <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-2 text-xs text-white/56">
                    <Play className="h-3.5 w-3.5 text-cyan-200" />
                    Next round primed
                  </div>
                  <div className="inline-flex items-center gap-1 rounded-full bg-[linear-gradient(90deg,#67e8f9,#d946ef)] px-4 py-2 text-xs font-semibold text-slate-950">
                    Next
                    <ArrowRight className="h-3.5 w-3.5" />
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>

        <footer
          id="contact"
          className="mt-auto flex flex-col gap-4 border-t border-white/10 pb-4 pt-8 sm:flex-row sm:items-center sm:justify-between"
        >
          <div>
            <p className="font-[family:var(--font-orbitron)] text-sm text-white/85">IntelliCasino</p>
            <p className="mt-2 text-xs text-white/42">
              © {new Date().getFullYear()} IntelliCasino. Built for public discovery while access
              remains curated.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="inline-flex h-8 items-center rounded-full border border-cyan-300/20 bg-white/[0.04] px-3 text-[11px] uppercase tracking-[0.18em] text-white/52">
              Beta closed
            </div>
            <Link
              href="https://linkedin.com/in/dmitryjum"
              target="_blank"
              rel="noreferrer"
              aria-label="LinkedIn"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-white/58 transition hover:border-cyan-300/35 hover:text-cyan-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/80"
            >
              <Linkedin className="h-4 w-4" />
            </Link>
          </div>
        </footer>
      </div>
    </div>
  );
}
