"use client";

import { useImperativeHandle, forwardRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { ScrollArea } from "@/components/ui/scroll-area";
import { DEFAULT_POP_VALUES, PopData, popSchema, type PopFormValues } from "../../types/pop";
import { usePopStore } from "../../store/pop";
import { useBranchList } from "@/features/administration/branch/api/branch-queries";
import { useCreatePop } from "../../api/create-pop";
import { useUpdatePop } from "../../api/update-pop";
import { GeneralInfoSection } from "./sections/general-info-section";
import { LocationInfoSection } from "./sections/location-info-section";

type PopFormProps = {
    mode: "new" | "edit" | "details";
    onSuccess?: () => void;
    popId?: string;
    readOnly?: boolean;
};

export type PopFormRef = {
    submit: () => void;
    isPending: boolean;
};

export const PopForm = forwardRef<PopFormRef, PopFormProps>(
    ({ onSuccess, popId, readOnly = false, mode }, ref) => {
        const { closePopFormSheet, selectedPop } = usePopStore();

        const { data: branches, isLoading: isLoadingBranches } = useBranchList();

        const data = selectedPop;

        const mapPopToFormValues = (pop: PopData): PopFormValues => {
            const branchId = pop.branch?.id || (pop as any).branchId || pop.branch?.id || "";

            let finalBranchId = branchId;
            if (!finalBranchId && pop.area && branches) {
                const matchingBranch = branches.find(
                    (b) => b.name === pop.area
                );
                if (matchingBranch) {
                    finalBranchId = matchingBranch.id;
                }
            }

            return {
                branch_id: finalBranchId,
                code: pop.code ?? "",
                gps_lat: pop.gps_lat?.toString() ?? "",
                gps_lng: pop.gps_lng?.toString() ?? "",
                name: pop.name,
                status: pop.status ?? "UP",
                address: pop.address ?? "",
            };
        };

        const form = useForm<PopFormValues>({
            resolver: zodResolver(popSchema),
            values: (data && mode !== "new") ? mapPopToFormValues(data) : (DEFAULT_POP_VALUES as PopFormValues),
        });

        const { mutate: createPop, isPending: isCreating } = useCreatePop({
            mutationConfig: {
                onSuccess: () => {
                    form.reset();
                    closePopFormSheet();
                    onSuccess?.();
                },
            },
        });

        const { mutate: updatePop, isPending: isUpdating } = useUpdatePop({
            mutationConfig: {
                onSuccess: () => {
                    form.reset();
                    closePopFormSheet();
                    onSuccess?.();
                },
            },
        });

        const isPending = isCreating || isUpdating;

        useImperativeHandle(ref, () => ({
            submit: () => form.handleSubmit(onSubmit)(),
            isPending,
        }));

        const onSubmit = (formData: PopFormValues) => {
            if (mode === "edit" && popId) {
                updatePop({ id: popId, data: formData });
            } else {
                createPop(formData);
            }
        };

        return (
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="flex h-full flex-col overflow-hidden">
                    <ScrollArea className="flex-1 px-6 py-6">
                        <div className="space-y-8 pb-6">
                            <GeneralInfoSection
                                branches={branches}
                                isLoadingBranches={isLoadingBranches}
                                readOnly={readOnly}
                                isPending={isPending}
                            />

                            <LocationInfoSection
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

PopForm.displayName = "PopForm";
