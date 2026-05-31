import { Injectable } from '@nestjs/common';

import { createResponse } from '../../common/types/api-response.type';
import { DashboardRepository } from './dashboard.repository';
import type { QueryDashboardDto } from './dto/query-dashboard.dto';

@Injectable()
export class DashboardService {
  constructor(private readonly dashboardRepository: DashboardRepository) {}

  async getSummary() {
    const data = await this.dashboardRepository.getSummary();
    return createResponse(data);
  }

  async getRecentSales(dto: QueryDashboardDto) {
    const data = await this.dashboardRepository.getRecentSales(dto.dateFrom, dto.dateTo);
    return createResponse(data);
  }

  async getTopServices(dto: QueryDashboardDto) {
    const data = await this.dashboardRepository.getTopServices(dto.dateFrom, dto.dateTo);
    return createResponse(data);
  }

  async getTopProducts(dto: QueryDashboardDto) {
    const data = await this.dashboardRepository.getTopProducts(dto.dateFrom, dto.dateTo);
    return createResponse(data);
  }

  async getPaymentSummary(dto: QueryDashboardDto) {
    const data = await this.dashboardRepository.getPaymentSummary(dto.dateFrom, dto.dateTo);
    return createResponse(data);
  }
}
