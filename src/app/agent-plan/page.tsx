'use client';

import axios from 'axios';

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import{ Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge"
import { ArrowLeftIcon, Loader2, TrashIcon, PlusIcon, GripVerticalIcon, CirclePlayIcon, SquarePenIcon } from "lucide-react";

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useToast } from "@/hooks/use-toast"
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { json } from 'stream/consumers';

const ItemType = 'ROW';

const DraggableRow: React.FC<{ index: number; moveRow: (dragIndex: number, hoverIndex: number) => void; children: React.ReactNode }> = ({ index, moveRow, children }) => {
  const ref = React.useRef(null);
  const [, drop] = useDrop({
    accept: ItemType,
    hover(item: { index: number }) {
      if (!ref.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;
      if (dragIndex === hoverIndex) {
        return;
      }
      moveRow(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
  });

  const [{ isDragging }, drag] = useDrag({
    type: ItemType,
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  drag(drop(ref));

  return (
    <tr ref={ref} style={{ opacity: isDragging ? 0.5 : 1 }}>
      {children}
    </tr>
  );
};

interface Role {
  title: string;
  goal: string;
  backstory: string;
}

interface Tools {
  name: string;
  description: string;
}

interface Task {
  description: string;
  output: string;
  role: string;
  tools: string[]; // list of tool names
}

export default function AgentPlanner() {
  const router = useRouter();
  const { toast } = useToast()
  
  const [objective, setObjective] = useState('');
  const [isLoading, setLoading] = useState(false);
  const [roles, setRoles] = useState<Role[]>([]);
  const [tools, setTools] = useState<string[]>([]);
  const [draftPlan, setDraftPlan] = useState<Task[]>([]);

  const handleCreatePlan = async () => {
    console.log("Creating plan for objective:", objective);
    setLoading(true);
    try {
      const response = await fetch('/api/plan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ objective })
      });

      if (response.ok) {
        const data = await response.json();
        setRoles(data.plan.roles); // These are all the roles available in the AI engine
        setTools(data.plan.tools); // These are all the tools available in the AI engine
        setDraftPlan(data.plan.tasks);
      } else {
        console.error('Failed to create plan');
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: "There was a problem with your agent planning.",
        })
      }
    } catch (error) {
      console.error('Error creating plan:', error);
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "There was a problem with your agent planning.",
      })
    } finally {
      setLoading(false);
    }
  };

  const handleRunPlan = async () => {
    console.log("Preparing agent creation and launch");

    // Task:
    // description: string;
    // output: string;
    // role: string;
    // tools: string[];

    // Generate the agent and task config based on the draft plan and the roles.
    const agent_config = [];
    const task_config = [];
    for (const task of draftPlan) {
      const role = roles.find(r => r.title === task.role);
      if (!role) {
        console.error('Role not found for task:', task);
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: "There was a problem with your agent creation.",
        })
        return;
      }
      agent_config.push({
        role: role.title,
        goal: role.goal,
        backstory: role.backstory,
      });
      task_config.push({
        description: task.description,
        expected_output: task.output, // Note: name change since what's what the AI engine expects
        tools: task.tools,
      });
    }
    // Use the first 20 characters of the objective as the agent name 
    const agentName = objective.replace(/ /g, '-').slice(0, 20);

    const payload = {
      agentName,
      objective,
      agent_config,
      task_config,
    };
    console.log("PAYLOAD", JSON.stringify(payload, null, 4));

    setLoading(true);

    try {
      // New Agent creation
      const response = await axios.put('/api/agent/create', payload);
      console.log('Agent created successfully:', response.data);
      toast({
        title: "Agent successfully created and launched",
        description: "Name: " + agentName,
      })
      router.push('/');
    } catch (error) {
      console.error('Error creating agent:', error);
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "There was a problem with your agent creation.",
      })
    }
    setLoading(false);
  };

  const handleInputChange = (index: number, field: keyof Task, value: string) => {
    const updatedDraftPlan = [...draftPlan];
    if (field === 'tools') {
      updatedDraftPlan[index][field] = value.split(',').map(tool => tool.trim());
    } else {
      updatedDraftPlan[index][field] = value;
    }
    setDraftPlan(updatedDraftPlan);
  };

  const handleDeleteRow = (index: number) => {
    const updatedDraftPlan = draftPlan.filter((_, i) => i !== index);
    setDraftPlan(updatedDraftPlan);
  };

  const handleAddRow = () => {
    const newTask = { description: '', output: '', role: '', tools: [] };
    setDraftPlan([...draftPlan, newTask]);
  };

  interface DragItem {
    index: number;
  }

  const moveRow = (dragIndex: number, hoverIndex: number) => {
    const updatedDraftPlan = [...draftPlan];
    const [movedRow] = updatedDraftPlan.splice(dragIndex, 1);
    updatedDraftPlan.splice(hoverIndex, 0, movedRow);
    setDraftPlan(updatedDraftPlan);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" className="p-0">
            <ArrowLeftIcon className="h-4 w-4 mr-2" />
            <Link href="/">Back</Link>
          </Button>
          <h2 className="text-2xl font-bold">
            Agent Planner
          </h2>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Agent Configuration</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="objective">
                Agent Objective
              </Label>
              <Input
                id="objective"
                placeholder="Enter agent objective"
                value={objective}
                onChange={(e) => setObjective(e.target.value)}
              />
            </div>

            {draftPlan.length > 0 && (
              <div className="space-y-2">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead style={{ width: '35%' }}>Task</TableHead>
                      <TableHead style={{ width: '35%' }}>Output</TableHead>
                      <TableHead style={{ width: '10%' }}>Role</TableHead>
                      <TableHead style={{ width: '20%' }}>Tools</TableHead>
                      <TableHead>Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {draftPlan.map((task, index) => (
                      <DraggableRow key={index} index={index} moveRow={moveRow}>
                        <TableCell style={{ width: '35%', whiteSpace: 'normal', wordWrap: 'break-word' }}>
                          <Textarea
                            value={task.description}
                            onChange={(e) => handleInputChange(index, 'description', e.target.value)}
                            wrap="hard"
                          />
                        </TableCell>
                        <TableCell style={{ width: '35%', whiteSpace: 'normal', wordWrap: 'break-word' }}>
                          <Textarea
                            value={task.output}
                            onChange={(e) => handleInputChange(index, 'output', e.target.value)}
                          />
                        </TableCell>
                        <TableCell style={{ width: '10%' }}>
                          <Input
                            value={task.role}
                            onChange={(e) => handleInputChange(index, 'role', e.target.value)}
                          />
                        </TableCell>
                        <TableCell style={{ width: '15%' }}>
                          <div className="flex flex-wrap gap-1">
                            {task.tools.map((tool, toolIndex) => (
                              <Badge key={toolIndex}>{tool}</Badge>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Button variant="ghost" onClick={() => handleDeleteRow(index)}>
                              <TrashIcon className="h-4 w-4" />
                            </Button>
                            <GripVerticalIcon className="h-4 w-4 cursor-move" />
                          </div>
                        </TableCell>
                      </DraggableRow>
                    ))}
                    <TableRow>
                      <TableCell colSpan={6} className="text-center">
                        <Button variant="ghost" onClick={handleAddRow}>
                          <PlusIcon className="h-4 w-4 mr-2" />
                          Add Row
                        </Button>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            )}

            <div className="flex justify-end">
              {draftPlan.length > 0 ? (
                <Button onClick={handleRunPlan} disabled={isLoading}>
                  {isLoading ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    <CirclePlayIcon className="h-4 w-4 mr-2" />
                  )}
                  Run Plan
                </Button>
              ) : (
                <Button onClick={handleCreatePlan} disabled={isLoading}>
                  {isLoading ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    <SquarePenIcon className="h-4 w-4 mr-2" />
                  )}
                  Create Plan
                </Button>
              )}
            </div>

          </CardContent>
        </Card>
      </div>
    </DndProvider>
  );
}
