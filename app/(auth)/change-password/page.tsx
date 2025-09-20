import { Suspense } from "react";
import { ChangePasswordForm } from "@/features/auth/change-password";
import { ScreenLoader } from "@/components/screen-loader";

export default function ChangePasswordPage() {
  return (
    <Suspense fallback={<ScreenLoader />}>
      <ChangePasswordForm />
    </Suspense>
  );
}
