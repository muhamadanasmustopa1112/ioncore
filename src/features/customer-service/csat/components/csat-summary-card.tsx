"use client";

import { Star } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useCsatSummary } from "../api/get-csat";

export function CsatSummaryCard() {
  const { data: csat, isLoading } = useCsatSummary();

  if (isLoading || !csat) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-bold uppercase tracking-widest text-muted-foreground">
            CSAT Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-20 w-full" />
        </CardContent>
      </Card>
    );
  }

  const maxCount = Math.max(...Object.values(csat.distribution));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-bold uppercase tracking-widest text-muted-foreground">
          Customer Satisfaction
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-3">
          <span className="text-4xl font-black text-foreground">
            {csat.average_rating.toFixed(1)}
          </span>
          <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`size-5 ${
                  star <= Math.round(csat.average_rating)
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-muted-foreground"
                }`}
              />
            ))}
          </div>
          <span className="text-sm text-muted-foreground">
            ({csat.total_responses} responses)
          </span>
        </div>

        <div className="space-y-1.5">
          {[5, 4, 3, 2, 1].map((rating) => (
            <div key={rating} className="flex items-center gap-2">
              <span className="text-xs font-medium text-muted-foreground w-3">
                {rating}
              </span>
              <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-yellow-400 rounded-full"
                  style={{
                    width: `${maxCount > 0 ? (csat.distribution[rating] / maxCount) * 100 : 0}%`,
                  }}
                />
              </div>
              <span className="text-xs text-muted-foreground w-6 text-right">
                {csat.distribution[rating]}
              </span>
            </div>
          ))}
        </div>

        {csat.flagged_count > 0 && (
          <p className="text-xs text-red-600 dark:text-red-400 font-medium">
            {csat.flagged_count} tickets flagged for review (rating &le; 2)
          </p>
        )}
      </CardContent>
    </Card>
  );
}
