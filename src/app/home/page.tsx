'use client';

import React from "react";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { AgentList } from "../(components)/agent-list";
import { ConnectedServices } from "../(components)/connected-services";
import { AgentInbox } from "../(components)/agent-inbox";
import { Calendar } from "../(components)/calendar-card";

export default function HomePage() {
  // Check user authentication status
  const { data: session, status } = useSession()
  if (status === "loading") {
    return <p>Loading...</p>
  }
  if (status === "unauthenticated") {
    redirect('/landing')
  }

  return (
    <div className="space-y-8">
      <Calendar />
      <AgentList />
      <ConnectedServices />
      <AgentInbox />
    </div>
  );
}
