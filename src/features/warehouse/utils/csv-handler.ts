import { LowStockAlertData } from "../types";

// Extended interface that includes receivedBy field
export interface AssetWithReceivedBy extends LowStockAlertData {
  receivedBy: string;
}

export interface AssetImportRow {
  name: string;
  sku: string;
  category: string;
  brand: string;
  model: string;
  units: string;
  threshold: string;
  uom: string;
  receivedBy: string;
}

export const parseCSV = (text: string): AssetImportRow[] => {
  const lines = text.split('\n').filter(line => line.trim());
  if (lines.length < 2) throw new Error('CSV must have header and at least one data row');
  
  const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
  const data: AssetImportRow[] = [];
  
  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',').map(v => v.trim());
    if (values.length !== headers.length) continue;
    
    const row: any = {};
    headers.forEach((header, index) => {
      row[header] = values[index];
    });
    
    data.push(row as AssetImportRow);
  }
  
  return data;
};

export const validateImportRow = (row: AssetImportRow): string[] => {
  const errors: string[] = [];
  
  if (!row.name || row.name.length < 3) errors.push('Name must be at least 3 characters');
  if (!row.sku || row.sku.length < 3) errors.push('SKU must be at least 3 characters');
  if (!row.brand || row.brand.length < 2) errors.push('Brand is required');
  if (!row.model || row.model.length < 2) errors.push('Model is required');
  if (!row.receivedBy || row.receivedBy.length < 2) errors.push('Received by name is required');
  
  const validCategories = ['Cables', 'Equipment', 'Connectors'];
  if (!row.category || !validCategories.includes(row.category)) {
    errors.push('Category must be one of: Cables, Equipment, Connectors');
  }
  
  const units = parseInt(row.units);
  if (isNaN(units) || units < 0) errors.push('Units must be a positive number');
  
  const threshold = parseInt(row.threshold);
  if (isNaN(threshold) || threshold < 1) errors.push('Threshold must be at least 1');
  
  if (!row.uom || row.uom.length < 1) errors.push('UoM is required');
  
  return errors;
};

export const convertImportRowToAsset = (row: AssetImportRow): Omit<AssetWithReceivedBy, 'id' | 'status'> => {
  return {
    name: row.name,
    sku: row.sku,
    category: row.category as 'Cables' | 'Equipment' | 'Connectors',
    brand: row.brand,
    model: row.model,
    units: parseInt(row.units),
    threshold: parseInt(row.threshold),
    uom: row.uom,
    receivedBy: row.receivedBy,
  };
};

export const exportAssetsToCSV = (assets: AssetWithReceivedBy[]): string => {
  const headers = [
    'name',
    'sku', 
    'category',
    'brand',
    'model',
    'units',
    'threshold',
    'uom',
    'receivedBy'
  ];
  
  const csvContent = [
    headers.join(','),
    ...assets.map(asset => [
      asset.name,
      asset.sku,
      asset.category,
      asset.brand || '',
      asset.model || '',
      asset.units.toString(),
      asset.threshold.toString(),
      asset.uom,
      asset.receivedBy || ''
    ].map(field => `"${field}"`).join(','))
  ].join('\n');
  
  return csvContent;
};

export const downloadCSV = (csvContent: string, filename: string) => {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const generateImportTemplate = (): string => {
  const template = `name,sku,category,brand,model,units,threshold,uom,receivedBy
"Huawei HG8145V5","HW-ONT-992","Equipment","Huawei","HG8145V5","100","10","pieces","Budi Santoso"
"ZTE F609","ZTE-ONT-404","Equipment","ZTE","F609","50","15","pieces","Agus Prasetyo"
"Fiber Drop Cable","FIB-DROP-100","Cables","FiberOptic","100m","200","25","meters","Rizki Pratama"
"Splitter 1:8","SPL-18-PLC","Connectors","Generic","1:8 PLC","150","80","pieces","Sarah Lee"`;
  
  return template;
};
