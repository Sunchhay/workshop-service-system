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
import { Textarea } from "@/components/ui/textarea";
import { useGetMachineModelsQuery } from "@/features/machine-models/api";
import { useGetServicesQuery } from "@/features/services/api";
import { useTranslation } from "@/lib/i18n/TranslationContext";

import type {
  CreateServicePriceRequest,
  UpdateServicePriceRequest,
} from "../types";

const schema = z
  .object({
    serviceId: z.string().min(1),
    machineModelId: z.string().min(1),
    ownerPrice: z.string().optional(),
    mechanicPrice: z.string().optional(),
    note: z.string().optional(),
    status: z.enum(["ACTIVE", "INACTIVE"]),
  })
  .superRefine((data, ctx) => {
    const owner = data.ownerPrice?.trim();
    const mechanic = data.mechanicPrice?.trim();
    if (!owner && !mechanic) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "atLeastOnePrice",
        path: ["ownerPrice"],
      });
    }
    if (owner && isNaN(parseFloat(owner))) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "invalidPrice",
        path: ["ownerPrice"],
      });
    }
    if (mechanic && isNaN(parseFloat(mechanic))) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "invalidPrice",
        path: ["mechanicPrice"],
      });
    }
  });

type FormValues = z.infer<typeof schema>;

interface ServicePriceFormProps {
  mode: "create" | "edit";
  defaultValues?: Partial<FormValues>;
  onSubmit: (
    data: CreateServicePriceRequest | UpdateServicePriceRequest,
  ) => Promise<void>;
  isLoading?: boolean;
}

export function ServicePriceForm({
  mode,
  defaultValues,
  onSubmit,
  isLoading,
}: ServicePriceFormProps) {
  const { t } = useTranslation();

  const { data: servicesData } = useGetServicesQuery({ limit: 100 });
  const { data: modelsData } = useGetMachineModelsQuery({ limit: 100 });

  const services = servicesData?.data ?? [];
  const machineModels = modelsData?.data ?? [];

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      serviceId: defaultValues?.serviceId ?? "",
      machineModelId: defaultValues?.machineModelId ?? "",
      ownerPrice: defaultValues?.ownerPrice ?? "",
      mechanicPrice: defaultValues?.mechanicPrice ?? "",
      note: defaultValues?.note ?? "",
      status: defaultValues?.status ?? "ACTIVE",
    },
  });

  const handleSubmit = async (data: FormValues) => {
    const ownerPriceNum = data.ownerPrice?.trim()
      ? parseFloat(data.ownerPrice.trim())
      : undefined;
    const mechanicPriceNum = data.mechanicPrice?.trim()
      ? parseFloat(data.mechanicPrice.trim())
      : undefined;

    const payload: CreateServicePriceRequest | UpdateServicePriceRequest = {
      serviceId: data.serviceId,
      machineModelId: data.machineModelId,
      ownerPrice: ownerPriceNum,
      mechanicPrice: mechanicPriceNum,
      note: data.note?.trim() || undefined,
      status: data.status,
    };
    await onSubmit(payload);
  };

  const getPriceError = (msg: string | undefined) => {
    if (!msg) return undefined;
    if (msg === "atLeastOnePrice") return t("servicePrices.atLeastOnePrice");
    if (msg === "invalidPrice") return t("servicePrices.invalidPrice");
    return msg;
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-5">
        {/* Service + Machine Model */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="serviceId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  {t("servicePrices.service")}{" "}
                  <span className="text-destructive">*</span>
                </FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue
                        placeholder={t("servicePrices.selectService")}
                      />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {services.map((s) => (
                      <SelectItem key={s.id} value={s.id}>
                        {s.nameEn}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
                  {t("servicePrices.machineModel")}{" "}
                  <span className="text-destructive">*</span>
                </FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue
                        placeholder={t("servicePrices.selectMachineModel")}
                      />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {machineModels.map((m) => (
                      <SelectItem key={m.id} value={m.id}>
                        {m.modelName}
                        {m.brand ? ` · ${m.brand}` : ""}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Owner Price + Mechanic Price */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="ownerPrice"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel>{t("servicePrices.ownerPrice")}</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                    {...field}
                  />
                </FormControl>
                {fieldState.error && (
                  <p className="text-sm text-destructive">
                    {getPriceError(fieldState.error.message)}
                  </p>
                )}
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="mechanicPrice"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel>{t("servicePrices.mechanicPrice")}</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                    {...field}
                  />
                </FormControl>
                {fieldState.error && (
                  <p className="text-sm text-destructive">
                    {getPriceError(fieldState.error.message)}
                  </p>
                )}
              </FormItem>
            )}
          />
        </div>

        {/* Status */}
        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("servicePrices.statusLabel")}</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="ACTIVE">{t("common.active")}</SelectItem>
                  <SelectItem value="INACTIVE">
                    {t("common.inactive")}
                  </SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Note */}
        <FormField
          control={form.control}
          name="note"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("servicePrices.note")}</FormLabel>
              <FormControl>
                <Textarea
                  placeholder={t("servicePrices.notePlaceholder")}
                  className="min-h-[80px] resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
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
              ? t("servicePrices.createEntry")
              : t("common.save")}
          </Button>
        </div>
      </form>
    </Form>
  );
}
