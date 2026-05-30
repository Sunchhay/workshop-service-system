import { Injectable } from '@nestjs/common';

import { ItemType, PosCartStatus } from '../../generated/prisma/enums';
import { PrismaService } from '../../prisma/prisma.service';
import type { AddCartItemDto } from './dto/add-cart-item.dto';
import type { CreatePosCartDto } from './dto/create-pos-cart.dto';
import type { QueryCartServiceCatalogDto } from './dto/query-cart-service-catalog.dto';
import type { UpdateCartItemDto } from './dto/update-cart-item.dto';
import type { UpdatePosCartDto } from './dto/update-pos-cart.dto';

const CART_ITEM_SELECT = {
  id: true,
  cartId: true,
  type: true,
  serviceId: true,
  productId: true,
  machineModelId: true,
  modelNameSnapshot: true,
  itemCode: true,
  itemNameKh: true,
  itemNameEn: true,
  description: true,
  quantity: true,
  unitPrice: true,
  discountAmount: true,
  totalPrice: true,
  sortOrder: true,
  createdAt: true,
  updatedAt: true,
} as const;

const CART_SELECT = {
  id: true,
  cartCode: true,
  cartName: true,
  customerId: true,
  machineModelId: true,
  modelNameSnapshot: true,
  customerName: true,
  customerPhone: true,
  jobTitle: true,
  engineType: true,
  discountAmount: true,
  paidAmount: true,
  paymentMethod: true,
  note: true,
  internalNote: true,
  status: true,
  createdById: true,
  createdAt: true,
  updatedAt: true,
  machineModel: {
    select: { id: true, brand: true, model: true, category: true },
  },
  items: {
    select: CART_ITEM_SELECT,
    orderBy: { sortOrder: 'asc' as const },
  },
} as const;

function toNum(v: unknown, fallback = 0): number {
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
}

@Injectable()
export class PosCartsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async generateCartCode(): Promise<string> {
    const count = await this.prisma.posCart.count();
    return `CART-${String(count + 1).padStart(3, '0')}`;
  }

  async create(dto: CreatePosCartDto, userId: string) {
    const cartCode = await this.generateCartCode();
    return this.prisma.posCart.create({
      data: {
        cartCode,
        cartName: dto.cartName ?? 'New Cart',
        createdById: userId,
      },
      select: CART_SELECT,
    });
  }

  async findActive(userId: string) {
    return this.prisma.posCart.findMany({
      where: { createdById: userId, status: PosCartStatus.ACTIVE },
      select: CART_SELECT,
      orderBy: { createdAt: 'asc' },
    });
  }

  async findById(id: string) {
    return this.prisma.posCart.findUnique({
      where: { id },
      select: CART_SELECT,
    });
  }

  async update(id: string, dto: UpdatePosCartDto) {
    return this.prisma.posCart.update({
      where: { id },
      data: {
        ...(dto.cartName !== undefined && { cartName: dto.cartName }),
        ...(dto.customerId !== undefined && { customerId: dto.customerId }),
        ...(dto.machineModelId !== undefined && { machineModelId: dto.machineModelId }),
        ...(dto.modelNameSnapshot !== undefined && { modelNameSnapshot: dto.modelNameSnapshot }),
        ...(dto.customerName !== undefined && { customerName: dto.customerName }),
        ...(dto.customerPhone !== undefined && { customerPhone: dto.customerPhone }),
        ...(dto.jobTitle !== undefined && { jobTitle: dto.jobTitle }),
        ...(dto.engineType !== undefined && { engineType: dto.engineType }),
        ...(dto.note !== undefined && { note: dto.note }),
        ...(dto.internalNote !== undefined && { internalNote: dto.internalNote }),
        ...(dto.discountAmount !== undefined && { discountAmount: dto.discountAmount }),
        ...(dto.paidAmount !== undefined && { paidAmount: dto.paidAmount }),
        ...(dto.paymentMethod !== undefined && { paymentMethod: dto.paymentMethod }),
      },
      select: CART_SELECT,
    });
  }

  async close(id: string) {
    return this.prisma.posCart.update({
      where: { id },
      data: { status: PosCartStatus.CLOSED },
      select: CART_SELECT,
    });
  }

  async delete(id: string) {
    return this.prisma.posCart.delete({ where: { id } });
  }

  // ─── CartItem methods ──────────────────────────────────────────────────────

  async addItem(cartId: string, dto: AddCartItemDto) {
    const qty = Math.max(0.001, toNum(dto.quantity, 1));
    const price = toNum(dto.unitPrice, 0);
    const discount = toNum(dto.discountAmount, 0);
    const itemCount = await this.prisma.cartItem.count({ where: { cartId } });

    await this.prisma.cartItem.create({
      data: {
        cartId,
        type: dto.type as ItemType,
        serviceId: dto.serviceId ?? null,
        productId: dto.productId ?? null,
        machineModelId: dto.machineModelId ?? null,
        modelNameSnapshot: dto.modelNameSnapshot ?? null,
        itemCode: dto.itemCode ?? null,
        itemNameKh: dto.itemNameKh ?? null,
        itemNameEn: dto.itemNameEn ?? null,
        description: dto.description ?? null,
        quantity: qty,
        unitPrice: price,
        discountAmount: discount,
        totalPrice: Math.max(0, qty * price - discount),
        sortOrder: itemCount,
      },
    });

    return this.findById(cartId);
  }

  async incrementItem(itemId: string, extraQty: number) {
    const item = await this.prisma.cartItem.findUnique({ where: { id: itemId } });
    if (!item) return null;
    const newQty = toNum(item.quantity, 1) + extraQty;
    const price = toNum(item.unitPrice, 0);
    const discount = toNum(item.discountAmount, 0);
    await this.prisma.cartItem.update({
      where: { id: itemId },
      data: {
        quantity: newQty,
        totalPrice: Math.max(0, newQty * price - discount),
      },
    });
    return this.findById(item.cartId);
  }

  async updateItem(cartId: string, itemId: string, dto: UpdateCartItemDto) {
    const existing = await this.prisma.cartItem.findFirst({
      where: { id: itemId, cartId },
    });
    if (!existing) return null;

    const qty = dto.quantity !== undefined ? Math.max(0.001, toNum(dto.quantity, 1)) : toNum(existing.quantity, 1);
    const price = dto.unitPrice !== undefined ? toNum(dto.unitPrice, 0) : toNum(existing.unitPrice, 0);
    const discount = dto.discountAmount !== undefined ? toNum(dto.discountAmount, 0) : toNum(existing.discountAmount, 0);

    await this.prisma.cartItem.update({
      where: { id: itemId },
      data: {
        ...(dto.quantity !== undefined && { quantity: qty }),
        ...(dto.unitPrice !== undefined && { unitPrice: price }),
        ...(dto.discountAmount !== undefined && { discountAmount: discount }),
        ...(dto.description !== undefined && { description: dto.description }),
        totalPrice: Math.max(0, qty * price - discount),
      },
    });

    return this.findById(cartId);
  }

  async removeItem(cartId: string, itemId: string) {
    await this.prisma.cartItem.deleteMany({ where: { id: itemId, cartId } });
    return this.findById(cartId);
  }

  async clearItems(cartId: string) {
    await this.prisma.cartItem.deleteMany({ where: { cartId } });
    return this.findById(cartId);
  }

  // ─── Service Catalog Search ────────────────────────────────────────────────
  // When machineModelId is set and showAll is false: query PriceCatalog.
  // Otherwise: query Service table directly.

  async searchServiceCatalog(dto: QueryCartServiceCatalogDto) {
    const { search, machineModelId, showAll, page = 1, limit = 12 } = dto;
    const skip = (page - 1) * limit;
    const usePriceCatalog = !!machineModelId && !showAll;

    if (usePriceCatalog) {
      const where = {
        machineModelId,
        isActive: true as const,
        ...(search && {
          OR: [
            { label: { contains: search, mode: 'insensitive' as const } },
            { service: { nameKh: { contains: search, mode: 'insensitive' as const } } },
            { service: { nameEn: { contains: search, mode: 'insensitive' as const } } },
            { service: { category: { contains: search, mode: 'insensitive' as const } } },
            { machineModel: { brand: { contains: search, mode: 'insensitive' as const } } },
            { machineModel: { model: { contains: search, mode: 'insensitive' as const } } },
          ],
        }),
      };

      const [rows, total] = await Promise.all([
        this.prisma.priceCatalog.findMany({
          where,
          skip,
          take: limit,
          orderBy: { createdAt: 'desc' },
          select: {
            id: true,
            serviceId: true,
            machineModelId: true,
            label: true,
            unitPrice: true,
            currency: true,
            service: {
              select: {
                id: true,
                code: true,
                nameEn: true,
                nameKh: true,
                imageUrl: true,
                category: true,
                description: true,
              },
            },
            machineModel: {
              select: { id: true, brand: true, model: true },
            },
          },
        }),
        this.prisma.priceCatalog.count({ where }),
      ]);

      const data = rows.map((row) => ({
        source: 'PRICE_CATALOG' as const,
        serviceId: row.serviceId,
        priceCatalogId: row.id,
        machineModelId: row.machineModelId,
        machineModelName: `${row.machineModel.brand} ${row.machineModel.model}`.trim(),
        nameKh: row.service.nameKh,
        nameEn: row.service.nameEn,
        category: row.service.category,
        label: row.label,
        suggestedPrice: row.unitPrice.toString(),
        currency: row.currency,
        description: row.service.description,
        code: row.service.code,
        imageUrl: row.service.imageUrl,
      }));

      return { data, total, page, limit };
    }

    // Query Service table (no model filter or showAll=true)
    const where = {
      deletedAt: null,
      isActive: true as const,
      ...(search && {
        OR: [
          { code: { contains: search, mode: 'insensitive' as const } },
          { nameEn: { contains: search, mode: 'insensitive' as const } },
          { nameKh: { contains: search, mode: 'insensitive' as const } },
          { category: { contains: search, mode: 'insensitive' as const } },
          { description: { contains: search, mode: 'insensitive' as const } },
        ],
      }),
    };

    const [rows, total] = await Promise.all([
      this.prisma.service.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          code: true,
          nameEn: true,
          nameKh: true,
          imageUrl: true,
          category: true,
          description: true,
        },
      }),
      this.prisma.service.count({ where }),
    ]);

    const data = rows.map((row) => ({
      source: 'SERVICE' as const,
      serviceId: row.id,
      nameKh: row.nameKh,
      nameEn: row.nameEn,
      category: row.category,
      description: row.description,
      code: row.code,
      imageUrl: row.imageUrl,
    }));

    return { data, total, page, limit };
  }
}
