"use client";

import { useState } from "react";

import { PlusIcon } from "@radix-ui/react-icons";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { createTask } from "@/actions/create-task";
import type { CreateTaskSchema } from "@/actions/create-task";
import { cn } from "@/lib/utils";

type AddTaskProps = {
  className?: string;
  isImportant: boolean;
  isMyDay?: boolean;
};

export default function AddTask(props: AddTaskProps) {
  const { className, isImportant, isMyDay } = props;

  const [isAdding, setIsAdding] = useState(false);
  const [title, setTitle] = useState("");

  async function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter") {
      const data: CreateTaskSchema = {
        title,
        isImportant: isImportant ? true : false,
      };

      if (isMyDay) {
        data.addedToMyDayAt = new Date().toISOString();
      }
      await createTask(data);
      setIsAdding(false);
      setTitle("");
    }
  }

  return (
    <div>
      {isAdding ? (
        <Input
          type="text"
          name="title"
          placeholder="Try adding pay utilities by Friday 6pm"
          onKeyDown={handleKeyDown}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onBlur={() => setIsAdding(false)}
          className="text-accent-foreground"
        />
      ) : (
        <Button className={cn(className)} onClick={() => setIsAdding(true)}>
          <PlusIcon /> Add Task
        </Button>
      )}
    </div>
  );
}
