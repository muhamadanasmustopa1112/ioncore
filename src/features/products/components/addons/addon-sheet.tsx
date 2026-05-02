"use client";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle, SheetBody } from "@/components/ui/sheet";
import { useCreateAddon, useUpdateAddon } from "../../api/products-queries";
import type { Addon, CreateAddonPayload } from "../../types/products";
import { AddonForm } from "./addon-form";

interface AddonSheetProps {
  open: boolean;
  mode: "new" | "edit" | "details";
  selected: Addon | null;
  onClose: () => void;
}

export function AddonSheet({ open, mode, selected, onClose }: AddonSheetProps) {
  const create = useCreateAddon();
  const update = useUpdateAddon();
  const isPending = create.isPending || update.isPending;

  const handleSubmit = (payload: CreateAddonPayload) => {
    if (mode === "new") {
      create.mutate(payload, { onSuccess: onClose });
    } else if (mode === "edit" && selected) {
      update.mutate({ id: selected.id, payload }, { onSuccess: onClose });
    }
  };

  const handleSave = () => {
    const fn = (window as unknown as Record<string, unknown>).__productFormSubmit;
    if (typeof fn === "function") (fn as () => void)();
  };

  const title = mode === "new" ? "Add Add-on" : mode === "edit" ? "Edit Add-on" : "Add-on Detail";

  return (
    <Sheet open={open} onOpenChange={(o) => !o && onClose()}>
      <SheetContent
        aria-describedby={undefined}
        className="inset-y-0 sm:inset-y-8 lg:end-10 start-auto h-full sm:max-h-[calc(100vh-64px)] gap-0 sm:rounded-lg border p-0 sm:max-w-none w-full md:w-[520px] lg:w-[600px] flex flex-col [&_[data-slot=sheet-close]]:end-5 [&_[data-slot=sheet-close]]:top-4.5 shadow-2xl"
      >
        <SheetHeader className="border-border border-b px-5 py-4">
          <SheetTitle className="font-medium text-xl">{title}</SheetTitle>
        </SheetHeader>
        <SheetBody className="flex-1 p-0 overflow-hidden">
          <AddonForm selected={selected} mode={mode} onSubmit={handleSubmit} />
        </SheetBody>
        <SheetFooter className="border-border flex-row gap-2.5 border-t p-5 pb-4 lg:gap-0 mt-auto">
          <Button variant="ghost" onClick={onClose}>Close</Button>
          <div className="flex-1" />
          <Button variant="outline" onClick={onClose} className="mr-3" disabled={isPending}>Cancel</Button>
          <Button variant="primary" onClick={handleSave} disabled={mode === "details" || isPending} className="font-semibold">
            {isPending ? "Saving..." : mode === "new" ? "Create Add-on" : "Save Changes"}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
