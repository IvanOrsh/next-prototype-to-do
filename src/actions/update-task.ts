"use server";

import { and, eq } from "drizzle-orm";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { tasks } from "@/lib/schema";
import { revalidatePath } from "next/cache";

export type UpdateTaskSchema = {
  title: string;
  note: string;
  isImportant: boolean;
  addedToMyDayAt: string | null;
};

export async function updateTask(id: number, data: Partial<UpdateTaskSchema>) {
  const session = await auth();

  if (!session) {
    return {
      message: "unauthenticated",
    };
  }

  const update = {
    title: data.title,
    note: data.note,
    isImportant: data.isImportant,
    addedToMyDayAt: data.addedToMyDayAt,
  };

  await db
    .update(tasks)
    .set(update)
    .where(and(eq(tasks.id, id), eq(tasks.userId, session.user.id)));

  revalidatePath("/tasks");
}
