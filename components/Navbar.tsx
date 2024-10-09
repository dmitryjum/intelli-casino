import Link from "next/link";
import React from "react";
import SignInButton from "./SignInButton";
import UserAccountNav from "./UserAccountNav";
import { ThemeToggle } from "./ThemeToggle";
import { Brain } from "lucide-react";
import { User } from "@prisma/client";
import Image from "next/image";

type Props = {
  user: User;
}

const Navbar = ({ user }: Props) => {
  
  return (
    <div className="fixed inset-x-0 top-0 h-16 bg-white dark:bg-gray-950 z-[10] h-fit border-b border-zinc-300 py-2">
      <div className="flex items-center justify-between h-full gap-2 px-8 max-auto">
        {/* Logo */}
        <Link href='/' className="flex items-center rounded-lg border-2 border-b-4 border-r-4 border-black pr-3 text-xl font-bold transition-all hover:translate-y-0.5 sm:inline-flex dark:border-white">
            <div className="relative w-14 h-14 -mb-3">
              <Image
                src="/Intelli-Casino-logo-white.png"
                alt="Intelli Casino Logo"
                layout="fill"
                objectFit="contain"
                objectPosition="center"
              />
            </div>
            <span>Intelli Casino</span>
        </Link>
        <div className="flex itmes-center">
          <ThemeToggle className="mr-3"/>
          <div className="flex items-center">
            { user ? <UserAccountNav user={user}/> : <SignInButton text="Sign In" /> }
          </div>
        </div>
      </div>
    </div>
  )
};

export default Navbar;