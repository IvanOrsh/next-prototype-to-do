import TaskList from "@/components/task-list";
import { db } from "@/lib/db";
import AddTask from "@/components/add-task";
import { and, eq } from "drizzle-orm";
import { tasks } from "@/lib/schema";
import { auth } from "@/lib/auth";
import TaskListCompleted from "@/components/task-list-completed";

export default async function TasksPage() {
  const session = await auth();

  const res = await db.query.tasks.findMany({
    where: and(eq(tasks.userId, session!.user.id), eq(tasks.isComplete, false)),
  });

  const resCompleted = await db.query.tasks.findMany({
    where: and(eq(tasks.userId, session!.user.id), eq(tasks.isComplete, true)),
  });

  return (
    <div className="flex flex-col  text-accent-blue-foreground p-5 gap-5">
      <h1 className="font-bold text-3xl">Tasks</h1>
      {/* All Tasks */}
      {res.length > 0 ? (
        <TaskList tasks={res} accentClassName="text-accent-blue-foreground" />
      ) : (
        <div>
          Tasks show up here if they aren&apos;t part of any lists you&apos;ve
          created
        </div>
      )}

      {/* Completed Tasks */}
      {resCompleted.length > 0 ? (
        <TaskListCompleted
          tasks={resCompleted}
          accentClassName="text-accent-blue-foreground"
        />
      ) : null}

      <div>
        <AddTask className="text-accent-blue-foreground bg-accent hover:bg-accent/50" />
      </div>
    </div>
  );
}
