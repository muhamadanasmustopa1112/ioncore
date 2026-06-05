import type { StartOpnameRequest } from "../types/opnames";

export type StartOpnameFormValues = {
  session_number: string;
  started_by: string;
  warehouse_id: number;
  scope: string;
  scope_category_id?: number;
};

export function generateOpnameSessionNumber(): string {
  return `OPN-${Date.now()}`;
}

export function buildStartOpnamePayload(
  values: StartOpnameFormValues
): StartOpnameRequest {
  const payload: StartOpnameRequest = {
    scope: values.scope,
    session_number: values.session_number.trim(),
    started_by: values.started_by.trim(),
    warehouse_id: values.warehouse_id,
  };

  if (
    values.scope === "category" &&
    values.scope_category_id != null &&
    values.scope_category_id > 0
  ) {
    payload.scope_category_id = values.scope_category_id;
  }

  return payload;
}
