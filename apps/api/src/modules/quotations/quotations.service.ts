import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';

import { createResponse } from '../../common/types/api-response.type';
import { PrismaService } from '../../prisma/prisma.service';
import { QuotationsRepository } from './quotations.repository';

@Injectable()
export class QuotationsService {
  constructor(
    private readonly repo: QuotationsRepository,
    private readonly prisma: PrismaService,
  ) {}

  async createFromCart(cartId: string, userId: string, notes?: string, validUntil?: string) {
    const cart = await this.prisma.posCart.findUnique({
      where: { id: cartId },
      include: { items: { orderBy: { sortOrder: 'asc' } } },
    });
    if (!cart) throw new NotFoundException('Cart not found');
    if (cart.items.length === 0) throw new BadRequestException('Cart has no items');

    const subtotal = cart.items.reduce(
      (sum, item) => sum + Math.max(0, Number(item.quantity) * Number(item.unitPrice) - Number(item.discountAmount)),
      0,
    );
    const discountAmount = Number(cart.discountAmount);
    const totalAmount = Math.max(0, subtotal - discountAmount);

    // Snapshot items as plain objects for the Quotation JSON field
    const itemsSnapshot = cart.items.map((item) => ({
      type: item.type,
      serviceId: item.serviceId,
      productId: item.productId,
      itemCode: item.itemCode,
      itemNameKh: item.itemNameKh,
      itemNameEn: item.itemNameEn,
      description: item.description,
      quantity: Number(item.quantity),
      unitPrice: Number(item.unitPrice),
      discountAmount: Number(item.discountAmount),
      totalPrice: Number(item.totalPrice),
    }));

    const quotationNumber = await this.repo.generateQuotationNumber();
    const quotation = await this.repo.create({
      quotationNumber,
      customerId: cart.customerId,
      customerName: cart.customerName,
      customerPhone: cart.customerPhone,
      posCartId: cart.id,
      notes: notes ?? cart.note,
      validUntil: validUntil ? new Date(validUntil) : null,
      items: itemsSnapshot,
      subtotal,
      discountAmount,
      totalAmount,
      createdById: userId,
    });

    return createResponse(quotation, 'Quotation created');
  }

  async findAll(userId: string) {
    const quotations = await this.repo.findAll(userId);
    return createResponse(quotations, 'Quotations fetched');
  }

  async findOne(id: string) {
    const quotation = await this.repo.findById(id);
    if (!quotation) throw new NotFoundException('Quotation not found');
    return createResponse(quotation, 'Quotation found');
  }
}
