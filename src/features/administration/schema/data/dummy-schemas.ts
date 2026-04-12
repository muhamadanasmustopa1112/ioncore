export { BILLING_SCHEMAS } from "./dummy-schemas/billing";
export { ONBOARDING_SCHEMAS } from "./dummy-schemas/onboarding";
export { SERVICE_SCHEMAS } from "./dummy-schemas/service";
export { COMMISSION_SCHEMAS } from "./dummy-schemas/commission";
export { SUSPENSION_SCHEMAS } from "./dummy-schemas/suspension";
export { DUMMY_SCHEMA_VERSIONS } from "./dummy-schemas/versions";

import { BILLING_SCHEMAS } from "./dummy-schemas/billing";
import { ONBOARDING_SCHEMAS } from "./dummy-schemas/onboarding";
import { SERVICE_SCHEMAS } from "./dummy-schemas/service";
import { COMMISSION_SCHEMAS } from "./dummy-schemas/commission";
import { SUSPENSION_SCHEMAS } from "./dummy-schemas/suspension";

export const DUMMY_SCHEMAS = [
  ...BILLING_SCHEMAS,
  ...ONBOARDING_SCHEMAS,
  ...SERVICE_SCHEMAS,
  ...COMMISSION_SCHEMAS,
  ...SUSPENSION_SCHEMAS,
];
