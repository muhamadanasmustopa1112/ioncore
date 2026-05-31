import { Suspense } from "react";
import { Metadata } from "next";
import { ScreenLoader } from "@/components/common/screen-loader";
import { TicketDetailPage } from "@/features/customer-service/tickets/components/detail/ticket-detail-page";

export const metadata: Metadata = {
  title: "Ticket Detail",
  description: "View and manage ticket details.",
};

export default function Page() {
  return (
    <Suspense fallback={<ScreenLoader />}>
      <TicketDetailPage />
    </Suspense>
  );
}
