const SALES_APP_SCHEME = "ion-network-sales://";

export function buildSalesLeadDetailDeeplink(leadId: string): string {
  return `${SALES_APP_SCHEME}leads/${leadId}`;
}
