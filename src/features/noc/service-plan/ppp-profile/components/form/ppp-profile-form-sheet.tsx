import { Button } from "@/components/ui/button";
import {
    Sheet,
    SheetBody,
    SheetContent,
    SheetFooter,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import { usePPPProfileStore } from "../../store/ppp-profile";
import { PPPProfileForm } from "./ppp-profile-form";

export function PPPProfileFormSheet() {
    const { pppProfileSheetOpen, closePPPProfileFormSheet, form } = usePPPProfileStore();

    const isNewMode = form === "new";
    const isEditMode = form === "edit";
    const isDetailMode = form === "details";

    const handleSave = () => {
        // Logic for saving will be handled here or inside the form
        closePPPProfileFormSheet();
    };

    return (
        <Sheet open={pppProfileSheetOpen} onOpenChange={(open) => !open && closePPPProfileFormSheet()}>
            <SheetContent className="inset-y-8 lg:end-10 start-auto h-full max-h-[calc(100vh-64px)] gap-0 rounded-lg border p-0 sm:max-w-none lg:w-[700px] flex flex-col [&_[data-slot=sheet-close]]:end-5 [&_[data-slot=sheet-close]]:top-4.5 shadow-2xl">
                {/* Header */}
                <SheetHeader className="border-border border-b px-5 py-4">
                    <SheetTitle className="font-medium text-xl">
                        {isNewMode ? "Add New Bandwidth" : isEditMode ? "Edit Bandwidth" : "Bandwidth Details"}
                    </SheetTitle>
                </SheetHeader>

                {/* Body */}
                <SheetBody className="flex-1 p-0 overflow-hidden">
                    <PPPProfileForm />
                </SheetBody>

                {/* Footer */}
                <SheetFooter className="border-border flex-row gap-2.5 border-t p-5 pb-4 lg:gap-0 mt-auto">
                    <Button variant="ghost" onClick={closePPPProfileFormSheet}>
                        Close
                    </Button>
                    <div className="flex-1" />
                    <Button variant="outline" onClick={closePPPProfileFormSheet} className="mr-3">
                        Cancel
                    </Button>
                    <Button
                        variant="primary"
                        onClick={handleSave}
                        className="font-semibold"
                        disabled={isDetailMode}
                    >
                        {isNewMode ? "Create PPP Profile" : "Save Changes"}
                    </Button>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    );
}
