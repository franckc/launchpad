'use client';

import React from "react";
import { AgentList } from "../(components)/agent-list";
import { ConnectedServices } from "../(components)/connected-services";
import { AgentInbox } from "../(components)/agent-inbox";
import { Calendar } from "../(components)/calendar-card";

export default function HomePage() {
  return (
    <div className="space-y-8">
      <Calendar />
      <AgentList />
      <ConnectedServices />
      <AgentInbox />
    </div>
  );
}
