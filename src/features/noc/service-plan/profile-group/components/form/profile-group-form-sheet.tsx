import { useRef } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import {
    Sheet,
    SheetBody,
    SheetContent,
    SheetFooter,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import { useProfileGroupStore } from "../../store/profile-group";
import { ProfileGroupForm, ProfileGroupFormRef } from "./profile-group-form";

export function ProfileGroupFormSheet() {
    const { t } = useTranslation();
    const { profileGroupSheetOpen, closeProfileGroupFormSheet, form } = useProfileGroupStore();
    const formRef = useRef<ProfileGroupFormRef>(null);

    const isNewMode = form === "new";
    const isEditMode = form === "edit";
    const isDetailMode = form === "details";

    const handleSave = () => {
        formRef.current?.submit();
    };

    const isPending = formRef.current?.isPending;
    const { selectedProfileGroup } = useProfileGroupStore();

    return (
        <Sheet open={profileGroupSheetOpen} onOpenChange={(open) => !open && closeProfileGroupFormSheet()}>
            <SheetContent className="inset-y-8 lg:end-10 start-auto h-full max-h-[calc(100vh-64px)] gap-0 rounded-lg border p-0 sm:max-w-none lg:w-[700px] flex flex-col [&_[data-slot=sheet-close]]:end-5 [&_[data-slot=sheet-close]]:top-4.5 shadow-2xl overflow-hidden">
                {/* Header */}
                <SheetHeader className="border-border border-b px-5 py-4 shrink-0 bg-card">
                    <SheetTitle className="font-medium text-xl">
                        {isNewMode ? t("nocProfileGroup.form.addNewProfileGroup", "Add New Profile Group") : isEditMode ? t("nocProfileGroup.form.editProfileGroup", "Edit Profile Group") : t("nocProfileGroup.form.profileGroupDetails", "Profile Group Details")}
                    </SheetTitle>
                </SheetHeader>

                {/* Body */}
                <SheetBody className="flex-1 p-0 overflow-hidden bg-card/50">
                    <ProfileGroupForm
                        ref={formRef}
                        mode={form || "details"}
                        profileGroupCode={selectedProfileGroup?.code}
                    />
                </SheetBody>

                {/* Footer */}
                <SheetFooter className="border-border flex-nowrap gap-2.5 border-t p-5 shrink-0 bg-card">
                    <Button variant="ghost" onClick={closeProfileGroupFormSheet} disabled={isPending}>
                        {t("nocProfileGroup.form.close", "Close")}
                    </Button>
                    <div className="flex-1" />
                    <Button variant="outline" onClick={closeProfileGroupFormSheet} disabled={isPending} className="mr-3">
                        {t("nocProfileGroup.form.cancel", "Cancel")}
                    </Button>
                    <Button
                        onClick={handleSave}
                        variant="primary"
                        className="font-semibold"
                        disabled={isDetailMode || isPending}
                    >
                        {isPending ? (isNewMode ? t("nocProfileGroup.form.creating", "Creating...") : t("nocProfileGroup.form.saving", "Saving...")) : isNewMode ? t("nocProfileGroup.form.createProfileGroup", "Create Profile Group") : t("nocProfileGroup.form.saveChanges", "Save Changes")}
                    </Button>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    );
}
