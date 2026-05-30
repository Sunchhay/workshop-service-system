import { Controller, Get, Query } from '@nestjs/common';
import { QueryReportDto } from './dto/query-report.dto';
import { ReportsService } from './reports.service';

@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('summary')
  getSummary(@Query() dto: QueryReportDto) {
    return this.reportsService.getSummary(dto);
  }

  @Get('invoices')
  getInvoices(@Query() dto: QueryReportDto) {
    return this.reportsService.getInvoices(dto);
  }

  @Get('payments')
  getPayments(@Query() dto: QueryReportDto) {
    return this.reportsService.getPayments(dto);
  }

  @Get('sales')
  getSales(@Query() dto: QueryReportDto) {
    return this.reportsService.getSales(dto);
  }

  @Get('expenses')
  getExpenses(@Query() dto: QueryReportDto) {
    return this.reportsService.getExpenses(dto);
  }

  @Get('profit')
  getProfit(@Query() dto: QueryReportDto) {
    return this.reportsService.getProfit(dto);
  }

  @Get('unpaid-balances')
  getUnpaidBalances(@Query() dto: QueryReportDto) {
    return this.reportsService.getUnpaidBalances(dto);
  }

  @Get('products')
  getProducts(@Query() dto: QueryReportDto) {
    return this.reportsService.getProducts(dto);
  }

  @Get('low-stock')
  getLowStock() {
    return this.reportsService.getLowStock();
  }
}
