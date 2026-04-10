import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetBody,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useUserStore } from "../../store/user";
import { UserForm } from "./user-form";

export function UserFormSheet() {
  const { userSheetOpen, closeUserFormSheet, form } = useUserStore();
  const isNewMode = form === "new";
  const isDetailMode = form === "details";

  return (
    <Sheet open={userSheetOpen} onOpenChange={(open) => !open && closeUserFormSheet()}>
      <SheetContent className="inset-y-8 lg:end-10 start-auto h-full max-h-[calc(100vh-64px)] gap-0 rounded-lg border p-0 sm:max-w-none lg:w-[760px] flex flex-col [&_[data-slot=sheet-close]]:end-5 [&_[data-slot=sheet-close]]:top-4.5 shadow-2xl">
        <SheetHeader className="border-border border-b px-5 py-4">
          <SheetTitle className="font-medium text-xl">
            {isNewMode ? "Add New User" : form === "edit" ? "Edit User" : "User Details"}
          </SheetTitle>
        </SheetHeader>
        <SheetBody className="flex-1 p-0 overflow-hidden">
          <UserForm />
        </SheetBody>
        <SheetFooter className="border-border flex-row gap-2.5 border-t p-5 pb-4 lg:gap-0 mt-auto">
          <Button variant="ghost" onClick={closeUserFormSheet}>
            Close
          </Button>
          <div className="flex-1" />
          <Button variant="outline" onClick={closeUserFormSheet} className="mr-3">
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={closeUserFormSheet}
            disabled={isDetailMode}
            className="font-semibold"
          >
            {isNewMode ? "Create User" : "Save Changes"}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
