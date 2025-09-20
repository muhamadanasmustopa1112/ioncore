import { Suspense } from "react";
import { VerifyEmailForm } from "@/features/auth/verify-email";
import { ScreenLoader } from "@/components/screen-loader";

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<ScreenLoader />}>
      <VerifyEmailForm />
    </Suspense>
  );
}
