'use client';

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TrashIcon } from "lucide-react";
import { useRouter } from 'next/navigation'
import { getImageStatusColor } from "@/lib/utils";

type Agent = Record<string, any>;


export function AgentCard({ agent }: { agent: Agent }) {
  const router = useRouter()

  const handleDelete = (e: React.MouseEvent<Element>) => {
    e.stopPropagation();
    // Handle delete logic here
  };

  const handleStatusClick = (e: React.MouseEvent<Element>) => {
    e.stopPropagation();
    router.push(`/agent/${agent.id}/status`);
  };

  const imageStatus = agent.image?.buildStatus || 'UNKOWN';

  return (
    <Card
      className="cursor-pointer hover:shadow-md transition-shadow"
      onClick={() => router.push(`/agent/${agent.id}/status`)}
    >
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <h3 className="font-semibold text-lg">
            {agent.config.agentName}
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
          <Badge className={getImageStatusColor(imageStatus)}>
            {imageStatus.replace("_", " ").replace("DONE", "DEPLOYED").replace("PENDING", "DEPLOYING")}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}
