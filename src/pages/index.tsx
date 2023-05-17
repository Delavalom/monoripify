import { Analytics } from "~/components/application/Analytics";
import { TableComponent } from "~/components/application/Table";
import { cities, monorepoData } from "~/data";

const valueFormatter = (number: number) =>
  `$ ${Intl.NumberFormat("us").format(number).toString()}`;

export default function Home() {
  return (
    <main className="mx-auto flex w-full max-w-[1000px] flex-col gap-10 p-10">
      <Analytics data={cities} valueFormatter={valueFormatter} />
      <TableComponent data={monorepoData} />
    </main>
  );
}
