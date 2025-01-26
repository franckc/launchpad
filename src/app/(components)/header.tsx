'use client';

import React from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from 'next/navigation'
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut, Plus, Settings } from "lucide-react";

export function Header() {
  const username = "John Doe";
  const router = useRouter()

  const handleLogout = () => {
    // Add logout logic here (clear tokens, etc)
    router.push("/sign-in");
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
          <Button onClick={() => router.push("/agent/0/upsert")}>
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