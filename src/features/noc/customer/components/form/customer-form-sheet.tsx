import { Button } from "@/components/ui/button";
import {
    Sheet,
    SheetBody,
    SheetContent,
    SheetFooter,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import { useCustomerStore } from "../../store/customer";
import { CustomerForm } from "./service-form";

export function CustomerFormSheet() {
    const { customerSheetOpen, closeCustomerFormSheet, form } = useCustomerStore();

    const isNewMode = form === "new";
    const isEditMode = form === "edit";
    const isDetailMode = form === "details";

    const handleSave = () => {
        closeCustomerFormSheet();
    };

    return (
        <Sheet open={customerSheetOpen} onOpenChange={(open) => !open && closeCustomerFormSheet()}>
            <SheetContent className="inset-y-8 lg:end-10 start-auto h-full max-h-[calc(100vh-64px)] gap-0 rounded-lg border p-0 sm:max-w-none lg:w-[700px] flex flex-col [&_[data-slot=sheet-close]]:end-5 [&_[data-slot=sheet-close]]:top-4.5 shadow-2xl">
                {/* Header */}
                <SheetHeader className="border-border border-b px-5 py-4">
                    <SheetTitle className="font-medium text-xl">
                        {isNewMode ? "Add New Customer" : isEditMode ? "Edit Customer" : "Customer Details"}
                    </SheetTitle>
                </SheetHeader>

                {/* Body */}
                <SheetBody className="flex-1 p-0 overflow-hidden">
                    <CustomerForm />
                </SheetBody>

                {/* Footer */}
                <SheetFooter className="border-border flex-row gap-2.5 border-t p-5 pb-4 lg:gap-0 mt-auto">
                    <Button variant="ghost" onClick={closeCustomerFormSheet}>
                        Close
                    </Button>
                    <div className="flex-1" />
                    <Button variant="outline" onClick={closeCustomerFormSheet} className="mr-3">
                        Cancel
                    </Button>
                    <Button
                        variant="primary"
                        onClick={handleSave}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold"
                        disabled={isDetailMode}
                    >
                        {isNewMode ? "Create Customer" : "Save Changes"}
                    </Button>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    );
}
