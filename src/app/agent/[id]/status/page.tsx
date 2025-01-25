'use client';

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeftIcon, PlayIcon, PauseIcon, RotateCwIcon, PencilIcon } from "lucide-react";
import { useRouter } from 'next/navigation';
import { getJobStatusColor, formatDate, formatDateAgo } from "@/lib/utils";


interface Job {
  status: string;
  output: string;
  updatedAt: string;
}

interface Agent {
  config: {
    agentName: string;
  };
  jobs: Job[];
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



  const latestJob = agent.jobs.length ? agent.jobs[0] : null;
  const latestJobStatus = agent.jobs.length ? agent.jobs[0].status : 'NO JOB';

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
            <span>{agent.config.agentName}</span>
          </CardTitle>
        </CardHeader>

        <CardContent>
          <div>
            <Button
              variant="outline"
              onClick={() => router.push("/agent-create?id=" + agentId)}
            >
              <PencilIcon className="h-4 w-4 mr-2" />
              Edit
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Status Overview</span>
            <Badge
              className={getJobStatusColor(latestJobStatus)}
            >
              {latestJobStatus}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="text-sm text-muted-foreground">
                  Last Run
                </div>
                <div className="text-2xl font-bold">
                  {latestJob ? formatDateAgo(latestJob.updatedAt) : 'N/A'}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-sm text-muted-foreground">
                  Runs Completed
                </div>
                <div className="text-2xl font-bold">
                  {agent.jobs.length}
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div>
            <Button variant="outline">
              <PauseIcon className="h-4 w-4 mr-2" />
              Pause
            </Button>
            {/* <Button>
              <PlayIcon className="h-4 w-4 mr-2" />
              Resume
            </Button> */}
            <Button variant="outline">
              <RotateCwIcon className="h-4 w-4 mr-2" />
              Rerun
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Runs output</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {agent.jobs.length ? (
            agent.jobs.map((job, index) => (
              <Card key={index}>
                <CardContent className="p-4">
                  <div className="text-sm text-muted-foreground">
                    Run date
                  </div>
                  <div className="text-l" style={{ whiteSpace: 'pre-wrap' }}>
                    {formatDate(job.updatedAt)}
                  </div>
                </CardContent>
                <CardContent className="p-4">
                  <div className="text-sm text-muted-foreground">
                    Raw Output
                  </div>
                  <div className="text-l" style={{ whiteSpace: 'pre-wrap' }}>
                    {job.output}
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div>No run yet</div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
