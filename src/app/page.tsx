import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Page() {
  return (
    <main className="min-h-screen w-full flex gap-2 items-center justify-center">
      <Link href="/login">
        <Button>
          Login
        </Button>
      </Link>
      <Link href="/sign-up">
        <Button variant="secondary">
          Sign up
        </Button>
      </Link>
    </main>
  )
}