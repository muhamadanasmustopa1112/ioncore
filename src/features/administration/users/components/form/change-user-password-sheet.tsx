"use client";

import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { zodResolver } from "@hookform/resolvers/zod";
import { RiLockPasswordLine, RiEyeLine, RiEyeCloseLine } from "@remixicon/react";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetBody,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useAdminResetUserPassword } from "@/features/user-service/api/users";
import { passwordZodSchema } from "@/lib/password";
import { useUserStore } from "../../store/user";

const changePasswordSchema = z
  .object({
    newPassword: passwordZodSchema,
    confirmPassword: z.string(),
    forcePasswordChange: z.boolean(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type ChangePasswordValues = z.infer<typeof changePasswordSchema>;

export function ChangeUserPasswordSheet() {
  const { t } = useTranslation();
  const { passwordSheetOpen, passwordSheetUser, closeChangePasswordSheet } = useUserStore();
  const { mutate: resetPassword, isPending } = useAdminResetUserPassword();

  const [newVisible, setNewVisible] = useState(false);
  const [confirmVisible, setConfirmVisible] = useState(false);

  const form = useForm<ChangePasswordValues>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
      forcePasswordChange: true,
    },
  });

  useEffect(() => {
    if (!passwordSheetOpen) return;
    form.reset({
      newPassword: "",
      confirmPassword: "",
      forcePasswordChange: true,
    });
    setNewVisible(false);
    setConfirmVisible(false);
  }, [passwordSheetOpen, passwordSheetUser, form]);

  const handleSubmit = form.handleSubmit((values) => {
    if (!passwordSheetUser) return;

    resetPassword(
      {
        id: passwordSheetUser.id,
        payload: {
          new_password: values.newPassword,
          force_password_change: values.forcePasswordChange,
        },
      },
      {
        onSuccess: () => {
          toast.success(t("administration.users.passwordChanged"));
          closeChangePasswordSheet();
        },
        onError: (err: unknown) =>
          toast.error(
            (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
              t("administration.users.failedToChangePassword"),
          ),
      },
    );
  });

  return (
    <Sheet open={passwordSheetOpen} onOpenChange={(open) => !open && closeChangePasswordSheet()}>
      <SheetContent className="inset-y-0 sm:inset-y-8 lg:end-10 start-auto h-full sm:max-h-[calc(100vh-64px)] gap-0 sm:rounded-lg border p-0 sm:max-w-none w-full md:w-[480px] lg:w-[520px] flex flex-col [&_[data-slot=sheet-close]]:end-5 [&_[data-slot=sheet-close]]:top-4.5 shadow-2xl">
        <SheetHeader className="border-border border-b px-5 py-4">
          <SheetTitle className="font-medium text-xl flex items-center gap-2">
            <RiLockPasswordLine className="size-5 text-amber-500" />
            {t("administration.users.changePasswordTitle")}
          </SheetTitle>
        </SheetHeader>

        <SheetBody className="flex-1 p-0 overflow-hidden">
          <ScrollArea className="h-full px-6 py-6">
            <Form {...form}>
              <form onSubmit={handleSubmit} className="space-y-6">
                {passwordSheetUser && (
                  <div className="rounded-md border border-border/50 bg-muted/30 px-4 py-3 space-y-1">
                    <p className="text-sm font-semibold">{passwordSheetUser.fullName}</p>
                    <p className="text-xs text-muted-foreground">{passwordSheetUser.email}</p>
                  </div>
                )}

                <FormField
                  control={form.control}
                  name="newPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-medium text-muted-foreground">
                        {t("administration.users.newPassword")} <span className="text-red-500">*</span>
                      </FormLabel>
                      <div className="relative">
                        <FormControl>
                          <Input
                            type={newVisible ? "text" : "password"}
                            placeholder={t("administration.users.newPasswordPlaceholder")}
                            {...field}
                            className="pr-10"
                          />
                        </FormControl>
                        <Button
                          type="button"
                          mode="icon"
                          variant="ghost"
                          className="absolute end-0.5 top-1/2 h-7 w-7 -translate-y-1/2 text-muted-foreground"
                          onClick={() => setNewVisible((v) => !v)}
                        >
                          {newVisible ? <RiEyeCloseLine /> : <RiEyeLine />}
                        </Button>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-medium text-muted-foreground">
                        {t("administration.users.confirmNewPassword")} <span className="text-red-500">*</span>
                      </FormLabel>
                      <div className="relative">
                        <FormControl>
                          <Input
                            type={confirmVisible ? "text" : "password"}
                            placeholder={t("administration.users.confirmNewPasswordPlaceholder")}
                            {...field}
                            className="pr-10"
                          />
                        </FormControl>
                        <Button
                          type="button"
                          mode="icon"
                          variant="ghost"
                          className="absolute end-0.5 top-1/2 h-7 w-7 -translate-y-1/2 text-muted-foreground"
                          onClick={() => setConfirmVisible((v) => !v)}
                        >
                          {confirmVisible ? <RiEyeCloseLine /> : <RiEyeLine />}
                        </Button>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="forcePasswordChange"
                  render={({ field }) => (
                    <FormItem className="flex items-start gap-3 space-y-0 rounded-md border border-border/50 px-4 py-3">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={(checked) => field.onChange(checked === true)}
                        />
                      </FormControl>
                      <div className="space-y-1">
                        <Label className="text-sm font-medium leading-none">
                          {t("administration.users.forcePasswordChange")}
                        </Label>
                        <p className="text-xs text-muted-foreground">
                          {t("administration.users.forcePasswordChangeHint")}
                        </p>
                      </div>
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-x-4 gap-y-0.5 text-[10px] text-muted-foreground">
                  <span>{t("administration.users.minChars")}</span>
                  <span>{t("administration.users.minUppercase")}</span>
                  <span>{t("administration.users.minLowercase")}</span>
                  <span>{t("administration.users.minSpecial")}</span>
                </div>
              </form>
            </Form>
          </ScrollArea>
        </SheetBody>

        <SheetFooter className="border-border flex-row gap-2.5 border-t p-5 pb-4 lg:gap-0 mt-auto">
          <Button type="button" variant="ghost" onClick={closeChangePasswordSheet}>
            {t("common.close", "Close")}
          </Button>
          <div className="flex-1" />
          <Button type="button" variant="outline" onClick={closeChangePasswordSheet} className="mr-3">
            {t("common.cancel", "Cancel")}
          </Button>
          <Button
            type="button"
            variant="primary"
            onClick={handleSubmit}
            disabled={isPending}
            className="font-semibold"
          >
            {isPending && <Loader2 className="size-4 animate-spin" />}
            {t("administration.users.updatePassword")}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
