import { Suspense } from "react";
import { Metadata } from "next";
import { ScreenLoader } from "@/components/common/screen-loader";
import { PlatformConfigPage } from "@/features/administration/platform-config/components";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Platform Config",
  description: "Manage global and per-branch platform configuration.",
};

export default function Page() {
  return (
    <Suspense fallback={<ScreenLoader />}>
      <PlatformConfigPage />
    </Suspense>
  );
}
