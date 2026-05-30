'use client';

import { Box, Plus } from 'lucide-react';

import { Button } from '@/components/ui/button';

interface CatalogCardProps {
  imageUrl: string | null | undefined;
  primaryName: string;
  secondaryName?: string | null;
  code: string;
  category?: string | null;
  priceLabel: string;
  stockLabel?: string | null;
  type?: 'SERVICE' | 'PRODUCT';
  onAdd: () => void;
  disabled?: boolean;
}

export function CatalogCard({
  imageUrl,
  primaryName,
  secondaryName,
  code,
  category,
  priceLabel,
  stockLabel,
  type,
  onAdd,
  disabled = false,
}: CatalogCardProps) {
  return (
    <div className="rounded-lg border bg-card flex flex-col overflow-hidden hover:shadow-sm transition-all hover:border-primary/40 group">
      {/* Image / placeholder row */}
      <div className="relative h-24 sm:h-28 bg-muted flex items-center justify-center overflow-hidden shrink-0">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={primaryName}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        ) : (
          <Box className="h-7 w-7 text-muted-foreground/20" />
        )}
        {type && (
          <span className="absolute top-1.5 left-1.5 text-[10px] font-medium bg-background/85 backdrop-blur px-1.5 py-0.5 rounded-full text-muted-foreground">
            {type === 'SERVICE' ? 'សេវាកម្ម' : 'គ្រឿងបន្លាស់'}
          </span>
        )}
      </div>

      {/* Info */}
      <div className="p-2.5 flex flex-col flex-1 gap-0.5">
        <p className="font-semibold text-sm leading-snug line-clamp-2">{primaryName}</p>
        {secondaryName && primaryName !== secondaryName && (
          <p className="text-xs text-muted-foreground leading-tight line-clamp-1">{secondaryName}</p>
        )}
        {category && (
          <p className="text-[11px] text-muted-foreground/70 line-clamp-1">{category}</p>
        )}
        <p className="text-[10px] font-mono text-muted-foreground/50 mt-0.5">{code}</p>

        <div className="mt-auto pt-2 flex items-center justify-between gap-1.5">
          <div className="min-w-0">
            <span className="text-sm font-bold font-mono">{priceLabel}</span>
            {stockLabel && (
              <p className="text-[10px] text-muted-foreground truncate">{stockLabel}</p>
            )}
          </div>
          <Button
            type="button"
            size="sm"
            onClick={onAdd}
            disabled={disabled}
            className="h-7 px-2.5 shrink-0 text-xs"
          >
            <Plus className="h-3 w-3 mr-1" />
            បន្ថែម
          </Button>
        </div>
      </div>
    </div>
  );
}
