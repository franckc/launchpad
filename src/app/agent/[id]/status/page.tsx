'use client';

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeftIcon, PlayIcon, PauseIcon, RotateCwIcon, PencilIcon, Car } from "lucide-react";
import { useRouter } from 'next/navigation';
import { getImageStatusColor, getRunStatusColor, formatDate, formatDateAgo } from "@/lib/utils";


interface Run {
  id: string;
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
    envs?: Record<string, string>;
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

  const startNewRun = async (agentId: string) => {
    try {
      const response = await fetch(`/api/agent/${agentId}/run/start`, {
        method: 'POST',
      });
      if (response.ok) {
        const data = await response.json();
        router.push(`/agent/${agentId}/run/${data.runId}`);
      } else {
        console.error('Failed to start new run');
      }
    } catch (error) {
      console.error('Error starting new run:', error);
    }
  };

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
            <span>Env Variables</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
        {agent.config.envs ? (
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="text-left pb-2 text-sm text-muted-foreground">Name</th>
                <th className="text-left pb-2 text-sm text-muted-foreground">Value</th>
              </tr>
            </thead>
            <tbody>
              {Object.keys(agent.config.envs).map((key) => (
                <tr key={key} className="border-t">
                  <td className="py-2 text-sm font-medium">{key}</td>
                  <td className="py-2 text-sm">
                    {key.includes("KEY") || key.includes("TOKEN") 
                      ? "•".repeat(agent.config.envs[key].length - 4) + agent.config.envs[key].slice(-4)
                      : agent.config.envs[key]}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div>No environment variables</div>
        )}
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
      <CardTitle className="flex items-center justify-between text-2xl font-bold">
            <span>Runs</span>
            <Button
            onClick={() => startNewRun(agentId)}
            className="flex items-center space-x-1"
            size="lg"
            >
            <PlayIcon className="h-4 w-4" />
            <span>New Run</span>
            </Button>
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
                <CardContent className="p-4">
                  <Button
                    variant="outline"
                    className="flex items-center space-x-1"
                    onClick={() => router.push(`/agent/${agentId}/run/${run.id}`)}
                  >
                    <span>View Run Details</span>
                  </Button>
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
