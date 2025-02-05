"use client";

import React from 'react';
import { redirect } from 'next/navigation'
import { useSession, signIn, signOut } from "next-auth/react"

import HomePage from './home/page';

export default function Home() {

  // extracting data from usesession as session
  const { data: session } = useSession()

  // checking if sessions exists
  if (!session) {
    redirect('/landing')
  }

  // Render the home page for logged in users
  return (
    <div>
      <HomePage />
    </div>
  )
}