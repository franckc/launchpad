'use client';

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { ArrowLeftIcon, PlayIcon, PauseIcon, RotateCwIcon, PencilIcon, Car, TrashIcon } from "lucide-react";
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
    inputKeys?: Array<string>;
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
  const [showInputModal, setShowInputModal] = useState(false);
  const [inputs, setInputs] = useState<Record<string, string>>({});

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

  // Decorate agent with mock dependencies for now
  agent.dependencies = {
    "Pydantic": "3.8",
    "Pandas": "1.3.3",
    "Numpy": "1.21.2",
    "AWS S3 Cloud Storage": "1.42.0",
    "Google Websearch MCP server": "2.6.0"
  };

  const startNewRun = async (agentId: string, inputs: Record<string, string>) => {
    try {
      const payload = { inputs: inputs, }
      const response = await fetch(`/api/agent/${agentId}/run/start`, {
        method: 'POST',
        body: JSON.stringify(payload),
        headers: {
          'Content-Type': 'application/json',
        },
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

            <Button
            onClick={() => {
              // FIXME
              console.log("Delete Agent not implemented yet")
            }}
            className="flex items-center space-x-1"
            size="lg"
              >
            <TrashIcon className="h-4 w-4" />
            <span>Delete</span>
          </Button>
          </CardTitle>
        </CardHeader>

        <CardContent >
            <div className="text-sm text-muted-foreground">
              Agent Name
            </div>
            <div className="text-m" style={{ whiteSpace: 'pre-wrap' }}>
              {agent.config.agentName}
            </div>
            <div className="text-sm text-muted-foreground">
              Agent Hash
            </div>
            <div className="text-m" style={{ whiteSpace: 'pre-wrap' }}>
              0x123ABCD765FDEG
            </div>
            <div className="text-sm text-muted-foreground">
              Description
            </div>
            <div className="text-m" style={{ whiteSpace: 'pre-wrap' }}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla nec dui eget
            </div>
        </CardContent>
        <CardContent >
            <div className="text-sm text-muted-foreground">
              GitHub URL
            </div>
            <div className="text-m" style={{ whiteSpace: 'pre-wrap' }}>
                <a href={agent.config.githubUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                {agent.config.githubUrl}
                </a>
            </div>
            <div className="text-sm text-muted-foreground">
              Developer Profile
            </div>
            <div className="text-m" style={{ whiteSpace: 'pre-wrap' }}>
              <a href="https://github.com/franckc" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                https://github.com/franckc
              </a>
            </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between text-2xl font-bold">
            <span>Environment Variables</span>
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
            <span>Tools & Libraries</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
        {agent.config.envs ? (
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="text-left pb-2 text-sm text-muted-foreground">Name</th>
                <th className="text-left pb-2 text-sm text-muted-foreground">Version</th>
              </tr>
            </thead>
            <tbody>
                {Object.keys(agent.dependencies).map((key) => (
                <tr key={key} className="border-t">
                  <td className="py-2 text-sm font-medium">{key}</td>
                  <td className="py-2 text-sm">
                  {agent.dependencies[key]}
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
            <div className="text-sm text-muted-foreground mt-4">
              Last Updated
            </div>
            {agent.image.updatedAt ? (
              <div className="text-m" style={{ whiteSpace: 'pre-wrap' }}>
                {formatDate(agent.image.updatedAt)} ({formatDateAgo(agent.image.updatedAt)})
              </div>
            ) : (
              <div className="text-m text-muted-foreground">
                Not available
              </div>
            )}
        </CardContent>
    </Card>

    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-2xl font-bold">
          <span>Runs</span>
          <Button
            onClick={() => {
              // Check if agent has input keys. If yes show a modal to enter input values,
              // otherwise start a new run directly.
              if (agent.config.inputKeys && agent.config.inputKeys.length > 0) {
                setShowInputModal(true);
              } else {
                startNewRun(agentId, {});
              }
            }}
            className="flex items-center space-x-1"
            size="lg"
              >
            <PlayIcon className="h-4 w-4" />
            <span>New Run</span>
          </Button>

          {/* Input Keys Dialog */}
          <Dialog open={showInputModal} onOpenChange={setShowInputModal}>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Enter Run Parameters</DialogTitle>
                <DialogDescription>
                  Provide values for the required input parameters.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={(e) => {
                e.preventDefault();
                const inputValues = {};
                agent.config.inputKeys?.forEach(key => { inputValues[key] = inputs[key] || '';});
                startNewRun(agentId, inputValues);
                setShowInputModal(false);
              }}>
              {agent.config.inputKeys?.map(key => (
                <div key={key} className="mb-4">
                  <label className="block text-sm font-medium mb-1">{key}</label>
                  <input
                    type="text"
                    name={key}
                    value={inputs[key] || ''}
                    onChange={(e) => setInputs({...inputs, [key]: e.target.value})}
                    className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
                  />
                </div>
              ))}
              <div className="flex justify-end space-x-2 mt-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setShowInputModal(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">
                  Start Run
                </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {agent.runs.length ? (
          agent.runs.map((run, index) => (
            <React.Fragment key={index}>
              <Card>
                <div className="p-4 space-y-4">
                  <div className="flex justify-between items-start">
                  <div>
                    <div className="text-sm text-muted-foreground">
                    Run ID
                    </div>
                    <div className="text-l" style={{ whiteSpace: 'pre-wrap' }}>
                    {run.id}
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    className="flex items-center space-x-1"
                    onClick={() => router.push(`/agent/${agentId}/run/${run.id}`)}
                  >
                    <span>Details</span>
                  </Button>
                  </div>
                  
                  <div className="flex flex-col gap-2">
                  <div>
                    <div className="text-sm text-muted-foreground">
                    Run config hash
                    </div>
                    <div className="text-sm" style={{ whiteSpace: 'pre-wrap' }}>
                    #Ox123ABCD765FDEG
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">
                    Run date
                    </div>
                    <div className="text-sm" style={{ whiteSpace: 'pre-wrap' }}>
                    {formatDate(run.updatedAt)}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">
                    Status
                    </div>
                    <Badge className={getRunStatusColor(run.status)}>
                    {run.status.replace('DONE', 'COMPLETED').replace('PENDING', 'RUNNING')}
                    </Badge>
                  </div>
                  </div>
                </div>
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
