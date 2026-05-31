import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import {
  createPaginatedResponse,
  createResponse,
} from '../../common/types/api-response.type';
import { CartStatus, ItemType } from '../../generated/prisma/enums';
import type { AddCartItemDto } from './dto/add-cart-item.dto';
import type { CreateCartDto } from './dto/create-cart.dto';
import type { QueryCartDto } from './dto/query-cart.dto';
import type { UpdateCartDto } from './dto/update-cart.dto';
import type { UpdateCartItemDto } from './dto/update-cart-item.dto';
import { CartsRepository } from './carts.repository';

@Injectable()
export class CartsService {
  constructor(private readonly cartsRepository: CartsRepository) {}

  async create(dto: CreateCartDto, createdById: string) {
    if (dto.customerId !== undefined) {
      const exists = await this.cartsRepository.customerExists(dto.customerId);
      if (!exists) throw new BadRequestException('Customer not found');
    }
    if (dto.mechanicId !== undefined) {
      const exists = await this.cartsRepository.mechanicExists(dto.mechanicId);
      if (!exists) throw new BadRequestException('Mechanic not found or not a mechanic customer');
    }
    const cart = await this.cartsRepository.create(dto, createdById);
    return createResponse(cart, 'Cart created');
  }

  async findAll(dto: QueryCartDto) {
    const page = dto.page ?? 1;
    const limit = dto.limit ?? 20;
    const { data, total } = await this.cartsRepository.findAll(dto);
    return createPaginatedResponse(data, total, page, limit);
  }

  async findOne(id: string) {
    const cart = await this.cartsRepository.findById(id);
    if (!cart) throw new NotFoundException('Cart not found');
    return cart;
  }

  private assertActive(status: string) {
    if (status !== CartStatus.ACTIVE) {
      throw new BadRequestException('Cart is not active');
    }
  }

  async update(id: string, dto: UpdateCartDto) {
    const cart = await this.findOne(id);
    this.assertActive(cart.status);

    if (dto.customerId !== undefined) {
      const exists = await this.cartsRepository.customerExists(dto.customerId);
      if (!exists) throw new BadRequestException('Customer not found');
    }
    if (dto.mechanicId !== undefined) {
      const exists = await this.cartsRepository.mechanicExists(dto.mechanicId);
      if (!exists) throw new BadRequestException('Mechanic not found or not a mechanic customer');
    }

    const updated = await this.cartsRepository.update(id, dto);
    return createResponse(updated, 'Cart updated');
  }

  async addItem(cartId: string, dto: AddCartItemDto) {
    const cart = await this.findOne(cartId);
    this.assertActive(cart.status);

    if (dto.itemType === ItemType.SERVICE) {
      if (!dto.serviceId) throw new BadRequestException('serviceId is required for SERVICE item');
    } else {
      if (!dto.productId) throw new BadRequestException('productId is required for PRODUCT item');
    }

    let entityName: string;

    if (dto.itemType === ItemType.SERVICE) {
      const service = await this.cartsRepository.serviceExists(dto.serviceId!);
      if (!service) throw new BadRequestException('Service not found');
      entityName = service.name;
    } else {
      const product = await this.cartsRepository.productExists(dto.productId!);
      if (!product) throw new BadRequestException('Product not found');
      entityName = product.name;
    }

    let nameSnapshot = entityName;
    if (dto.machineModelId !== undefined) {
      const model = await this.cartsRepository.machineModelExists(dto.machineModelId);
      if (!model) throw new BadRequestException('Machine model not found');
      nameSnapshot = `${model.modelName} - ${entityName}`;
    }

    const item = await this.cartsRepository.addItem(cartId, dto, nameSnapshot);
    return createResponse(item, 'Item added to cart');
  }

  async updateItem(cartId: string, itemId: string, dto: UpdateCartItemDto) {
    const cart = await this.findOne(cartId);
    this.assertActive(cart.status);

    const item = await this.cartsRepository.findItemById(itemId);
    if (!item || item.cartId !== cartId) throw new NotFoundException('Cart item not found');

    let nameSnapshot: string | undefined;
    if (dto.machineModelId !== undefined) {
      const model = dto.machineModelId
        ? await this.cartsRepository.machineModelExists(dto.machineModelId)
        : null;
      if (dto.machineModelId && !model) throw new BadRequestException('Machine model not found');

      // Rebuild nameSnapshot with updated model
      let entityName: string;
      if (item.itemType === ItemType.SERVICE) {
        const service = await this.cartsRepository.serviceExists(item.serviceId!);
        entityName = service?.name ?? '';
      } else {
        const product = await this.cartsRepository.productExists(item.productId!);
        entityName = product?.name ?? '';
      }
      nameSnapshot = model ? `${model.modelName} - ${entityName}` : entityName;
    }

    // Recalculate total using updated or existing values
    const unitPrice = dto.unitPrice ?? parseFloat(item.unitPrice.toString());
    const quantity = dto.quantity ?? parseFloat(item.quantity.toString());
    const patchedDto = { ...dto, unitPrice, quantity };

    const updated = await this.cartsRepository.updateItem(itemId, patchedDto, nameSnapshot);
    return createResponse(updated, 'Cart item updated');
  }

  async removeItem(cartId: string, itemId: string) {
    const cart = await this.findOne(cartId);
    this.assertActive(cart.status);

    const item = await this.cartsRepository.findItemById(itemId);
    if (!item || item.cartId !== cartId) throw new NotFoundException('Cart item not found');

    await this.cartsRepository.deleteItem(itemId);
    return createResponse(null, 'Cart item removed');
  }

  async clearItems(cartId: string) {
    const cart = await this.findOne(cartId);
    this.assertActive(cart.status);
    await this.cartsRepository.clearItems(cartId);
    return createResponse(null, 'Cart cleared');
  }

  async discard(id: string) {
    const cart = await this.findOne(id);
    this.assertActive(cart.status);
    await this.cartsRepository.deleteCart(id);
    return createResponse(null, 'Cart discarded');
  }
}
