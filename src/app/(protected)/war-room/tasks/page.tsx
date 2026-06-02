import { Suspense } from "react";
import { Metadata } from "next";
import { ScreenLoader } from "@/components/common/screen-loader";
import { TaskBoardPage } from "@/features/war-room/tasks/components";

export const metadata: Metadata = {
  title: "Task Board",
  description: "Kanban-style task board for incidents.",
};

export default function Page() {
  return (
    <Suspense fallback={<ScreenLoader />}>
      <TaskBoardPage />
    </Suspense>
  );
}
