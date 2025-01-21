'use client';

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ChevronDownIcon,
  ChevronUpIcon,
  MessageSquareIcon,
} from "lucide-react";

export function AgentInbox() {
  const [expandedItem, setExpandedItem] = useState(0);

  const inboxItems = [
    {
      id: 1,
      agentName: "Data Analysis Agent",
      type: "OUTPUT",
      content: "Analysis complete: Found 3 anomalies in the dataset",
      timestamp: "2 minutes ago",
      status: "RUNNING",
    },
    {
      id: 2,
      agentName: "Email Assistant",
      type: "WAITING_FOR_FEEDBACK",
      content: "Should I proceed with sending the weekly newsletter?",
      timestamp: "5 minutes ago",
      status: "WAITING_FOR_FEEDBACK",
    },
    {
      id: 3,
      agentName: "Document Processor",
      type: "ACTIVITY",
      content: "Processing new documents from Google Drive",
      timestamp: "1 hour ago",
      status: "SCHEDULED",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "RUNNING":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-400";
      case "SCHEDULED":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-400";
      case "WAITING_FOR_FEEDBACK":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-400";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <MessageSquareIcon className="h-5 w-5" />
          <span>Agent Inbox</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {inboxItems.map((item, index) => (
            <Card
              key={item.id}
              className="border shadow-sm"
              id={`xdt701_${index}`}
            >
              <CardContent className="p-4" id={`qmrjcp_${index}`}>
                <div
                  className="flex items-start justify-between"
                  id={`4hoym4_${index}`}
                >
                  <div className="space-y-2" id={`r5o1d1_${index}`}>
                    <div
                      className="flex items-center space-x-2"
                      id={`ps0nzr_${index}`}
                    >
                      <h3 className="font-medium" id={`w2sb3j_${index}`}>
                        {item.agentName}
                      </h3>
                      <Badge
                        className={getStatusColor(item.status)}
                        id={`z3jfa9_${index}`}
                      >
                        {item.type}
                      </Badge>
                    </div>
                    <p
                      className="text-sm text-muted-foreground"
                      id={`ck8iwf_${index}`}
                    >
                      {expandedItem === item.id
                        ? item.content
                        : `${item.content.slice(0, 60)}...`}
                    </p>
                    <p
                      className="text-xs text-muted-foreground"
                      id={`6h340q_${index}`}
                    >
                      {item.timestamp}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      setExpandedItem(expandedItem === item.id ? 0 : item.id)
                    }
                    id={`794urf_${index}`}
                  >
                    {expandedItem === item.id ? (
                      <ChevronUpIcon
                        className="h-4 w-4"
                        id={`zs05hn_${index}`}
                      />
                    ) : (
                      <ChevronDownIcon
                        className="h-4 w-4"
                        id={`g597sc_${index}`}
                      />
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
