"use client";

import { useState } from "react";

import type { Task } from "@/types/task";
import { Button } from "./ui/button";
import { ChevronDownIcon, ChevronRightIcon } from "@radix-ui/react-icons";
import TaskList from "./task-list";

type TaskListCompletedProps = {
  tasks: Task[];
  accentClassName?: string;
};

export default function TaskListCompleted({
  tasks,
  accentClassName,
}: TaskListCompletedProps) {
  const [open, setOpen] = useState(false);

  return (
    <div>
      {open ? (
        <div className="flex flex-col gap-5">
          <div>
            <Button
              className="text-accent-blue-foreground bg-accent hover:bg-accent/50"
              onClick={() => setOpen(!open)}
            >
              <ChevronDownIcon className="mr-2" /> Completed
            </Button>
          </div>
          <TaskList tasks={tasks} accentClassName={accentClassName} />
        </div>
      ) : (
        <Button
          className="text-accent-blue-foreground bg-accent hover:bg-accent/50"
          onClick={() => setOpen(!open)}
        >
          <ChevronRightIcon className="mr-2" /> Completed
        </Button>
      )}
    </div>
  );
}
