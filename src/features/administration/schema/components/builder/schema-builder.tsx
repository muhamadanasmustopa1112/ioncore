"use client";

import { useSchemaStore } from "../../store/schema";
import { BillingForm } from "./billing/billing-form";
import { ServiceForm } from "./service/service-form";
import { SuspensionForm } from "./suspension/suspension-form";
import { CommissionForm } from "./commission/commission-form";
import { OnboardingForm } from "./onboarding/onboarding-form";

export function SchemaBuilder() {
  const { activeSchemaType } = useSchemaStore();

  switch (activeSchemaType) {
    case "billing":
      return <BillingForm />;
    case "service":
      return <ServiceForm />;
    case "suspension":
      return <SuspensionForm />;
    case "commission":
      return <CommissionForm />;
    case "onboarding":
      return <OnboardingForm />;
  }
}
