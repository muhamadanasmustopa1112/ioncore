import { Suspense } from "react";
import { ScreenLoader } from "@/components/screen-loader";
import { MenuVisibilityPage } from "@/features/administration/menu-visibility/components";

export default function Page() {
  return <Suspense fallback={<ScreenLoader />}><MenuVisibilityPage /></Suspense>;
}
