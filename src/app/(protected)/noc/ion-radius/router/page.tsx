import { Suspense } from "react";
import { Metadata } from "next";
import { ScreenLoader } from "@/components/common/screen-loader";
import { RouterListPage } from "@/features/noc/router/components";

export const metadata: Metadata = {
    title: "Router",
    description: "Manage router.",
};

export default function Page() {
    return (
        <Suspense fallback={<ScreenLoader />}>
            <RouterListPage />
        </Suspense>
    );
}
