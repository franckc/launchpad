'use client';

import React from "react";
import { useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeftIcon, PlayIcon, PauseIcon, RotateCwIcon } from "lucide-react";
import Link from 'next/link'

export default function AgentStatus() {
  const { id } = useParams();

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
              className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-400"
            >
              RUNNING
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="text-sm text-muted-foreground">
                  Last Active
                </div>
                <div className="text-2xl font-bold">
                  2 minutes ago
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-sm text-muted-foreground">
                  Tasks Completed
                </div>
                <div className="text-2xl font-bold">
                  24
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-sm text-muted-foreground">
                  Uptime
                </div>
                <div className="text-2xl font-bold">
                  4h 23m
                </div>
              </CardContent>
            </Card>
          </div>

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
