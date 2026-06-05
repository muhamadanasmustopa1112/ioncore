import type { CreateReturnRequest } from "../types/returns";

export type CreateReturnFormValues = {
  wo_id: string;
  asset_id: number;
  condition: string;
  disposition: string;
  received_warehouse_id: number;
  actor: string;
};

export function buildCreateReturnPayload(
  values: CreateReturnFormValues
): CreateReturnRequest {
  return {
    wo_id: values.wo_id.trim(),
    asset_id: values.asset_id,
    condition: values.condition,
    disposition: values.disposition,
    received_warehouse_id: values.received_warehouse_id,
    actor: values.actor.trim(),
  };
}
