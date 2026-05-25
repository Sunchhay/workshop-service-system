'use client';

import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTranslation } from '@/lib/i18n/TranslationContext';

import { useCreateReferenceBookMutation } from '../api';
import type { CreateReferenceBookRequest, UpdateReferenceBookRequest } from '../types';
import { ReferenceBookForm } from './ReferenceBookForm';

export function ReferenceBookCreatePage() {
  const { t } = useTranslation();
  const router = useRouter();
  const [createReferenceBook, { isLoading }] = useCreateReferenceBookMutation();

  const handleSubmit = async (
    data: CreateReferenceBookRequest | UpdateReferenceBookRequest,
  ) => {
    try {
      await createReferenceBook(data as CreateReferenceBookRequest).unwrap();
      toast.success(t('referenceBook.createSuccess'));
      router.replace('/admin/reference-book');
    } catch (err: unknown) {
      const message =
        (err as { data?: { message?: string } })?.data?.message ??
        t('common.error');
      toast.error(message);
    }
  };

  return (
    <div className="space-y-4">
      <div className="hidden md:flex items-center gap-3">
        <Button variant="ghost" size="icon-sm" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h2 className="text-xl font-semibold">{t('referenceBook.createRecord')}</h2>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">{t('referenceBook.recordDetail')}</CardTitle>
        </CardHeader>
        <CardContent>
          <ReferenceBookForm
            mode="create"
            onSubmit={handleSubmit}
            isLoading={isLoading}
          />
        </CardContent>
      </Card>
    </div>
  );
}
