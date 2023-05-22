import { Frown, Github, Loader2 } from "lucide-react";
import { signIn, useSession } from "next-auth/react";
import Link from "next/link";
import { TableComponent } from "~/components/application/Table";
import { Button } from "~/components/ui/Button";
import { monorepoData } from "~/data";

export default function Home() {
  const session = useSession();

  return (
    <main className="mx-auto flex w-full max-w-[1000px] flex-col gap-10 p-10">
      <section className="bg-dots flex h-[200px] w-full items-center justify-center rounded-lg border">
        {session.status === "authenticated" ? (
          <Button variant="secondary" className="gap-4 border" asChild>
            <Link
              href={`https://github.com/apps/monoripify/installations/new/permissions?target_id=${session.data.user.id}`}
              className="gap-4 border"
            >
              <Frown />
              Click to install the Github App
            </Link>
          </Button>
        ) : session.status === "loading" ? (
          <Button
            variant="secondary"
            className="border"
            onClick={() => signIn("github")}
            disabled
          >
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Please wait
          </Button>
        ) : (
          <Button
            variant="secondary"
            className="border"
            onClick={() => signIn("github")}
          >
            <Github className="mr-2 h-4 w-4" /> Sign In
          </Button>
        )}
      </section>
      <TableComponent data={monorepoData} />
    </main>
  );
}
