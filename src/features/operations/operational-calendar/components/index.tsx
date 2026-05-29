"use client";

import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { CalendarDays, CalendarRange, List, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Toolbar, ToolbarActions, ToolbarHeading, ToolbarTitle } from "@/components/common/toolbar";
import { PageBreadcrumb } from "@/components/common/page-breadcrumb";
import { paths } from "@/config/paths";
import { useCalendarEvents } from "../api/get-calendar-events";
import { useCalendarStore } from "../store/calendar";
import { MonthlyView } from "./calendar-monthly-view";
import { WeeklyView } from "./calendar-weekly-view";
import { ListView } from "./calendar-list-view";
import { EventDrawer } from "./calendar-event-drawer";
import type { CalendarEvent, CalendarViewType } from "../types";

const VIEW_TABS: { value: CalendarViewType; label: string; icon: React.ElementType }[] = [
  { value: "monthly", label: "Monthly", icon: CalendarDays },
  { value: "weekly", label: "Weekly", icon: CalendarRange },
  { value: "list", label: "List", icon: List },
];

export function OperationalCalendarPage() {
  const { t } = useTranslation();
  const { view, setView, currentMonth, filters } = useCalendarStore();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const params = useMemo(
    () => ({
      draw: 1,
      start: 0,
      length: 200,
      month: currentMonth,
      event_type: filters.event_types.length === 1 ? filters.event_types[0] : undefined,
      area_id: filters.area_id ?? undefined,
    }),
    [currentMonth, filters],
  );

  const { data: calendarData, isLoading } = useCalendarEvents({ params });
  const events = useMemo(() => calendarData?.data ?? [], [calendarData]);

  const handleEventClick = (_event: CalendarEvent) => {
    setDrawerOpen(true);
  };

  return (
    <div className="relative h-full w-full overflow-hidden px-6 py-3">
      <PageBreadcrumb
        items={[
          {
            title: t("menu.operations", "Operations"),
            path: paths.dashboard.operations?.root?.getHref() || "/operations",
          },
          { title: t("operations.calendarTitle", "Operational Calendar") },
        ]}
      />

      <Toolbar className="mt-5 items-center">
        <ToolbarHeading>
          <ToolbarTitle className="text-2xl font-extrabold tracking-tight">
            {t("operations.calendarTitle", "Operational Calendar")}
          </ToolbarTitle>
        </ToolbarHeading>
        <ToolbarActions>
          <Button variant="primary" className="h-11 px-6 font-semibold shadow-md">
            <Plus className="size-5" />
            {t("calendar.newEvent", "New Event")}
          </Button>
        </ToolbarActions>
      </Toolbar>

      <div className="mt-4">
        <Tabs
          value={view}
          onValueChange={(v) => setView(v as CalendarViewType)}
        >
          <TabsList variant="line" size="sm">
            {VIEW_TABS.map((tab) => (
              <TabsTrigger key={tab.value} value={tab.value} className="gap-1.5">
                <tab.icon className="size-3.5" />
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="monthly" className="mt-4">
            {isLoading ? (
              <div className="flex items-center justify-center h-64 text-sm text-muted-foreground">
                Loading calendar...
              </div>
            ) : (
              <MonthlyView events={events} onEventClick={handleEventClick} />
            )}
          </TabsContent>

          <TabsContent value="weekly" className="mt-4">
            {isLoading ? (
              <div className="flex items-center justify-center h-64 text-sm text-muted-foreground">
                Loading calendar...
              </div>
            ) : (
              <WeeklyView events={events} onEventClick={handleEventClick} />
            )}
          </TabsContent>

          <TabsContent value="list" className="mt-4">
            {isLoading ? (
              <div className="flex items-center justify-center h-64 text-sm text-muted-foreground">
                Loading calendar...
              </div>
            ) : (
              <ListView events={events} onEventClick={handleEventClick} />
            )}
          </TabsContent>
        </Tabs>
      </div>

      <EventDrawer open={drawerOpen} onOpenChange={setDrawerOpen} />
    </div>
  );
}
