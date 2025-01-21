'use client';

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  FileIcon,
  ImageIcon,
  MailIcon,
  DatabaseIcon,
  TableIcon,
  BoxIcon,
} from "lucide-react";

export function ConnectedServices() {
  const services = [
    { name: "Google Docs", icon: FileIcon, connected: true },
    { name: "Photos", icon: ImageIcon, connected: true },
    { name: "Dropbox", icon: BoxIcon, connected: false },
    { name: "Gmail", icon: MailIcon, connected: true },
    { name: "Database", icon: DatabaseIcon, connected: true },
    { name: "Sheets", icon: TableIcon, connected: false },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">
          Connected Services
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4"
        >
          {services.map((service, index) => (
            <div
              key={service.name}
              className="flex flex-col items-center space-y-2 p-4 rounded-lg border bg-card"
              id={`jqo5ym_${index}`}
            >
              <service.icon
                className="h-8 w-8 text-muted-foreground"
                id={`lowluh_${index}`}
              />
              <span className="text-sm font-medium" id={`kjj1w6_${index}`}>
                {service.name}
              </span>
              <Badge
                variant={service.connected ? "default" : "secondary"}
                className="mt-2"
                id={`fkqrqg_${index}`}
              >
                {service.connected ? "Connected" : "Disconnected"}
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
