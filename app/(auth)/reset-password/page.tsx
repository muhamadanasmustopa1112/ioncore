import { Suspense } from "react";
import { ResetPasswordForm } from "@/features/auth/reset-password";
import { ScreenLoader } from "@/components/screen-loader";

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<ScreenLoader />}>
      <ResetPasswordForm />
    </Suspense>
  );
}
