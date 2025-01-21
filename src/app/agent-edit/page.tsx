'use client';

import React from "react";
import { useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeftIcon, SaveIcon } from "lucide-react";
import Link from 'next/link'

export default function AgentEdit() {
  const { id } = useParams();

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
      <Button variant="ghost" className="p-0">
          <ArrowLeftIcon className="h-4 w-4 mr-2" />
          <Link href="/">Back</Link>
        </Button>
        <h2 className="text-2xl font-bold">
          Edit Agent
        </h2>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Agent Configuration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">
              Agent Name
            </Label>
            <Input placeholder="Enter agent name" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">
              Description
            </Label>
            <Textarea
              placeholder="Describe what this agent does"
              className="min-h-[100px]"
            />
          </div>

          <div className="flex justify-end">
            <Button>
              <SaveIcon className="h-4 w-4 mr-2" />
              Save Changes
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
