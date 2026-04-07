import { Suspense } from "react";
import { Metadata } from "next";
import { ScreenLoader } from "@/components/common/screen-loader";
import { CustomerCreate } from "@/features/noc/customer/components/create";

export const metadata: Metadata = {
    title: "Add New Customer",
    description: "Create a new customer profile.",
};

export default function Page() {
    return (
        <Suspense fallback={<ScreenLoader />}>
            <CustomerCreate />
        </Suspense>
    );
}
