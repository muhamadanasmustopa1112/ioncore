"use client";

import { useState } from "react";
import { RiInformationLine, RiShieldLine } from "@remixicon/react";
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
import { useRoleStore } from "../../store/role";

export function RoleDialog() {
  const { roleDialogOpen, closeRoleDialog, form } = useRoleStore();

  const isNewMode = form === "new";
  const isEditMode = form === "edit";
  const isDetailMode = form === "details";

  const [name, setName] = useState(isEditMode || isDetailMode ? "NOC Engineer" : "");
  const [description, setDescription] = useState(
    isEditMode || isDetailMode ? "Network Operations Center engineer" : ""
  );
  const [keyPermissions, setKeyPermissions] = useState(
    isEditMode || isDetailMode ? "Network monitoring, BAST verification" : ""
  );

  const handleSave = () => {
    closeRoleDialog();
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
          {/* General Info */}
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

          {/* Permissions Summary */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-1 border-b border-border/50">
              <RiShieldLine className="size-4 text-purple-500" />
              <h3 className="text-sm font-semibold">Key Permissions Summary</h3>
            </div>
            <div className="space-y-2">
              <Label htmlFor="keyPermissions" className="text-xs font-medium text-muted-foreground">
                Permissions (human-readable)
              </Label>
              <Textarea
                id="keyPermissions"
                placeholder="e.g. Network monitoring, BAST verification, maintenance WO creation"
                className="min-h-[80px] resize-none"
                value={keyPermissions}
                onChange={(e) => setKeyPermissions(e.target.value)}
                disabled={isDetailMode}
              />
              <p className="text-[11px] text-muted-foreground">
                Full permission matrix will be configured here once BE contract is defined.
              </p>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={closeRoleDialog}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleSave}
            disabled={isDetailMode}
            className="font-semibold"
          >
            {isNewMode ? "Create Role" : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
