'use client';

import { useState } from 'react';
import { toast } from 'sonner';

import { useTranslation } from '@/lib/i18n/TranslationContext';

import { useCreateSaleMutation } from '../api';
import type { CreateSaleRequest, UpdateSaleRequest } from '../types';
import { SalesForm } from './SalesForm';

interface Props {
  onDraftSaved: () => void;
}

export function SalesNewSaleTab({ onDraftSaved }: Props) {
  const { t } = useTranslation();
  const [createSale, { isLoading }] = useCreateSaleMutation();
  const [formKey, setFormKey] = useState(0);

  const handleDraft = async (payload: CreateSaleRequest | UpdateSaleRequest) => {
    try {
      await createSale(payload as CreateSaleRequest).unwrap();
      toast.success(t('sales.createSuccess'));
      setFormKey((k) => k + 1);
      onDraftSaved();
    } catch (err: unknown) {
      const message =
        (err as { data?: { message?: string } })?.data?.message ?? t('common.error');
      toast.error(message);
    }
  };

  const handleComplete = async (payload: CreateSaleRequest | UpdateSaleRequest) => {
    try {
      await createSale(payload as CreateSaleRequest).unwrap();
      toast.success(t('sales.createSuccess'));
      setFormKey((k) => k + 1);
    } catch (err: unknown) {
      const message =
        (err as { data?: { message?: string } })?.data?.message ?? t('common.error');
      toast.error(message);
    }
  };

  return (
    <SalesForm
      key={formKey}
      mode="create"
      onSubmitDraft={handleDraft}
      onSubmitComplete={handleComplete}
      isLoading={isLoading}
    />
  );
}
