'use client';

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeftIcon, PlayIcon, PauseIcon, RotateCwIcon, PencilIcon, Car } from "lucide-react";
import { useRouter } from 'next/navigation';
import { getImageStatusColor, getRunStatusColor, formatDate, formatDateAgo } from "@/lib/utils";


interface Run {
  status: string;
  config: any;
  output: Record<string, any>;
  updatedAt: string;
}

interface Image {
  name: string;
  buildStatus: string;
}

interface Agent {
  config: {
    agentName: string;
    githubUrl: string;
  };
  image: Image;
  runs: Run[];
}

interface Params {
  id: string;
}

export default function AgentStatus({ params }: { params: Params }) {
  const agentId = params.id;
  const [agent, setAgent] = useState<Agent | null>(null);

  const router = useRouter();

  useEffect(() => {
    const fetchAgent = async () => {
      try {
        const response = await fetch(`/api/agent/${agentId}`);
        if (response.ok) {
          const data = await response.json();
          setAgent(data);
        } else {
          console.error('Failed to fetch agent');
        }
      } catch (error) {
        console.error('Error fetching agent:', error);
      }
    };

    fetchAgent();
  }, [agentId]);

  if (!agent) {
    return <div>Loading...</div>;
  }



  const latestRun = agent.runs.length ? agent.runs[0] : null;
  const latestRunStatus = agent.runs.length ? agent.runs[0].status : 'NO RUN';

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Button
            variant="ghost"
            className="p-0"
            onClick={() => router.push("/")}
          >
            <ArrowLeftIcon className="h-4 w-4 mr-2" />
            Back
        </Button>
        <h2 className="text-2xl font-bold">
          Agent Status
        </h2>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between text-2xl font-bold">
            <span>Config</span>
          </CardTitle>
        </CardHeader>

        <CardContent >
            <div className="text-sm text-muted-foreground">
              Agent Name
            </div>
            <div className="text-m" style={{ whiteSpace: 'pre-wrap' }}>
              {agent.config.agentName}
            </div>
        </CardContent>
        <CardContent >
            <div className="text-sm text-muted-foreground">
              GitHub URL
            </div>
            <div className="text-m" style={{ whiteSpace: 'pre-wrap' }}>
              {agent.config.githubUrl}
            </div>
        </CardContent>
      </Card>

    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-2xl font-bold">
            <span>Image</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <div className="text-sm text-muted-foreground">
              Build Status
            </div>
            <div className="text-m">
              <Badge className={getImageStatusColor(agent.image.buildStatus)}>
                {agent.image.buildStatus.replace("_", " ").replace("DONE", "DEPLOYED").replace("PENDING", "DEPLOYING")}
              </Badge>
            </div>
          </div>
        </CardContent>
        <CardContent >
            <div className="text-sm text-muted-foreground">
              Image Name
            </div>
            <div className="text-m" style={{ whiteSpace: 'pre-wrap' }}>
              {agent.image.name}
            </div>
        </CardContent>
    </Card>

    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Runs</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {agent.runs.length ? (
          agent.runs.map((run, index) => (
            <React.Fragment key={index}>
              <Card>
                <CardContent className="p-4">
                  <div className="text-l">
                    <b>Run date</b>
                  </div>
                  <div className="text-l" style={{ whiteSpace: 'pre-wrap' }}>
                    {formatDate(run.updatedAt)}
                  </div>
                </CardContent>
                <CardContent className="p-4">
                  <div className="text-l">
                    <b>Status</b>
                  </div>
                  <div className="text-m">
                    <Badge className={getRunStatusColor(run.status)}>
                      {run.status}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </React.Fragment>
          ))
        ) : (
          <div>No run yet</div>
        )}
      </CardContent>
    </Card>
    </div>
  );
}
