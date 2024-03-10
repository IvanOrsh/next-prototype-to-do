import TaskList from "@/components/task-list";
import { db } from "@/lib/db";
import AddTask from "@/components/add-task";
import { and, eq, gte } from "drizzle-orm";
import { tasks } from "@/lib/schema";
import { auth } from "@/lib/auth";
import TaskListCompleted from "@/components/task-list-completed";
import { format, startOfDay } from "date-fns";

export default async function MyDayPage() {
  const session = await auth();

  const res = await db.query.tasks.findMany({
    where: and(
      eq(tasks.userId, session!.user.id),
      eq(tasks.isComplete, false),
      gte(tasks.addedToMyDayAt, startOfDay(new Date()).toISOString()),
    )
  });

  const resCompleted = await db.query.tasks.findMany({
    where: and(
      eq(tasks.userId, session!.user.id),
      eq(tasks.isComplete, true),
      gte(tasks.addedToMyDayAt, startOfDay(new Date()).toISOString()),
    ),
  });

  return (
    <div className="flex flex-col  text-accent-green-foreground p-5 gap-5">
      <h1 className="font-bold text-3xl">My Day</h1>
      {/* All Tasks */}
      {res.length > 0 ? (
        <TaskList tasks={res} accentClassName="text-accent-green-foreground" />
      ) : (
        <div>Tasks for today</div>
      )}

      {/* Completed Tasks */}
      {resCompleted.length > 0 ? (
        <TaskListCompleted tasks={resCompleted}
          accentClassName="text-accent-green-foreground"
        />
      ) : null}

      <div>
        <AddTask
          isImportant={true}
          isMyDay={true}
          className="text-accent-green-foreground bg-accent hover:bg-accent/50" />
      </div>
    </div>
  );
}
