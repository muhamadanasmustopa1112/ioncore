import { Suspense } from "react";
import { SignupForm } from "@/features/auth/signup";
import { ScreenLoader } from "@/components/screen-loader";

export default function SignupPage() {
  return (
    <Suspense fallback={<ScreenLoader />}>
      <SignupForm />
    </Suspense>
  );
}
