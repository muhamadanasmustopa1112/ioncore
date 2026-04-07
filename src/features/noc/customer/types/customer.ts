import React from "react";

export interface CustomerData {
  id: string;
  customerId: string;
  name: string;
  odpPop: string;
  identityNo: string;
  mobile: string;
  countryCode: string;
  email: string;
  address: string;
  latitude: string;
  longitude: string;
  loginMethod: string;
  username: string;
  password: string;
  confirmPassword: string;
  clientAreaPassword: string;
  note: string;

  // Existing Service Plan Fields
  registrationStatus: "active" | "process";
  customerType: "regular" | "non-regular";
  serverName: string;
  paymentType: string;
  payStatus: string;
  accountStatus: string;
  dataOwner: string;
  bindOnLogin: boolean;
  serviceType: string;
  servicePlan: string;
  collectVat: boolean;
  autoProrate: boolean;
  promo: boolean;
  promoDuration: string;
  discount: number;
  sellerFee: number;
  installationFee: number;
  deviceFee: number;
  renewedOn: string;
  dueDate: string;
  expirationAction: string;
  ipAddressType: string;
  ipAddress: string;
}

export interface KpiCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  colorClassName: string;
}

