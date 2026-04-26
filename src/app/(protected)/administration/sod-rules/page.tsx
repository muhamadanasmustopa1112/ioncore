import { Suspense } from "react";
import { ScreenLoader } from "@/components/screen-loader";
import { SodRulesPage } from "@/features/administration/sod-rules/components";

export default function Page() {
  return <Suspense fallback={<ScreenLoader />}><SodRulesPage /></Suspense>;
}
