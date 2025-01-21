'use client';

import React from "react";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { useRouter } from 'next/navigation'

export function Header() {
  const router = useRouter()

  return (
    <header className="border-b">
      <div
        className="container mx-auto px-6 py-4 flex items-center justify-between"
      >
        <h1 className="text-2xl font-bold">
          Agent Launchpad
        </h1>
        <Button onClick={() => router.push("/agent-create")}>
          <PlusIcon className="h-4 w-4 mr-2" />
          New Agent
        </Button>
      </div>
    </header>
  );
}
