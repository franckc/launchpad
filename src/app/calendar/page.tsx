'use client';

import React, { useEffect, useState } from "react";
import { useRouter, redirect } from 'next/navigation'
import { useSession } from "next-auth/react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, ArrowLeftIcon, ChevronUpIcon, ChevronDownIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BlocksCalendar } from "../(components)/blocks-calendar";


const DEFAULT_TAXONOMY = [
  {
    "category": "Exercise",
    "description": "go to the gym, run, swim or any other type of exercise"
  },
  {
    "category": "No screen",
    "description": "not available online, no access to a computer"
  },
  {
    "category": "Admin",
    "description": "team meeting, organize my calendar, set up meetings, etc..."
  },
  {
    "category": "Learn",
    "description": "educational, reading, research"
  },
  {
    "category": "GSD",
    "description": "solo work time. sometime referred to as 'DNS' (Do Not Schedule)"
  },
  {
    "category": "Animals care",
    "description": "take care of my pets. feeding, walk them, etc..."
  },
  {
    "category": "Hiring",
    "description": "interviews, recruiting, hiring committee"
  },
  {
    "category": "Network / Mentor / Coach",
    "description": "typically 1:1 meeting"
  },
  {
    "category": "Internal Meetings",
    "description": "professional meeting with employees at the company I work at"
  },
  {
    "category": "External Meetings",
    "description": "professional meeting with people that do not work at the same company"
  },
  {
    "category": "Family Time (DND)",
    "description": "spend time with wife, kids and familiy in general. for example dinner time, activities."
  },
  {
    "category": "Chores",
    "description": "house maintenance, feed the pets, take trash out, etc..."
  },
]

function taxonomyToText(taxonomy: any[]) {
  return taxonomy.map(item => `${item.category}: ${item.description}`).join('\n');
}

function textToTaxonomy(text: string) {
  return text
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.includes(':'))
    .map(line => {
      const [category, description] = line.split(': ');
      return { "category": category.trim(), "description": description.trim() };
    });
}


async function getCalEvents(accessToken: string) {
  //await new Promise(resolve => setTimeout(resolve, 10000)); // 10-second delay
  
  // Fetch calendar events from the backend.
  const response = await fetch(`/api/calendar/events`);
  if (response.ok) {
    const data = await response.json();
    console.log(`Fetched ${data.items?.length} calendar events`);
    return data;
  }
  // TODO: show a toast
  console.error('Failed to fetch calendar events');
  throw new Error('Failed to fetch calendar events');
}

type Attendee = {
  email: string;
};

export default function Calendar() {
  // Check user authentication status
  const { data: session, status } = useSession()
  if (status === "loading") {
    return <p>Loading...</p>
  }
  if (status === "unauthenticated") {
    redirect('/landing')
  }

  const router = useRouter();

  const [events, setEvents] = useState<any[]>([]);
  const [taxonomy, setTaxonomy] = useState<any[]>(DEFAULT_TAXONOMY);
  const [blocks, setBlocks] = useState<any[]>([]);
  const [isLoadingCalEvents, setIsLoadingCalEvents] = useState(true);
  const [isLoadingClassification, setIsLoadingClassification] = useState(false);
  const [isLoadingComputeBlocks, setIsLoadingComputeBlocks] = useState(false);
  const [showTableBody, setShowTableBody] = useState(true);
  const [showTaxonomy, setShowTaxonomy] = useState(true);
  const [showBlocks, setShowBlocks] = useState(true);

  useEffect(() => {
    handleGetCalEvents();
  }, [session]);

  const handleGetCalEvents = async () => {
    setIsLoadingCalEvents(true);
    try {
      const accessToken = (session as any)?.accessToken as string;
      const data = await getCalEvents(accessToken);
      setEvents(data.items || []);
    } catch (error) {
      console.error('Error fetching calendar events:', error);
    }
    setIsLoadingCalEvents(false)
  };

  const handleClassifyEvents = async () => {
    setIsLoadingClassification(true);
    try {
      const response = await fetch('/api/calendar/classify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ events, taxonomy }),
      });
      if (!response.ok) {
        throw new Error('Failed to classify events');
      }
      const result = await response.json();
      console.log('Classification result:', result);
      setEvents(result.events);
    } catch (error) {
      console.error('Error classifying events:', error);
    }
    setIsLoadingClassification(false);
  };

  // Compute time blocks based on events.
  const handleComputeBlocks = async () => {
    setIsLoadingComputeBlocks(true);
    try {
      const response = await fetch('/api/calendar/blocks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ events, taxonomy }),
      });
      if (!response.ok) {
        throw new Error('Failed to compute blocks');
      }
      const results = await response.json();
      setBlocks(results.blocks);
    } catch (error) {
      console.error('Error computing blocks:', error);
    }
    setIsLoadingComputeBlocks(false);
  };

  return (
    <div className="space-y-8">
    
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
          Calendar Training
        </h2>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between px-4 py-2">
            <CardTitle>Taxonomy</CardTitle>
            <Button
              variant="ghost"
              onClick={() => setShowTaxonomy(!showTaxonomy)}
              className="p-0"
            >
              {showTaxonomy ? (
                <ChevronUpIcon className="h-4 w-4" />
              ) : (
                <ChevronDownIcon className="h-4 w-4" />
              )}
            </Button>
          </div>
        </CardHeader>
          {showTaxonomy && (
            <CardContent>
              <Textarea
                rows={15}
                defaultValue={taxonomyToText(taxonomy)}
                onChange={(e) => setTaxonomy(textToTaxonomy(e.target.value)) }
              />
            </CardContent>
          )}
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Calendar Events
            <Button onClick={handleClassifyEvents} disabled={isLoadingClassification}>
                  {isLoadingClassification ? <Loader2 className="animate-spin" /> : 'Classify events'}
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Start Time</TableHead>
                <TableHead>Organizer</TableHead>
                <TableHead>Attendees</TableHead>
                <TableHead>Classification</TableHead>
              </TableRow>
            </TableHeader>
              <tr>
                <TableCell colSpan={5} className="text-right">
                  <Button
                    variant="ghost"
                    onClick={() => setShowTableBody(!showTableBody)}
                  >
                    {showTableBody ? <ChevronDownIcon /> : <ChevronUpIcon />}
                  </Button>
                </TableCell>
              </tr>
              {showTableBody && (
                <TableBody>
                  {events.length > 0 ? (
                    events.map((event, index) => (
                      <TableRow key={index}>
                        <TableCell>{event.summary}</TableCell>
                        <TableCell>{event.start.dateTime || event.start.date}</TableCell>
                        <TableCell>{event.organizer.email}</TableCell>
                        <TableCell>
                          {event.attendees
                            ? event.attendees
                                .map((attendee: Attendee) => attendee.email)
                                .join(", ")
                            : "No attendee"}
                        </TableCell>
                        <TableCell>
                          <b>{event.category || ""}</b>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      {isLoadingCalEvents ? (
                        <TableCell colSpan={5}>
                          Loading calendar data...
                          <Loader2 className="animate-spin" />
                        </TableCell>
                      ) : (
                        <TableCell colSpan={5}>No data found. Check console for error.</TableCell>
                      )}
                    </TableRow>
                  )}
                </TableBody>
              )}
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between px-4 py-2">
            <CardTitle>Time blocks</CardTitle>
            <Button onClick={handleComputeBlocks} disabled={isLoadingComputeBlocks}>
                  {isLoadingComputeBlocks ? <Loader2 className="animate-spin" /> : 'Compute blocks'}
            </Button>
            <Button
              variant="ghost"
              onClick={() => setShowBlocks(!showBlocks)}
              className="p-0"
            >
              {showTaxonomy ? (
                <ChevronUpIcon className="h-4 w-4" />
              ) : (
                <ChevronDownIcon className="h-4 w-4" />
              )}
            </Button>
          </div>
        </CardHeader>
          {showBlocks && (
            <CardContent>
              <Textarea
                rows={15}
                value={JSON.stringify(blocks, null, 2)}
                readOnly={true}
              />
            </CardContent>
          )}
      </Card>
      <BlocksCalendar blocks={blocks}/>
    </div>
  );
}
