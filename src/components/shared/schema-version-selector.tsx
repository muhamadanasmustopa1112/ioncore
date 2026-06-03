"use client";

import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useQueries } from "@tanstack/react-query";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSchemaList, useSchemaVersion, schemaKeys } from "@/features/administration/schema/api/schema-queries";
import { listSchemaVersions } from "@/features/administration/schema/api/schema-api";
import { SCHEMA_TYPE_API } from "@/features/administration/schema/types/schema-type-constants";
import type { SchemaVersion } from "@/features/administration/schema/types";

interface SchemaVersionSelectorProps {
  schemaType: "billing" | "suspension" | "commission";
  customerType?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

interface FlattenedOption {
  value: string;
  label: string;
  content: object | null;
}

export function SchemaVersionSelector({
  schemaType,
  customerType,
  value,
  onChange,
  placeholder,
  disabled,
}: SchemaVersionSelectorProps) {
  const { t } = useTranslation();

  const apiType = SCHEMA_TYPE_API[schemaType] ?? schemaType.toUpperCase();

  const { data: schemasData, isLoading: loadingSchemas } = useSchemaList({
    schemaType: apiType,
    customerType,
    hasSchemaPublished: true,
    page: 1,
    size: 100,
  });

  const schemas = schemasData?.schemas ?? [];

  const schemaIds = schemas.map((s) => s.id);
  const versionsMap = useVersionsBySchemaIds(schemaIds);

  const options = useMemo<FlattenedOption[]>(() => {
    const result: FlattenedOption[] = [];
    for (const schema of schemas) {
      const versions = versionsMap?.get(schema.id) ?? [];
      for (const version of versions) {
        const status = (version.status || "").toUpperCase();
        if (status === "PUBLISHED") {
          result.push({
            value: version.id,
            label: `${schema.name} — ${version.version} (${schema.customer_type})`,
            content: version.content ?? null,
          });
        }
      }
    }
    return result;
  }, [schemas, versionsMap]);

  const selectedOption = useMemo(
    () => options.find((o) => o.value === value),
    [options, value]
  );

  const placeholderText =
    placeholder || t("billing.schema.selectSchema", "Select schema version");

  return (
    <Select value={value} onValueChange={onChange} disabled={disabled || loadingSchemas}>
      <SelectTrigger>
        <SelectValue placeholder={placeholderText} />
      </SelectTrigger>
      <SelectContent>
        {loadingSchemas && (
          <SelectItem value="__loading__" disabled>
            {t("common.loading", "Loading...")}
          </SelectItem>
        )}
        {options.length === 0 && !loadingSchemas && (
          <SelectItem value="__none__" disabled>
            {t("billing.schema.noSchemas", "No published schemas available")}
          </SelectItem>
        )}
        {options.map((opt) => (
          <SelectItem key={opt.value} value={opt.value}>
            {opt.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

export function useSchemaRules(versionId: string | null) {
  const { data: version, isLoading } = useSchemaVersion(versionId);

  return {
    rules: (version?.content as Record<string, unknown> | null) ?? null,
    isLoading,
    version,
  };
}

function useVersionsBySchemaIds(ids: string[]) {
  const results = useQueries({
    queries: ids.map((id) => ({
      queryKey: schemaKeys.versions(id),
      queryFn: async () => {
        const res = await listSchemaVersions(id);
        return res.data.schema_versions ?? [];
      },
      enabled: !!id,
      placeholderData: [],
    })),
  });

  return useMemo(() => {
    const map = new Map<string, SchemaVersion[]>();
    ids.forEach((id, i) => {
      map.set(id, results[i]?.data ?? []);
    });
    return map;
  }, [ids, results]);
}
