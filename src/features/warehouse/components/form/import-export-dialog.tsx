"use client";

import React, { useState, useRef } from "react";
import { Upload, Download, FileText, AlertCircle, CheckCircle2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardHeading } from "@/components/ui/card";
import { useWarehouseStore } from "../../store/warehouse";
import { AssetWithReceivedBy } from "../../utils/csv-handler";
import { 
  parseCSV, 
  validateImportRow, 
  convertImportRowToAsset, 
  exportAssetsToCSV, 
  downloadCSV, 
  generateImportTemplate,
  AssetImportRow 
} from "../../utils/csv-handler";

interface ImportExportDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ImportExportDialog({ isOpen, onClose }: ImportExportDialogProps) {
  const { assets, addAsset } = useWarehouseStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [importResults, setImportResults] = useState<{
    success: number;
    failed: number;
    errors: string[];
  } | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    setImportResults(null);

    try {
      const text = await file.text();
      const rows = parseCSV(text);
      
      let successCount = 0;
      let failedCount = 0;
      const allErrors: string[] = [];

      for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        const errors = validateImportRow(row);
        
        if (errors.length > 0) {
          failedCount++;
          allErrors.push(`Row ${i + 1}: ${errors.join(', ')}`);
        } else {
          try {
            const asset = convertImportRowToAsset(row);
            addAsset(asset);
            successCount++;
          } catch (error) {
            failedCount++;
            allErrors.push(`Row ${i + 1}: Failed to add asset`);
          }
        }
      }

      setImportResults({
        success: successCount,
        failed: failedCount,
        errors: allErrors
      });

    } catch (error) {
      setImportResults({
        success: 0,
        failed: 0,
        errors: [error instanceof Error ? error.message : 'Unknown error occurred']
      });
    } finally {
      setIsProcessing(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleExport = () => {
    const csvContent = exportAssetsToCSV(assets);
    const timestamp = new Date().toISOString().split('T')[0];
    downloadCSV(csvContent, `assets-export-${timestamp}.csv`);
  };

  const handleDownloadTemplate = () => {
    const template = generateImportTemplate();
    downloadCSV(template, 'assets-import-template.csv');
  };

  const resetImport = () => {
    setImportResults(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-hidden">
        <CardHeader className="border-b">
          <div className="flex items-center justify-between">
            <CardHeading className="flex items-center gap-2">
              <FileText className="size-5" />
              Import & Export Assets
            </CardHeading>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0"
            >
              <X className="size-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-6 space-y-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {/* Export Section */}
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-bold text-foreground mb-2">Export Assets</h3>
              <p className="text-xs text-muted-foreground mb-4">
                Download all current assets as CSV file for backup or editing
              </p>
            </div>
            
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={handleExport}
                disabled={assets.length === 0}
                className="flex items-center gap-2"
              >
                <Download className="size-4" />
                Export {assets.length} Assets
              </Button>
            </div>
          </div>

          {/* Import Section */}
          <div className="space-y-4 border-t pt-6">
            <div>
              <h3 className="text-sm font-bold text-foreground mb-2">Import Assets</h3>
              <p className="text-xs text-muted-foreground mb-4">
                Upload CSV file to add multiple assets at once
              </p>
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={handleDownloadTemplate}
                className="flex items-center gap-2"
              >
                <Download className="size-4" />
                Download Template
              </Button>

              <Button
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                disabled={isProcessing}
                className="flex items-center gap-2"
              >
                <Upload className="size-4" />
                {isProcessing ? 'Processing...' : 'Upload CSV'}
              </Button>

              <input
                ref={fileInputRef}
                type="file"
                accept=".csv"
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>

            {/* Import Results */}
            {importResults && (
              <div className="space-y-3 border-t pt-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold">Import Results</h4>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={resetImport}
                    className="h-6 px-2 text-xs"
                  >
                    Clear
                  </Button>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="size-4 text-green-500" />
                    <span className="text-sm">{importResults.success} imported successfully</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {importResults.failed > 0 ? (
                      <AlertCircle className="size-4 text-red-500" />
                    ) : (
                      <CheckCircle2 className="size-4 text-green-500" />
                    )}
                    <span className="text-sm">{importResults.failed} failed</span>
                  </div>
                </div>

                {importResults.errors.length > 0 && (
                  <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
                    <h5 className="text-xs font-bold text-red-700 dark:text-red-300 mb-2">Errors:</h5>
                    <div className="space-y-1 max-h-32 overflow-y-auto">
                      {importResults.errors.map((error, index) => (
                        <p key={index} className="text-xs text-red-600 dark:text-red-400">
                          {error}
                        </p>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Instructions */}
          <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <h4 className="text-xs font-bold text-blue-700 dark:text-blue-300 mb-2">CSV Format Requirements:</h4>
            <ul className="text-xs text-blue-600 dark:text-blue-400 space-y-1">
              <li>• Required columns: name, sku, category, brand, model, units, threshold, uom, receivedBy</li>
              <li>• Category must be exactly: Cables, Equipment, or Connectors</li>
              <li>• Units and threshold must be numbers</li>
              <li>• First row must contain headers exactly as shown in template</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
