"use client";

import { useState } from "react";
import { RiInformationLine, RiShieldLine } from "@remixicon/react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import { useCreateRole } from "@/features/user-service/api/roles";
import { useRoleStore } from "../../store/role";

export function RoleDialog() {
  const { roleDialogOpen, closeRoleDialog, form } = useRoleStore();
  const isNewMode = form === "new";
  const isEditMode = form === "edit";
  const isDetailMode = form === "details";

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const { mutate: createRole, isPending } = useCreateRole();

  const handleSave = () => {
    if (!isNewMode) {
      closeRoleDialog();
      return;
    }
    if (!name.trim()) {
      toast.error("Role name is required");
      return;
    }
    createRole(
      { name: name.trim(), description: description.trim() || undefined },
      {
        onSuccess: () => {
          toast.success("Role created");
          setName("");
          setDescription("");
          closeRoleDialog();
        },
        onError: (err: unknown) => {
          const msg =
            (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
            "Failed to create role";
          toast.error(msg);
        },
      },
    );
  };

  return (
    <Dialog open={roleDialogOpen} onOpenChange={(open) => !open && closeRoleDialog()}>
      <DialogContent className="sm:max-w-[520px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            {isNewMode ? "Add New Role" : isEditMode ? "Edit Role" : "Role Details"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-2">
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-1 border-b border-border/50">
              <RiInformationLine className="size-4 text-blue-500" />
              <h3 className="text-sm font-semibold">General Information</h3>
            </div>
            <div className="space-y-2">
              <Label htmlFor="roleName" className="text-xs font-medium text-muted-foreground">
                Role Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="roleName"
                placeholder="e.g. NOC Engineer"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={isDetailMode}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="roleDescription" className="text-xs font-medium text-muted-foreground">
                Description
              </Label>
              <Textarea
                id="roleDescription"
                placeholder="What does this role do?"
                className="min-h-[72px] resize-none"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={isDetailMode}
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-1 border-b border-border/50">
              <RiShieldLine className="size-4 text-purple-500" />
              <h3 className="text-sm font-semibold">Key Permissions Summary</h3>
            </div>
            <p className="text-[11px] text-muted-foreground">
              Assign permissions via access policies after the role is created.
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={closeRoleDialog} disabled={isPending}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleSave}
            disabled={isDetailMode || isPending}
            className="font-semibold"
          >
            {isPending && <Loader2 className="size-4 animate-spin" />}
            {isNewMode ? "Create Role" : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
