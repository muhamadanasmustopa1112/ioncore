import { Suspense } from "react";
import { Metadata } from "next";
import { ScreenLoader } from "@/components/common/screen-loader";
import { OdpPopManagePage } from "@/features/noc/odp-pop/components";

export const metadata: Metadata = {
    title: "Manage ODP | POP",
    description: "Monitoring and managing ODP & POP locations via list and interactive map views.",
};

export default function Page() {
    return (
        <Suspense fallback={<ScreenLoader />}>
            <OdpPopManagePage />
        </Suspense>
    );
}
