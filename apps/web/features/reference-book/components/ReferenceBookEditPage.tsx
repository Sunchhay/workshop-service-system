'use client';

import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useTranslation } from '@/lib/i18n/TranslationContext';

import { useGetReferenceBookQuery, useUpdateReferenceBookMutation } from '../api';
import type { CreateReferenceBookRequest, UpdateReferenceBookRequest } from '../types';
import { ReferenceBookForm } from './ReferenceBookForm';

export function ReferenceBookEditPage({ id }: { id: string }) {
  const { t } = useTranslation();
  const router = useRouter();
  const { data, isLoading: isFetching } = useGetReferenceBookQuery(id);
  const [updateReferenceBook, { isLoading: isUpdating }] = useUpdateReferenceBookMutation();

  const handleSubmit = async (
    payload: CreateReferenceBookRequest | UpdateReferenceBookRequest,
  ) => {
    try {
      await updateReferenceBook({ id, data: payload as UpdateReferenceBookRequest }).unwrap();
      toast.success(t('referenceBook.updateSuccess'));
      router.replace(`/admin/reference-book/${id}`);
    } catch (err: unknown) {
      const message =
        (err as { data?: { message?: string } })?.data?.message ?? t('common.error');
      toast.error(message);
    }
  };

  const entry = data?.data;

  return (
    <div className="space-y-4">
      <div className="hidden md:flex items-center gap-3">
        <Button variant="ghost" size="icon-sm" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h2 className="text-xl font-semibold">{t('referenceBook.editRecord')}</h2>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">{t('referenceBook.recordDetail')}</CardTitle>
        </CardHeader>
        <CardContent>
          {isFetching ? (
            <div className="space-y-5">
              <Skeleton className="h-11 w-full" />
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <Skeleton className="h-11 w-full" />
                <Skeleton className="h-11 w-full" />
              </div>
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-11 w-full" />
              <Skeleton className="h-11 w-full" />
              <Skeleton className="h-11 w-full" />
            </div>
          ) : entry ? (
            <ReferenceBookForm
              mode="edit"
              defaultValues={{
                title: entry.title,
                category: entry.category ?? '',
                machineModelId: entry.machineModelId ?? '__none',
                summary: entry.summary ?? '',
                imageUrl: entry.imageUrl ?? '',
                fileUrl: entry.fileUrl ?? '',
                status: entry.status,
              }}
              onSubmit={handleSubmit}
              isLoading={isUpdating}
            />
          ) : (
            <p className="text-muted-foreground">{t('common.error')}</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
