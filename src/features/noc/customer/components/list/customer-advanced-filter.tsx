"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function CustomerAdvancedFilter() {
  const { t } = useTranslation();
  const [registerDate, setRegisterDate] = useState<Date>();
  const [dueDate, setDueDate] = useState<Date>();
  const [renewalDate, setRenewalDate] = useState<Date>();

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 py-4 px-1">
      {/* Row 1 */}
      <div className="space-y-2">
        <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{t("nocCustomer.serviceStatus", "Service Status")}</Label>
        <Select>
          <SelectTrigger className="bg-background">
            <SelectValue placeholder={t("nocCustomer.allStatus", "ALL STATUS")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("nocCustomer.allStatus", "ALL STATUS")}</SelectItem>
            <SelectItem value="active">{t("nocCustomer.active", "Active")}</SelectItem>
            <SelectItem value="suspended">{t("nocCustomer.suspended", "Suspended")}</SelectItem>
            <SelectItem value="disabled">{t("nocCustomer.disabled", "Disabled")}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{t("nocCustomer.dataOwner", "Data Owner")}</Label>
        <Select>
          <SelectTrigger className="bg-background">
            <SelectValue placeholder={t("nocCustomer.allOwner", "- All Owner -")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("nocCustomer.allOwner", "- All Owner -")}</SelectItem>
            <SelectItem value="admin">{t("nocCustomer.admin", "Admin")}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{t("nocCustomer.servicePlan", "Service Plan")}</Label>
        <Select>
          <SelectTrigger className="bg-background">
            <SelectValue placeholder={t("nocCustomer.allProfile", "- All Profile -")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("nocCustomer.allProfile", "- All Profile -")}</SelectItem>
            <SelectItem value="10mbps">10 Mbps</SelectItem>
            <SelectItem value="20mbps">20 Mbps</SelectItem>
            <SelectItem value="50mbps">50 Mbps</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{t("nocCustomer.namePrefixIdPlaceholder", "Name Prefix | Customer ID")}</Label>
        <div className="relative">
          <Input placeholder={t("nocCustomer.namePrefixIdPlaceholder", "Search by Name Prefix | Customer ID")} className="bg-background" />
        </div>
      </div>

      {/* Row 2 */}
      <div className="space-y-2">
        <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{t("nocCustomer.popOdp", "ODP | POP")}</Label>
        <Select>
          <SelectTrigger className="bg-background">
            <SelectValue placeholder={t("nocCustomer.allPopOdp", "- All ODP | POP -")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("nocCustomer.allPopOdp", "- All ODP | POP -")}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{t("nocCustomer.registerDate", "Register Date")}</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "w-full justify-start text-left font-normal bg-background",
                !registerDate && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4 text-muted-foreground" />
              {registerDate ? format(registerDate, "PPP") : <span>{t("nocCustomer.registrationDatePlaceholder", "Registration Date")}</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={registerDate}
              onSelect={setRegisterDate}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>

      <div className="space-y-2">
        <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{t("nocCustomer.dueDate", "Due Date")}</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "w-full justify-start text-left font-normal bg-background",
                !dueDate && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4 text-muted-foreground" />
              {dueDate ? format(dueDate, "PPP") : <span>{t("nocCustomer.expirationDatePlaceholder", "Expiration Date")}</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={dueDate}
              onSelect={setDueDate}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>

      <div className="space-y-2">
        <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{t("nocCustomer.renewal", "Renewal")}</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "w-full justify-start text-left font-normal bg-background",
                !renewalDate && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4 text-muted-foreground" />
              {renewalDate ? format(renewalDate, "PPP") : <span>{t("nocCustomer.renewalDatePlaceholder", "Renewal Date")}</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={renewalDate}
              onSelect={setRenewalDate}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>

      {/* Row 3 - Actions */}
      <div className="md:col-span-4 flex justify-end items-center gap-3 mt-2">
        <Button variant="ghost" className="text-muted-foreground font-semibold h-11 px-6">
          {t("nocCustomer.clearAll", "Clear All")}
        </Button>
        <Button variant="primary" className="font-bold h-11 px-10 shadow-md">
          <Search className="size-4" />
          {t("nocCustomer.search", "Search")}
        </Button>
      </div>
    </div>
  );
}

