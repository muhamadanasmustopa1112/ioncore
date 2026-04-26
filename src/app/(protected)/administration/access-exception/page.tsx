import { Suspense } from "react";
import { ScreenLoader } from "@/components/screen-loader";
import { AccessExceptionPage } from "@/features/administration/access-exception/components";

export default function Page() {
  return <Suspense fallback={<ScreenLoader />}><AccessExceptionPage /></Suspense>;
}
