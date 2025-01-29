'use client';

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import{ Textarea } from "@/components/ui/textarea";

import { Badge } from "@/components/ui/badge"

import { ArrowLeftIcon, SaveIcon, TrashIcon, PlusIcon } from "lucide-react";
import Link from 'next/link';
import { useToast } from "@/hooks/use-toast"

export default function AgentPlanner() {
  const { toast } = useToast()
  
  const [objective, setObjective] = useState('');
  const [loading, setLoading] = useState(false);
  const [draftPlan, setDraftPlan] = useState([]);

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
        setDraftPlan(data.plan);
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

  const handleInputChange = (index, field, value) => {
    const updatedDraftPlan = [...draftPlan];
    updatedDraftPlan[index][field] = value;
    setDraftPlan(updatedDraftPlan);
  };

  const handleDeleteRow = (index) => {
    const updatedDraftPlan = draftPlan.filter((_, i) => i !== index);
    setDraftPlan(updatedDraftPlan);
  };

  const handleAddRow = () => {
    const newTask = { description: '', output: '', role: '', tools: [] };
    setDraftPlan([...draftPlan, newTask]);
  };

  return (
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
                    <TableRow key={index}>
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
                        <Button variant="ghost" onClick={() => handleDeleteRow(index)}>
                          <TrashIcon className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  <TableRow>
                    <TableCell colSpan={5} className="text-center">
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
            <Button onClick={handleCreatePlan} disabled={loading}>
              {loading ? (
                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
              ) : (
                <SaveIcon className="h-4 w-4 mr-2" />
              )}
              Create Plan
            </Button>
          </div>

        </CardContent>
      </Card>
    </div>
  );
}
