import { Injectable } from '@nestjs/common';
import { createResponse } from '../../common/types/api-response.type';
import { QueryReportDto } from './dto/query-report.dto';
import { ReportsRepository } from './reports.repository';

@Injectable()
export class ReportsService {
  constructor(private readonly reportsRepository: ReportsRepository) {}

  async getSummary(dto: QueryReportDto) {
    const data = await this.reportsRepository.getSummary(dto.fromDate, dto.toDate);
    return createResponse(data);
  }

  async getInvoices(dto: QueryReportDto) {
    const data = await this.reportsRepository.getInvoices(dto);
    return createResponse(data);
  }

  async getPayments(dto: QueryReportDto) {
    const data = await this.reportsRepository.getPayments(dto);
    return createResponse(data);
  }

  async getSales(dto: QueryReportDto) {
    const data = await this.reportsRepository.getSales(dto);
    return createResponse(data);
  }

  async getExpenses(dto: QueryReportDto) {
    const data = await this.reportsRepository.getExpenses(dto);
    return createResponse(data);
  }

  async getProfit(dto: QueryReportDto) {
    const data = await this.reportsRepository.getProfit(dto.fromDate, dto.toDate);
    return createResponse(data);
  }

  async getUnpaidBalances(dto: QueryReportDto) {
    const data = await this.reportsRepository.getUnpaidBalances(dto);
    return createResponse(data);
  }

  async getProducts(dto: QueryReportDto) {
    const data = await this.reportsRepository.getProducts(dto);
    return createResponse(data);
  }

  async getLowStock() {
    const data = await this.reportsRepository.getLowStock();
    return createResponse(data);
  }
}
