'use client'
import { User } from "next-auth";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { signOut } from 'next-auth/react';
import { LogOut } from "lucide-react";
import UserAvatar from "./UserAvatar";
import { useSession } from "next-auth/react";
import { useMutation } from "@tanstack/react-query";
import { useUserContext } from "@/app/context/UserContext";
import axios from 'axios';
import { usePathname } from 'next/navigation';

type Props = {
  user: Pick<User, "name" | "image" | "email">;
};

const UserAccountNav = ({user}: Props) => {
  const { data: session, update: updateSession } = useSession();
  const { userRole, setUserRole } = useUserContext();
  const pathname: string = usePathname();
  const isPlayRoute: boolean = pathname.includes('/play');
  const toggleRoleMutation = useMutation({
    mutationFn: async () => {
      const response = await axios.post('/api/user/toggle-role');
      if (response.status !== 200) throw new Error('Failed to toggle role');
      return response.data;
    },
    onSuccess: async (data) => {
      setUserRole(data.role)
      await updateSession({ ...session, user: { ...session?.user, role: data.role } });
    },
  });

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <UserAvatar user={user} />
      </DropdownMenuTrigger>

      <DropdownMenuContent className="bg-white" align="end">
        <div className="flex items-center justify-start gap-2 p-2">
          <div className="flex flex-col space-y-1 leading-none">
            {user.name && <p className="font-medium">{user.name} | {userRole}</p>}
            {
              user.email && (
                <p className="w-[200px] truncate text-sm text-zinc-700">
                  {user.email}
                </p>
              )
            }
          </div>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => toggleRoleMutation.mutate()} disabled={isPlayRoute}>
          Toggle Role (Current: {userRole})
        </DropdownMenuItem>

        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={(e) => {
          e.preventDefault();
          signOut().catch(console.error)
        }} className="text-red-600 cursor-pointer">
          Sign Out
          <LogOut className="w-4 h-4 ml-2" />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
};

export default UserAccountNav;