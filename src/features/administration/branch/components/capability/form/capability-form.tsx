"use client";

import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { RiInformationLine, RiSettings3Line } from "@remixicon/react";
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
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useCapabilityStore } from "../../../store/capability";
import { CapabilityJson, CapabilityPayload } from "../../../types/capability-api";

const CAPABILITY_KEYS: Record<keyof CapabilityJson, string> = {
  sales: "sales",
  helpdesk: "helpdesk",
  dispatch: "dispatch",
  stock_holding: "stockHolding",
  monitoring: "monitoring",
  collection: "collection",
  approval: "approval",
  auto_assignment: "autoAssignment",
};

const DEFAULT_JSON: CapabilityJson = {
  sales: false,
  helpdesk: false,
  dispatch: false,
  stock_holding: false,
  monitoring: false,
  collection: false,
  approval: false,
  auto_assignment: false,
};

interface CapabilityFormProps {
  onSubmit?: (payload: CapabilityPayload) => void;
}

export function CapabilityForm({ onSubmit }: CapabilityFormProps) {
  const { t } = useTranslation();
  const { form, selectedCapability } = useCapabilityStore();
  const isDetailMode = form === "details";

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isActive, setIsActive] = useState("true");
  const [capJson, setCapJson] = useState<CapabilityJson>({ ...DEFAULT_JSON });

  useEffect(() => {
    if (selectedCapability && (form === "edit" || form === "details")) {
      setName(selectedCapability.name);
      setDescription(selectedCapability.description);
      setIsActive(selectedCapability.isActive ? "true" : "false");
      setCapJson(selectedCapability.capabilityJson ?? { ...DEFAULT_JSON });
    } else if (form === "new") {
      setName("");
      setDescription("");
      setIsActive("true");
      setCapJson({ ...DEFAULT_JSON });
    }
  }, [selectedCapability, form]);

  const toggleCap = (key: keyof CapabilityJson) => {
    setCapJson((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSubmit = useCallback(() => {
    if (!onSubmit) return;
    onSubmit({ name, description, is_active: isActive === "true", capability_json: capJson });
  }, [name, description, isActive, capJson, onSubmit]);

  useEffect(() => {
    (window as unknown as Record<string, unknown>).__capabilityFormSubmit =
      handleSubmit;
    return () => {
      delete (window as unknown as Record<string, unknown>).__capabilityFormSubmit;
    };
  }, [handleSubmit]);

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <ScrollArea className="flex-1 px-6 py-6">
        <div className="space-y-8 pb-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-border/50">
              <RiInformationLine className="size-4 text-blue-500" />
              <h3 className="text-sm font-semibold">{t("administration.branch.capability.generalInformation")}</h3>
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-medium text-muted-foreground">
                {t("administration.branch.capability.name")} <span className="text-red-500">*</span>
              </Label>
              <Input
                placeholder={t("administration.branch.capability.namePlaceholder")}
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={isDetailMode}
              />
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-medium text-muted-foreground">
                {t("administration.branch.capability.description")}
              </Label>
              <Textarea
                placeholder={t("administration.branch.capability.descriptionPlaceholder")}
                className="min-h-[72px] resize-none"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={isDetailMode}
              />
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-medium text-muted-foreground">
                {t("administration.branch.capability.status")}
              </Label>
              {isDetailMode ? (
                <Input
                  value={isActive === "true" ? t("administration.branch.capability.active") : t("administration.branch.capability.inactive")}
                  disabled
                />
              ) : (
                <Select value={isActive} onValueChange={setIsActive}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="true">{t("administration.branch.capability.active")}</SelectItem>
                    <SelectItem value="false">{t("administration.branch.capability.inactive")}</SelectItem>
                  </SelectContent>
                </Select>
              )}
            </div>
          </div>

          <div className="space-y-4 pt-2">
            <div className="flex items-center gap-2 pb-1 border-b border-border/50">
              <RiSettings3Line className="size-4 text-violet-500" />
              <h3 className="text-sm font-semibold">{t("administration.branch.capability.featureFlags")}</h3>
            </div>

            <div className="grid grid-cols-1 gap-3">
              {(Object.keys(CAPABILITY_KEYS) as Array<keyof CapabilityJson>).map(
                (key) => (
                  <div
                    key={key}
                    className="flex items-center justify-between rounded-lg border border-border/60 px-4 py-3 bg-muted/20"
                  >
                    <span className="text-sm font-medium">
                      {t(`administration.branch.capability.${CAPABILITY_KEYS[key]}`)}
                    </span>
                    <Switch
                      checked={capJson[key]}
                      onCheckedChange={() => !isDetailMode && toggleCap(key)}
                      disabled={isDetailMode}
                    />
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}