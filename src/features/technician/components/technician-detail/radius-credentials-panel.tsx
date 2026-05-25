"use client";

import { useState } from "react";
import { Copy, Eye, EyeOff, Loader2, RefreshCw, ShieldAlert, Zap } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard";
import { useGenerateWorkOrderRadiusCredential, useRevealWorkOrderRadiusCredential } from "../../api/radius-credential.queries";
import type { GenerateRadiusCredentialResponse, WorkOrderRadiusCredential } from "../../types/radius-credential-api";
import { useTranslation } from "react-i18next";
import { fmtDate, humanize } from "./shared";

function isMaskedValue(value: string | undefined | null): boolean {
  if (!value) return true;
  return value.includes("*") || value === "******";
}

function credentialStatusVariant(
  status: string | undefined,
): "success" | "warning" | "info" | "destructive" {
  const key = (status ?? "").toLowerCase();
  if (key === "active" || key === "success" || key === "revealed") return "success";
  if (key === "pending" || key === "temporary") return "warning";
  if (key === "failed" || key === "expired" || key === "revoked") return "destructive";
  return "info";
}

function CredentialField({
  label,
  value,
  mono,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  const { t } = useTranslation();
  const { copyToClipboard, isCopied } = useCopyToClipboard({
    onCopy: () => toast.success(`${label} ${t("workOrder.detail.copied").toLowerCase()}`),
  });

  return (
    <div className="space-y-1">
      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">{label}</p>
      <div className="flex items-center gap-2">
        <p
          className={`text-sm font-semibold flex-1 min-w-0 break-all ${
            mono ? "font-mono text-xs sm:text-sm" : ""
          }`}
        >
          {value}
        </p>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="shrink-0 h-8 px-2"
          onClick={() => copyToClipboard(value)}
          title={`${t("workOrder.detail.copied")} ${label}`}
        >
          <Copy className="size-3.5" />
          <span className="sr-only">Copy {label}</span>
        </Button>
        {isCopied && (
          <span className="text-[9px] text-emerald-600 font-bold uppercase shrink-0">{t("workOrder.detail.copied")}</span>
        )}
      </div>
    </div>
  );
}

export function RadiusCredentialsPanel({
  workOrderId,
  maskedUsername,
  maskedPassword,
  variant = "default",
}: {
  workOrderId: string;
  maskedUsername?: string | null;
  maskedPassword?: string | null;
  variant?: "default" | "compact";
}) {
  const { t } = useTranslation();
  const [revealed, setRevealed] = useState<WorkOrderRadiusCredential | GenerateRadiusCredentialResponse | null>(null);
  const [hidden, setHidden] = useState(true);

  const revealMutation = useRevealWorkOrderRadiusCredential({
    mutationConfig: {
      onSuccess: (data) => {
        setRevealed(data);
        setHidden(false);
        const isIndo = t("workOrder.detail.no").toLowerCase() === "tidak";
        toast.success(t("workOrder.detail.radiusCredentials") + " " + (isIndo ? "ditampilkan" : "revealed"));
      },
    },
  });

  const generateMutation = useGenerateWorkOrderRadiusCredential();

  const displayUsername = revealed?.radius_username ?? maskedUsername;
  const displayPassword = revealed?.radius_password_plaintext ?? maskedPassword;
  const showPlaintext = !!revealed && !hidden;

  function handleReveal() {
    if (revealed) {
      setHidden(false);
      return;
    }
    revealMutation.mutate(workOrderId);
  }

  function handleHide() {
    setHidden(true);
  }

  function handleGenerate(forceRegenerate = false) {
    generateMutation.mutate(
      {
        workOrderId,
        data: {
          force_regenerate: forceRegenerate,
        },
      },
      {
        onSuccess: (data) => {
          setRevealed(data);
          setHidden(false);
        },
      }
    );
  }

  const compact = variant === "compact";

  return (
    <div
      className={
        compact
          ? "space-y-3"
          : "mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3"
      }
    >
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 flex items-center gap-1.5">
            <ShieldAlert className="size-3.5 text-amber-500 shrink-0" />
            {t("workOrder.detail.radiusCredentials")}
          </p>
          <p className="text-[9px] text-slate-400 mt-0.5">
            {t("workOrder.detail.revealLoadsPlaintext")}
          </p>
        </div>
      </div>

      {!showPlaintext && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
          <div>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">{t("workOrder.detail.username")}</p>
            <p className="text-sm font-mono font-semibold mt-1 text-slate-500">
              {isMaskedValue(maskedUsername) ? "••••••••" : (maskedUsername ?? "—")}
            </p>
          </div>
          <div>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">{t("workOrder.detail.password")}</p>
            <p className="text-sm font-mono font-semibold mt-1 text-slate-500">
              {isMaskedValue(maskedPassword) ? "••••••••" : (maskedPassword ?? "—")}
            </p>
          </div>
        </div>
      )}

      {showPlaintext && revealed && (
        <div className="p-3 rounded-lg bg-amber-50/80 dark:bg-amber-950/20 border border-amber-200/80 dark:border-amber-900/40 space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            {revealed.status && (
              <Badge
                variant={credentialStatusVariant(revealed.status)}
                appearance="light"
                size="sm"
                className="uppercase"
              >
                {humanize(revealed.status)}
              </Badge>
            )}
            {"viewed_at" in revealed && revealed.viewed_at && (
              <span className="text-[10px] text-slate-500">
                Viewed at {fmtDate(revealed.viewed_at)}
              </span>
            )}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <CredentialField label={t("workOrder.detail.username")} value={displayUsername ?? "—"} mono />
            <CredentialField label={t("workOrder.detail.password")} value={displayPassword ?? "—"} mono />
          </div>
        </div>
      )}
    </div>
  );
}
