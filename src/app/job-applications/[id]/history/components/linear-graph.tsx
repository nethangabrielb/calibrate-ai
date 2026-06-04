"use client";

import { TrendingUp } from "lucide-react";
import ReactDOM from "react-dom";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";

import React from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

import { HistoryVersion, getHistoryScoreDelta } from "@/lib/history";

type ResumeAnalysisLineGraphProps = {
  versions: HistoryVersion[];
};

const chartConfig = {
  score: {
    label: "Resume score",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

export function ResumeAnalysisLineGraph({
  versions,
}: ResumeAnalysisLineGraphProps) {
  const chartData = versions
    .slice()
    .reverse()
    .map((version) => ({
      version: version.versionLabel,
      score: version.score,
      resume: version.resumeLabel,
      uploadedAt: version.uploadedAtLabel,
    }));

  const [hover, setHover] = React.useState<{
    x: number;
    y: number;
    label: string;
  } | null>(null);

  // Default dot: small circle only. Active (hovered) dot: circle + resume label.
  const renderDot = (props: any) => {
    const { cx, cy } = props ?? {};

    if (cx == null || cy == null) return null;

    return (
      <circle
        cx={cx}
        cy={cy}
        r={3.5}
        fill="var(--color-score)"
        stroke="transparent"
      />
    );
  };

  const renderActiveDot = (props: any) => {
    const { cx, cy, payload } = props ?? {};

    if (cx == null || cy == null || !payload) return null;

    const label = payload.resume ?? "";

    return (
      <g
        onMouseEnter={(e: any) =>
          setHover({ x: e.clientX, y: e.clientY, label })
        }
        onMouseLeave={() => setHover(null)}
        onMouseMove={(e: any) =>
          setHover({ x: e.clientX, y: e.clientY, label })
        }
      >
        <circle
          cx={cx}
          cy={cy}
          r={5}
          fill="var(--color-score)"
          stroke="transparent"
        />
      </g>
    );
  };

  const latestVersion = versions[0];
  const previousVersion = versions[1];
  const scoreDelta = latestVersion
    ? getHistoryScoreDelta(latestVersion.score, previousVersion?.score)
    : null;

  return (
    <Card className="overflow-hidden border-border/70 bg-background shadow-sm">
      <CardHeader>
        <CardTitle>Resume score progression</CardTitle>
        <CardDescription>
          Track how the latest resume versions performed across analyses.
        </CardDescription>
      </CardHeader>

      <CardContent className="isolate z-9">
        <div className="relative">
          <ChartContainer config={chartConfig} className="h-60 w-full">
            <LineChart
              accessibilityLayer
              data={chartData}
              margin={{ left: 12, right: 12, top: 12, bottom: 12 }}
            >
              <CartesianGrid vertical={false} strokeOpacity={0.35} />
              <XAxis
                dataKey="version"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value) =>
                  String(value).replace("Version ", "V")
                }
              />
              <YAxis
                domain={[0, 100]}
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                width={32}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent labelKey="resume" />}
              />
              <Line
                dataKey="score"
                type="monotone"
                stroke="var(--color-score)"
                strokeWidth={2.5}
                dot={renderDot}
                activeDot={renderActiveDot}
              />
            </LineChart>
          </ChartContainer>

          {hover
            ? ReactDOM.createPortal(
                <div
                  aria-hidden
                  className="pointer-events-none rounded-md border border-border/50 bg-background px-2 py-0.5 text-xs text-muted-foreground shadow-md"
                  style={{
                    position: "fixed",
                    left: hover.x,
                    top: hover.y - 12,
                    transform: "translate(-50%, -100%)",
                    whiteSpace: "nowrap",
                    zIndex: 9999,
                  }}
                >
                  {hover.label}
                </div>,
                document.body,
              )
            : null}
        </div>
      </CardContent>

      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 leading-none font-medium">
          {scoreDelta ? (
            <>
              {scoreDelta.label} since the previous version
              <TrendingUp className="h-4 w-4" />
            </>
          ) : (
            <>
              Latest resume analysis <TrendingUp className="h-4 w-4" />
            </>
          )}
        </div>
        <div className="leading-none text-muted-foreground">
          {latestVersion
            ? `Latest version ${latestVersion.versionLabel} uploaded ${latestVersion.uploadedAtLabel}.`
            : "No resume analysis data yet."}
        </div>
      </CardFooter>
    </Card>
  );
}
