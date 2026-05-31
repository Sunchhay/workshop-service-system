import { Controller, Get, Query } from '@nestjs/common';

import { DashboardService } from './dashboard.service';
import { QueryDashboardDto } from './dto/query-dashboard.dto';

@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  // GET /api/dashboard/summary
  @Get('summary')
  getSummary() {
    return this.dashboardService.getSummary();
  }

  // GET /api/dashboard/recent-sales
  @Get('recent-sales')
  getRecentSales(@Query() dto: QueryDashboardDto) {
    return this.dashboardService.getRecentSales(dto);
  }

  // GET /api/dashboard/top-services
  @Get('top-services')
  getTopServices(@Query() dto: QueryDashboardDto) {
    return this.dashboardService.getTopServices(dto);
  }

  // GET /api/dashboard/top-products
  @Get('top-products')
  getTopProducts(@Query() dto: QueryDashboardDto) {
    return this.dashboardService.getTopProducts(dto);
  }

  // GET /api/dashboard/payment-summary
  @Get('payment-summary')
  getPaymentSummary(@Query() dto: QueryDashboardDto) {
    return this.dashboardService.getPaymentSummary(dto);
  }
}
