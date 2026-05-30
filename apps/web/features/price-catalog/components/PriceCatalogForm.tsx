"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod/v4";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useGetMachineModelsQuery } from "@/features/machine-models/api";
import { useGetServicesQuery } from "@/features/services/api";
import { getServiceDisplayName } from "@/lib/display-name";
import { useTranslation } from "@/lib/i18n/TranslationContext";

import type {
  CreatePriceCatalogRequest,
  UpdatePriceCatalogRequest,
} from "../types";

const schema = z
  .object({
    serviceId: z.string().min(1),
    machineModelId: z.string().min(1),
    label: z.string().min(1),
    unitPrice: z.string().min(1),
    currency: z.string().min(1),
    notes: z.string(),
    effectiveDate: z.string(),
    expiredDate: z.string(),
    isActive: z.boolean(),
  })
  .superRefine((data, ctx) => {
    const price = Number(data.unitPrice);
    if (!Number.isFinite(price) || price <= 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "__unitPriceInvalid__",
        path: ["unitPrice"],
      });
    }
    if (
      data.effectiveDate &&
      data.expiredDate &&
      data.expiredDate <= data.effectiveDate
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "__expiredAfterEffective__",
        path: ["expiredDate"],
      });
    }
  });

type FormValues = z.infer<typeof schema>;

interface PriceCatalogFormProps {
  mode: "create" | "edit";
  defaultValues?: Partial<FormValues>;
  onSubmit: (
    data: CreatePriceCatalogRequest | UpdatePriceCatalogRequest,
  ) => Promise<void>;
  isLoading?: boolean;
}

export function PriceCatalogForm({
  mode,
  defaultValues,
  onSubmit,
  isLoading,
}: PriceCatalogFormProps) {
  const { t } = useTranslation();
  const { data: servicesData, isLoading: servicesLoading } = useGetServicesQuery({
    isActive: true,
    limit: 100,
  });
  const { data: machineModelsData, isLoading: modelsLoading } = useGetMachineModelsQuery({
    isActive: true,
    limit: 100,
  });
  const services = servicesData?.data ?? [];
  const machineModels = machineModelsData?.data ?? [];

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      serviceId: defaultValues?.serviceId ?? "",
      machineModelId: defaultValues?.machineModelId ?? "",
      label: defaultValues?.label ?? "",
      unitPrice: defaultValues?.unitPrice ?? "",
      currency: defaultValues?.currency ?? "USD",
      notes: defaultValues?.notes ?? "",
      effectiveDate: defaultValues?.effectiveDate ?? "",
      expiredDate: defaultValues?.expiredDate ?? "",
      isActive: defaultValues?.isActive ?? true,
    },
  });

  const handleSubmit = async (data: FormValues) => {
    const payload: CreatePriceCatalogRequest | UpdatePriceCatalogRequest = {
      serviceId: data.serviceId,
      machineModelId: data.machineModelId,
      label: data.label.trim(),
      unitPrice: Number(data.unitPrice),
      currency: data.currency.trim() || "USD",
      notes: data.notes.trim() || undefined,
      effectiveDate: data.effectiveDate || undefined,
      expiredDate: data.expiredDate || undefined,
      isActive: data.isActive,
    };
    await onSubmit(payload);
  };

  const translateError = (message: string | undefined) => {
    if (message === "__unitPriceInvalid__")
      return t("priceCatalog.unitPriceInvalid");
    if (message === "__expiredAfterEffective__")
      return t("priceCatalog.expiredAfterEffective");
    return message;
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-5">
        <FormField
          control={form.control}
          name="serviceId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                {t("priceCatalog.service")}{" "}
                <span className="text-destructive">*</span>
              </FormLabel>
              <FormControl>
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="w-full">
                    <SelectValue
                      placeholder={t("priceCatalog.selectService")}
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {servicesLoading ? (
                      <div className="px-2 py-3 text-sm text-muted-foreground">កំពុងផ្ទុក...</div>
                    ) : services.length === 0 ? (
                      <div className="px-2 py-3 text-sm text-muted-foreground">មិនមានទិន្នន័យសេវាកម្ម</div>
                    ) : (
                      services.map((service) => (
                        <SelectItem key={service.id} value={service.id}>
                          {getServiceDisplayName(service)} — {service.code}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="machineModelId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                {t("priceCatalog.machineModel")}{" "}
                <span className="text-destructive">*</span>
              </FormLabel>
              <FormControl>
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="w-full">
                    <SelectValue
                      placeholder={t("priceCatalog.selectMachineModel")}
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {modelsLoading ? (
                      <div className="px-2 py-3 text-sm text-muted-foreground">កំពុងផ្ទុក...</div>
                    ) : machineModels.length === 0 ? (
                      <div className="px-2 py-3 text-sm text-muted-foreground">មិនមានទិន្នន័យម៉ូដែល</div>
                    ) : (
                      machineModels.map((model) => (
                        <SelectItem key={model.id} value={model.id}>
                          {model.brand} {model.model}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="label"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                {t("priceCatalog.label")}{" "}
                <span className="text-destructive">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  placeholder={t("priceCatalog.labelPlaceholder")}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="unitPrice"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  {t("priceCatalog.unitPrice")}{" "}
                  <span className="text-destructive">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.01"
                    min="0.01"
                    placeholder={t("priceCatalog.unitPricePlaceholder")}
                    {...field}
                  />
                </FormControl>
                <FormMessage>
                  {translateError(form.formState.errors.unitPrice?.message)}
                </FormMessage>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="currency"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  {t("priceCatalog.currency")}{" "}
                  <span className="text-destructive">*</span>
                </FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="effectiveDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("priceCatalog.effectiveDate")}</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="expiredDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("priceCatalog.expiredDate")}</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage>
                  {translateError(form.formState.errors.expiredDate?.message)}
                </FormMessage>
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("priceCatalog.notes")}</FormLabel>
              <FormControl>
                <Textarea
                  placeholder={t("priceCatalog.notesPlaceholder")}
                  className="min-h-[80px] resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="isActive"
          render={({ field }) => (
            <FormItem className="flex items-center justify-between rounded-lg border p-4">
              <div>
                <FormLabel>{t("priceCatalog.statusLabel")}</FormLabel>
                <p className="text-sm text-muted-foreground">
                  {field.value ? t("common.active") : t("common.inactive")}
                </p>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />

        {form.formState.errors.root && (
          <p className="text-sm text-destructive">
            {form.formState.errors.root.message}
          </p>
        )}

        <div className="sticky bottom-16 md:static z-10 bg-background/95 backdrop-blur-sm md:bg-transparent pt-4 pb-2 md:py-0 border-t md:border-t-0">
          <Button
            type="submit"
            size="lg"
            className="w-full md:w-auto"
            disabled={isLoading}
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {mode === "create"
              ? t("priceCatalog.createEntry")
              : t("common.save")}
          </Button>
        </div>
      </form>
    </Form>
  );
}
