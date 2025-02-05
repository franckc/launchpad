'use client';

import React from "react";
import { Header } from "./(components)/header";
import { Toaster } from "@/components/ui/toaster"
import type { ReactNode } from 'react';
import SessionWrapper from "@/components/session-wrapper";

import "./globals.css";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <SessionWrapper>
      <html>
        <body>
          <div className="min-h-screen bg-background">
            <Header />
            <main className="container mx-auto p-6">
              {children}
              <Toaster />
            </main>
          </div>
        </body>
      </html>
    </SessionWrapper>
  );
}
