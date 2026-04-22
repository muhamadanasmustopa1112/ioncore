import { useRef } from "react";
import { Button } from "@/components/ui/button";
import {
    Sheet,
    SheetBody,
    SheetContent,
    SheetFooter,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import { useRouterStore } from "../../store/router";
import { RouterForm, RouterFormRef } from "./router-form";

export function RouterFormSheet() {
    const { routerSheetOpen, closeRouterFormSheet, form: formMode, selectedRouter } = useRouterStore();
    const formRef = useRef<RouterFormRef>(null);

    const isNewMode = formMode === "new";
    const isEditMode = formMode === "edit";
    const isDetailMode = formMode === "details";

    const handleSave = () => {
        formRef.current?.submit();
    };

    return (
        <Sheet open={routerSheetOpen} onOpenChange={(open) => !open && closeRouterFormSheet()}>
            <SheetContent className="inset-y-8 lg:end-10 start-auto h-full max-h-[calc(100vh-64px)] gap-0 rounded-lg border p-0 sm:max-w-none lg:w-[700px] flex flex-col [&_[data-slot=sheet-close]]:end-5 [&_[data-slot=sheet-close]]:top-4.5 shadow-2xl">
                {/* Header */}
                <SheetHeader className="border-border border-b px-5 py-4">
                    <SheetTitle className="font-medium text-xl">
                        {isNewMode ? "Add New Router" : isEditMode ? "Edit Router" : "Router Details"}
                    </SheetTitle>
                </SheetHeader>

                {/* Body */}
                <SheetBody className="flex-1 p-0 overflow-hidden">
                    <RouterForm 
                        ref={formRef}
                        mode={formMode || "new"}
                        routerId={selectedRouter?.id ? String(selectedRouter.id) : undefined}
                        readOnly={isDetailMode}
                    />
                </SheetBody>

                {/* Footer */}
                <SheetFooter className="border-border flex-row gap-2.5 border-t p-5 pb-4 lg:gap-0 mt-auto">
                    <Button variant="ghost" onClick={closeRouterFormSheet}>
                        Close
                    </Button>
                    <div className="flex-1" />
                    <Button variant="outline" onClick={closeRouterFormSheet} className="mr-3">
                        Cancel
                    </Button>
                    {!isDetailMode && (
                        <Button
                            variant="primary"
                            onClick={handleSave}
                            className="font-semibold"
                            disabled={formRef.current?.isPending}
                        >
                            {isNewMode ? "Create Router" : "Save Changes"}
                        </Button>
                    )}
                </SheetFooter>
            </SheetContent>
        </Sheet>
    );
}
