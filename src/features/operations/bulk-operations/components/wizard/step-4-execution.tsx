"use client";

import { useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { RefreshCw, CheckCircle2, XCircle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useBulkOperationWizardStore } from "../../store/wizard";
import { dummyExecutionResults } from "../../data/dummy";

export function Step4Execution() {
  const { t } = useTranslation();
  const {
    isExecuting,
    executionProgress,
    executionResults,
    setExecuting,
    setExecutionProgress,
    setExecutionResults,
  } = useBulkOperationWizardStore();

  const simulateExecution = useCallback(() => {
    setExecuting(true);
    setExecutionProgress(0);
    setExecutionResults([]);

    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 15;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        setExecuting(false);
        setExecutionResults(dummyExecutionResults);
      }
      setExecutionProgress(Math.min(progress, 100));
    }, 500);

    return () => clearInterval(interval);
  }, [setExecuting, setExecutionProgress, setExecutionResults]);

  useEffect(() => {
    if (isExecuting && executionProgress === 0) {
      const cleanup = simulateExecution();
      return cleanup;
    }
  }, [isExecuting, executionProgress, simulateExecution]);

  useEffect(() => {
    if (executionProgress === 0 && !isExecuting) {
      simulateExecution();
    }
  }, []);

  const successCount = executionResults.filter(
    (r) => r.status === "success"
  ).length;
  const failedCount = executionResults.filter(
    (r) => r.status === "failed"
  ).length;
  const pendingCount = executionResults.filter(
    (r) => r.status === "pending"
  ).length;

  const formatPrice = (price: number): string =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold">
          {t("bulkOperations.step4.title", "Execution Progress")}
        </h3>
        <p className="mt-1 text-sm text-muted-foreground">
          {t(
            "bulkOperations.step4.description",
            "Monitor the execution of the bulk operation."
          )}
        </p>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium">
            {t("bulkOperations.progress", "Progress")}
          </span>
          <span className="text-muted-foreground">
            {Math.round(executionProgress)}%
          </span>
        </div>
        <div className="h-3 w-full overflow-hidden rounded-full bg-muted">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              executionProgress >= 100
                ? "bg-green-500"
                : "bg-primary"
            }`}
            style={{ width: `${executionProgress}%` }}
          />
        </div>
        <p className="text-xs text-muted-foreground">
          {isExecuting
            ? t("bulkOperations.executing", "Processing customers...")
            : executionProgress >= 100
              ? t("bulkOperations.completed", "Execution completed")
              : t("bulkOperations.starting", "Starting execution...")}
        </p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="flex items-center gap-3 rounded-lg border p-3">
          <CheckCircle2 className="size-5 text-green-600 dark:text-green-400" />
          <div>
            <p className="text-2xl font-bold">{successCount}</p>
            <p className="text-xs text-muted-foreground">
              {t("bulkOperations.success", "Success")}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-lg border p-3">
          <XCircle className="size-5 text-red-600 dark:text-red-400" />
          <div>
            <p className="text-2xl font-bold">{failedCount}</p>
            <p className="text-xs text-muted-foreground">
              {t("bulkOperations.failed", "Failed")}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-lg border p-3">
          <Clock className="size-5 text-yellow-600 dark:text-yellow-400" />
          <div>
            <p className="text-2xl font-bold">{pendingCount}</p>
            <p className="text-xs text-muted-foreground">
              {t("bulkOperations.pending", "Pending")}
            </p>
          </div>
        </div>
      </div>

      {executionResults.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-medium">
              {t("bulkOperations.executionLog", "Execution Log")}
            </h4>
            {failedCount > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  /* retry failed */
                }}
              >
                <RefreshCw className="mr-2 size-3" />
                {t("bulkOperations.retryFailed", "Retry Failed")}
              </Button>
            )}
          </div>

          <div className="rounded-lg border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="px-4 py-2 text-left font-medium">
                    {t("bulkOperations.customer", "Customer")}
                  </th>
                  <th className="px-4 py-2 text-left font-medium">
                    {t("common.status", "Status")}
                  </th>
                  <th className="px-4 py-2 text-left font-medium">
                    {t("bulkOperations.message", "Message")}
                  </th>
                  <th className="px-4 py-2 text-left font-medium">
                    {t("bulkOperations.time", "Time")}
                  </th>
                </tr>
              </thead>
              <tbody>
                {executionResults.map((result) => (
                  <tr
                    key={result.customer_id}
                    className="border-b last:border-0"
                  >
                    <td className="px-4 py-2 font-medium">
                      {result.customer_name}
                    </td>
                    <td className="px-4 py-2">
                      <Badge
                        className={
                          result.status === "success"
                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                            : result.status === "failed"
                              ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                              : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
                        }
                      >
                        {result.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-2 text-muted-foreground">
                      {result.message}
                    </td>
                    <td className="px-4 py-2 text-muted-foreground">
                      {result.executed_at
                        ? new Date(result.executed_at).toLocaleTimeString("id-ID")
                        : "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
