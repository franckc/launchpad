// Landing page for non logged in users
'use client';

import React from "react";
//import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react";

export default function SignIn() {
  //const router = useRouter()
  return (
    <div
      className="flex items-center justify-center min-h-screen bg-background"
    >
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center">
            Veritai Launchpad
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col space-y-4">
            <Button
              type="submit"
              className="w-full"
              onClick={() => signIn('google', { callbackUrl: '/home' })}
            >
              Sign in with Google
            </Button>
            
            <p className="text-center text-sm text-muted-foreground">
              Don't have an account?{" "}
              <Button
                variant="link"
                className="p-0 h-auto font-normal"
                // Note with next-auth, signIn is used for both sign in and sign up
                onClick={() => signIn('google', { callbackUrl: '/home' })}
              >
                Sign up with Google
              </Button>
            </p>
        </CardContent>
      </Card>
    </div>
  );
}