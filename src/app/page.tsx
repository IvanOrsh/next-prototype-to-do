import Link from "next/link";
import { ArrowRightIcon } from "@radix-ui/react-icons";

import { ModeToggle } from "@/components/mode-toggle";
import SignInButton from "@/components/signin-button";
import { Button } from "@/components/ui/button";
import { auth } from "@/lib/auth";

export default async function Home() {
  const session = await auth();

  return (
    <div className="flex h-screen w-screen justify-center items-center">
      <div className="flex flex-col gap-5 text-center">
        <ModeToggle />

        <h1>To Do Prototype</h1>

        <div>
          {session ? (
            <Link href="/tasks">
              <Button>
                Go to App <ArrowRightIcon className="ml-2" />
              </Button>
            </Link>
          ) : (
            <SignInButton />
          )}
        </div>
      </div>
    </div>
  );
}
