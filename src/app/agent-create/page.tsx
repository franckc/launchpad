'use client';

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ArrowLeftIcon,
  RocketIcon,
  UploadIcon,
  ClockIcon,
  ServerIcon,
  BellIcon,
} from "lucide-react";
import Link from 'next/link'

// Simple hash function
const simpleHash = (str) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash).toString(16).substring(0, 10);
};

export default function AgentCreate() {
  const [agentHash, setAgentHash] = useState("");
  const [lifeExpectancyType, setLifeExpectancyType] = useState("runs");
  const [isHosted, setIsHosted] = useState(true);
  const [agentSummary, setAgentSummary] = useState("");
  const [additionalQuestions, setAdditionalQuestions] = useState([]);

  useEffect(() => {
    generateAgentHash();
  }, []);

  const generateAgentHash = () => {
    const timestamp = new Date().getTime();
    const random = Math.random().toString();
    const hash = simpleHash(`${timestamp}-${random}`);
    setAgentHash(hash);
  };

  const notificationPriorities = [
    { level: "FYI", description: "General information" },
    { level: "Feedback", description: "Requires user input" },
    { level: "Urgent", description: "Time-sensitive action needed" },
    { level: "Critical", description: "Immediate attention required" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Button variant="ghost" className="p-0">
          <ArrowLeftIcon className="h-4 w-4 mr-2" />
          <Link href="/">Back</Link>
        </Button>
        <h2 className="text-2xl font-bold">
          Create New Agent
        </h2>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Main Configuration */}
        <div className="col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <RocketIcon className="h-5 w-5 mr-2" />
                Basic Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Agent Hash</Label>
                <div className="flex items-center space-x-2">
                  <Input value={agentHash} disabled />
                  <Button
                    variant="outline"
                    onClick={generateAgentHash}
                  >
                    Regenerate
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="name">
                  Agent Name
                </Label>
                <Input placeholder="Enter a name for your agent" />
              </div>

              <div className="space-y-4">
                <Label>Life Expectancy</Label>
                <RadioGroup
                  defaultValue="runs"
                  onValueChange={setLifeExpectancyType}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="runs" />
                    <Label htmlFor="runs">
                      Number of Runs
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="calendar" />
                    <Label htmlFor="calendar">
                      Calendar Based
                    </Label>
                  </div>
                </RadioGroup>
                {lifeExpectancyType === "runs" ? (
                  <Input
                    type="number"
                    placeholder="Number of runs"
                    min="1"
                  />
                ) : (
                  <Input type="date" />
                )}
              </div>

              <div className="space-y-4">
                <Label>Runtime Schedule</Label>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Start Time</Label>
                    <Input type="time" />
                  </div>
                  <div>
                    <Label>Frequency</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue
                          placeholder="Select frequency"
                        />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="hourly">
                          Hourly
                        </SelectItem>
                        <SelectItem value="daily">
                          Daily
                        </SelectItem>
                        <SelectItem value="weekly">
                          Weekly
                        </SelectItem>
                        <SelectItem value="monthly">
                          Monthly
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Hosted Environment</Label>
                  <Switch
                    checked={isHosted}
                    onCheckedChange={setIsHosted}
                  />
                </div>
                <p className="text-sm text-muted-foreground">
                  {isHosted
                    ? "Agent will run on our secure cloud infrastructure"
                    : "Agent will run on your private LLM instance"}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Agent Definition</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Role</Label>
                <Textarea
                  placeholder="Define the agent's role and responsibilities"
                />
              </div>

              <div className="space-y-2">
                <Label>Goal</Label>
                <Textarea
                  placeholder="What is the primary objective of this agent?"
                />
              </div>

              <div className="space-y-2">
                <Label>Backstory</Label>
                <Textarea
                  placeholder="Provide context and background for the agent"
                />
              </div>

              <div className="space-y-4">
                <Label>Task</Label>
                <div className="space-y-2">
                  <Label className="text-sm">
                    Description
                  </Label>
                  <Textarea
                    placeholder="Describe the specific task"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm">
                    Expected Output
                  </Label>
                  <Textarea
                    placeholder="What should the task produce?"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Context & Data Sources</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <Label>Connected Service</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a service" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="gdocs">
                      Google Docs
                    </SelectItem>
                    <SelectItem value="dropbox">
                      Dropbox
                    </SelectItem>
                    <SelectItem value="gmail">
                      Gmail
                    </SelectItem>
                    <SelectItem value="database">
                      Database
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Upload Files</Label>
                <div
                  className="border-2 border-dashed rounded-lg p-6 text-center"
                >
                  <UploadIcon
                    className="h-8 w-8 mx-auto mb-2 text-muted-foreground"
                  />

                  <p className="text-sm text-muted-foreground">
                    Drag and drop files here or click to browse
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Agent Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose prose-sm">
                <p className="text-muted-foreground">
                  {agentSummary ||
                    "Summary will appear here as you define the agent..."}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Priority</TableHead>
                    <TableHead>Method</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {notificationPriorities.map((priority, index) => (
                    <TableRow key={priority.level} id={`7he9vg_${index}`}>
                      <TableCell className="font-medium" id={`kt6o2t_${index}`}>
                        {priority.level}
                        <div
                          className="text-xs text-muted-foreground"
                          id={`arxwnc_${index}`}
                        >
                          {priority.description}
                        </div>
                      </TableCell>
                      <TableCell id={`2h2yz4_${index}`}>
                        <Select id={`pmq3yh_${index}`}>
                          <SelectTrigger id={`oarhob_${index}`}>
                            <SelectValue
                              placeholder="Select method"
                              id={`yli1yw_${index}`}
                            />
                          </SelectTrigger>
                          <SelectContent id={`n6c9kt_${index}`}>
                            <SelectItem value="email" id={`coqb0u_${index}`}>
                              Email
                            </SelectItem>
                            <SelectItem value="sms" id={`xk5cli_${index}`}>
                              SMS
                            </SelectItem>
                            <SelectItem value="call" id={`netc6i_${index}`}>
                              Call
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Additional Questions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {additionalQuestions.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    Questions will appear here based on your agent
                    configuration...
                  </p>
                ) : (
                  additionalQuestions.map((question, index) => (
                    <div
                      key={index}
                      className="space-y-2"
                      id={`c3ikzq_${index}`}
                    >
                      <Label id={`2rl7cu_${index}`}>{question}</Label>
                      <Input id={`eb9el0_${index}`} />
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          <Button className="w-full">
            <RocketIcon className="h-4 w-4 mr-2" />
            Launch Agent
          </Button>
        </div>
      </div>
    </div>
  );
}
