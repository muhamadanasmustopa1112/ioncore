"use client";

import { useImperativeHandle, forwardRef, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams } from "next/navigation";
import { Form } from "@/components/ui/form";
import { ScrollArea } from "@/components/ui/scroll-area";
import { DEFAULT_ODP_VALUES, OdpData, odpSchema, type OdpFormValues, type OdpPayload } from "../../types/odp";
import { useOdpStore } from "../../store/odp";
import { useCreateOdp } from "../../api/create-odp";
import { useUpdateOdp } from "../../api/update-odp";
import { useOdp } from "../../api/get-odp";
import { OdpGeneralInfoSection } from "./sections/odp-general-info-section";
import { OdpLocationInfoSection } from "./sections/odp-location-info-section";

type OdpFormProps = {
  mode: "new" | "edit" | "details";
  onSuccess?: () => void;
  odpId?: string;
  readOnly?: boolean;
};

export type OdpFormRef = {
  submit: () => void;
  isPending: boolean;
};

export const OdpForm = forwardRef<OdpFormRef, OdpFormProps>(
  ({ onSuccess, odpId, readOnly = false, mode }, ref) => {
    const params = useParams();
    const { closeOdpFormSheet, selectedOdp } = useOdpStore();

    const urlOltId = params?.id as string;

    const data = selectedOdp;

    const { data: odpListRes } = useOdp({ params: { limit: 1000 } });

    const nextSuffix = useMemo(() => {
      if (mode !== "new" && data?.code) {
        const match = data.code.match(/-(\d+)$/);
        return match ? match[1] : "001";
      }
      const codes = odpListRes?.data?.map((o) => o.code) || [];
      const numbers = codes
        .map((code) => {
          if (!code) return 0;
          const match = code.match(/-(\d+)$/);
          return match ? parseInt(match[1], 10) : 0;
        })
        .filter(Boolean);
      const nextNum = numbers.length > 0 ? Math.max(...numbers) + 1 : 1;
      return nextNum.toString().padStart(3, "0");
    }, [odpListRes, data, mode]);

    const mapOdpToFormValues = (odp: OdpData): any => ({
      code: odp.code ?? "",
      name: odp.name,
      gps_lat: odp.gps_lat?.toString() ?? "0",
      gps_lng: odp.gps_lng?.toString() ?? "0",
      olt_id: odp.olt_id ?? urlOltId ?? "",
      parent_id: (odp as any).parent_id ?? null,
      status: odp.status ?? "UP",
      total_port: odp.total_port ?? 16,
      address: odp.address ?? "",
    });

    const form = useForm<any>({
      resolver: zodResolver(odpSchema),
      values: (data && mode !== "new") ? mapOdpToFormValues(data) : {
        ...DEFAULT_ODP_VALUES,
        olt_id: urlOltId || "",
      },
    });

    const { mutate: createOdp, isPending: isCreating } = useCreateOdp({
      mutationConfig: {
        onSuccess: () => {
          form.reset();
          closeOdpFormSheet();
          onSuccess?.();
        },
      },
    });

    const { mutate: updateOdp, isPending: isUpdating } = useUpdateOdp({
      mutationConfig: {
        onSuccess: () => {
          form.reset();
          closeOdpFormSheet();
          onSuccess?.();
        },
      },
    });

    const isPending = isCreating || isUpdating;

    useImperativeHandle(ref, () => ({
      submit: () => form.handleSubmit(onSubmit)(),
      isPending,
    }));

    const onSubmit = (formData: OdpFormValues) => {
      // Parse coordinates to number before sending to API
      const payload: OdpPayload = {
        ...formData,
        gps_lat: formData.gps_lat === "" ? 0 : Number(formData.gps_lat),
        gps_lng: formData.gps_lng === "" ? 0 : Number(formData.gps_lng),
        total_port: Number(formData.total_port),
      };

      if (mode === "edit" && odpId) {
        updateOdp({ id: odpId, data: payload });
      } else {
        createOdp(payload);
      }
    };

    return (
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col h-[75vh]">
          <ScrollArea className="flex-1 w-full rounded-md border-t">
            <div className="px-6 py-6 space-y-8 pb-10">
              <OdpGeneralInfoSection
                readOnly={readOnly}
                isPending={isPending}
                nextSuffix={nextSuffix}
                mode={mode}
              />

              <OdpLocationInfoSection
                readOnly={readOnly}
                isPending={isPending}
              />
            </div>
          </ScrollArea>
        </form>
      </Form>
    );
  }
);

OdpForm.displayName = "OdpForm";
