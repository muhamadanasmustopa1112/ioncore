"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { RiAddLine, RiDownloadLine } from "@remixicon/react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Toolbar, ToolbarActions, ToolbarHeading, ToolbarTitle } from "@/components/common/toolbar";
import { PageBreadcrumb } from "@/components/common/page-breadcrumb";
import { paths } from "@/config/paths";
import { AnnouncementList } from "./announcement-list";
import { AnnouncementInbox } from "./announcement-inbox";
import { AnnouncementFormSheet } from "./announcement-form-sheet";
import { useAnnouncementStore } from "../store/announcement";

export function AnnouncementListPage() {
  const { t } = useTranslation();
  const { openFormSheet } = useAnnouncementStore();
  const [activeTab, setActiveTab] = useState<string>("all");

  return (
    <div className="relative h-full w-full overflow-hidden px-6 py-3">
      <PageBreadcrumb items={[
        { title: t("menu.operations", "Operations"), path: paths.dashboard.operations?.root?.getHref() || "/operations" },
        { title: t("operations.announcementsTitle", "Announcements") },
      ]} />
      <Toolbar className="mt-5 items-center">
        <ToolbarHeading>
          <ToolbarTitle className="text-2xl font-extrabold tracking-tight">
            {t("operations.announcementsTitle", "Announcements")}
          </ToolbarTitle>
        </ToolbarHeading>
        <ToolbarActions>
          <Button variant="outline" className="h-11 px-5 font-semibold shadow-xs">
            <RiDownloadLine className="size-4" />
            {t("common.exportData", "Export Data")}
          </Button>
          <Button
            variant="primary"
            className="h-11 px-6 font-semibold shadow-md"
            onClick={() => openFormSheet("new")}
          >
            <RiAddLine className="size-5" />
            {t("announcements.newAnnouncement", "New Announcement")}
          </Button>
        </ToolbarActions>
      </Toolbar>
      <div className="mt-4">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList variant="line" size="lg">
            <TabsTrigger value="all">
              {t("announcements.allAnnouncements", "All Announcements")}
            </TabsTrigger>
            <TabsTrigger value="inbox">
              {t("announcements.myInbox", "My Inbox")}
            </TabsTrigger>
          </TabsList>
          <TabsContent value="all" className="mt-0">
            <AnnouncementList />
          </TabsContent>
          <TabsContent value="inbox" className="mt-0">
            <AnnouncementInbox />
          </TabsContent>
        </Tabs>
      </div>
      <AnnouncementFormSheet />
    </div>
  );
}
