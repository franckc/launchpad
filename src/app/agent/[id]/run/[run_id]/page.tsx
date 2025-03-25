'use client';

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeftIcon, ChevronDown, ChevronUp } from "lucide-react";
import { useRouter } from 'next/navigation';
import { getImageStatusColor, getRunStatusColor, formatDate, formatDateAgo } from "@/lib/utils";


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
}

interface Run {
  id: string
  status: string;
  config: any;
  output: Record<string, any>;
  updatedAt: string;
  agent: Agent;
  image: Image;
}

interface Params {
  id: string;
  run_id: string;
}

const mockActivity = [
  { "URL": "https://openai.com/api/llm", "request": "{ prompt: 'You are a senior researcher...' }", "response": "{ output: 'Lorem Ipsum....'}" },
  { "URL": "https://tools.io/api/search/web", "request": "{ query: 'lorem ipsum' }", "response": "{ [ { url: 'https://lorem.co/ipsum', snippet: 'Rosae...'}, ...]" },
  { "URL": "https://tools.io/api/scraper/web", "request": "{ URL: 'https://lorem.co/ipsum' }", "response": "{ body: 'Lorem Ipsum....'}" },
  { "URL": "https://tools.io/api/scraper/web", "request": "{ URL: 'https://ipsum.co/lorem' }", "response": "{ body: 'Lorem Ipsum....'}" },
  { "URL": "https://openai.com/api/llm", "request": "{ prompt: 'Generate a report...' }", "response": "{ output: 'Lorem Ipsum....'}" },
  { "URL": "https://openai.com/api/llm", "request": "{ prompt: 'Format the output as...' }", "response": "{ file_path: 's3://dominus/lorem/ipsum'}" },
]


export default function RunStatus({ params }: { params: Params }) {
  const agentId = params.id;
  const runId = params.run_id;
  const [run, setRun] = useState<Run | null>(null);
  const [stdoutExpanded, setStdoutExpanded] = useState(false);
  const [stderrExpanded, setStderrExpanded] = useState(false);
  const [activityExpanded, setActivityExpanded] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const fetchRun = async () => {
      try {
        const response = await fetch(`/api/agent/${agentId}/run/${runId}`);
        if (response.ok) {
          const data = await response.json();
          setRun(data);
        } else {
          console.error('Failed to fetch run');
        }
      } catch (error) {
        console.error('Error fetching agent:', error);
      }
    };

    fetchRun();
  }, [agentId]);

  if (!run) {
    return <div>Loading...</div>;
  }


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
          Run Details
        </h2>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between text-2xl font-bold">
            <span>Instance</span>
          </CardTitle>
        </CardHeader>
        <CardContent >
            <div className="text-sm text-muted-foreground">
              Run ID
            </div>
            <div className="text-m" style={{ whiteSpace: 'pre-wrap' }}>
              {run.id}
            </div>
        </CardContent>
        <CardContent >
            <div className="text-sm text-muted-foreground">
              Run date
            </div>
            <div className="text-m" style={{ whiteSpace: 'pre-wrap' }}>
              {formatDate(run.updatedAt)}
            </div>
        </CardContent>
        <CardContent >
            <div className="text-sm text-muted-foreground">
              Agent Name
            </div>
            <div className="text-m" style={{ whiteSpace: 'pre-wrap' }}>
              {run.agent.config.agentName}
            </div>
        </CardContent>
        <CardContent >
            <div className="text-sm text-muted-foreground">
              Agent Hash
            </div>
            <div className="text-m" style={{ whiteSpace: 'pre-wrap' }}>
              0x123ABCD765FDDE
            </div>
        </CardContent>   
        <CardContent >
            <div className="text-sm text-muted-foreground">
              Run Hash
            </div>
            <div className="text-m" style={{ whiteSpace: 'pre-wrap' }}>
              0xDEE8897FEE4091
            </div>
        </CardContent>      
        <CardContent >
            <div className="text-sm text-muted-foreground">
              Image Name
            </div>
            <div className="text-m" style={{ whiteSpace: 'pre-wrap' }}>
              {run.image.name}
            </div>
        </CardContent>
        <CardContent >
            <div className="text-sm text-muted-foreground">
              GitHub URL
            </div>
            <div className="text-m" style={{ whiteSpace: 'pre-wrap' }}>
              {run.agent.config.githubUrl}
            </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between text-2xl font-bold">
            <span>Execution</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
            <div className="text-sm text-muted-foreground">
              Status
            </div>
            <div className="text-m" style={{ whiteSpace: 'pre-wrap' }}>
              <Badge className={getRunStatusColor(run.status)}>
                {run.status?.replace("_", " ").replace("DONE", "COMPLETED").replace("FAILED", "ERROR") ?? "Unknown Status"}
              </Badge>
            </div>
        </CardContent>
        <CardContent>
            <div className="text-sm text-muted-foreground">
              Last Updated
            </div>
            <div className="text-m" style={{ whiteSpace: 'pre-wrap' }}>
              {formatDate(run.updatedAt)}
            </div>
        </CardContent>
        <CardContent>
            <div className="text-sm text-muted-foreground">
              Environment variables
            </div>
            <div className="text-sm">
              {run.agent.config.envs && Object.keys(run.agent.config.envs).length > 0 ? (
                <div className="border rounded-md overflow-hidden">
                  <table className="w-full">
                    <thead>
                      <tr>
                        <th className="text-left p-2">Key</th>
                        <th className="text-left p-2">Value</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.entries(run.agent.config.envs).map(([key, value]) => (
                        <tr key={key} className="border-t">
                          <td className="p-2 font-mono text-sm">{key}</td>
                          <td className="p-2 font-mono text-sm">{value}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p>No environment variables set.</p>
              )}
            </div>
        </CardContent>
        <CardContent>
            <div className="text-sm text-muted-foreground">
              Parameters
            </div>
            <div className="text-sm">
              {run.config?.inputs && Object.keys(run.config?.inputs).length > 0 ? (
                <div className="border rounded-md overflow-hidden">
                  <table className="w-full">
                    <thead>
                      <tr>
                        <th className="text-left p-2">Key</th>
                        <th className="text-left p-2">Value</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.entries(run.config.inputs).map(([key, value]) => (
                        <tr key={key} className="border-t">
                          <td className="p-2 font-mono text-sm">{key}</td>
                          <td className="p-2 font-mono text-sm">{value}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p>No parameters set.</p>
              )}
            </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between text-2xl font-bold">
            <span>Result</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between text-m font-bold">
                <span>Output</span>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="p-0 h-auto" 
                  onClick={() => setStdoutExpanded(!stdoutExpanded)}
                >
                  {stdoutExpanded ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </Button>
              </CardTitle>
            </CardHeader>
            {stdoutExpanded && (
              <CardContent>
                <div className="text-m" style={{ whiteSpace: 'pre-wrap' }}>
                  {run.output?.stdout?.length > 0 
                    ? run.output.stdout 
                    : "No output yet..."}
                </div>
                    </CardContent>
                  )}
          </Card>
        </CardContent>
        <CardContent className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between text-m font-bold">
                <span>LLMs & Tools activity</span>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="p-0 h-auto" 
                  onClick={() => setActivityExpanded(!activityExpanded)}
                >
                  {activityExpanded ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </Button>
              </CardTitle>
            </CardHeader>
            {activityExpanded && (
              <CardContent>
                <div className="text-xs" style={{ whiteSpace: 'pre-wrap' }}>
                {mockActivity.length > 0 ? (
                  <div className="border rounded-md overflow-hidden">
                    <table className="w-full">
                      <thead>
                        <tr>
                          <th className="text-left p-2">URL</th>
                          <th className="text-left p-2">Request</th>
                          <th className="text-left p-2">Response</th>
                        </tr>
                      </thead>
                      <tbody>
                        {mockActivity.map((activity, index) => (
                          <tr key={index} className="border-t">
                            <td className="p-2 font-mono text-xs">{activity.URL}</td>
                            <td className="p-2 font-mono text-xs">{activity.request}</td>
                            <td className="p-2 font-mono text-xs">{activity.response}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p>No activity recorded.</p>
                )}
                </div>
              </CardContent>
            )}
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between text-m font-bold">
              <span>Errors</span>
              <Button 
                variant="ghost" 
                size="sm" 
                className="p-0 h-auto" 
                onClick={() => setStderrExpanded(!stderrExpanded)}
              >
                {stderrExpanded ? (
                <ChevronUp className="h-4 w-4" />
                ) : (
                <ChevronDown className="h-4 w-4" />
                )}
              </Button>
              </CardTitle>
            </CardHeader>
            {stderrExpanded && (
              <CardContent>
              <div className="text-m" style={{ whiteSpace: 'pre-wrap' }}>
                {run.output?.stderr?.length > 0 
                ? run.output.stderr 
                : "No error output yet..."}
              </div>
              </CardContent>
            )}
            </Card>
        </CardContent>
      </Card>
    </div>
  );
}