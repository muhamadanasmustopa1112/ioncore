"use client";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetBody,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useCrossBranchRulesStore } from "../../../store/cross-branch-rules";
import { CrossBranchRulesForm } from "./cross-branch-rules-form";

export function CrossBranchRulesFormSheet() {
  const { sheetOpen, closeSheet, form } = useCrossBranchRulesStore();

  const isNewMode = form === "new";
  const isEditMode = form === "edit";
  const isDetailMode = form === "details";

  const handleSaveClick = () => {
    const submit = (window as unknown as Record<string, unknown>).__crossBranchRulesFormSubmit;
    if (typeof submit === "function") (submit as () => void)();
  };

  return (
    <Sheet open={sheetOpen} onOpenChange={(open) => !open && closeSheet()}>
      <SheetContent className="inset-y-0 sm:inset-y-8 lg:end-10 start-auto h-full sm:max-h-[calc(100vh-64px)] gap-0 sm:rounded-lg border p-0 sm:max-w-none w-full md:w-[540px] lg:w-[650px] flex flex-col [&_[data-slot=sheet-close]]:end-5 [&_[data-slot=sheet-close]]:top-4.5 shadow-2xl">
        <SheetHeader className="border-border border-b px-5 py-4">
          <SheetTitle className="font-medium text-xl">
            {isNewMode
              ? "Add Cross-branch Rule"
              : isEditMode
                ? "Edit Cross-branch Rule"
                : "Rule Details"}
          </SheetTitle>
        </SheetHeader>

        <SheetBody className="flex-1 p-0 overflow-hidden">
          <CrossBranchRulesForm onSubmit={closeSheet} />
        </SheetBody>

        <SheetFooter className="border-border flex-row gap-2.5 border-t p-5 pb-4 lg:gap-0 mt-auto">
          <Button variant="ghost" onClick={closeSheet}>
            Close
          </Button>
          <div className="flex-1" />
          <Button variant="outline" onClick={closeSheet} className="mr-3">
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleSaveClick}
            className="font-semibold"
            disabled={isDetailMode}
          >
            {isNewMode ? "Add Rule" : "Save Changes"}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
