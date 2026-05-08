"use client";

import { useMemo, useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  RowSelectionState,
} from "@tanstack/react-table";
import { useQueryStates, parseAsInteger, parseAsString } from "nuqs";
import { Filter, Search, X, ShieldAlert, CheckCircle2, Loader2, ArrowRight } from "lucide-react";

import { DataGrid, DataGridContainer } from "@/components/ui/data-grid";
import { DataGridTable } from "@/components/ui/data-grid-table";
import { DataGridPagination } from "@/components/ui/data-grid-pagination";
import {
  Card,
  CardHeader,
  CardHeading,
  CardTable,
  CardFooter
} from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from "@/components/ui/collapsible";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { RiHistoryLine } from "@remixicon/react";

import { radiusLogColumns } from "./columns";
import { DataTableToolbar } from "./table/data-table-toolbar";
import { useRadiusDashboardStore } from "../../store/use-radius-dashboard-store";

// Import Sheet Drawer
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetBody,
} from "@/components/ui/sheet";

export function RadiusLiveLogTable() {
  const { logs, isLoading } = useRadiusDashboardStore();

  const [filter, setFilter] = useQueryStates({
    limit: parseAsInteger.withDefault(10),
    page: parseAsInteger.withDefault(1),
    search: parseAsString,
  });

  const [openFilter, setOpenFilter] = useState<boolean>(false);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  // Session Control States
  const [selectedLog, setSelectedLog] = useState<any | null>(null);
  const [actionType, setActionType] = useState<"retry" | "revoke" | null>(null);
  const [reasonCode, setReasonCode] = useState<string>("");
  const [note, setNote] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // 1. Filter logs based on search query
  const filteredLogs = useMemo(() => {
    if (!filter.search) return logs;
    const searchLower = filter.search.toLowerCase();
    return logs.filter((log) => 
      log.username.toLowerCase().includes(searchLower) ||
      log.callingStationId.toLowerCase().includes(searchLower) ||
      log.nasIp.toLowerCase().includes(searchLower) ||
      (log.reason && log.reason.toLowerCase().includes(searchLower))
    );
  }, [logs, filter.search]);

  // 2. Slice filtered logs for pagination
  const paginatedLogs = useMemo(() => {
    const startIndex = (filter.page - 1) * filter.limit;
    const endIndex = startIndex + filter.limit;
    return filteredLogs.slice(startIndex, endIndex);
  }, [filteredLogs, filter.page, filter.limit]);

  const columns = useMemo(() => radiusLogColumns, []);
  const [columnOrder, setColumnOrder] = useState<string[]>(
    columns.map((column) => column.id as string),
  );

  const table = useReactTable({
    data: paginatedLogs,
    columns,
    pageCount: Math.ceil(filteredLogs.length / (filter.limit || 10)),
    state: {
      pagination: {
        pageIndex: filter.page - 1,
        pageSize: filter.limit,
      },
      columnOrder,
      rowSelection,
    },
    onColumnOrderChange: setColumnOrder,
    columnResizeMode: "onChange",
    manualPagination: true,
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  const handleSubmitAction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reasonCode) {
      alert("Please select a reason code.");
      return;
    }
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSuccessMessage(
        actionType === "retry"
          ? `AAA Re-Authentication command (CoA / Disconnect) sent successfully for ${selectedLog.username}. Session re-authenticated.`
          : `Disconnect-Request (PoD) packet sent successfully for ${selectedLog.username}. Session successfully revoked.`
      );
    }, 1000);
  };

  return (
    <>
      <DataGrid
        table={table}
        recordCount={filteredLogs.length}
        tableLayout={{
          columnsPinnable: true,
          columnsMovable: true,
          columnsVisibility: true,
          columnsResizable: true,
          cellBorder: true,
          width: "auto",
        }}
        isLoading={isLoading}
        onRowClick={(row) => {
          setSelectedLog(row);
          setActionType(null);
          setReasonCode("");
          setNote("");
          setSuccessMessage(null);
        }}
      >
        <Card className="border-none shadow-md bg-card rounded-3xl overflow-hidden mt-8">
          <CardHeader className="flex-col items-stretch pt-6 pb-4 px-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-primary/10 rounded-lg">
                <RiHistoryLine className="size-4 text-primary" />
              </div>
              <CardHeading className="text-sm font-black uppercase tracking-widest text-foreground">
                Live Authentication Logs
              </CardHeading>
            </div>

            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-2">
                <Collapsible open={openFilter} onOpenChange={setOpenFilter}>
                  <div className="flex items-center gap-2">
                    <CollapsibleTrigger asChild>
                      <Button variant="outline" size="sm" className="h-10 rounded-xl px-4 font-bold border-2">
                        <Filter className="size-3.5" />
                        Filter
                      </Button>
                    </CollapsibleTrigger>

                    <div className="relative">
                      <Search className="text-muted-foreground absolute start-3 top-1/2 size-4 -translate-y-1/2" />
                      <Input
                        placeholder="Search Logs..."
                        value={filter.search || ""}
                        onChange={(e) =>
                          setFilter({ ...filter, search: e.target.value })
                        }
                        className="h-10 w-64 ps-9 text-xs font-semibold bg-muted/30 border-none rounded-xl"
                      />
                      {filter.search && (
                        <Button
                          mode="icon"
                          variant="ghost"
                          className="absolute end-1.5 top-1/2 h-7 w-7 -translate-y-1/2"
                          onClick={() => setFilter({ ...filter, search: "" })}
                        >
                          <X className="size-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </Collapsible>
              </div>

              <DataTableToolbar />
            </div>

            <Collapsible open={openFilter}>
              <CollapsibleContent className="border-t border-border/50 mt-4 py-4">
                <div className="text-xs font-bold text-muted-foreground bg-muted/20 p-4 rounded-2xl border-2 border-dashed border-border/50 text-center">
                  Advanced log filters (NAS Client, MAC Address, Reason) will be available soon.
                </div>
              </CollapsibleContent>
            </Collapsible>
          </CardHeader>

          <CardTable className="p-0 border-t border-border/50">
            <ScrollArea>
              <DataGridContainer className="w-full">
                <div className="min-w-max">
                  <DataGridTable />
                </div>
              </DataGridContainer>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          </CardTable>

          <CardFooter className="px-6 py-4 border-t border-border/50">
            <DataGridPagination setFilter={setFilter} filter={filter} />
          </CardFooter>
        </Card>
      </DataGrid>

      {/* Action Drawer */}
      <Sheet open={!!selectedLog} onOpenChange={(open) => !open && setSelectedLog(null)}>
        <SheetContent className="w-full sm:max-w-md bg-card border-l border-border/60 shadow-2xl p-6 custom-scrollbar overflow-y-auto">
          <SheetHeader className="pb-6 border-b border-border/50">
            <SheetTitle className="text-lg font-black tracking-widest text-foreground flex items-center gap-2">
              <ShieldAlert className="size-5 text-primary" />
              SESSION CONTROL
            </SheetTitle>
            <SheetDescription className="text-xs text-muted-foreground font-medium mt-1">
              Troubleshoot subscriber logs and execute AAA re-auth or revocation directly to NAS clients.
            </SheetDescription>
          </SheetHeader>

          <SheetBody className="pt-6 space-y-6">
            {selectedLog && (
              <>
                {/* Subscriber Log Detail Card */}
                <div className="p-4 rounded-2xl bg-muted/30 border border-border/50 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-black text-muted-foreground uppercase tracking-wider">Subscriber Status</span>
                    <span className={`text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-1 rounded-md ${
                      selectedLog.status === "success" 
                        ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20" 
                        : "bg-rose-500/10 text-rose-600 border border-rose-500/20"
                    }`}>
                      {selectedLog.status}
                    </span>
                  </div>
                  
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground font-medium">Username:</span>
                      <span className="font-bold text-foreground font-mono">{selectedLog.username}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground font-medium">MAC Address:</span>
                      <span className="font-mono text-muted-foreground">{selectedLog.callingStationId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground font-medium">NAS Client IP:</span>
                      <span className="font-mono text-muted-foreground">{selectedLog.nasIp} <span className="text-[10px] text-muted-foreground/60">(Port: {selectedLog.nasPort})</span></span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground font-medium">Log Timestamp:</span>
                      <span className="text-muted-foreground">{selectedLog.timestamp}</span>
                    </div>
                    {selectedLog.reason && (
                      <div className="flex justify-between pt-1 border-t border-dashed border-border/50">
                        <span className="text-rose-500 font-bold">Failure Reason:</span>
                        <span className="text-rose-500 font-semibold">{selectedLog.reason}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Conditional Success Screen */}
                {successMessage ? (
                  <div className="p-5 rounded-2xl bg-emerald-500/5 border border-emerald-500/20 text-center space-y-4">
                    <div className="flex justify-center">
                      <CheckCircle2 className="size-12 text-emerald-500" />
                    </div>
                    <div>
                      <h4 className="text-sm font-extrabold text-emerald-700 uppercase tracking-wider">Command Dispatched</h4>
                      <p className="text-xs text-emerald-600/90 font-medium mt-1">{successMessage}</p>
                    </div>
                    
                    <div className="pt-2 border-t border-emerald-500/10 grid grid-cols-2 gap-2 text-[10px]">
                      <div className="text-left bg-emerald-500/5 p-2 rounded-xl">
                        <span className="text-emerald-500/70 block uppercase font-bold">Reason Code</span>
                        <span className="font-bold text-emerald-800">{reasonCode}</span>
                      </div>
                      <div className="text-left bg-emerald-500/5 p-2 rounded-xl">
                        <span className="text-emerald-500/70 block uppercase font-bold">Operator</span>
                        <span className="font-bold text-emerald-800">NOC-ADMIN</span>
                      </div>
                    </div>

                    {note && (
                      <div className="text-left bg-emerald-500/5 p-2.5 rounded-xl text-[10px]">
                        <span className="text-emerald-500/70 block uppercase font-bold">Admin Note</span>
                        <span className="text-emerald-800 font-medium">{note}</span>
                      </div>
                    )}

                    <Button 
                      variant="primary" 
                      onClick={() => {
                        setSuccessMessage(null);
                        setActionType(null);
                        setReasonCode("");
                        setNote("");
                      }}
                      className="w-full h-10 font-bold uppercase text-xs tracking-wider bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl"
                    >
                      Perform Another Action
                    </Button>
                  </div>
                ) : (
                  <>
                    {/* Action Selector Tabs */}
                    <div className="space-y-3">
                      <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest block">Choose Dispatch Action</span>
                      <div className="grid grid-cols-2 gap-3">
                        <button
                          type="button"
                          onClick={() => {
                            setActionType("retry");
                            setReasonCode("");
                            setNote("");
                          }}
                          className={`flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all duration-200 gap-2 ${
                            actionType === "retry"
                              ? "bg-primary/5 border-primary shadow-sm"
                              : "bg-muted/10 border-transparent hover:border-border/50"
                          }`}
                        >
                          <CheckCircle2 className={`size-5 ${actionType === "retry" ? "text-primary" : "text-muted-foreground"}`} />
                          <span className="text-xs font-black uppercase tracking-wider">Retry Session</span>
                          <span className="text-[9px] text-muted-foreground font-medium text-center">CoA Re-Authenticate</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setActionType("revoke");
                            setReasonCode("");
                            setNote("");
                          }}
                          className={`flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all duration-200 gap-2 ${
                            actionType === "revoke"
                              ? "bg-rose-500/5 border-rose-500 shadow-sm"
                              : "bg-muted/10 border-transparent hover:border-border/50"
                          }`}
                        >
                          <ShieldAlert className={`size-5 ${actionType === "revoke" ? "text-rose-500" : "text-muted-foreground"}`} />
                          <span className="text-xs font-black uppercase tracking-wider text-rose-500">Revoke Session</span>
                          <span className="text-[9px] text-muted-foreground font-medium text-center">PoD Disconnect</span>
                        </button>
                      </div>
                    </div>

                    {/* Action Form */}
                    {actionType && (
                      <form onSubmit={handleSubmitAction} className="space-y-4 pt-4 border-t border-border/50 animate-in fade-in slide-in-from-bottom-2 duration-200">
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Reason Code</label>
                          <select
                            value={reasonCode}
                            onChange={(e) => setReasonCode(e.target.value)}
                            className="flex h-12 w-full items-center justify-between rounded-xl bg-muted/40 border border-transparent px-3.5 py-2 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-primary/20"
                            required
                          >
                            <option value="" disabled>-- Select Reason Code --</option>
                            {actionType === "retry" ? (
                              <>
                                <option value="MIGRATE_DEVICE">ONT / Hardware Migration</option>
                                <option value="SIGNAL_RESTORED">Optical Signal Restored</option>
                                <option value="CONFIG_RESET">Router/CPE Reset</option>
                                <option value="SPEED_BOOST">Speed Boost Provisioning</option>
                                <option value="OTHER">Other Technical Resolution</option>
                              </>
                            ) : (
                              <>
                                <option value="EXPIRED_TRIAL">Temp / Trial Period Expired</option>
                                <option value="BILLING_UNPAID">Unpaid Bill suspension</option>
                                <option value="SUSPICIOUS_TRAFFIC">High packet rate / Abuse</option>
                                <option value="USER_REQUEST">Customer account termination</option>
                                <option value="OTHER">Other Administrative Action</option>
                              </>
                            )}
                          </select>
                        </div>

                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Note / Remark</label>
                          <textarea
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                            placeholder="Enter administrative note..."
                            rows={3}
                            className="flex w-full rounded-xl bg-muted/40 border border-transparent px-3.5 py-2.5 text-xs font-semibold placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
                            required
                          />
                        </div>

                        <Button
                          type="submit"
                          disabled={isSubmitting}
                          className={`w-full h-12 font-black uppercase text-xs tracking-wider rounded-2xl shadow-lg flex items-center justify-center gap-2 ${
                            actionType === "retry"
                              ? "bg-primary hover:bg-primary/90 text-white shadow-primary/20"
                              : "bg-rose-500 hover:bg-rose-600 text-white shadow-rose-500/20"
                          }`}
                        >
                          {isSubmitting ? (
                            <>
                              <Loader2 className="size-4 animate-spin" />
                              Sending Command...
                            </>
                          ) : (
                            <>
                              Dispatch AAA Request
                              <ArrowRight className="size-4" />
                            </>
                          )}
                        </Button>
                      </form>
                    )}
                  </>
                )}
              </>
            )}
          </SheetBody>
        </SheetContent>
      </Sheet>
    </>
  );
}
