import { Card, DonutChart, Title } from "@tremor/react";
import { type FC } from "react";

type Data = {
  name: string;
  sales: number;
};

type Props = {
  data: Data[];
};

const valueFormatter = (number: number) =>
  `$ ${Intl.NumberFormat("us").format(number).toString()}`;

export const Analytics: FC<Props> = ({ data }) => {
  return (
    <section className="flex gap-10">
      {/* build analitycs */}
      <Card>
        <Title>Sales</Title>
        <DonutChart
          className="mt-6"
          data={data}
          category="sales"
          index="name"
          valueFormatter={valueFormatter}
          colors={["slate", "violet", "indigo", "rose", "cyan", "amber"]}
        />
      </Card>
      <Card>
        <Title>Sales</Title>
        <DonutChart
          className="mt-6"
          data={data}
          category="sales"
          index="name"
          valueFormatter={valueFormatter}
          colors={["slate", "violet", "indigo", "rose", "cyan", "amber"]}
        />
      </Card>
    </section>
  );
};
