"use client";

import { EmployeeInterview } from "./employee-interview";
import { EmployeeNewArticle } from "./employee-new-article";
import { EmployeeActivitiesPhotographyWorkshop } from "./employee-photography-workshop";
import { EmployeeActivitiesProductWebinar } from "./employee-product-webinar";
import { EmployeeActivitiesProjectStatus } from "./employee-project-status";
import { EmployeeActivitiesUpcomingContent } from "./employee-upcoming-content";

export function EmployeeActivity() {
  return (
    <div className="space-y-4">
      <EmployeeNewArticle />
      <EmployeeInterview />
      <EmployeeActivitiesPhotographyWorkshop />
      <EmployeeActivitiesUpcomingContent />
      <EmployeeActivitiesProductWebinar />
      <EmployeeActivitiesProjectStatus />
    </div>
  );
}
