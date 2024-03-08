"use client";

import { useState } from "react";

import { Checkbox } from "./ui/checkbox";
import type { Task } from "@/types/task";
import { Button } from "./ui/button";
import { ChevronDownIcon, ChevronRightIcon } from "@radix-ui/react-icons";
import TaskList from "./task-list";

type TaskListCompletedProps = {
  tasks: Task[];
};

export default function TaskListCompleted({ tasks }: TaskListCompletedProps) {
  const [open, setOpen] = useState(false);

  return (
    <div>
      {open ? (
        <div>
          <Button onClick={() => setOpen(!open)}>
            <ChevronDownIcon /> Completed
          </Button>
          <TaskList tasks={tasks} />
        </div>
      ) : (
        <Button onClick={() => setOpen(!open)}>
          <ChevronRightIcon /> Completed
        </Button>
      )}
    </div>
  );
}
