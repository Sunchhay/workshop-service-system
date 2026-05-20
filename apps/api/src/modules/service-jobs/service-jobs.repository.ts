import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import type { CreateServiceJobDto, CreateServiceJobItemDto } from './dto/create-service-job.dto';
import type { QueryServiceJobDto } from './dto/query-service-job.dto';
import type { UpdateServiceJobDto, UpdateServiceJobItemDto } from './dto/update-service-job.dto';

const SERVICE_JOB_SELECT = {
  id: true,
  jobCode: true,
  customerId: true,
  machineModelId: true,
  partDescription: true,
  status: true,
  priority: true,
  estimatedCompletionDate: true,
  completedAt: true,
  deliveredAt: true,
  notes: true,
  technicianNotes: true,
  createdById: true,
  assignedToId: true,
  createdAt: true,
  updatedAt: true,
  customer: {
    select: { id: true, code: true, name: true, phone: true },
  },
  machineModel: {
    select: { id: true, brand: true, model: true, category: true },
  },
  createdBy: {
    select: { id: true, name: true },
  },
  assignedTo: {
    select: { id: true, name: true },
  },
  items: {
    select: {
      id: true,
      serviceJobId: true,
      type: true,
      serviceId: true,
      priceCatalogId: true,
      productId: true,
      description: true,
      quantity: true,
      unitPrice: true,
      totalPrice: true,
      measurement: true,
      notes: true,
      createdAt: true,
      updatedAt: true,
      service: {
        select: { id: true, code: true, nameEn: true },
      },
      priceCatalog: {
        select: { id: true, label: true },
      },
    },
    orderBy: { createdAt: 'asc' as const },
  },
} as const;

@Injectable()
export class ServiceJobsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async generateJobCode(): Promise<string> {
    const year = new Date().getFullYear();
    const last = await this.prisma.serviceJob.findFirst({
      where: { jobCode: { startsWith: `JOB-${year}-` } },
      orderBy: { createdAt: 'desc' },
      select: { jobCode: true },
    });
    if (!last) return `JOB-${year}-0001`;
    const num = parseInt(last.jobCode.split('-')[2], 10);
    return `JOB-${year}-${String(num + 1).padStart(4, '0')}`;
  }

  private buildItemData(item: CreateServiceJobItemDto | UpdateServiceJobItemDto) {
    const qty = item.quantity ?? 1;
    const total = qty * item.unitPrice;
    return {
      type: item.type,
      serviceId: item.serviceId ?? null,
      priceCatalogId: item.priceCatalogId ?? null,
      description: item.description,
      quantity: qty,
      unitPrice: item.unitPrice,
      totalPrice: total,
      measurement: item.measurement ?? null,
      notes: item.notes ?? null,
    };
  }

  create(data: CreateServiceJobDto & { jobCode: string; createdById: string }) {
    return this.prisma.serviceJob.create({
      data: {
        jobCode: data.jobCode,
        customerId: data.customerId,
        machineModelId: data.machineModelId ?? null,
        partDescription: data.partDescription,
        status: data.status,
        priority: data.priority,
        estimatedCompletionDate: data.estimatedCompletionDate
          ? new Date(data.estimatedCompletionDate)
          : null,
        notes: data.notes ?? null,
        technicianNotes: data.technicianNotes ?? null,
        createdById: data.createdById,
        assignedToId: data.assignedToId ?? null,
        items: data.items?.length
          ? { create: data.items.map((item) => this.buildItemData(item)) }
          : undefined,
      },
      select: SERVICE_JOB_SELECT,
    });
  }

  async findAll(dto: QueryServiceJobDto) {
    const {
      search,
      status,
      priority,
      customerId,
      machineModelId,
      assignedToId,
      fromDate,
      toDate,
      page = 1,
      limit = 20,
    } = dto;
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = { deletedAt: null };
    if (status !== undefined) where.status = status;
    if (priority !== undefined) where.priority = priority;
    if (customerId !== undefined) where.customerId = customerId;
    if (machineModelId !== undefined) where.machineModelId = machineModelId;
    if (assignedToId !== undefined) where.assignedToId = assignedToId;
    if (fromDate !== undefined || toDate !== undefined) {
      where.createdAt = {
        ...(fromDate && { gte: new Date(fromDate) }),
        ...(toDate && { lte: new Date(toDate) }),
      };
    }
    if (search !== undefined) {
      where.OR = [
        { jobCode: { contains: search, mode: 'insensitive' } },
        { partDescription: { contains: search, mode: 'insensitive' } },
        { notes: { contains: search, mode: 'insensitive' } },
        { customer: { name: { contains: search, mode: 'insensitive' } } },
        { customer: { phone: { contains: search, mode: 'insensitive' } } },
      ];
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const prismaWhere = where as any;
    const [data, total] = await Promise.all([
      this.prisma.serviceJob.findMany({
        where: prismaWhere,
        select: SERVICE_JOB_SELECT,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.serviceJob.count({ where: prismaWhere }),
    ]);

    return { data, total };
  }

  findById(id: string) {
    return this.prisma.serviceJob.findFirst({
      where: { id, deletedAt: null },
      select: SERVICE_JOB_SELECT,
    });
  }

  async update(id: string, data: UpdateServiceJobDto) {
    // If items provided, replace all items (delete + recreate)
    if (data.items !== undefined) {
      await this.prisma.serviceJobItem.deleteMany({ where: { serviceJobId: id } });
    }

    return this.prisma.serviceJob.update({
      where: { id },
      data: {
        ...(data.partDescription !== undefined && { partDescription: data.partDescription }),
        ...('machineModelId' in data && { machineModelId: data.machineModelId }),
        ...(data.priority !== undefined && { priority: data.priority }),
        ...('estimatedCompletionDate' in data && {
          estimatedCompletionDate: data.estimatedCompletionDate
            ? new Date(data.estimatedCompletionDate)
            : null,
        }),
        ...(data.notes !== undefined && { notes: data.notes }),
        ...(data.technicianNotes !== undefined && { technicianNotes: data.technicianNotes }),
        ...('assignedToId' in data && { assignedToId: data.assignedToId }),
        ...(data.items !== undefined && {
          items: { create: data.items.map((item) => this.buildItemData(item)) },
        }),
      },
      select: SERVICE_JOB_SELECT,
    });
  }

  updateStatus(id: string, status: string) {
    return this.prisma.serviceJob.update({
      where: { id },
      data: {
        status: status as import('../../generated/prisma/enums').JobStatus,
        ...(status === 'COMPLETED' && { completedAt: new Date() }),
        ...(status === 'DELIVERED' && { deliveredAt: new Date() }),
      },
      select: SERVICE_JOB_SELECT,
    });
  }

  softDelete(id: string) {
    return this.prisma.serviceJob.update({
      where: { id },
      data: { deletedAt: new Date() },
      select: { id: true },
    });
  }
}
