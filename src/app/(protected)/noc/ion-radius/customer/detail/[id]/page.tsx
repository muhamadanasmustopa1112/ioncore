import { Suspense } from "react";
import { Metadata } from "next";
import { ScreenLoader } from "@/components/common/screen-loader";
import { CustomerDetail } from "@/features/noc/customer/components/detail";

export const metadata: Metadata = {
    title: "Customer Detail",
    description: "Detailed view of the customer profile.",
};

export default function Page() {
    return (
        <Suspense fallback={<ScreenLoader />}>
            <CustomerDetail />
        </Suspense>
    );
}
