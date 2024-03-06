import { ReactNode } from "react";

import { auth } from "@/lib/auth";
import SessionProvider from "@/components/providers/session-provider";

export default async function Layout({ children }: { children: ReactNode }) {
  const session = await auth();

  return <SessionProvider session={session}>{children}</SessionProvider>;
}
