'use client';

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TrashIcon, ClockIcon } from "lucide-react";
import { useRouter } from 'next/navigation'


type Agent = Record<string, any>;


export function AgentCard({ agent }: { agent: Agent }) {
  const router = useRouter()

  const getStatusColor = (status: string) => {
    switch (status) {
      case "CREATED":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-400";
      case "RUNNING":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-400";
      case "SCHEDULED":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-400";
      case "WAITING_FOR_FEEDBACK":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-400";
      case "DONE":
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-400";
    }
  };

  const handleDelete = (e: React.MouseEvent<Element>) => {
    e.stopPropagation();
    // Handle delete logic here
  };

  const handleStatusClick = (e: React.MouseEvent<Element>) => {
    e.stopPropagation();
    router.push(`/agent/${agent.id}/status`);
  };

  // Defensicve code to handle the case where the agent has no job yet.
  // Should not happen in production.
  const latestJobStatus = agent.latestJob ? agent.latestJob.status : "";

  return (
    <Card
      className="cursor-pointer hover:shadow-md transition-shadow"
      // FIXME: Should be something like agent/${agent.id}/status
      onClick={() => router.push(`/agent/${agent.id}/status`)}
    >
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <h3 className="font-semibold text-lg">
            {agent.name}
          </h3>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-destructive"
            onClick={handleDelete}
          >
            <TrashIcon className="h-4 w-4" />
          </Button>
        </div>

        <div className="mt-4 space-y-2">
          <Badge
            className={`cursor-pointer ${getStatusColor(latestJobStatus)}`}
            onClick={handleStatusClick}
          >
            {latestJobStatus.replace("_", " ")}
          </Badge>

          <div
            className="flex items-center text-sm text-muted-foreground"
          >
            <ClockIcon className="h-4 w-4 mr-1" />
            {agent.lastActive}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
