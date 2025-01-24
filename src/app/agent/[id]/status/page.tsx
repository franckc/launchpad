'use client';

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeftIcon, PlayIcon, PauseIcon, RotateCwIcon } from "lucide-react";
import Link from 'next/link';
import moment from 'moment';

export default function AgentStatus({ params }) {
  const agentId = params.id;
  const [agent, setAgent] = useState(null);

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

  const formatDate = (dateString: string) => {
    const pastDate = moment(dateString);
    const agoString = pastDate.fromNow();
    return agoString;
    //return moment(dateString).format('MM/DD/YY h:mm:ss a');
  };


  console.log("LOADED AGENT", agent);

  const latestJob = agent.jobs.length ? agent.jobs[0] : null;
  const latestJobStatus = agent.jobs.length ? agent.jobs[0].status : 'NO JOB';

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Button variant="ghost" className="p-0">
          <ArrowLeftIcon className="h-4 w-4 mr-2" />
          <Link href="/">Back</Link>
        </Button>
        <h2 className="text-2xl font-bold">
          Agent Status
        </h2>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Status Overview</span>
            <Badge
              className={getStatusColor(latestJobStatus)}
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
                  {latestJob ? formatDate(latestJob.updatedAt) : 'N/A'}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-sm text-muted-foreground">
                  Tasks Completed
                </div>
                <div className="text-2xl font-bold">
                  {agent.jobs.length}
                </div>
              </CardContent>
            </Card>
          </div>
          {latestJob && (
            <div>
              <Card>
                <CardContent className="p-4">
                  <div className="text-sm text-muted-foreground">
                    Raw Output
                  </div>
                  <div className="text-l" style={{ whiteSpace: 'pre-wrap' }}>
                    {latestJob ? latestJob.output : 'N/A'}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
          <div className="flex space-x-4">
            <Button variant="outline">
              <PauseIcon className="h-4 w-4 mr-2" />
              Pause
            </Button>
            <Button>
              <PlayIcon className="h-4 w-4 mr-2" />
              Resume
            </Button>
            <Button variant="outline">
              <RotateCwIcon className="h-4 w-4 mr-2" />
              Restart
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
