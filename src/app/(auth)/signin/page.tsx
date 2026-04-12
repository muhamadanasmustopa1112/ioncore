import { Suspense } from "react";
import { SigninForm } from "@/features/auth/signin";
import { ScreenLoader } from "@/components/screen-loader";

export const dynamic = "force-dynamic";

export default function SigninPage() {
  return (
    <Suspense fallback={<ScreenLoader />}>
      <SigninForm />
    </Suspense>
  );
}
