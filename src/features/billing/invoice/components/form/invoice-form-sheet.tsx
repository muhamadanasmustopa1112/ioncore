"use client";

import { useRef } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useInvoiceStore } from "../../store/invoice";
import { InvoiceForm, type InvoiceFormRef } from "./invoice-form";

export function InvoiceFormSheet() {
  const { t } = useTranslation();
  const {
    form: mode,
    invoiceSheetOpen,
    selectedInvoice,
    closeInvoiceFormSheet,
  } = useInvoiceStore();

  const formRef = useRef<InvoiceFormRef>(null);

  const title =
    mode === "new"
      ? t("billing.invoice.addNew")
      : mode === "edit"
        ? t("billing.invoice.editInvoice")
        : t("billing.invoice.viewInvoice");

  const description =
    mode === "new"
      ? "Create a new invoice for a customer."
      : mode === "edit"
        ? "Edit invoice details and line items."
        : "View invoice details and payment history.";

  return (
    <Sheet open={invoiceSheetOpen} onOpenChange={closeInvoiceFormSheet}>
      <SheetContent className="sm:max-w-2xl overflow-y-auto">
        <SheetHeader>
          <SheetTitle>{title}</SheetTitle>
          <SheetDescription>{description}</SheetDescription>
        </SheetHeader>
        <div className="py-6">
          <InvoiceForm
            ref={formRef}
            onSuccess={closeInvoiceFormSheet}
            invoice={selectedInvoice}
            readOnly={mode === "details"}
            mode={mode}
          />
        </div>
        <SheetFooter>
          <Button variant="outline" onClick={closeInvoiceFormSheet}>
            {t("billing.common.close")}
          </Button>
          {mode !== "details" && (
            <Button
              onClick={() => formRef.current?.submit()}
              disabled={formRef.current?.isPending}
            >
              {mode === "new"
                ? t("billing.common.create")
                : t("billing.common.save")}
            </Button>
          )}
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
