'use client';

import React, { useEffect, useState } from "react";
import { AgentCard } from "./agent-card";

export function AgentList() {
  const [agents, setAgents] = useState([]);

  useEffect(() => {
    const fetchAgents = async () => {
      try {
        const response = await fetch('/api/agents/list');
        if (response.ok) {
          const data = await response.json();
          setAgents(data);
        } else {
          console.error('Failed to fetch agents');
        }
      } catch (error) {
        console.error('Error fetching agents:', error);
      }
    };

    fetchAgents();
  }, []);

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">
        My Agents
      </h2>
      <div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
      >
        {agents.map((agent) => (
          <AgentCard key={agent.id} agent={agent} />
        ))}
      </div>
    </div>
  );
}
