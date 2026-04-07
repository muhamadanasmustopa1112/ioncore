import { Suspense } from "react";
import { Metadata } from "next";
import { ScreenLoader } from "@/components/common/screen-loader";
import { CustomerUpdate } from "@/features/noc/customer/components/update";

export const metadata: Metadata = {
    title: "Edit Customer",
    description: "Modify an existing customer profile.",
};

export default function Page() {
    return (
        <Suspense fallback={<ScreenLoader />}>
            <CustomerUpdate />
        </Suspense>
    );
}
