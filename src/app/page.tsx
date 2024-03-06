import { ModeToggle } from "@/components/mode-toggle";
import SignInButton from "@/components/signin-button";
import { Button } from "@/components/ui/button";
import { auth } from "@/lib/auth";

export default async function Home() {
  const session = await auth();

  return (
    <div>
      <ModeToggle />
      {session ? <Button>Go to App</Button> : <SignInButton />}
    </div>
  );
}
