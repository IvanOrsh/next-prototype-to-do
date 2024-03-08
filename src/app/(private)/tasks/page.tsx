import { TaskList } from "@/components/task-list";
import { db } from "@/lib/db";
import AddTask from "@/components/add-task";

export default async function TasksPage() {
  const res = await db.query.tasks.findMany();

  return (
    <div className="flex flex-col  text-accent-blue-foreground p-5">
      <h1 className="font-bold text-3xl">Tasks</h1>
      {res.length > 0 ? (
        <TaskList tasks={res} />
      ) : (
        <div>
          Tasks show up here if they aren&apos;t part of any lists you&apos;ve
          created
        </div>
      )}

      <div>Completed Tasks</div>

      <div>
        <AddTask />
      </div>
    </div>
  );
}
