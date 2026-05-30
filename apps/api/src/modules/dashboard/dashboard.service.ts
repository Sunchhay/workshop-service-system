import { Injectable } from '@nestjs/common';

import { createResponse } from '../../common/types/api-response.type';
import { DashboardRepository } from './dashboard.repository';

@Injectable()
export class DashboardService {
  constructor(private readonly dashboardRepository: DashboardRepository) {}

  async getSummary() {
    const summary = await this.dashboardRepository.getSummary();
    return createResponse(summary);
  }

  async getRecentTransactions() {
    const transactions = await this.dashboardRepository.getRecentTransactions();
    return createResponse(transactions);
  }

  async getLowStockProducts() {
    const products = await this.dashboardRepository.getLowStockProducts();
    return createResponse(products);
  }
}
