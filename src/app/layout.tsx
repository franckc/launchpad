'use client';

import React from "react";
import { Header } from "./(components)/header";
import "./globals.css";

import type { ReactNode } from 'react';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html>
        <body>
            <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto p-6">
        {children}
      </main>
    </div>
        </body>
    </html>

  );
}
