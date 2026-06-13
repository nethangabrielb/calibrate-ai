"use client";

import { useEffect, useMemo, useState } from "react";

import {
  HistoryAnalysis,
  buildHistoryVersions,
  getComparisonPairFromVersion,
  getDefaultCompareVersionIds,
} from "@/lib/history";

import { Analysis } from "@/types/analysis";
import { Application } from "@/types/application";

import { HistoryComparePanel } from "./history-compare-panel";
import { HistoryPageHeader } from "./history-page-header";
import { HistoryTimeline } from "./history-timeline";
import { HistoryTrendCard } from "./history-trend-card";

type HistoryPageProps = {
  application: Application;
  analyses: Analysis[];
  applicationId: string;
};

export const HistoryPage = ({
  application,
  analyses,
  applicationId,
}: HistoryPageProps) => {
  const versions = useMemo(
    () => buildHistoryVersions(analyses as HistoryAnalysis[]),
    [analyses],
  );

  const [leftVersionId, setLeftVersionId] = useState<string>("");
  const [rightVersionId, setRightVersionId] = useState<string>("");

  useEffect(() => {
    if (versions.length === 0) {
      setLeftVersionId("");
      setRightVersionId("");
      return;
    }

    const defaults = getDefaultCompareVersionIds(versions);

    if (!defaults) {
      return;
    }

    const [defaultLeft, defaultRight] = defaults;

    const leftExists = versions.some(
      (version) => String(version.id) === leftVersionId,
    );
    const rightExists = versions.some(
      (version) => String(version.id) === rightVersionId,
    );

    if (!leftVersionId || !leftExists) {
      setLeftVersionId(defaultLeft);
    }

    if (!rightVersionId || !rightExists || leftVersionId === rightVersionId) {
      setRightVersionId(defaultRight);
    }
  }, [leftVersionId, rightVersionId, versions]);

  const handleCompareFromHere = (versionId: number) => {
    const selection = getComparisonPairFromVersion(versions, String(versionId));

    setLeftVersionId(selection.leftVersionId);
    setRightVersionId(selection.rightVersionId);
  };

  return (
    <>
      <HistoryPageHeader
        application={application}
        versionCount={versions.length}
        latestScore={versions[0]?.score}
        analysisHref={`/job-applications/${applicationId}`}
        applicationsHref="/job-applications"
      />

      <div className="grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="flex flex-col gap-4">
          <HistoryTrendCard versions={versions} />
        </div>

        <div className="xl:col-start-2 xl:row-start-1 xl:row-span-2">
          <HistoryComparePanel
            versions={versions}
            leftVersionId={leftVersionId}
            rightVersionId={rightVersionId}
            onLeftVersionIdChange={setLeftVersionId}
            onRightVersionIdChange={setRightVersionId}
          />
        </div>

        <div className="flex flex-col gap-4">
          <HistoryTimeline
            versions={versions}
            onCompareFromHere={handleCompareFromHere}
            jobDescription={application.description}
            applicationId={applicationId}
          />
        </div>
      </div>
    </>
  );
};
