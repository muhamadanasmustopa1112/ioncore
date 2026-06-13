"use client";

import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetBody,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useBranchStore } from "../../store/branch";
import { useCreateBranch, useUpdateBranch, useBranchDetail } from "../../api/branch-queries";
import { BranchForm } from "./branch-form";
import { BranchLevel, GeographicPolygon } from "../../types";

export function BranchFormSheet() {
  const { t } = useTranslation();
  const branchSheetOpen = useBranchStore((s) => s.branchSheetOpen);
  const closeBranchFormSheet = useBranchStore((s) => s.closeBranchFormSheet);
  const form = useBranchStore((s) => s.form);
  const selectedBranch = useBranchStore((s) => s.selectedBranch);

  const isNewMode = form === "new";
  const isEditMode = form === "edit";
  const isDetailMode = form === "details";

  const { data: detailBranch } = useBranchDetail(
    isEditMode || isDetailMode ? selectedBranch : null
  );

  const createBranch = useCreateBranch();
  const updateBranch = useUpdateBranch();

  const isPending = createBranch.isPending || updateBranch.isPending;

  const handleFormSubmit = (formData: {
    name: string;
    code?: string;
    is_active: boolean;
    type: string;
    level: BranchLevel;
    regionalId?: string;
    areaId?: string;
    address?: string;
    geographic_polygon?: GeographicPolygon;
    lat?: number;
    long?: number;
  }) => {
    const basePayload = {
      name: formData.name,
      ...(isNewMode ? { code: formData.code } : {}),
      is_active: formData.is_active,
      type: formData.type,
      address: formData.address,
      geographic_polygon: formData.geographic_polygon,
      lat: formData.lat,
      lon: formData.long,
    };

    if (isNewMode) {
      const branchPayload = {
        ...basePayload,
        ...(formData.level === "area" && formData.regionalId
          ? { branch_parent_id: formData.regionalId }
          : {}),
      };
      createBranch.mutate(
        {
          level: formData.level,
          regionalId: formData.regionalId,
          areaId: formData.areaId,
          payload: branchPayload,
        },
        { onSuccess: closeBranchFormSheet }
      );
    } else if (isEditMode && selectedBranch) {
      const regionalParentId =
        formData.regionalId?.trim() ||
        detailBranch?._regionalId ||
        selectedBranch._regionalId;

      const branchPayload = {
        ...basePayload,
        ...(selectedBranch.level === "area" && regionalParentId
          ? { branch_parent_id: regionalParentId }
          : {}),
      };

      updateBranch.mutate(
        {
          id: selectedBranch.id,
          level: selectedBranch.level,
          regionalId: regionalParentId || formData.regionalId,
          areaId: formData.areaId,
          payload: branchPayload,
        },
        { onSuccess: closeBranchFormSheet }
      );
    }
  };

  const handleSaveClick = () => {
    const submit = (
      window as unknown as Record<string, unknown>
    ).__branchFormSubmit;
    if (typeof submit === "function") {
      (submit as () => void)();
    }
  };

  const getTitle = () => {
    if (isNewMode) return t("administration.branch.form.addNewBranch");
    if (isEditMode) return t("administration.branch.form.editBranch");
    return t("administration.branch.form.branchDetails");
  };

  const getSaveButtonText = () => {
    if (isPending) return t("administration.branch.form.saving");
    if (isNewMode) return t("administration.branch.form.createBranch");
    return t("administration.branch.form.saveChanges");
  };

  return (
    <Sheet
      open={branchSheetOpen}
      onOpenChange={(open) => !open && closeBranchFormSheet()}
    >
      <SheetContent aria-describedby={undefined} className="inset-y-0 sm:inset-y-8 lg:end-10 start-auto h-full sm:max-h-[calc(100vh-64px)] gap-0 sm:rounded-lg border p-0 sm:max-w-none w-full md:w-[560px] lg:w-[700px] flex flex-col [&_[data-slot=sheet-close]]:end-5 [&_[data-slot=sheet-close]]:top-4.5 shadow-2xl">
        <SheetHeader className="border-border border-b px-5 py-4">
          <SheetTitle className="font-medium text-xl">
            {getTitle()}
          </SheetTitle>
        </SheetHeader>

        <SheetBody className="flex-1 p-0 overflow-hidden">
          <BranchForm onSubmit={handleFormSubmit} branchData={detailBranch ?? null} />
        </SheetBody>

        <SheetFooter className="border-border flex-row gap-2.5 border-t p-5 pb-4 lg:gap-0 mt-auto">
          <Button variant="ghost" onClick={closeBranchFormSheet}>
            {t("administration.branch.form.close")}
          </Button>
          <div className="flex-1" />
          <Button
            variant="outline"
            onClick={closeBranchFormSheet}
            className="mr-3"
            disabled={isPending}
          >
            {t("administration.branch.form.cancel")}
          </Button>
          <Button
            variant="primary"
            onClick={handleSaveClick}
            className="font-semibold"
            disabled={isDetailMode || isPending}
          >
            {getSaveButtonText()}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}