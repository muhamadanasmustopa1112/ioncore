import { ScreenLoader } from "@/components/common/screen-loader";
import { PopDetailView } from "@/features/noc/odp-pop/components/details";
import { Metadata } from "next";
import { Suspense } from "react";


export const metadata: Metadata = {
  title: "Manage ODP | POP",
  description: "Monitoring and managing ODP & POP locations via list and interactive map views.",
};


export default function PopDetailPage() {
  return (
    <Suspense fallback={<ScreenLoader />}>
      <PopDetailView />
    </Suspense>
  );
}
