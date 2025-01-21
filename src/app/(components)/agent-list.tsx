'use client';

import React from "react";
import { AgentCard } from "./agent-card";

export function AgentList() {
  const agents = [
    {
      id: "1",
      name: "Data Analysis Agent",
      status: "RUNNING",
      lastActive: "2 minutes ago",
    },
    {
      id: "2",
      name: "Document Processor",
      status: "SCHEDULED",
      lastActive: "1 hour ago",
    },
    {
      id: "3",
      name: "Email Assistant",
      status: "WAITING_FOR_FEEDBACK",
      lastActive: "5 minutes ago",
    },
    {
      id: "4",
      name: "Research Agent",
      status: "DONE",
      lastActive: "2 days ago",
    },
  ];

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">
        My Agents
      </h2>
      <div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
      >
        {agents.map((agent) => (
          //<AgentCard key={agent.id} agent={agent} id={`5osplx_${index}`} />
          <AgentCard key={agent.id} agent={agent} />
        ))}
      </div>
    </div>
  );
}
