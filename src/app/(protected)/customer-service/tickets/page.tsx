import { Suspense } from "react";
import { Metadata } from "next";
import { ScreenLoader } from "@/components/common/screen-loader";
import { TicketListPage } from "@/features/customer-service/tickets/components";

export const metadata: Metadata = {
  title: "Tickets",
  description: "Manage customer service tickets.",
};

export default function Page() {
  return (
    <Suspense fallback={<ScreenLoader />}>
      <TicketListPage />
    </Suspense>
  );
}
