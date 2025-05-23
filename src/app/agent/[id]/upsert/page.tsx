'use client';

export const dynamic = 'force-dynamic'

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
} from "lucide-react";
import Link from 'next/link'
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useToast } from "@/hooks/use-toast"
import { z } from "zod"

const agentSchema = z.object({
  agentName: z.string().nonempty("Mandatory field"),
  role: z.string().nonempty("Mandatory field"),
  goal: z.string().nonempty("Mandatory field"),
  backstory: z.string().nonempty("Mandatory field"),
  taskDescription: z.string().nonempty("Mandatory field"),
  expectedOutput: z.string().nonempty("Mandatory field"),
  // ...other fields...
});

interface Params {
  id: string;
}

// Create (if id is set to 0) or Edit (if id > 0) an agent.
export default function AgentUpsert({ params }: { params: Params }) {
  const router = useRouter();
  const { toast } = useToast()

  const agentId = parseInt(params.id);
  const isEdit = !!agentId

  const [isLoading, setIsLoading] = useState(isEdit);
  const [agentHash, setAgentHash] = useState("0xAF79EF318");
  const [lifeExpectancyType, setLifeExpectancyType] = useState("runs");
  const [isHosted, setIsHosted] = useState(true);
  const [agentSummary, ] = useState("");
  const [additionalQuestions, ] = useState([]);
  const [agentName, setAgentName] = useState("");
  const [agentNameError, setAgentNameError] = useState("");
  const [role, setRole] = useState("");
  const [roleError, setRoleError] = useState("");
  const [goal, setGoal] = useState("");
  const [goalError, setGoalError] = useState("");
  const [backstory, setBackstory] = useState("");
  const [backstoryError, setBackstoryError] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [taskDescriptionError, setTaskDescriptionError] = useState("");
  const [expectedOutput, setExpectedOutput] = useState("");
  const [expectedOutputError, setExpectedOutputError] = useState("");
  const [startTime, setStartTime] = useState("");
  const [frequency, setFrequency] = useState("");
  const [connectedService, setConnectedService] = useState("");
  const [notificationMethods, setNotificationMethods] = useState({});

  useEffect(() => {
    const fetchAgent = async () => {
      try {
        const response = await fetch(`/api/agent/${agentId}`);
        if (response.ok) {
          const data = await response.json();
          setAgentName(data.name);
          setRole(data.config.role);
          setGoal(data.config.goal);
          setBackstory(data.config.backstory);
          setTaskDescription(data.config.taskDescription);
          setExpectedOutput(data.config.expectedOutput);
          setIsLoading(false);
        } else {
          console.error('Failed to fetch data for agent id', agentId);
        }
      } catch (error) {
        console.error('Error fetching data for agent id:', agentId, error);
      }
    };

    // If it's an edit we got the aggentId. Load the data
    if (isEdit) {
      fetchAgent();
    }
  }, []);

  const notificationPriorities = [
    { level: "FYI", description: "General information" },
    { level: "Feedback", description: "Requires user input" },
    { level: "Urgent", description: "Time-sensitive action needed" },
    { level: "Critical", description: "Immediate attention required" },
  ];

  const handleSubmit = async () => {
    const payload = {
      agentHash,
      agentName,
      role,
      goal,
      backstory,
      taskDescription,
      expectedOutput,
      lifeExpectancyType,
      isHosted,
      startTime,
      frequency,
      connectedService,
      notificationMethods,
      additionalQuestions,
    };

    const result = agentSchema.safeParse(payload);
    if (!result.success) {
      const error = result.error.format();
      setAgentNameError(error.agentName?._errors[0] || "");
      setRoleError(error.role?._errors[0] || "");
      setGoalError(error.goal?._errors[0] || "");
      setBackstoryError(error.backstory?._errors[0] || "");
      setTaskDescriptionError(error.taskDescription?._errors[0] || "");
      setExpectedOutputError(error.expectedOutput?._errors[0] || "");
      return;
    }
    setAgentNameError("");
    setRoleError("");
    setGoalError("");
    setBackstoryError("");
    setTaskDescriptionError("");
    setExpectedOutputError("");

    try {
      if (isEdit) {
        // Existing Agent update. Note the rerun=1 search arg to kick-off a rerun
        const response = await axios.post(`/api/agent/${agentId}/update?rerun=1`, payload);
        console.log('Agent updated successfully:', response.data);
        toast({
          title: "Agent successfully updated and launched",
          description: "Name: " + agentName,
        })
      } else {
        // New Agent creation
        const response = await axios.put('/api/agent/create', payload);
        console.log('Agent created successfully:', response.data);
        toast({
          title: "Agent successfully created and launched",
          description: "Name: " + agentName,
        })
      }
      router.push('/');
    } catch (error) {
      console.error('Error creating agent:', error);
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "There was a problem with your agent creation.",
      })
    }
  };

  if (isLoading) {
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
          {isEdit ? "Edit Agent" : "Create New Agent"}
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
                    //onClick={generateAgentHash}
                  >
                    Regenerate
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="name">
                  Agent Name
                </Label>
                {agentNameError && (
                  <p className="text-red-500 text-sm">{agentNameError}</p>
                )}
                <Input
                  placeholder="Enter a name for your agent"
                  value={agentName}
                  onChange={(e) => setAgentName(e.target.value)}
                  className={agentNameError ? "bg-red-100" : ""}
                />
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
                    <Input
                      type="time"
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>Frequency</Label>
                    <Select onValueChange={setFrequency}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select frequency" />
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
                {roleError && (
                  <p className="text-red-500 text-sm">{roleError}</p>
                )}
                <Textarea
                  placeholder="Define the agent's role and responsibilities"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className={roleError ? "bg-red-100" : ""}
                />
              </div>

              <div className="space-y-2">
                <Label>Goal</Label>
                {goalError && (
                  <p className="text-red-500 text-sm">{goalError}</p>
                )}
                <Textarea
                  placeholder="What is the primary objective of this agent?"
                  value={goal}
                  onChange={(e) => setGoal(e.target.value)}
                  className={goalError ? "bg-red-100" : ""}
                />
              </div>

              <div className="space-y-2">
                <Label>Backstory</Label>
                {backstoryError && (
                  <p className="text-red-500 text-sm">{backstoryError}</p>
                )}
                <Textarea
                  placeholder="Provide context and background for the agent"
                  value={backstory}
                  onChange={(e) => setBackstory(e.target.value)}
                  className={backstoryError ? "bg-red-100" : ""}
                />
              </div>

              <div className="space-y-4">
                <Label>Task</Label>
                <div className="space-y-2">
                  <Label className="text-sm">
                    Description
                  </Label>
                  {taskDescriptionError && (
                    <p className="text-red-500 text-sm">{taskDescriptionError}</p>
                  )}
                  <Textarea
                    placeholder="Describe the specific task"
                    value={taskDescription}
                    onChange={(e) => setTaskDescription(e.target.value)}
                    className={taskDescriptionError ? "bg-red-100" : ""}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm">
                    Expected Output
                  </Label>
                  {expectedOutputError && (
                    <p className="text-red-500 text-sm">{expectedOutputError}</p>
                  )}
                  <Textarea
                    placeholder="What should the task produce?"
                    value={expectedOutput}
                    onChange={(e) => setExpectedOutput(e.target.value)}
                    className={expectedOutputError ? "bg-red-100" : ""}
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
                <Select onValueChange={setConnectedService}>
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
              <CardTitle>Additional Questions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Questions will appear here based on your agent
                    configuration...
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
                        <Select onValueChange={(value) => setNotificationMethods((prev) => ({ ...prev, [priority.level]: value }))}>
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

          <Button className="w-full" onClick={handleSubmit}>
            <RocketIcon className="h-4 w-4 mr-2" />
            {isEdit ? "Save Changes and Launch Agent" : "Launch Agent"}
          </Button>
        </div>
      </div>
    </div>
  );
}
