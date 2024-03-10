"use server";

import { revalidatePath } from "next/cache";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { tasks } from "@/lib/schema";

export type CreateTaskSchema = {
  title: string;
  isImportant: boolean;
  addedToMyDayAt?: string;
};

export async function createTask(data: CreateTaskSchema) {
  const session = await auth();

  if (!session) {
    return {
      message: "unauthenticated",
    };
  }

  const dataToInsert = {
    userId: session.user.id,
    title: data.title,
    isImportant: data.isImportant,
    addedToMyDayAt: data.addedToMyDayAt,
  };

  await db.insert(tasks).values(dataToInsert);

  // important!
  revalidatePath("/tasks");
}
