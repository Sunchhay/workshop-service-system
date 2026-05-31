import { Injectable } from '@nestjs/common';

import { CartStatus, CustomerType, ItemType } from '../../generated/prisma/enums';
import { PrismaService } from '../../prisma/prisma.service';
import type { AddCartItemDto } from './dto/add-cart-item.dto';
import type { CreateCartDto } from './dto/create-cart.dto';
import type { QueryCartDto } from './dto/query-cart.dto';
import type { UpdateCartDto } from './dto/update-cart.dto';
import type { UpdateCartItemDto } from './dto/update-cart-item.dto';

const CART_ITEM_SELECT = {
  id: true,
  cartId: true,
  itemType: true,
  serviceId: true,
  productId: true,
  machineModelId: true,
  nameSnapshot: true,
  unitPrice: true,
  quantity: true,
  total: true,
  note: true,
  createdAt: true,
  updatedAt: true,
  service: { select: { id: true, code: true, name: true, nameEn: true } },
  product: { select: { id: true, code: true, name: true, nameEn: true } },
  machineModel: { select: { id: true, code: true, brand: true, modelName: true } },
} as const;

const CART_SELECT = {
  id: true,
  customerId: true,
  mechanicId: true,
  createdById: true,
  commissionAmount: true,
  commissionNote: true,
  status: true,
  note: true,
  createdAt: true,
  updatedAt: true,
  customer: { select: { id: true, name: true, phone: true, customerType: true } },
  mechanic: { select: { id: true, name: true, phone: true, customerType: true } },
  createdBy: { select: { id: true, name: true } },
  items: {
    select: CART_ITEM_SELECT,
    orderBy: { createdAt: 'asc' as const },
  },
} as const;

@Injectable()
export class CartsRepository {
  constructor(private readonly prisma: PrismaService) {}

  customerExists(id: string) {
    return this.prisma.customer.findUnique({ where: { id }, select: { id: true } });
  }

  mechanicExists(id: string) {
    return this.prisma.customer.findFirst({
      where: { id, customerType: CustomerType.MECHANIC },
      select: { id: true },
    });
  }

  serviceExists(id: string) {
    return this.prisma.service.findUnique({
      where: { id },
      select: { id: true, name: true },
    });
  }

  productExists(id: string) {
    return this.prisma.product.findUnique({
      where: { id },
      select: { id: true, name: true },
    });
  }

  machineModelExists(id: string) {
    return this.prisma.machineModel.findUnique({
      where: { id },
      select: { id: true, modelName: true },
    });
  }

  create(dto: CreateCartDto, createdById: string) {
    return this.prisma.cart.create({
      data: {
        customerId: dto.customerId,
        mechanicId: dto.mechanicId,
        commissionAmount: dto.commissionAmount ?? 0,
        commissionNote: dto.commissionNote,
        note: dto.note,
        status: CartStatus.ACTIVE,
        createdById,
      },
      select: CART_SELECT,
    });
  }

  async findAll(dto: QueryCartDto) {
    const { search, status, customerId, mechanicId, createdById, page = 1, limit = 20 } = dto;
    const skip = (page - 1) * limit;

    const where = {
      ...(status !== undefined && { status }),
      ...(customerId !== undefined && { customerId }),
      ...(mechanicId !== undefined && { mechanicId }),
      ...(createdById !== undefined && { createdById }),
      ...(search !== undefined && {
        OR: [
          { customer: { name: { contains: search, mode: 'insensitive' as const } } },
          { customer: { phone: { contains: search, mode: 'insensitive' as const } } },
          { mechanic: { name: { contains: search, mode: 'insensitive' as const } } },
          { note: { contains: search, mode: 'insensitive' as const } },
        ],
      }),
    };

    const [data, total] = await Promise.all([
      this.prisma.cart.findMany({
        where,
        select: CART_SELECT,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.cart.count({ where }),
    ]);

    return { data, total };
  }

  findById(id: string) {
    return this.prisma.cart.findUnique({ where: { id }, select: CART_SELECT });
  }

  update(id: string, dto: UpdateCartDto) {
    return this.prisma.cart.update({
      where: { id },
      data: {
        ...(dto.customerId !== undefined && { customerId: dto.customerId }),
        ...(dto.mechanicId !== undefined && { mechanicId: dto.mechanicId }),
        ...(dto.commissionAmount !== undefined && { commissionAmount: dto.commissionAmount }),
        ...(dto.commissionNote !== undefined && { commissionNote: dto.commissionNote }),
        ...(dto.note !== undefined && { note: dto.note }),
      },
      select: CART_SELECT,
    });
  }

  addItem(
    cartId: string,
    dto: AddCartItemDto,
    nameSnapshot: string,
  ) {
    const quantity = dto.quantity ?? 1;
    const total = dto.unitPrice * quantity;
    return this.prisma.cartItem.create({
      data: {
        cartId,
        itemType: dto.itemType,
        serviceId: dto.itemType === ItemType.SERVICE ? dto.serviceId : null,
        productId: dto.itemType === ItemType.PRODUCT ? dto.productId : null,
        machineModelId: dto.machineModelId,
        nameSnapshot,
        unitPrice: dto.unitPrice,
        quantity,
        total,
        note: dto.note,
      },
      select: CART_ITEM_SELECT,
    });
  }

  findItemById(id: string) {
    return this.prisma.cartItem.findUnique({
      where: { id },
      select: {
        id: true,
        cartId: true,
        itemType: true,
        serviceId: true,
        productId: true,
        machineModelId: true,
        unitPrice: true,
        quantity: true,
      },
    });
  }

  updateItem(id: string, dto: UpdateCartItemDto, nameSnapshot?: string) {
    const unitPrice = dto.unitPrice;
    const quantity = dto.quantity;
    return this.prisma.cartItem.update({
      where: { id },
      data: {
        ...(dto.machineModelId !== undefined && { machineModelId: dto.machineModelId }),
        ...(unitPrice !== undefined && { unitPrice }),
        ...(quantity !== undefined && { quantity }),
        ...(unitPrice !== undefined || quantity !== undefined
          ? { total: (unitPrice ?? 0) * (quantity ?? 1) }
          : {}),
        ...(nameSnapshot !== undefined && { nameSnapshot }),
        ...(dto.note !== undefined && { note: dto.note }),
      },
      select: CART_ITEM_SELECT,
    });
  }

  deleteItem(id: string) {
    return this.prisma.cartItem.delete({ where: { id } });
  }

  clearItems(cartId: string) {
    return this.prisma.cartItem.deleteMany({ where: { cartId } });
  }

  async deleteCart(id: string) {
    await this.prisma.cartItem.deleteMany({ where: { cartId: id } });
    return this.prisma.cart.delete({ where: { id } });
  }
}
