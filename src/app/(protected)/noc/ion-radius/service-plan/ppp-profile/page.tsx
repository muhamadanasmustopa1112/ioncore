import { Suspense } from "react";
import { Metadata } from "next";
import { ScreenLoader } from "@/components/common/screen-loader";
import { BandwidthListPage } from "@/features/noc/service-plan/bandwidth/components";

export const metadata: Metadata = {
    title: "Profile PPP",
    description: "Manage bandwidth.",
};

export default function Page() {
    return (
        <Suspense fallback={<ScreenLoader />}>
            <BandwidthListPage />
        </Suspense>
    );
}
