'use client';

import { ArrowLeft, ExternalLink, Pencil, Plus, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { useTranslation } from '@/lib/i18n/TranslationContext';

import {
  useCreateItemMutation,
  useCreateSectionMutation,
  useDeleteItemMutation,
  useDeleteReferenceBookMutation,
  useDeleteSectionMutation,
  useGetReferenceBookQuery,
  useUpdateItemMutation,
  useUpdateReferenceBookMutation,
  useUpdateSectionMutation,
} from '../api';
import type { ReferenceBookItem, ReferenceBookSection } from '../types';
import { DeleteReferenceBookDialog } from './dialogs/DeleteReferenceBookDialog';
import { DisableReferenceBookDialog } from './dialogs/DisableReferenceBookDialog';
import { ItemDialog } from './dialogs/ItemDialog';
import { SectionDialog } from './dialogs/SectionDialog';

function formatDate(d: string) {
  return new Date(d).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function ReferenceBookDetailPage({ id }: { id: string }) {
  const { t } = useTranslation();
  const router = useRouter();
  const { data, isLoading } = useGetReferenceBookQuery(id);

  const [updateBook, { isLoading: isToggling }] = useUpdateReferenceBookMutation();
  const [deleteBook, { isLoading: isDeleting }] = useDeleteReferenceBookMutation();
  const [createSection, { isLoading: isCreatingSection }] = useCreateSectionMutation();
  const [updateSection, { isLoading: isUpdatingSection }] = useUpdateSectionMutation();
  const [deleteSection, { isLoading: isDeletingSection }] = useDeleteSectionMutation();
  const [createItem, { isLoading: isCreatingItem }] = useCreateItemMutation();
  const [updateItem, { isLoading: isUpdatingItem }] = useUpdateItemMutation();
  const [deleteItem, { isLoading: isDeletingItem }] = useDeleteItemMutation();

  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const [sectionDialogOpen, setSectionDialogOpen] = useState(false);
  const [editingSection, setEditingSection] = useState<ReferenceBookSection | null>(null);
  const [deleteSectionTarget, setDeleteSectionTarget] = useState<ReferenceBookSection | null>(null);

  const [itemDialogOpen, setItemDialogOpen] = useState(false);
  const [itemSectionId, setItemSectionId] = useState<string | null>(null);
  const [editingItem, setEditingItem] = useState<ReferenceBookItem | null>(null);
  const [deleteItemTarget, setDeleteItemTarget] = useState<ReferenceBookItem | null>(null);

  const record = data?.data;

  const handleStatusConfirm = async () => {
    if (!record) return;
    const newStatus = record.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    try {
      await updateBook({ id, data: { status: newStatus } }).unwrap();
      toast.success(
        record.status === 'ACTIVE'
          ? t('referenceBook.disabledSuccess')
          : t('referenceBook.enabledSuccess'),
      );
      setStatusDialogOpen(false);
    } catch {
      toast.error(t('common.error'));
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteBook(id).unwrap();
      toast.success(t('referenceBook.deleteSuccess'));
      router.replace('/admin/reference-book');
    } catch {
      toast.error(t('common.error'));
    }
  };

  const handleSectionConfirm = async (data: {
    name: string;
    description?: string;
    sortOrder?: number;
  }) => {
    try {
      if (editingSection) {
        await updateSection({
          sectionId: editingSection.id,
          bookId: id,
          data,
        }).unwrap();
        toast.success(t('referenceBook.sectionUpdated'));
      } else {
        await createSection({ bookId: id, data }).unwrap();
        toast.success(t('referenceBook.sectionCreated'));
      }
      setSectionDialogOpen(false);
      setEditingSection(null);
    } catch {
      toast.error(t('common.error'));
    }
  };

  const handleDeleteSectionConfirm = async () => {
    if (!deleteSectionTarget) return;
    try {
      await deleteSection({ sectionId: deleteSectionTarget.id, bookId: id }).unwrap();
      toast.success(t('referenceBook.sectionDeleted'));
      setDeleteSectionTarget(null);
    } catch {
      toast.error(t('common.error'));
    }
  };

  const handleItemConfirm = async (data: {
    label: string;
    value?: string;
    unit?: string;
    note?: string;
    sortOrder?: number;
  }) => {
    try {
      if (editingItem) {
        await updateItem({ itemId: editingItem.id, bookId: id, data }).unwrap();
        toast.success(t('referenceBook.itemUpdated'));
      } else if (itemSectionId) {
        await createItem({ sectionId: itemSectionId, bookId: id, data }).unwrap();
        toast.success(t('referenceBook.itemCreated'));
      }
      setItemDialogOpen(false);
      setEditingItem(null);
      setItemSectionId(null);
    } catch {
      toast.error(t('common.error'));
    }
  };

  const handleDeleteItemConfirm = async () => {
    if (!deleteItemTarget) return;
    try {
      await deleteItem({ itemId: deleteItemTarget.id, bookId: id }).unwrap();
      toast.success(t('referenceBook.itemDeleted'));
      setDeleteItemTarget(null);
    } catch {
      toast.error(t('common.error'));
    }
  };

  const openAddSection = () => {
    setEditingSection(null);
    setSectionDialogOpen(true);
  };

  const openEditSection = (section: ReferenceBookSection) => {
    setEditingSection(section);
    setSectionDialogOpen(true);
  };

  const openAddItem = (sectionId: string) => {
    setEditingItem(null);
    setItemSectionId(sectionId);
    setItemDialogOpen(true);
  };

  const openEditItem = (item: ReferenceBookItem) => {
    setEditingItem(item);
    setItemSectionId(null);
    setItemDialogOpen(true);
  };

  const sortedSections = [...(record?.sections ?? [])].sort(
    (a, b) => a.sortOrder - b.sortOrder,
  );

  return (
    <div className="space-y-4">
      <div className="hidden md:flex items-center gap-3">
        <Button variant="ghost" size="icon-sm" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h2 className="text-xl font-semibold">{t('referenceBook.recordDetail')}</h2>
      </div>

      {isLoading ? (
        <Card>
          <CardContent className="space-y-4 pt-6">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-5 w-64" />
            <Skeleton className="h-5 w-32" />
          </CardContent>
        </Card>
      ) : record ? (
        <>
          {/* Main info card */}
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between gap-3 flex-wrap">
                <div>
                  <CardTitle>{record.title}</CardTitle>
                  {record.machineModel && (
                    <p className="text-sm text-muted-foreground mt-1">
                      {record.machineModel.modelName}
                      {record.machineModel.brand ? ` · ${record.machineModel.brand}` : ''}
                    </p>
                  )}
                </div>
                <Button asChild variant="outline" size="sm">
                  <Link href={`/admin/reference-book/${id}/edit`}>
                    <Pencil className="h-3.5 w-3.5 mr-1.5" />
                    {t('common.edit')}
                  </Link>
                </Button>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <Separator />

              <div className="flex flex-wrap gap-2">
                {record.category && (
                  <Badge
                    variant="outline"
                    className="bg-blue-500/10 text-blue-700 border-blue-500/20 dark:text-blue-400"
                  >
                    {record.category}
                  </Badge>
                )}
                <Badge
                  variant={record.status === 'ACTIVE' ? 'default' : 'outline'}
                  className={
                    record.status === 'ACTIVE'
                      ? 'bg-green-500/10 text-green-700 border-green-500/20 dark:text-green-400'
                      : 'text-muted-foreground'
                  }
                >
                  {t(record.status === 'ACTIVE' ? 'common.active' : 'common.inactive')}
                </Badge>
              </div>

              {record.summary && (
                <>
                  <Separator />
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">{t('referenceBook.summary')}</p>
                    <p className="text-sm whitespace-pre-line text-muted-foreground">
                      {record.summary}
                    </p>
                  </div>
                </>
              )}

              {record.imageUrl && (
                <>
                  <Separator />
                  <div>
                    <p className="text-xs text-muted-foreground mb-2">{t('referenceBook.imageUrl')}</p>
                    <img
                      src={record.imageUrl}
                      alt={record.title}
                      className="max-h-48 rounded-lg border object-contain"
                    />
                  </div>
                </>
              )}

              {record.fileUrl && (
                <>
                  <Separator />
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">{t('referenceBook.fileUrl')}</p>
                    <a
                      href={record.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                      {t('referenceBook.openFile')}
                    </a>
                  </div>
                </>
              )}

              <Separator />

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground text-xs mb-1">{t('referenceBook.createdAt')}</p>
                  <p>{formatDate(record.createdAt)}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs mb-1">{t('referenceBook.updatedAt')}</p>
                  <p>{formatDate(record.updatedAt)}</p>
                </div>
              </div>

              <Separator />

              <div className="flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setStatusDialogOpen(true)}
                  className={
                    record.status === 'ACTIVE'
                      ? 'border-destructive/30 text-destructive hover:bg-destructive/10'
                      : 'border-green-500/30 text-green-700 hover:bg-green-500/10 dark:text-green-400'
                  }
                >
                  {record.status === 'ACTIVE'
                    ? t('referenceBook.confirmDisableTitle')
                    : t('referenceBook.confirmEnableTitle')}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setDeleteDialogOpen(true)}
                  className="border-destructive/30 text-destructive hover:bg-destructive/10"
                >
                  <Trash2 className="h-3.5 w-3.5 mr-1.5" />
                  {t('common.delete')}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Sections */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-semibold">{t('referenceBook.sections')}</h3>
              <Button variant="outline" size="sm" onClick={openAddSection}>
                <Plus className="h-3.5 w-3.5 mr-1.5" />
                {t('referenceBook.addSection')}
              </Button>
            </div>

            {sortedSections.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4 text-center">
                {t('referenceBook.noSections')}
              </p>
            ) : (
              sortedSections.map((section) => {
                const sortedItems = [...(section.items ?? [])].sort(
                  (a, b) => a.sortOrder - b.sortOrder,
                );
                return (
                  <Card key={section.id}>
                    <CardHeader className="pb-2">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <CardTitle className="text-base">{section.name}</CardTitle>
                          {section.description && (
                            <p className="text-xs text-muted-foreground mt-0.5">
                              {section.description}
                            </p>
                          )}
                        </div>
                        <div className="flex items-center gap-1 shrink-0">
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            onClick={() => openEditSection(section)}
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            className="text-destructive hover:text-destructive"
                            onClick={() => setDeleteSectionTarget(section)}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-1 pt-0">
                      {sortedItems.length > 0 && (
                        <div className="divide-y rounded-lg border overflow-hidden mb-3">
                          {sortedItems.map((item) => (
                            <div
                              key={item.id}
                              className="flex items-start justify-between gap-3 px-3 py-2 text-sm bg-muted/30 hover:bg-muted/60 transition-colors"
                            >
                              <div className="flex-1 min-w-0">
                                <span className="text-muted-foreground">{item.label}</span>
                                {(item.value || item.unit) && (
                                  <span className="ml-2 font-medium font-mono">
                                    {item.value}
                                    {item.unit && (
                                      <span className="ml-1 text-xs text-muted-foreground font-normal">
                                        {item.unit}
                                      </span>
                                    )}
                                  </span>
                                )}
                                {item.note && (
                                  <span className="ml-2 text-xs text-muted-foreground">
                                    — {item.note}
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center gap-1 shrink-0">
                                <Button
                                  variant="ghost"
                                  size="icon-sm"
                                  onClick={() => openEditItem(item)}
                                >
                                  <Pencil className="h-3 w-3" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon-sm"
                                  className="text-destructive hover:text-destructive"
                                  onClick={() => setDeleteItemTarget(item)}
                                >
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-muted-foreground w-full justify-start"
                        onClick={() => openAddItem(section.id)}
                      >
                        <Plus className="h-3.5 w-3.5 mr-1.5" />
                        {t('referenceBook.addItem')}
                      </Button>
                    </CardContent>
                  </Card>
                );
              })
            )}
          </div>

          {/* Dialogs */}
          <DisableReferenceBookDialog
            record={record}
            open={statusDialogOpen}
            onOpenChange={setStatusDialogOpen}
            onConfirm={handleStatusConfirm}
            isLoading={isToggling}
          />
          <DeleteReferenceBookDialog
            record={record}
            open={deleteDialogOpen}
            onOpenChange={setDeleteDialogOpen}
            onConfirm={handleDeleteConfirm}
            isLoading={isDeleting}
          />

          <SectionDialog
            open={sectionDialogOpen}
            onOpenChange={(open) => {
              setSectionDialogOpen(open);
              if (!open) setEditingSection(null);
            }}
            section={editingSection}
            onConfirm={handleSectionConfirm}
            isLoading={isCreatingSection || isUpdatingSection}
          />

          {/* Delete section confirm */}
          {deleteSectionTarget && (
            <AlertDeleteDialog
              open={!!deleteSectionTarget}
              title={t('referenceBook.confirmDeleteSectionTitle')}
              description={`${deleteSectionTarget.name} — ${t('referenceBook.confirmDeleteSectionDesc')}`}
              onCancel={() => setDeleteSectionTarget(null)}
              onConfirm={handleDeleteSectionConfirm}
              isLoading={isDeletingSection}
            />
          )}

          <ItemDialog
            open={itemDialogOpen}
            onOpenChange={(open) => {
              setItemDialogOpen(open);
              if (!open) {
                setEditingItem(null);
                setItemSectionId(null);
              }
            }}
            item={editingItem}
            onConfirm={handleItemConfirm}
            isLoading={isCreatingItem || isUpdatingItem}
          />

          {/* Delete item confirm */}
          {deleteItemTarget && (
            <AlertDeleteDialog
              open={!!deleteItemTarget}
              title={t('referenceBook.confirmDeleteItemTitle')}
              description={`${deleteItemTarget.label} — ${t('referenceBook.confirmDeleteItemDesc')}`}
              onCancel={() => setDeleteItemTarget(null)}
              onConfirm={handleDeleteItemConfirm}
              isLoading={isDeletingItem}
            />
          )}
        </>
      ) : (
        <p className="text-muted-foreground">{t('common.error')}</p>
      )}
    </div>
  );
}

function AlertDeleteDialog({
  open,
  title,
  description,
  onCancel,
  onConfirm,
  isLoading,
}: {
  open: boolean;
  title: string;
  description: string;
  onCancel: () => void;
  onConfirm: () => void;
  isLoading?: boolean;
}) {
  const { t } = useTranslation();
  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center ${open ? '' : 'hidden'}`}
      aria-modal="true"
    >
      <div className="fixed inset-0 bg-black/50" onClick={onCancel} />
      <div className="relative z-10 bg-background rounded-xl border shadow-lg p-6 max-w-sm w-full mx-4 space-y-4">
        <p className="font-semibold text-base">{title}</p>
        <p className="text-sm text-muted-foreground">{description}</p>
        <div className="flex justify-end gap-2">
          <Button variant="outline" size="sm" onClick={onCancel} disabled={isLoading}>
            {t('common.cancel')}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onConfirm}
            disabled={isLoading}
            className="border-destructive/30 text-destructive hover:bg-destructive/10"
          >
            {t('common.delete')}
          </Button>
        </div>
      </div>
    </div>
  );
}
