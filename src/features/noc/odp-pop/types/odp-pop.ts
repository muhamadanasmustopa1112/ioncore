export interface PopData {
  id: string;
  name: string;
  address: string;
  oltCount: number;
  odpCount: number;
  area: string;
  latitude: number;
  longitude: number;
  status: "active" | "warning" | "down";
  isValidated: boolean;
}


