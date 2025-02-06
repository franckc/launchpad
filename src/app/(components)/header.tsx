'use client';

import React from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from 'next/navigation'
import { useSession, signOut } from "next-auth/react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { LogOut, Plus, Settings } from "lucide-react";

export function Header() {
  const router = useRouter()
  const { data: session } = useSession()

  // If user is not logged in, do no show a Header.
  if (!session) {
    // rendering components for logged in users
    return <></>;
  }

  // <p>Session = {JSON.stringify(session, null, 4)}</p>
  // <p>Welcome {session.user?.name}. Signed In As</p>
  // <p>{session.user?.email}</p>
  // <button onClick={() => signOut()}>Sign out</button>

  const username = session.user?.name || '';

  const handleLogout = () => {
    // Logout and redirect to landing page
    signOut({ callbackUrl: '//landing' });
  };


  return (
    <header className="w-full border-b bg-background">
      <div
        className="container flex h-16 items-center justify-between px-4"
      >
        <div className="flex items-center gap-2">
          <div className="text-xl font-bold">
            VERITAI
          </div>
        </div>
        <div
          className="absolute left-1/2 transform -translate-x-1/2 text-xl font-semibold"
        >
          Agent Launchpad
        </div>
        <div className="flex items-center gap-4">
          <Button onClick={() => router.push("/agent-plan")}>
            <Plus className="mr-2 h-4 w-4" />
            New Agent
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Avatar className="h-8 w-8 cursor-pointer">
                <AvatarFallback
                  className="bg-primary text-primary-foreground"
                >
                  {username.charAt(0)}
                </AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <Label className="text-sm italic text-muted-foreground">{session.user?.email}</Label>
              <DropdownMenuItem
                onClick={() => router.push("/account-settings")}
              >
                <Settings className="mr-2 h-4 w-4" />
                Account Settings
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}