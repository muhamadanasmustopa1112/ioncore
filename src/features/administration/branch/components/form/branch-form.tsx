"use client";

import { useState } from "react";
import {
  RiInformationLine,
  RiMapPin2Line,
} from "@remixicon/react";
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
import { useBranchStore } from "../../store/branch";
import { DUMMY_BRANCHES } from "../../data/dummy-branch";
import { BranchLevel } from "../../types";

export function BranchForm() {
  const { form } = useBranchStore();
  const isEditMode = form === "edit";
  const isDetailMode = form === "details";

  const [name, setName] = useState(isEditMode || isDetailMode ? "Jakarta Regional" : "");
  const [code, setCode] = useState(isEditMode || isDetailMode ? "JKT-REG" : "");
  const [level, setLevel] = useState<BranchLevel>(isEditMode || isDetailMode ? "regional" : "regional");
  const [parentId, setParentId] = useState(isEditMode || isDetailMode ? "" : "");
  const [branchType, setBranchType] = useState(isEditMode || isDetailMode ? "office" : "office");
  const [active, setActive] = useState(isEditMode || isDetailMode ? "true" : "true");
  const [address, setAddress] = useState(isEditMode || isDetailMode ? "Jl. Sudirman No. 1, Jakarta Pusat" : "");

  const parentOptions = DUMMY_BRANCHES.filter((b) => {
    if (level === "area") return b.level === "regional";
    if (level === "sub_area") return b.level === "area";
    return false;
  });

  const isRegional = level === "regional";

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <ScrollArea className="flex-1 px-6 py-6">
        <div className="space-y-8 pb-6">
          {/* General Information Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-border/50">
              <RiInformationLine className="size-4 text-blue-500" />
              <h3 className="text-sm font-semibold">General Information</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="branchName" className="text-xs font-medium text-muted-foreground">
                  Branch Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="branchName"
                  placeholder="e.g. Jakarta Pusat Area"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={isDetailMode}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="branchCode" className="text-xs font-medium text-muted-foreground">
                  Branch Code <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="branchCode"
                  placeholder="e.g. JKT-PST"
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  disabled={isDetailMode}
                  className="font-mono uppercase"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="branchLevel" className="text-xs font-medium text-muted-foreground">
                  Branch Level <span className="text-red-500">*</span>
                </Label>
                {isDetailMode ? (
                  <Input
                    value={level === "sub_area" ? "Sub Area" : level.charAt(0).toUpperCase() + level.slice(1)}
                    disabled
                  />
                ) : (
                  <Select
                    value={level}
                    onValueChange={(val) => {
                      setLevel(val as BranchLevel);
                      setParentId("");
                    }}
                  >
                    <SelectTrigger id="branchLevel">
                      <SelectValue placeholder="Select Level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="regional">Regional</SelectItem>
                      <SelectItem value="area">Area</SelectItem>
                      <SelectItem value="sub_area">Sub Area</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="parentBranch" className="text-xs font-medium text-muted-foreground">
                  Parent Branch {!isRegional && <span className="text-red-500">*</span>}
                </Label>
                {isDetailMode ? (
                  <Input
                    value={
                      parentOptions.find((b) => b.id === parentId)?.name ??
                      (isRegional ? "— (Top Level)" : "")
                    }
                    disabled
                  />
                ) : (
                  <Select
                    value={parentId || "none"}
                    onValueChange={(val) => setParentId(val === "none" ? "" : val)}
                    disabled={isRegional}
                  >
                    <SelectTrigger id="parentBranch">
                      <SelectValue placeholder={isRegional ? "None (Top Level)" : "Select Parent Branch"} />
                    </SelectTrigger>
                    <SelectContent>
                      {isRegional && (
                        <SelectItem value="none">None (Top Level)</SelectItem>
                      )}
                      {parentOptions.map((b) => (
                        <SelectItem key={b.id} value={b.id}>
                          {b.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="branchType" className="text-xs font-medium text-muted-foreground">
                  Branch Type <span className="text-red-500">*</span>
                </Label>
                {isDetailMode ? (
                  <Input
                    value={branchType.charAt(0).toUpperCase() + branchType.slice(1)}
                    disabled
                  />
                ) : (
                  <Select value={branchType} onValueChange={setBranchType}>
                    <SelectTrigger id="branchType">
                      <SelectValue placeholder="Select Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="office">Office</SelectItem>
                      <SelectItem value="noc">NOC</SelectItem>
                      <SelectItem value="warehouse">Warehouse</SelectItem>
                      <SelectItem value="hybrid">Hybrid</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="branchStatus" className="text-xs font-medium text-muted-foreground">
                  Status
                </Label>
                {isDetailMode ? (
                  <Input value={active === "true" ? "Active" : "Inactive"} disabled />
                ) : (
                  <Select value={active} onValueChange={setActive}>
                    <SelectTrigger id="branchStatus">
                      <SelectValue placeholder="Select Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="true">Active</SelectItem>
                      <SelectItem value="false">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              </div>
            </div>
          </div>

          {/* Location Section */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center gap-2 pb-1 border-b border-border/50">
              <RiMapPin2Line className="size-4 text-emerald-500" />
              <h3 className="text-sm font-semibold">Location</h3>
            </div>
            <div className="space-y-2">
              <Label htmlFor="address" className="text-xs font-medium text-muted-foreground">
                Address
              </Label>
              <Textarea
                id="address"
                placeholder="Enter branch address..."
                className="min-h-[80px] resize-none"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                disabled={isDetailMode}
              />
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
