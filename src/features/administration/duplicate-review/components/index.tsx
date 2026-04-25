"use client";

import { RiGitMergeLine } from "@remixicon/react";
import { Badge } from "@/components/ui/badge";
import { PageBreadcrumb } from "@/components/common/page-breadcrumb";
import {
  Toolbar,
  ToolbarHeading,
  ToolbarTitle,
} from "@/components/common/toolbar";
import { paths } from "@/config/paths";
import { useDuplicateReviewStore } from "../store/duplicate-review";
import { DuplicatePairsList } from "./list/duplicate-pairs-list";
import { ReviewSheet } from "./review/review-sheet";

export function DuplicateReviewPage() {
  const pairs = useDuplicateReviewStore((s) => s.pairs);
  const pending = pairs.filter((p) => p.status === "pending").length;

  return (
    <div className="relative h-full w-full overflow-hidden">
      <PageBreadcrumb
        items={[
          { title: "Administration", path: paths.dashboard.administration.branch.root.getHref() },
          { title: "Duplicate Review & Merge Queue" },
        ]}
      />

      <Toolbar className="mt-5 items-start sm:items-center">
        <ToolbarHeading>
          <ToolbarTitle className="text-xl font-extrabold tracking-tight sm:text-2xl">
            Duplicate Review & Merge Queue
          </ToolbarTitle>
          <div className="mt-2 flex flex-col gap-1 sm:flex-row sm:flex-wrap sm:items-center sm:gap-2.5 sm:mt-2.5">
            <Badge
              variant="destructive"
              appearance="light"
              className="h-6 w-fit px-2.5 gap-1.5 border-none font-semibold text-xs"
            >
              <RiGitMergeLine className="size-3.5" />
              {pending} pending
            </Badge>
            <span className="hidden sm:inline text-muted-foreground/60 text-sm">•</span>
            <span className="text-muted-foreground font-normal text-xs sm:text-sm">
              Review flagged duplicate lead pairs and decide to merge, dismiss, or defer
            </span>
          </div>
        </ToolbarHeading>
      </Toolbar>

      <div className="mt-4">
        <DuplicatePairsList />
      </div>

      <ReviewSheet />
    </div>
  );
}
