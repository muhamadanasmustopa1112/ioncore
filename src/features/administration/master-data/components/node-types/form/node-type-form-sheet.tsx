"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Sheet,
  SheetBody,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useMasterDataStore } from "../../../store/master-data";
import { useCreateNodeType, useUpdateNodeType } from "../../../api/master-data-queries";

export function NodeTypeFormSheet() {
  const sheetOpen = useMasterDataStore((s) => s.sheetOpen);
  const closeSheet = useMasterDataStore((s) => s.closeSheet);
  const form = useMasterDataStore((s) => s.form);
  const selectedNodeType = useMasterDataStore((s) => s.selectedNodeType);

  const isNew = form === "new";
  const isEdit = form === "edit";
  const isDetail = form === "details";

  const createNodeType = useCreateNodeType();
  const updateNodeType = useUpdateNodeType();
  const isPending = createNodeType.isPending || updateNodeType.isPending;

  const [typeKey, setTypeKey] = useState("");
  const [label, setLabel] = useState("");
  const [description, setDescription] = useState("");
  const [sortOrder, setSortOrder] = useState("0");

  useEffect(() => {
    if (selectedNodeType) {
      setTypeKey(selectedNodeType.typeKey);
      setLabel(selectedNodeType.label);
      setDescription(selectedNodeType.description ?? "");
      setSortOrder(String(selectedNodeType.sortOrder));
    } else {
      setTypeKey("");
      setLabel("");
      setDescription("");
      setSortOrder("0");
    }
  }, [selectedNodeType]);

  const handleSave = () => {
    const payload = {
      type_key: typeKey,
      label,
      description: description || undefined,
      sort_order: Number(sortOrder),
    };

    if (isNew) {
      createNodeType.mutate(payload, { onSuccess: closeSheet });
    } else if (isEdit && selectedNodeType) {
      updateNodeType.mutate(
        { id: selectedNodeType.id, payload },
        { onSuccess: closeSheet }
      );
    }
  };

  return (
    <Sheet open={sheetOpen} onOpenChange={(open) => !open && closeSheet()}>
      <SheetContent className="inset-y-0 sm:inset-y-8 lg:end-10 start-auto h-full sm:max-h-[calc(100vh-64px)] gap-0 sm:rounded-lg border p-0 sm:max-w-none w-full md:w-[480px] flex flex-col shadow-2xl">
        <SheetHeader className="border-border border-b px-5 py-4">
          <SheetTitle className="font-medium text-xl">
            {isNew ? "Add Node Type" : isEdit ? "Edit Node Type" : "Node Type Details"}
          </SheetTitle>
        </SheetHeader>

        <SheetBody className="flex-1 overflow-auto p-5 space-y-4">
          <div className="space-y-1.5">
            <Label>Type Key <span className="text-destructive">*</span></Label>
            <Input
              value={typeKey}
              onChange={(e) => setTypeKey(e.target.value.toLowerCase().replace(/\s+/g, "_"))}
              placeholder="e.g. media_converter"
              disabled={isDetail || isEdit}
              className="font-mono"
            />
            <p className="text-xs text-muted-foreground">Unique slug key. Cannot be changed after creation.</p>
          </div>

          <div className="space-y-1.5">
            <Label>Label <span className="text-destructive">*</span></Label>
            <Input
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="e.g. Media Converter"
              disabled={isDetail}
            />
          </div>

          <div className="space-y-1.5">
            <Label>Description</Label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Optional description"
              disabled={isDetail}
              rows={3}
            />
          </div>

          <div className="space-y-1.5">
            <Label>Sort Order</Label>
            <Input
              type="number"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              disabled={isDetail}
              className="w-24"
            />
          </div>

          <div className="rounded-md bg-muted/40 p-3 text-xs text-muted-foreground">
            Icons (online / offline / trouble) can be configured after creation via the icon picker.
          </div>
        </SheetBody>

        <SheetFooter className="border-border flex-row gap-2.5 border-t p-5 pb-4 mt-auto">
          <Button variant="ghost" onClick={closeSheet}>Close</Button>
          <div className="flex-1" />
          <Button variant="outline" onClick={closeSheet} disabled={isPending}>Cancel</Button>
          <Button
            variant="primary"
            onClick={handleSave}
            disabled={isDetail || isPending || !typeKey || !label}
            className="font-semibold"
          >
            {isPending ? "Saving..." : isNew ? "Create" : "Save Changes"}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
