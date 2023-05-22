import { Card, Col, DonutChart, Grid, Title } from "@tremor/react";
import { type FC } from "react";
import {
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  Card as CardUI,
} from "~/components/ui/Card";
import { Separator } from "~/components/ui/Separator";
import { Badge } from "../ui/Badge";

export const Analytics: FC<BuildProcessAnalysis> = ({
  insights,
  efficiency_score,
}) => {
  return (
    <Grid numCols={1} numColsSm={2} numColsLg={3} className="gap-2">
      <Col numColSpan={1} numColSpanLg={1}>
        <section className="flex gap-10">
          {/* build analitycs */}
          <Card className="h-full">
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
        <CardUI key={idx + 1} className="w-full">
          <CardHeader>
            <CardTitle>Insight {idx + 1}</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-2 px-4">
              {insight.positive_message
                ? <p className="font-semibold text-green-700">{insight.insight}</p>
                : <p className="font-semibold text-red-700">{insight.insight}</p>}
            <Separator />
            <p className="text-sm font-medium">
              {insight.positive_message
                ? insight.positive_message
                : insight.solution}
            </p>
          </CardContent>
          <CardFooter>
            {insight.positive_message ? (
              <Badge
                variant="secondary"
                className="bg-green-300 shadow-md shadow-green-500"
              >
                Positive
              </Badge>
            ) : (
              <Badge
                variant="secondary"
                className="bg-red-300 shadow-md shadow-red-500"
              >
                Negative
              </Badge>
            )}
          </CardFooter>
        </CardUI>
      ))}
    </Grid>
  );
};
