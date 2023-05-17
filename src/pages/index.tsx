import { Frown } from "lucide-react";
import Link from "next/link";
import { TableComponent } from "~/components/application/Table";
import { Button } from "~/components/ui/Button";
import { monorepoData } from "~/data";
import { env } from "~/env.mjs";

export default function Home() {
  return (
    <main className="mx-auto flex w-full max-w-[1000px] flex-col gap-10 p-10">
      <section className="bg-dots flex h-[200px] w-full items-center justify-center rounded-lg border">
        <Button variant="secondary" className="gap-4 border" asChild>
          <Link
            href={`https://github.com/login/oauth/authorize?client_id=${env.NEXT_PUBLIC_CLIENT_ID}`}
            className="gap-4 border"
          >
            <Frown />
            Click to install the Github App
          </Link>
        </Button>
      </section>
      <TableComponent data={monorepoData} />
    </main>
  );
}
