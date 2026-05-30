'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { ImageIcon, Loader2, Upload, X } from 'lucide-react';
import { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod/v4';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { getUploadImageUrl } from '@/lib/display-name';
import { useTranslation } from '@/lib/i18n/TranslationContext';

import { useUploadCustomerImageMutation } from '../api';
import type {
  CreateCustomerRequest,
  CustomerType,
  UpdateCustomerRequest,
} from '../types';

const CUSTOMER_TYPES: CustomerType[] = ['NORMAL', 'VIP', 'WHOLESALE', 'PARTNER'];

const customerSchema = z.object({
  name: z.string().min(1),
  phone: z.string().min(1),
  imageUrl: z.string().nullable(),
  customerType: z.enum(['NORMAL', 'VIP', 'WHOLESALE', 'PARTNER']),
  notes: z.string(),
});

type FormValues = z.infer<typeof customerSchema>;

interface CustomerFormProps {
  mode: 'create' | 'edit';
  defaultValues?: Partial<FormValues>;
  onSubmit: (data: CreateCustomerRequest | UpdateCustomerRequest) => Promise<void>;
  isLoading?: boolean;
}

const MAX_IMAGE_SIZE = 2 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const IMAGE_TOO_LARGE_KM =
  'រូបភាពនៅតែធំពេក សូមជ្រើសរើសរូបភាពតូចជាងនេះ។';

async function canvasSupportsWebp(): Promise<boolean> {
  const canvas = document.createElement('canvas');
  canvas.width = 1;
  canvas.height = 1;
  return canvas.toDataURL('image/webp').startsWith('data:image/webp');
}

function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    const url = URL.createObjectURL(file);
    image.onload = () => {
      URL.revokeObjectURL(url);
      resolve(image);
    };
    image.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Invalid image'));
    };
    image.src = url;
  });
}

async function compressCustomerImage(file: File): Promise<File> {
  const image = await loadImage(file);
  const maxSize = 800;
  const scale = Math.min(1, maxSize / image.width, maxSize / image.height);
  const width = Math.max(1, Math.round(image.width * scale));
  const height = Math.max(1, Math.round(image.height * scale));

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas is not available');
  ctx.drawImage(image, 0, 0, width, height);

  const useWebp = await canvasSupportsWebp();
  const type = useWebp ? 'image/webp' : 'image/jpeg';
  const ext = useWebp ? 'webp' : 'jpg';
  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, type, 0.82),
  );
  if (!blob) throw new Error('Image compression failed');

  return new File([blob], `customer-profile.${ext}`, { type });
}

export function CustomerForm({
  mode,
  defaultValues,
  onSubmit,
  isLoading,
}: CustomerFormProps) {
  const { t } = useTranslation();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [uploadImage, { isLoading: isUploading }] = useUploadCustomerImageMutation();
  const [compressedFile, setCompressedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    getUploadImageUrl(defaultValues?.imageUrl),
  );
  const [imageRemoved, setImageRemoved] = useState(false);
  const [imageError, setImageError] = useState<string | null>(null);
  const [isCompressing, setIsCompressing] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(customerSchema),
    defaultValues: {
      name: defaultValues?.name ?? '',
      phone: defaultValues?.phone ?? '',
      imageUrl: defaultValues?.imageUrl ?? null,
      customerType: defaultValues?.customerType ?? 'NORMAL',
      notes: defaultValues?.notes ?? '',
    },
  });

  const handleImageSelected = async (file: File | undefined) => {
    setImageError(null);
    if (!file) return;

    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      setImageError(t('customers.imageTypeError'));
      return;
    }

    setIsCompressing(true);
    try {
      const compressed = await compressCustomerImage(file);
      if (compressed.size > MAX_IMAGE_SIZE) {
        setImageError(IMAGE_TOO_LARGE_KM);
        setCompressedFile(null);
        return;
      }

      setCompressedFile(compressed);
      setImageRemoved(false);
      form.setValue('imageUrl', defaultValues?.imageUrl ?? null);
      setPreviewUrl(URL.createObjectURL(compressed));
    } catch {
      setImageError(t('customers.imageProcessError'));
    } finally {
      setIsCompressing(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleRemoveImage = () => {
    setCompressedFile(null);
    setPreviewUrl(null);
    setImageRemoved(true);
    form.setValue('imageUrl', null);
    setImageError(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async (data: FormValues) => {
    let imageUrl: string | null | undefined = data.imageUrl;
    if (compressedFile) {
      const result = await uploadImage(compressedFile).unwrap();
      imageUrl = result.data.imageUrl;
    } else if (imageRemoved) {
      imageUrl = null;
    }

    const payload: CreateCustomerRequest | UpdateCustomerRequest = {
      name: data.name,
      phone: data.phone,
      imageUrl,
      customerType: data.customerType,
      notes: data.notes || undefined,
    };
    await onSubmit(payload);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-full border bg-muted">
            {previewUrl ? (
              <img
                src={previewUrl}
                alt={t('customers.profileImage')}
                className="h-full w-full object-cover"
              />
            ) : (
              <ImageIcon className="h-8 w-8 text-muted-foreground" />
            )}
          </div>
          <div className="space-y-2">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={(e) => handleImageSelected(e.target.files?.[0])}
            />
            <div className="flex flex-wrap gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                disabled={isCompressing || isUploading || isLoading}
              >
                {isCompressing ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Upload className="mr-2 h-4 w-4" />
                )}
                {previewUrl ? t('customers.replaceImage') : t('customers.uploadImage')}
              </Button>
              {previewUrl && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleRemoveImage}
                  disabled={isCompressing || isUploading || isLoading}
                >
                  <X className="mr-2 h-4 w-4" />
                  {t('customers.removeImage')}
                </Button>
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              {t('customers.imageHelp')}
            </p>
            {imageError && <p className="text-sm text-destructive">{imageError}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  {t('customers.name')}{' '}
                  <span className="text-destructive">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder={t('customers.namePlaceholder')}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  {t('customers.phone')}{' '}
                  <span className="text-destructive">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    type="tel"
                    placeholder={t('customers.phonePlaceholder')}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="customerType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('customers.customerType')}</FormLabel>
                <FormControl>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {CUSTOMER_TYPES.map((type) => (
                        <SelectItem key={type} value={type}>
                          {t(`customerTypes.${type}`)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('customers.notes')}</FormLabel>
              <FormControl>
                <Textarea
                  placeholder={t('customers.notesPlaceholder')}
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

        <div className="pt-2">
          <Button
            type="submit"
            size="lg"
            className="w-full md:w-auto"
            disabled={isLoading || isCompressing || isUploading}
          >
            {(isLoading || isUploading) && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            {mode === 'create' ? t('customers.createCustomer') : t('common.save')}
          </Button>
        </div>
      </form>
    </Form>
  );
}
