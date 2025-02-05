'use client';

import React from "react";
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function SignUp() {
  const router = useRouter()

  const handleSubmit = (e: any) => {
    e.preventDefault();
    // Add sign-up logic here
    router.push("/");
  };

  return (
    <div
      className="flex items-center justify-center min-h-screen bg-background"
    >
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center">
            Sign Up
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">
                Email
              </Label>
              <Input
                type="email"
                placeholder="Enter your email"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">
                Password
              </Label>
              <Input
                type="password"
                placeholder="Enter your password"
                required
              />
            </div>
            <Button type="submit" className="w-full">
              Sign Up
            </Button>
            <Button
              type="button"
              className="w-full mt-2"
              onClick={() => signIn('google')}
            >
              Sign Up with Google
            </Button>
            <p
              className="text-center text-sm text-muted-foreground"
            >
              Already have an account?{" "}
              <Button
                variant="link"
                className="p-0 h-auto font-normal"
                onClick={() => router.push("/sign-in")}
              >
                Sign in
              </Button>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
