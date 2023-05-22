import {
  Card,
  Col,
  DonutChart,
  Grid,
  Metric,
  Text,
  Title,
} from "@tremor/react";
import { type FC } from "react";

export const Analytics: FC<BuildProcessAnalysis> = ({
  insights,
  efficiency_score,
}) => {
  return (
    <Grid numCols={1} numColsSm={2} numColsLg={3} className="gap-2">
      <Col numColSpan={1} numColSpanLg={1}>
        <section className="flex gap-10">
          {/* build analitycs */}
          <Card>
            <Title>Efficiency Score</Title>
            <DonutChart
              className="mt-6 px-8 text-3xl"
              data={[{ score: efficiency_score }]}
              category="score"
              index="name"
              colors={["green"]}
            />
          </Card>
        </section>
      </Col>
      {insights?.map((insight, idx) => (
        <Card key={idx}>
          <Text>Insight {idx}</Text>
          <Metric>{insight.insight}</Metric>
        </Card>
      ))}
    </Grid>
  );
};
