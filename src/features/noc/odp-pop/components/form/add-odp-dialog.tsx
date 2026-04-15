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
import { useOdpStore } from "../../store/odp";
import { DEFAULT_ODP_VALUES, OdpFormValues, odpSchema } from "../../types/odp";
import { AddOdpForm } from "./odp-form";

export function AddOdpDialog() {
  const { isAddOdpDialogOpen, setAddOdpDialogOpen } = useOdpStore();

  const form = useForm<OdpFormValues>({
    resolver: zodResolver(odpSchema),
    defaultValues: DEFAULT_ODP_VALUES as OdpFormValues,
  });

  const { isSubmitting } = form.formState;

  async function onSubmit(data: OdpFormValues) {
    console.log("Submitting new ODP:", data);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    toast.success("ODP created successfully");
    setAddOdpDialogOpen(false);
    form.reset(DEFAULT_ODP_VALUES as OdpFormValues);
  }

  function handleOpenChange(open: boolean) {
    setAddOdpDialogOpen(open);
    if (!open) form.reset(DEFAULT_ODP_VALUES as OdpFormValues);
  }

  return (
    <Dialog open={isAddOdpDialogOpen} onOpenChange={handleOpenChange}>
      <Button size="sm" className="h-8" onClick={() => setAddOdpDialogOpen(true)}>
        <Plus className="size-4" />
        Add ODP
      </Button>

      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add New ODP</DialogTitle>
          <DialogDescription>
            Fill in the details below to register a new ODP on this OLT.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <DialogBody className="space-y-4">
              <AddOdpForm />
            </DialogBody>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setAddOdpDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : "Save ODP"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
