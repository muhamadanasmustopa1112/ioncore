import { Suspense } from "react";
import { Metadata } from "next";
import { ScreenLoader } from "@/components/common/screen-loader";
import { ProfileGroupListPage } from "@/features/noc/service-plan/profile-group/components";

export const metadata: Metadata = {
    title: "Profile Group",
    description: "Manage Profile Group.",
};

export default function Page() {
    return (
        <Suspense fallback={<ScreenLoader />}>
            <ProfileGroupListPage />
        </Suspense>
    );
}
