"use client";

import React from 'react';
import { redirect } from 'next/navigation'
import { useSession, signIn, signOut } from "next-auth/react"

import HomePage from './home/page';

export default function Home() {

  // Check the user's authenticaton status
  const { data: session, status } = useSession()
  if (status === "loading") {
    return <p>Loading...</p>
  }
  if (status === "unauthenticated") {
    redirect('/landing')
  }

  // Render the home page for logged in users
  return (
    <div>
      <HomePage />
    </div>
  )
}