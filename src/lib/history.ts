import { formatDate } from "@/lib/data";

import { Analysis } from "@/types/analysis";

export type HistoryResume = {
  id: number;
  name: string;
  createdAt: string | Date;
};

export type HistoryAnalysis = Analysis & {
  resume?: HistoryResume | null;
  resumes: HistoryResume[];
};

export type HistoryVersion = HistoryAnalysis & {
  versionLabel: string;
  resumeLabel: string;
  uploadedAtLabel: string;
  scoreDeltaLabel: string | null;
  scoreDeltaClassName: string | null;
};

export type HistoryTrendPoint = {
  x: number;
  y: number;
  score: number;
};

export type HistoryTrendData = {
  points: HistoryTrendPoint[];
  linePath: string;
  areaPath: string;
};

export type HistoryComparisonSummary = {
  label: string;
  description: string;
  toneClassName: string;
  scoreDelta: number | null;
};

export const normalizeHistoryDate = (date: string | Date) => {
  return date instanceof Date ? date : new Date(date);
};

export const formatHistoryDate = (date?: string | Date | null) => {
  if (!date) {
    return "Not available";
  }

  return formatDate(normalizeHistoryDate(date));
};

export const getHistoryScoreDelta = (
  currentScore: number,
  previousScore?: number,
) => {
  if (typeof previousScore !== "number") {
    return null;
  }

  const delta = currentScore - previousScore;

  if (delta === 0) {
    return { label: "No change", className: "text-muted-foreground" };
  }

  return {
    label: `${delta > 0 ? "+" : ""}${delta}`,
    className:
      delta > 0 ? "text-emerald-600 dark:text-emerald-400" : "text-destructive",
  };
};

export const buildHistoryVersions = (
  history: HistoryAnalysis[],
): HistoryVersion[] => {
  return history.map((analysis, index) => {
    const previousAnalysis = history[index + 1];
    const scoreDelta = getHistoryScoreDelta(
      analysis.score,
      previousAnalysis?.score,
    );
    const resume = analysis.resume ?? analysis.resumes[0];

    return {
      ...analysis,
      versionLabel: `Version ${history.length - index}`,
      resumeLabel: resume?.name ?? `Resume version ${history.length - index}`,
      uploadedAtLabel: formatHistoryDate(resume?.createdAt),
      scoreDeltaLabel: scoreDelta?.label ?? null,
      scoreDeltaClassName: scoreDelta?.className ?? null,
    };
  });
};

export const buildHistoryTrendData = (
  versions: HistoryVersion[],
): HistoryTrendData => {
  const points = versions
    .slice()
    .reverse()
    .map((version, index) => ({
      x: versions.length > 1 ? (index / (versions.length - 1)) * 100 : 50,
      y: 100 - Math.max(0, Math.min(100, version.score)),
      score: version.score,
    }));

  const linePath = points
    .map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`)
    .join(" ");

  const areaPath = points.length ? `${linePath} L 100 100 L 0 100 Z` : "";

  return {
    points,
    linePath,
    areaPath,
  };
};

export const getDefaultCompareVersionIds = (versions: HistoryVersion[]) => {
  if (versions.length < 2) {
    return null;
  }

  return [String(versions[0].id), String(versions[1].id)] as const;
};

export const getComparisonPairFromVersion = (
  versions: HistoryVersion[],
  versionId: string,
) => {
  const currentVersion = versions.find(
    (version) => String(version.id) === versionId,
  );

  if (!currentVersion) {
    return getDefaultCompareVersionIds(versions)
      ? {
          leftVersionId: String(versions[0].id),
          rightVersionId: String(
            versions.find((version) => version.id !== versions[0].id)?.id ??
              versions[0].id,
          ),
        }
      : { leftVersionId: "", rightVersionId: "" };
  }

  const fallbackVersion = versions.find(
    (version) => version.id !== currentVersion.id,
  );

  return {
    leftVersionId: String(currentVersion.id),
    rightVersionId: fallbackVersion
      ? String(fallbackVersion.id)
      : String(currentVersion.id),
  };
};

export const getHistoryComparisonSummary = (
  left?: HistoryVersion,
  right?: HistoryVersion,
): HistoryComparisonSummary => {
  if (!left || !right) {
    return {
      label: "Pick two versions to compare",
      description: "Select a left and right version to inspect the difference.",
      toneClassName: "text-muted-foreground",
      scoreDelta: null,
    };
  }

  if (left.id === right.id) {
    return {
      label: "Select two different versions",
      description: "A compare view needs two distinct resume versions.",
      toneClassName: "text-muted-foreground",
      scoreDelta: null,
    };
  }

  const scoreDelta = right.score - left.score;

  if (scoreDelta === 0) {
    return {
      label: "No score change",
      description: "The selected versions produced the same score.",
      toneClassName: "text-muted-foreground",
      scoreDelta,
    };
  }

  const toneClassName =
    scoreDelta > 0
      ? "text-emerald-600 dark:text-emerald-400"
      : "text-destructive";

  return {
    label:
      scoreDelta > 0
        ? `+${scoreDelta} improvement`
        : `${scoreDelta} regression`,
    description:
      scoreDelta > 0
        ? "The right version is scoring better than the left version."
        : "The right version is scoring lower than the left version.",
    toneClassName,
    scoreDelta,
  };
};
