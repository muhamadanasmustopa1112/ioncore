import { Suspense } from "react";
import { Metadata } from "next";
import { ScreenLoader } from "@/components/common/screen-loader";
import { CustomerListPage } from "@/features/noc/customer/components";

export const metadata: Metadata = {
    title: "Customer",
    description: "Manage customer.",
};

export default function Page() {
    return (
        <Suspense fallback={<ScreenLoader />}>
            <CustomerListPage />
        </Suspense>
    );
}
