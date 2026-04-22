import { Suspense } from "react";
import { Metadata } from "next";
import { ScreenLoader } from "@/components/common/screen-loader";
import { CustomerUpdate } from "@/features/noc/customer/components/update";

export const metadata: Metadata = {
    title: "Edit Customer",
    description: "Modify an existing customer profile.",
};

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    return (
        <Suspense fallback={<ScreenLoader />}>
            <CustomerUpdate id={id} />
        </Suspense>
    );
}

