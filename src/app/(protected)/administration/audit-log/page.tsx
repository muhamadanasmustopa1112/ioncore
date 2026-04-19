import { Suspense } from "react";
import { Metadata } from "next";
import { ScreenLoader } from "@/components/common/screen-loader";
import { AuditLogPage } from "@/features/administration/audit-log/components";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Audit Log",
  description: "Immutable record of all administration changes.",
};

export default function Page() {
  return (
    <Suspense fallback={<ScreenLoader />}>
      <AuditLogPage />
    </Suspense>
  );
}
