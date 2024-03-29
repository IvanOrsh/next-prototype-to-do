"use client";

import { signIn } from "next-auth/react";

import { Button } from "./ui/button";

export default function SignInButton() {
  return (
    <Button onClick={() => signIn(undefined, { callbackUrl: "/tasks" })}>
      Sign in
    </Button>
  );
}
