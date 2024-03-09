"use client";

import { format } from "date-fns";

import type { Task } from "@/types/task";
import { Checkbox } from "./ui/checkbox";
import completeTask from "@/actions/complete-tasks";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Textarea } from "./ui/textarea";
import { updateTask } from "@/actions/update-task";
import { debounce } from "@/lib/debounce";
import { StarFilledIcon, StarIcon } from "@radix-ui/react-icons";
import { cn } from "@/lib/utils";

type TaskListProps = {
  tasks: Task[];
  accentClassName?: string;
};

export default function TaskList({ tasks, accentClassName }: TaskListProps) {
  async function checkTask(task: Task) {
    await completeTask(task.id, !task.isComplete);
  }

  async function updateTitle(task: Task, title: string) {
    const data = {
      title,
    };
    await updateTask(task.id, data);
  }

  async function toggleIsImportant(task: Task) {
    const data = {
      isImportant: !task.isImportant,
    };
    await updateTask(task.id, data);
  }

  async function updateNote(task: Task, note: string) {
    const data = {
      note,
    };
    await updateTask(task.id, data);
  }

  async function handleRemoveFromMyDay(task: Task) {
    const data = {
      addToMyDayAt: null,
    };
    await updateTask(task.id, data);
  }

  async function handleAddToMyDay(task: Task) {
    const data = {
      addToMyDayAt: new Date().toISOString(),
    };
    await updateTask(task.id, data);
  }

  return (
    <div>
      {tasks.map((task) => (
        <div
          key={task.id}
          className="bg-accent mb-0.5 rounded text-foreground flex items-center"
        >
          <div className="p-3">
            <Checkbox
              checked={task.isComplete ? true : false}
              onClick={() => checkTask(task)}
            />
          </div>

          {/* Update Task Drawer */}
          <div className="flex-auto">
            <Drawer>
              <DrawerTrigger
                className={cn(
                  "w-full text-left p-3",
                  task.isComplete && "line-through text-muted-foreground"
                )}
              >
                {task.title}
              </DrawerTrigger>
              <DrawerContent>
                <DrawerHeader>
                  <DrawerTitle>Edit Task</DrawerTitle>
                </DrawerHeader>
                <div className="p-5 flex flex-col gap-5">
                  <Input
                    type="text"
                    name="title"
                    defaultValue={task.title ?? ""}
                    onChange={debounce(
                      (e) => updateTitle(task, e.target.value),
                      500
                    )}
                  />

                  <Textarea
                    placeholder="Add note"
                    name="note"
                    defaultValue={task.note ?? ""}
                    onChange={debounce(
                      (e) => updateNote(task, e.target.value),
                      500
                    )}
                  />

                  {/* Add / Remove to my day */}

                  {task.addedToMyDayAt &&
                  task.addedToMyDayAt > format(new Date(), "yyyy-MM-dd") ? (
                    <Button onClick={() => handleRemoveFromMyDay(task)}>
                      Remove from My Day
                    </Button>
                  ) : (
                    <Button onClick={() => handleAddToMyDay(task)}>
                      Add to My Day
                    </Button>
                  )}
                </div>
              </DrawerContent>
            </Drawer>
          </div>

          {/* isImportant */}
          <Button
            className={cn(accentClassName, `hover:${accentClassName}/50`)}
            variant="ghost"
            onClick={() => toggleIsImportant(task)}
          >
            {task.isImportant ? (
              <StarFilledIcon className="w-6 h-6" />
            ) : (
              <StarIcon className="w-6 h-6" />
            )}
          </Button>
        </div>
      ))}
    </div>
  );
}
