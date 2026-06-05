"use client";

import { useTranslation } from "react-i18next";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardHeading, CardToolbar } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Wrench, AlertCircle } from "lucide-react";
import type { RetrofitJob } from "../../../types";

interface RetrofitsTabProps {
  filteredJobs: RetrofitJob[];
  isMobile: boolean;
  onNewRetrofit?: () => void;
}

export function RetrofitsTab({ filteredJobs, isMobile, onNewRetrofit }: RetrofitsTabProps) {
  const { t } = useTranslation();

  if (isMobile) {
    return (
      <div className="space-y-3">
        {filteredJobs.map((job, index) => (
          <div
            key={index}
            className="bg-white dark:bg-slate-900 p-3 rounded-lg border border-slate-100 dark:border-slate-800 hover:shadow-md transition-all"
          >
            <div className="flex items-start justify-between gap-2 mb-1">
              <span className="font-semibold text-slate-900 dark:text-white text-sm truncate">
                {job.resultAssetName}
              </span>
              <Badge variant="secondary" appearance="light" className="font-bold text-[9px] px-1.5 py-0.5 rounded-full uppercase shrink-0">
                {job.woNumber ? "WO Linked" : "Manual"}
              </Badge>
            </div>
            <div className="text-[10px] text-slate-400 font-mono mb-2">
              SKU: {job.resultAssetSku}
            </div>
            <div className="text-[10px] text-slate-500 dark:text-slate-400 mb-1 truncate">
              {job.notes}
            </div>
            <div className="text-[10px] text-slate-400">{new Date(job.performedAt).toLocaleDateString()}</div>
          </div>
        ))}
        {filteredJobs.length === 0 && (
          <div className="text-center py-8 text-slate-400 text-sm">
            <AlertCircle className="size-8 mx-auto mb-2 opacity-50" />
            {t("warehouse.noRetrofitsAlert", "No retrofit jobs found")}
          </div>
        )}
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardHeading>{t("warehouse.assetRetrofits", "Asset Retrofits (Cannibalization)")}</CardHeading>
        <CardToolbar>
          <Button size="sm" variant="outline" onClick={onNewRetrofit}>
            <Wrench className="size-3.5 mr-1.5" />
            {t("warehouse.newRetrofit", "New Retrofit")}
          </Button>
        </CardToolbar>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t("warehouse.resultAsset", "Result Asset")}</TableHead>
              <TableHead>SKU</TableHead>
              <TableHead>{t("warehouse.notes", "Notes")}</TableHead>
              <TableHead>{t("warehouse.performedBy", "Performed By")}</TableHead>
              <TableHead>{t("warehouse.date", "Date")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredJobs.map((job, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">{job.resultAssetName}</TableCell>
                <TableCell className="font-mono text-xs">{job.resultAssetSku}</TableCell>
                <TableCell className="max-w-[200px] truncate">{job.notes}</TableCell>
                <TableCell>{job.performedByName}</TableCell>
                <TableCell>{new Date(job.performedAt).toLocaleDateString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
