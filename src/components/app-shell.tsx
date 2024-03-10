"use client";

import { PropsWithChildren, useState } from "react";
import { usePathname } from "next/navigation";
import { ChevronLeftIcon } from "@radix-ui/react-icons";

import { cn } from "@/lib/utils";
import Header from "./header";
import Sidebar from "./sidebar";
import { Button } from "./ui/button";
import type { TaskCounts } from "@/types/task-count";

type AppShellProps = {
  taskCounts: TaskCounts,
}

export default function AppShell({ children, taskCounts }: PropsWithChildren<AppShellProps>) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-12">
      <div className="sm:col-span-12">
        <Header />
      </div>
      <div
        className={cn(
          "w-full h-full",
          "bg-background",
          "absolute top-20 left-0",
          "transition delay-200",
          "sm:col-span-3 sm:relative sm:top-0 sm:left-0 sm:transform-none",
          "-translate-x-full",
          open && "translate-x-0"
        )}
      >
        <Sidebar taskCounts={taskCounts} onClick={() => setOpen(false)} />
      </div>

      <div className="sm:hidden mt-5">
        <Button
          className={cn(
            pathname === "/tasks" && "text-accent-blue-foreground",
            pathname === "/myday" && "text-accent-green-foreground",
            pathname === "/important" && "text-accent-pink-foreground"
          )}
          variant="link"
          onClick={() => setOpen(true)}
        >
          <ChevronLeftIcon className="w-6 h-6" /> Lists
        </Button>
      </div>
      <div className="sm:col-span-9">{children}</div>
    </div>
  );
}
