"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { RiLockLine, RiEyeCloseLine, RiEyeLine } from "@remixicon/react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useUserStore } from "../../../store/user";

interface AccountSectionProps {
  onPasswordChange: (password: string) => void;
}

export function AccountSection({ onPasswordChange }: AccountSectionProps) {
  const { t } = useTranslation();
  const { form } = useUserStore();
  const isDetailMode = form === "details";
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 pb-2 border-b border-border/50">
        <RiLockLine className="size-4 text-blue-500" />
        <h3 className="text-sm font-semibold">{t("administration.users.account")}</h3>
      </div>

      <div className="space-y-2">
        <Label className="text-xs font-medium text-muted-foreground">
          {t("administration.users.password")}
          {isDetailMode && <span className="ml-1 text-muted-foreground/60 font-normal">({t("administration.users.temporaryPassword")})</span>}
        </Label>
        <div className="relative">
          <Input
            type={showPassword ? "text" : "password"}
            placeholder={t("administration.users.minChars")}
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              onPasswordChange(e.target.value);
            }}
            disabled={isDetailMode}
            className="pr-10"
          />
          <Button
            type="button"
            mode="icon"
            variant="ghost"
            className="absolute end-0.5 top-1/2 h-7 w-7 -translate-y-1/2 text-muted-foreground"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <RiEyeCloseLine /> : <RiEyeLine />}
          </Button>
        </div>
        {!isDetailMode && (
          <div className="mt-1 grid grid-cols-2 gap-x-4 gap-y-0.5 text-[10px] text-muted-foreground">
            <span>{t("administration.users.minChars")}</span>
            <span>{t("administration.users.minUppercase")}</span>
            <span>{t("administration.users.minLowercase")}</span>
            <span>{t("administration.users.minSpecial")}</span>
          </div>
        )}
      </div>
    </div>
  );
}