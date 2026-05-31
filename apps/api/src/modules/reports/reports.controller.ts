import { Controller, Get, Query } from '@nestjs/common';

import { QueryReportDto } from './dto/query-report.dto';
import { ReportsService } from './reports.service';

@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  // GET /api/reports/sales
  @Get('sales')
  getSales(@Query() dto: QueryReportDto) {
    return this.reportsService.getSales(dto);
  }

  // GET /api/reports/payments
  @Get('payments')
  getPayments(@Query() dto: QueryReportDto) {
    return this.reportsService.getPayments(dto);
  }

  // GET /api/reports/expenses
  @Get('expenses')
  getExpenses(@Query() dto: QueryReportDto) {
    return this.reportsService.getExpenses(dto);
  }

  // GET /api/reports/profit-summary
  @Get('profit-summary')
  getProfitSummary(@Query() dto: QueryReportDto) {
    return this.reportsService.getProfitSummary(dto);
  }

  // GET /api/reports/mechanic-commissions
  @Get('mechanic-commissions')
  getMechanicCommissions(@Query() dto: QueryReportDto) {
    return this.reportsService.getMechanicCommissions(dto);
  }

  // GET /api/reports/customer-debts
  @Get('customer-debts')
  getCustomerDebts(@Query() dto: QueryReportDto) {
    return this.reportsService.getCustomerDebts(dto);
  }

  // GET /api/reports/service-usage
  @Get('service-usage')
  getServiceUsage(@Query() dto: QueryReportDto) {
    return this.reportsService.getServiceUsage(dto);
  }

  // GET /api/reports/product-sales
  @Get('product-sales')
  getProductSales(@Query() dto: QueryReportDto) {
    return this.reportsService.getProductSales(dto);
  }
}
