'use client';

import React, { useEffect, useState } from "react";
import { AgentCard } from "./agent-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookCopyIcon } from "lucide-react";
import { useSession } from "next-auth/react";

export function AgentList() {
  interface Agent {
    id: string;
    // Add other properties of Agent here
  }

  const [agents, setAgents] = useState<Agent[]>([]);
  const { data: session } = useSession();

  useEffect(() => {
    const fetchAgents = async () => {
      try {
        const userId = session?.user?.id;

        // Check if we have a userId before fetching
        if (!userId) {
          console.error('User ID not found');
          return;
        }
        const response = await fetch(`/api/agents/list/${userId}`);
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
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <BookCopyIcon className="h-5 w-5" />
          <span>Agents</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {agents.map((agent) => (
            <AgentCard key={agent.id} agent={agent} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
