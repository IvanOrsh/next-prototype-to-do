import TaskList from "@/components/task-list";
import { db } from "@/lib/db";
import AddTask from "@/components/add-task";
import { and, eq } from "drizzle-orm";
import { tasks } from "@/lib/schema";
import { auth } from "@/lib/auth";
import TaskListCompleted from "@/components/task-list-completed";

export default async function ImportantPage() {
  const session = await auth();

  const res = await db.query.tasks.findMany({
    where: and(eq(tasks.userId, session!.user.id), eq(tasks.isComplete, false), eq(tasks.isImportant, true)),
  });

  const resCompleted = await db.query.tasks.findMany({
    where: and(eq(tasks.userId, session!.user.id), eq(tasks.isComplete, true), eq(tasks.isImportant, true)),
  });

  return (
    <div className="flex flex-col  text-accent-pink-foreground p-5 gap-5">
      <h1 className="font-bold text-3xl">Important</h1>
      {/* All Tasks */}
      {res.length > 0 ? (
        <TaskList tasks={res} accentClassName="text-accent-pink-foreground" />
      ) : (
        <div>Try starring some tasks to see them here...</div>
      )}

      {/* Completed Tasks */}
      {resCompleted.length > 0 ? (
        <TaskListCompleted
          tasks={resCompleted}
          accentClassName="text-accent-pink-foreground"
        />
      ) : null}

      <div>
        <AddTask isImportant={true} className="text-accent-pink-foreground bg-accent hover:bg-accent/50" />
      </div>
    </div>
  );
}
