import { Analytics } from "~/components/application/Analytics";
import { TableComponent } from "~/components/application/Table";
import { cities, monorepoData } from "~/data";


export default function Home() {
  return (
    <main className="mx-auto flex w-full max-w-[1000px] flex-col gap-10 p-10">
      
      <TableComponent data={monorepoData} />
    </main>
  );
}
