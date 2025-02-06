'use client';

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  CalendarIcon,
  Calendar1,
} from "lucide-react";
import { useRouter } from 'next/navigation'

export function Calendar() {
  const router = useRouter()

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <CalendarIcon className="h-5 w-5" />
          <span>Calendars</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <div
            className="flex flex-col items-center space-y-2 p-4 rounded-lg border bg-card cursor-pointer"
            onClick={() => router.push("/calendar")}
          >
            <Calendar1 className="h-8 w-8 text-muted-foreground"/>
            <span className="text-sm font-medium">
              Google Calendar
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}