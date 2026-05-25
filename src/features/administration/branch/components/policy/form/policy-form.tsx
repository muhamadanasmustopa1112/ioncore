"use client";

import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  RiInformationLine,
  RiShieldLine,
  RiTimeLine,
  RiRouteLine,
} from "@remixicon/react";
import { OdpSelectionStrategyType } from "../../../types/policy-api";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { usePolicyStore } from "../../../store/policy";
import { PolicyPayload } from "../../../types/policy-api";

function formatRupiah(value: number): string {
  return new Intl.NumberFormat("id-ID").format(value);
}

function formatNumber(value: number): string {
  return new Intl.NumberFormat("id-ID").format(value);
}

interface PolicyFormProps {
  onSubmit?: (payload: PolicyPayload) => void;
  branchType?: string;
}

export function PolicyForm({ onSubmit, branchType }: PolicyFormProps) {
  const { t } = useTranslation();
  const isNoc = branchType?.toLowerCase() === "noc";
  const { form, selectedPolicy } = usePolicyStore();
  const isDetailMode = form === "details";

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isActive, setIsActive] = useState("true");
  const [slaHours, setSlaHours] = useState("24");
  const [workStart, setWorkStart] = useState("08:00");
  const [workEnd, setWorkEnd] = useState("17:00");
  const [timezone, setTimezone] = useState("Asia/Jakarta");
  const [taxDefault, setTaxDefault] = useState("1.1");
  const [contacts, setContacts] = useState("");
  const [approvalL1, setApprovalL1] = useState("");
  const [approvalL2, setApprovalL2] = useState("");
  const [excessCablePrice, setExcessCablePrice] = useState("35000");
  const [cableThresholdMeter, setCableThresholdMeter] = useState("210");
  const [cableRouteFactor, setCableRouteFactor] = useState("10");
  const [maxCableRunMeter, setMaxCableRunMeter] = useState("500");
  const [odpStrategy, setOdpStrategy] = useState<OdpSelectionStrategyType>("nearest");
  const [odpWeightDistance, setOdpWeightDistance] = useState("6");
  const [odpWeightCapacity, setOdpWeightCapacity] = useState("4");

  useEffect(() => {
    if (selectedPolicy && (form === "edit" || form === "details")) {
      const p = selectedPolicy;
      setName(p.name);
      setDescription(p.description);
      setIsActive(p.isActive ? "true" : "false");
      setSlaHours(p.policyJson.sla_hours?.toString() ?? "24");
      setWorkStart(p.policyJson.working_hours?.start ?? "08:00");
      setWorkEnd(p.policyJson.working_hours?.end ?? "17:00");
      setTimezone(p.policyJson.timezone ?? "Asia/Jakarta");
      setTaxDefault(p.policyJson.tax_default?.toString() ?? "1.1");
      setContacts(p.policyJson.notification_contacts?.join(", ") ?? "");
      setApprovalL1(p.policyJson.approval_matrix?.level_1 ?? "");
      setApprovalL2(p.policyJson.approval_matrix?.level_2 ?? "");
      setExcessCablePrice(p.policyJson.excess_cable_price?.toString() ?? "35000");
      setCableThresholdMeter(p.policyJson.cable_threshold_meter?.toString() ?? "210");
      const crf = p.policyJson.cable_route_factor;
      setCableRouteFactor(crf != null ? Math.round(crf * 10).toString() : "10");
      setMaxCableRunMeter(p.policyJson.max_cable_run_meter?.toString() ?? "500");
      setOdpStrategy((p.policyJson.odp_selection_strategy?.type as OdpSelectionStrategyType) ?? "nearest");
      const dist = p.policyJson.odp_selection_strategy?.weights?.distance;
      setOdpWeightDistance(dist != null ? (dist * 10).toString() : "6");
      const cap = p.policyJson.odp_selection_strategy?.weights?.available_capacity;
      setOdpWeightCapacity(cap != null ? (cap * 10).toString() : "4");
    } else if (form === "new") {
      setName("");
      setDescription("");
      setIsActive("true");
      setSlaHours("24");
      setWorkStart("08:00");
      setWorkEnd("17:00");
      setTimezone("Asia/Jakarta");
      setTaxDefault("1.1");
      setContacts("");
      setApprovalL1("");
      setApprovalL2("");
      setExcessCablePrice("35000");
      setCableThresholdMeter("210");
      setCableRouteFactor("10");
      setMaxCableRunMeter("500");
      setOdpStrategy("nearest");
      setOdpWeightDistance("6");
      setOdpWeightCapacity("4");
    }
  }, [selectedPolicy, form]);

  const handleSubmit = useCallback(() => {
    if (!onSubmit) return;
    onSubmit({
      name,
      description,
      is_active: isActive === "true",
      policy_json: {
        sla_hours: Number(slaHours) || 24,
        working_hours: { start: workStart, end: workEnd },
        timezone,
        tax_default: Number(taxDefault) || 0,
        notification_contacts: contacts
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        approval_matrix: { level_1: approvalL1, level_2: approvalL2 },
        ...(isNoc && {
          excess_cable_price: Number(excessCablePrice) || 0,
          cable_threshold_meter: Number(cableThresholdMeter) || 0,
          cable_route_factor: (Number(cableRouteFactor) || 10) / 10,
          max_cable_run_meter: Number(maxCableRunMeter) || 0,
        }),
        ...(isNoc && {
          odp_selection_strategy: {
            type: odpStrategy,
            weights: {
              distance: (Number(odpWeightDistance) || 6) / 10,
              available_capacity: (Number(odpWeightCapacity) || 4) / 10,
            },
          },
        }),
      },
    });
  }, [name, description, isActive, slaHours, workStart, workEnd, timezone, taxDefault, contacts, approvalL1, approvalL2, excessCablePrice, cableThresholdMeter, cableRouteFactor, maxCableRunMeter, odpStrategy, odpWeightDistance, odpWeightCapacity, isNoc, onSubmit]);

  useEffect(() => {
    (window as unknown as Record<string, unknown>).__policyFormSubmit =
      handleSubmit;
    return () => {
      delete (window as unknown as Record<string, unknown>).__policyFormSubmit;
    };
  }, [handleSubmit]);

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <ScrollArea className="flex-1 px-6 py-6">
        <div className="space-y-8 pb-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-border/50">
              <RiInformationLine className="size-4 text-blue-500" />
              <h3 className="text-sm font-semibold">{t("administration.branch.policy.generalInformation")}</h3>
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-medium text-muted-foreground">
                {t("administration.branch.policy.name")} <span className="text-red-500">*</span>
              </Label>
              <Input
                placeholder={t("administration.branch.policy.namePlaceholder")}
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={isDetailMode}
              />
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-medium text-muted-foreground">
                {t("administration.branch.policy.description")}
              </Label>
              <Textarea
                placeholder={t("administration.branch.policy.descriptionPlaceholder")}
                className="min-h-[72px] resize-none"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={isDetailMode}
              />
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-medium text-muted-foreground">
                {t("administration.branch.policy.status")}
              </Label>
              {isDetailMode ? (
                <Input
                  value={isActive === "true" ? t("administration.branch.policy.active") : t("administration.branch.policy.inactive")}
                  disabled
                />
              ) : (
                <Select value={isActive} onValueChange={setIsActive}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="true">{t("administration.branch.policy.active")}</SelectItem>
                    <SelectItem value="false">{t("administration.branch.policy.inactive")}</SelectItem>
                  </SelectContent>
                </Select>
              )}
            </div>
          </div>

          <div className="space-y-4 pt-2">
            <div className="flex items-center gap-2 pb-1 border-b border-border/50">
              <RiTimeLine className="size-4 text-amber-500" />
              <h3 className="text-sm font-semibold">{t("administration.branch.policy.slaWorkingHours")}</h3>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label className="text-xs font-medium text-muted-foreground">
                  {t("administration.branch.policy.slaHours")}
                </Label>
                <Input
                  type="number"
                  placeholder="24"
                  value={slaHours}
                  onChange={(e) => setSlaHours(e.target.value)}
                  disabled={isDetailMode}
                  min={1}
                  step={1}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-medium text-muted-foreground">
                  {t("administration.branch.policy.timezone")}
                </Label>
                {isDetailMode ? (
                  <Input value={timezone} disabled />
                ) : (
                  <Select value={timezone} onValueChange={setTimezone}>
                    <SelectTrigger>
                      <SelectValue placeholder={t("administration.branch.policy.selectTimezone")} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Asia/Jakarta">Asia/Jakarta (WIB)</SelectItem>
                      <SelectItem value="Asia/Makassar">Asia/Makassar (WITA)</SelectItem>
                      <SelectItem value="Asia/Jayapura">Asia/Jayapura (WIT)</SelectItem>
                      <SelectItem value="UTC">UTC</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-medium text-muted-foreground">
                  {t("administration.branch.policy.workHoursStart")}
                </Label>
                <Input
                  type="time"
                  value={workStart}
                  onChange={(e) => setWorkStart(e.target.value)}
                  disabled={isDetailMode}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-medium text-muted-foreground">
                  {t("administration.branch.policy.workHoursEnd")}
                </Label>
                <Input
                  type="time"
                  value={workEnd}
                  onChange={(e) => setWorkEnd(e.target.value)}
                  disabled={isDetailMode}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-medium text-muted-foreground">
                {t("administration.branch.policy.taxDefault")}
              </Label>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  placeholder="1.1"
                  value={taxDefault}
                  onChange={(e) => setTaxDefault(e.target.value)}
                  disabled={isDetailMode}
                  step={0.1}
                  min={0}
                  className="w-32"
                />
                <span className="text-sm text-muted-foreground">
                  ({(Number(taxDefault) || 0).toFixed(2).replace(/\.?0+$/, "")}%)
                </span>
              </div>
            </div>
          </div>

          {isNoc && <div className="space-y-4 pt-2">
            <div className="flex items-center gap-2 pb-1 border-b border-border/50">
              <RiInformationLine className="size-4 text-emerald-500" />
              <h3 className="text-sm font-semibold">{t("administration.branch.policy.cableConfiguration")}</h3>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label className="text-xs font-medium text-muted-foreground">
                  {t("administration.branch.policy.excessCablePrice")}
                </Label>
                <div className="relative flex items-center">
                  <span className="absolute left-3 text-sm text-muted-foreground select-none">Rp</span>
                  <Input
                    className="pl-8"
                    type="text"
                    placeholder="35.000"
                    value={excessCablePrice ? formatRupiah(Number(excessCablePrice) || 0) : ""}
                    onChange={(e) => {
                      const raw = e.target.value.replace(/[^\d]/g, "");
                      setExcessCablePrice(raw);
                    }}
                    disabled={isDetailMode}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-medium text-muted-foreground">
                  {t("administration.branch.policy.cableThresholdMeter")}
                </Label>
                <Input
                  type="text"
                  placeholder="210"
                  value={cableThresholdMeter ? formatNumber(Number(cableThresholdMeter) || 0) : ""}
                  onChange={(e) => {
                    const raw = e.target.value.replace(/[^\d]/g, "");
                    setCableThresholdMeter(raw);
                  }}
                  disabled={isDetailMode}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-medium text-muted-foreground">
                  {t("administration.branch.policy.cableRouteFactor")}
                </Label>
                <Input
                  type="text"
                  placeholder="10"
                  value={cableRouteFactor ? formatNumber(Number(cableRouteFactor) || 0) : ""}
                  onChange={(e) => {
                    const raw = e.target.value.replace(/[^\d]/g, "");
                    setCableRouteFactor(raw);
                  }}
                  disabled={isDetailMode}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-medium text-muted-foreground">
                  {t("administration.branch.policy.maxCableRunMeter")}
                </Label>
                <Input
                  type="text"
                  placeholder="300"
                  value={maxCableRunMeter ? formatNumber(Number(maxCableRunMeter) || 0) : ""}
                  onChange={(e) => {
                    const raw = e.target.value.replace(/[^\d]/g, "");
                    setMaxCableRunMeter(raw);
                  }}
                  disabled={isDetailMode}
                />
              </div>
            </div>
          </div>}

          {isNoc && (
            <div className="space-y-4 pt-2">
              <div className="flex items-center gap-2 pb-1 border-b border-border/50">
                <RiRouteLine className="size-4 text-orange-500" />
                <h3 className="text-sm font-semibold">{t("administration.branch.policy.odpSelectionStrategy")}</h3>
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-medium text-muted-foreground">{t("administration.branch.policy.strategyType")}</Label>
                {isDetailMode ? (
                  <Input value={odpStrategy} disabled />
                ) : (
                  <Select value={odpStrategy} onValueChange={(v) => setOdpStrategy(v as OdpSelectionStrategyType)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="nearest">Nearest</SelectItem>
                      <SelectItem value="least_loaded">Least Loaded</SelectItem>
                      <SelectItem value="round_robin">Round Robin</SelectItem>
                      <SelectItem value="priority">Priority</SelectItem>
                      <SelectItem value="weighted">Weighted</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label className="text-xs font-medium text-muted-foreground">
                    {t("administration.branch.policy.weightDistance")}
                    <span className="ml-1 text-muted-foreground/60 font-normal">{t("administration.branch.policy.weightHint")}</span>
                  </Label>
                  <Input
                    type="number"
                    step="1"
                    min="0"
                    max="10"
                    placeholder="6"
                    value={odpWeightDistance}
                    onChange={(e) => setOdpWeightDistance(e.target.value)}
                    disabled={isDetailMode}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-medium text-muted-foreground">
                    {t("administration.branch.policy.weightAvailableCapacity")}
                    <span className="ml-1 text-muted-foreground/60 font-normal">{t("administration.branch.policy.weightHint")}</span>
                  </Label>
                  <Input
                    type="number"
                    step="1"
                    min="0"
                    max="10"
                    placeholder="4"
                    value={odpWeightCapacity}
                    onChange={(e) => setOdpWeightCapacity(e.target.value)}
                    disabled={isDetailMode}
                  />
                </div>
              </div>
            </div>
          )}

          <div className="space-y-4 pt-2">
            <div className="flex items-center gap-2 pb-1 border-b border-border/50">
              <RiShieldLine className="size-4 text-violet-500" />
              <h3 className="text-sm font-semibold">{t("administration.branch.policy.notificationsApproval")}</h3>
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-medium text-muted-foreground">
                {t("administration.branch.policy.notificationContacts")}
              </Label>
              <Textarea
                placeholder="e.g. ops@example.com, manager@example.com"
                className="min-h-[60px] resize-none"
                value={contacts}
                onChange={(e) => setContacts(e.target.value)}
                disabled={isDetailMode}
              />
              {!isDetailMode && (
                <p className="text-[11px] text-muted-foreground">
                  {t("administration.branch.policy.notificationContactsHint")}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label className="text-xs font-medium text-muted-foreground">
                  {t("administration.branch.policy.approvalLevel1")}
                </Label>
                <Input
                  placeholder={t("administration.branch.policy.approvalLevel1Placeholder")}
                  value={approvalL1}
                  onChange={(e) => setApprovalL1(e.target.value)}
                  disabled={isDetailMode}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-medium text-muted-foreground">
                  {t("administration.branch.policy.approvalLevel2")}
                </Label>
                <Input
                  placeholder={t("administration.branch.policy.approvalLevel2Placeholder")}
                  value={approvalL2}
                  onChange={(e) => setApprovalL2(e.target.value)}
                  disabled={isDetailMode}
                />
              </div>
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}