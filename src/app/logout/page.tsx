import { Suspense } from "react";
import { LogoutPage } from "@/features/auth/logout";
import { ScreenLoader } from "@/components/screen-loader";

export const dynamic = "force-dynamic";

export default function Page() {
  return (
    <Suspense fallback={<ScreenLoader />}>
      <LogoutPage />
    </Suspense>
  );
}
