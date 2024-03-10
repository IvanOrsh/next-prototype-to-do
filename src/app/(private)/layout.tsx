import { ReactNode } from "react";
import { redirect } from "next/navigation";
import { startOfDay } from "date-fns";
import { and, count, eq, gte } from "drizzle-orm";

import { auth } from "@/lib/auth";
import SessionProvider from "@/components/providers/session-provider";
import AppShell from "@/components/app-shell";
import { db } from "@/lib/db";
import { tasks } from "@/lib/schema";
import type { TaskCounts } from "@/types/task-count";

export default async function Layout({ children }: { children: ReactNode }) {
  const session = await auth();

  if (!session) {
    redirect("/");
  }

  const myDayCount = await db
    .select({ value: count() })
    .from(tasks)
    .where(
      and(
        eq(tasks.userId, session?.user.id!),
        gte(tasks.addedToMyDayAt, startOfDay(new Date()).toISOString()),
        eq(tasks.isComplete, false)
      )
    );

  const importantCount = await db
    .select({ value: count() })
    .from(tasks)
    .where(
      and(
        eq(tasks.userId, session?.user.id!),
        eq(tasks.isImportant, true),
        eq(tasks.isComplete, false)
      )
    );

  const tasksCount = await db
    .select({ value: count() })
    .from(tasks)
    .where(
      and(
        eq(tasks.userId, session?.user.id!),
        eq(tasks.isComplete, false)
      )
    );

  const taskCounts: TaskCounts = {
    important: importantCount[0].value,
    myDay: myDayCount[0].value,
    tasks: tasksCount[0].value
  };


  return (
    <SessionProvider session={session}>
      <AppShell taskCounts={taskCounts}>{children}</AppShell>
    </SessionProvider>
  );
}
