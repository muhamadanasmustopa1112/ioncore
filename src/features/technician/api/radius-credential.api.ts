import { services } from "@/config/constants";
import { api } from "@/lib/api-client";

import type {
  GenerateRadiusCredentialRequest,
  GenerateRadiusCredentialResponse,
  GenerateRadiusCredentialEnvelope,
  WorkOrderRadiusCredential,
  WorkOrderRadiusCredentialEnvelope,
} from "../types/radius-credential-api";

const NETWORK_WORK_ORDERS_BASE = `${services.networking}/network/work-orders`;

function isRadiusCredentialEnvelope(
  res: WorkOrderRadiusCredential | WorkOrderRadiusCredentialEnvelope,
): res is WorkOrderRadiusCredentialEnvelope {
  return (
    typeof res === "object" &&
    res !== null &&
    "data" in res &&
    typeof (res as WorkOrderRadiusCredentialEnvelope).data === "object"
  );
}

function unwrapRadiusCredential(
  res: WorkOrderRadiusCredential | WorkOrderRadiusCredentialEnvelope,
): WorkOrderRadiusCredential {
  if (isRadiusCredentialEnvelope(res)) {
    return res.data;
  }
  return res;
}

function isGenerateRadiusCredentialEnvelope(
  res: GenerateRadiusCredentialResponse | GenerateRadiusCredentialEnvelope,
): res is GenerateRadiusCredentialEnvelope {
  return (
    typeof res === "object" &&
    res !== null &&
    "data" in res &&
    typeof (res as GenerateRadiusCredentialEnvelope).data === "object"
  );
}

export const getWorkOrderRadiusCredential = async (
  workOrderId: string,
): Promise<WorkOrderRadiusCredential> => {
  const res = (await api.get(
    `${NETWORK_WORK_ORDERS_BASE}/${workOrderId}/radius/credential`,
  )) as unknown as WorkOrderRadiusCredential | WorkOrderRadiusCredentialEnvelope;

  return unwrapRadiusCredential(res);
};

export const generateWorkOrderRadiusCredential = async (
  workOrderId: string,
  data: GenerateRadiusCredentialRequest,
): Promise<GenerateRadiusCredentialResponse> => {
  const res = (await api.post(
    `${NETWORK_WORK_ORDERS_BASE}/${workOrderId}/radius/credential/generate`,
    data,
  )) as unknown as GenerateRadiusCredentialResponse | GenerateRadiusCredentialEnvelope;

  if (isGenerateRadiusCredentialEnvelope(res)) {
    return res.data;
  }
  return res;
};
