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

import { ArrowLeftIcon, SaveIcon } from "lucide-react";
import Link from 'next/link';
import { useToast } from "@/hooks/use-toast"

export default function AgentPlanner() {
  const { toast } = useToast()
  
  const [objective, setObjective] = useState('');
  const [loading, setLoading] = useState(false);
  const [draftPlan, setDraftPlan] = useState([]);

  const handleCreatePlan = async () => {
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

          {draftPlan && (
            <div className="space-y-2">
              <Table>
                <TableCaption>Agent plan.</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead>Task</TableHead>
                    <TableHead>Output</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Tools</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {draftPlan.map((task) => (
                    <TableRow key={task.ID}>
                      <TableCell>{task.description}</TableCell>
                      <TableCell>{task.output}</TableCell>
                      <TableCell>{task.role}</TableCell>
                      <TableCell>{task.tools.join(", ")}</TableCell>
                    </TableRow>
                  ))}
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
