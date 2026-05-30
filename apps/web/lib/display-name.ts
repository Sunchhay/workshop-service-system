export function getServiceDisplayName(service: {
  nameKh: string | null;
  nameEn: string;
}): string {
  return service.nameKh || service.nameEn;
}

export function getProductDisplayName(product: {
  nameKh: string | null | undefined;
  name: string;
  nameEn: string | null | undefined;
}): string {
  return product.nameKh || product.name || product.nameEn || '';
}

export function getInvoiceItemDisplayName(item: {
  itemNameKh: string | null | undefined;
  description: string;
  itemNameEn: string | null | undefined;
  modelNameSnapshot?: string | null | undefined;
}): string {
  const baseName = item.itemNameKh || item.description || item.itemNameEn || '';
  return item.modelNameSnapshot ? `${item.modelNameSnapshot} - ${baseName}` : baseName;
}

export function getCatalogImageUrl(
  imageUrl: string | null | undefined,
): string | null {
  return imageUrl || null;
}

export function getUploadImageUrl(
  imageUrl: string | null | undefined,
): string | null {
  if (!imageUrl) return null;
  if (/^https?:\/\//i.test(imageUrl)) return imageUrl;
  if (!imageUrl.startsWith('/uploads/')) return imageUrl;

  const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api';
  const origin = apiUrl.replace(/\/api\/?$/, '');
  return `${origin}${imageUrl}`;
}
