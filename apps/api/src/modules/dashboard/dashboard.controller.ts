import { Controller, Get } from '@nestjs/common';

import { DashboardService } from './dashboard.service';

@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  // GET /api/dashboard/summary
  @Get('summary')
  getSummary() {
    return this.dashboardService.getSummary();
  }

  // GET /api/dashboard/recent-service-jobs
  @Get('recent-service-jobs')
  getRecentServiceJobs() {
    return this.dashboardService.getRecentServiceJobs();
  }

  // GET /api/dashboard/recent-transactions
  @Get('recent-transactions')
  getRecentTransactions() {
    return this.dashboardService.getRecentTransactions();
  }

  // GET /api/dashboard/low-stock-products
  @Get('low-stock-products')
  getLowStockProducts() {
    return this.dashboardService.getLowStockProducts();
  }
}
