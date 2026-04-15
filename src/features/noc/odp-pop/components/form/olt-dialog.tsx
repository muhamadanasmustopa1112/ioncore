"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogBody,
  DialogFooter,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { useOltStore } from "../../store/olt";
import { DEFAULT_OLT_VALUES, OltFormValues, oltSchema } from "../../types/olt";
import { AddOltForm } from "./olt-form";

export function AddOltDialog() {
  const { isAddOltDialogOpen, setAddOltDialogOpen } = useOltStore();

  const form = useForm<OltFormValues>({
    resolver: zodResolver(oltSchema),
    defaultValues: DEFAULT_OLT_VALUES,
  });

  const { isSubmitting } = form.formState;

  async function onSubmit(data: OltFormValues) {
    // TODO: Integrate with actual API
    console.log("Submitting new OLT:", data);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    toast.success("OLT created successfully");
    setAddOltDialogOpen(false);
    form.reset(DEFAULT_OLT_VALUES);
  }

  function handleOpenChange(open: boolean) {
    setAddOltDialogOpen(open);
    if (!open) form.reset(DEFAULT_OLT_VALUES);
  }

  return (
    <Dialog open={isAddOltDialogOpen} onOpenChange={handleOpenChange}>
      <Button size="sm" className="h-8" onClick={() => setAddOltDialogOpen(true)}>
        <Plus className="size-4" />
        Add New OLT
      </Button>

      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add New OLT</DialogTitle>
          <DialogDescription>
            Fill in the details below to add a new OLT device to this POP.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <DialogBody className="space-y-4">
              <AddOltForm />
            </DialogBody>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setAddOltDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : "Save OLT"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
