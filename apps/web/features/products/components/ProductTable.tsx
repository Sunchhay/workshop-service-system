'use client';

import { MoreHorizontal } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useTranslation } from '@/lib/i18n/TranslationContext';

import type { Product } from '../types';

function formatDecimal(v: string) {
  const n = parseFloat(v);
  return isNaN(n) ? '—' : `$${n.toFixed(2)}`;
}

function isLowStock(p: Product) {
  return p.stockQuantity <= p.reorderLevel;
}

interface ProductTableProps {
  products: Product[];
  onToggleStatus: (product: Product) => void;
  onDelete: (product: Product) => void;
  onAdjustStock: (product: Product) => void;
}

export function ProductTable({
  products,
  onToggleStatus,
  onDelete,
  onAdjustStock,
}: ProductTableProps) {
  const { t } = useTranslation();
  const router = useRouter();

  return (
    <div className="rounded-xl border bg-card overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t('products.name')}</TableHead>
            <TableHead>{t('products.category')}</TableHead>
            <TableHead>{t('products.stockQuantity')}</TableHead>
            <TableHead>{t('products.sellingPrice')}</TableHead>
            <TableHead>{t('products.statusLabel')}</TableHead>
            <TableHead className="w-12" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={6}
                className="text-center text-muted-foreground py-10"
              >
                {t('products.noProducts')}
              </TableCell>
            </TableRow>
          ) : (
            products.map((product) => (
              <TableRow
                key={product.id}
                className="cursor-pointer"
                onClick={() => router.push(`/admin/products/${product.id}`)}
              >
                {/* Name */}
                <TableCell>
                  <div>
                    <p className="font-medium">{product.name}</p>
                    {product.brand && (
                      <p className="text-xs text-muted-foreground">
                        {product.brand}
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground font-mono mt-0.5">
                      {product.code}
                    </p>
                  </div>
                </TableCell>
                {/* Category / Part type */}
                <TableCell>
                  <div>
                    {product.category ? (
                      <p className="text-sm">{product.category}</p>
                    ) : (
                      <p className="text-sm text-muted-foreground">—</p>
                    )}
                    {product.componentPartType && (
                      <p className="text-xs text-muted-foreground">
                        {product.componentPartType}
                      </p>
                    )}
                  </div>
                </TableCell>
                {/* Stock */}
                <TableCell>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm">
                      {product.stockQuantity} {product.unit}
                    </span>
                    {isLowStock(product) && (
                      <Badge
                        variant="outline"
                        className="text-[10px] px-1 py-0 bg-amber-500/10 text-amber-700 border-amber-500/20 dark:text-amber-400"
                      >
                        {t('products.lowStock')}
                      </Badge>
                    )}
                  </div>
                </TableCell>
                {/* Price */}
                <TableCell className="font-mono text-sm">
                  {formatDecimal(product.sellingPrice)}
                </TableCell>
                {/* Status */}
                <TableCell>
                  <Badge
                    variant={product.isActive ? 'default' : 'outline'}
                    className={
                      product.isActive
                        ? 'bg-green-500/10 text-green-700 border-green-500/20 dark:text-green-400'
                        : 'text-muted-foreground'
                    }
                  >
                    {t(product.isActive ? 'common.active' : 'common.inactive')}
                  </Badge>
                </TableCell>
                {/* Actions */}
                <TableCell onClick={(e) => e.stopPropagation()}>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon-sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link href={`/admin/products/${product.id}`}>
                          {t('products.productDetail')}
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href={`/admin/products/${product.id}/edit`}>
                          {t('common.edit')}
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => onAdjustStock(product)}
                      >
                        {t('products.adjustStock')}
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => onToggleStatus(product)}
                        className={
                          product.isActive
                            ? 'text-destructive focus:text-destructive'
                            : 'text-green-600 focus:text-green-600'
                        }
                      >
                        {product.isActive
                          ? t('products.confirmDisableTitle')
                          : t('products.confirmEnableTitle')}
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => onDelete(product)}
                        className="text-destructive focus:text-destructive"
                      >
                        {t('common.delete')}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
