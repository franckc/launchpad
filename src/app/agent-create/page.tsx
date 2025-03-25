'use client';

import axios from 'axios';
import React, { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {  ArrowLeftIcon, SettingsIcon, FileStackIcon } from "lucide-react";

import Link from 'next/link';
import { useToast } from "@/hooks/use-toast"

export default function AgentPlanner() {
  // Initialize all hooks first
  const { data: session, status } = useSession();
  const router = useRouter();
  const { toast } = useToast();
  
  const [isLoading, setLoading] = useState(false);
  const [agentName, setAgentName] = useState("");
  const [githubUrl, setGithubUrl] = useState("");
  const [profileUrl, setProfileUrl] = useState("");
  const [envVariables, setEnvVariables] = useState<Array<{ key: string; value: string }>>([ { key: '', value: '' } ]);

  // Use effect for conditional redirects
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push('/landing');
    }
  }, [status, router]);

  // Function to handle agent deployment
  const handleDeploy = async () => {
    if (!agentName || !githubUrl) {
      toast({
        title: "Missing information",
        description: "Please provide both agent name and GitHub URL",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    // Called the business logic FE API to create an agent.
    try {
      const envs = {};
      envVariables.forEach(variable => {
        if (variable.key) {
          envs[variable.key] = variable.value;
        }
      });

      const response = await axios.put('/api/agent/create', {
        userId: session.user.id,
        config: {
          agentName,
          githubUrl,
          envs
        }
      });
      
      toast({
        title: "Deployment started",
        description: "Your agent is being deployed",
      });
      
      // Optionally redirect to a status page or dashboard
      // router.push('/');
    } catch (error) {
      console.error("Deployment error:", error);
      toast({
        title: "Deployment failed",
        description: "There was a problem deploying your agent. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Show loading state
  if (status === "loading") {
    return <p>Loading...</p>;
  }


  // Render main component
  return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" className="p-0">
            <ArrowLeftIcon className="h-4 w-4 mr-2" />
            <Link href="/">Back</Link>
          </Button>
          <h2 className="text-2xl font-bold">
            Agent Creation
          </h2>
        </div>
        <div className="col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                {/* <SettingsIcon className="h-5 w-5 mr-2" /> */}
                Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">
                  Agent Name
                </Label>
                <Input
                  placeholder="Enter a name for your agent"
                  value={agentName}
                  onChange={(e) => setAgentName(e.target.value)}
                />
              </div>
            </CardContent>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="github-url">
                  GitHub URL
                </Label>
                <Input
                  id="github-url"
                  placeholder="Enter the agent's GitHub repository URL"
                  value={githubUrl}
                  onChange={(e) => setGithubUrl(e.target.value)}
                />
              </div>
            </CardContent>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="profile-url">
                  Developer Profile
                </Label>
                <Input
                  id="profile-url"
                  placeholder="Enter the Developer's profile URL"
                  value={profileUrl}
                  onChange={(e) => setProfileUrl(e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <SettingsIcon className="h-5 w-5 mr-2" />
                Environment Variables
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <Label>Environment Variables</Label>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setEnvVariables([...envVariables, { key: '', value: '' }])}
                  >
                    Add variable
                  </Button>
                </div>
                
                {envVariables.map((variable, index) => (
                  <div key={index} className="flex space-x-2">
                    <div className="flex-1">
                      <Input
                        placeholder="Variable name"
                        value={variable.key}
                        onChange={(e) => {
                          const newVariables = [...envVariables];
                          newVariables[index].key = e.target.value;
                          setEnvVariables(newVariables);
                        }}
                      />
                    </div>
                    <div className="flex-1">
                      <Input
                        placeholder="Variable value"
                        value={variable.value}
                        onChange={(e) => {
                          const newVariables = [...envVariables];
                          newVariables[index].value = e.target.value;
                          setEnvVariables(newVariables);
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button 
              onClick={handleDeploy} 
              disabled={isLoading}
            >
              {isLoading ? "Deploying..." : "Deploy"}
            </Button>
          </div>
        </div>
      </div>
  );
}
