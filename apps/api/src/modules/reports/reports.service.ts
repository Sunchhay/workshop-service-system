import { Injectable } from '@nestjs/common';

import { createResponse } from '../../common/types/api-response.type';
import { QueryReportDto } from './dto/query-report.dto';
import { ReportsRepository } from './reports.repository';

@Injectable()
export class ReportsService {
  constructor(private readonly reportsRepository: ReportsRepository) {}

  async getSales(dto: QueryReportDto) {
    const data = await this.reportsRepository.getSales(dto);
    return createResponse(data);
  }

  async getPayments(dto: QueryReportDto) {
    const data = await this.reportsRepository.getPayments(dto);
    return createResponse(data);
  }

  async getExpenses(dto: QueryReportDto) {
    const data = await this.reportsRepository.getExpenses(dto);
    return createResponse(data);
  }

  async getProfitSummary(dto: QueryReportDto) {
    const data = await this.reportsRepository.getProfitSummary(dto);
    return createResponse(data);
  }

  async getMechanicCommissions(dto: QueryReportDto) {
    const data = await this.reportsRepository.getMechanicCommissions(dto);
    return createResponse(data);
  }

  async getCustomerDebts(dto: QueryReportDto) {
    const data = await this.reportsRepository.getCustomerDebts(dto);
    return createResponse(data);
  }

  async getServiceUsage(dto: QueryReportDto) {
    const data = await this.reportsRepository.getServiceUsage(dto);
    return createResponse(data);
  }

  async getProductSales(dto: QueryReportDto) {
    const data = await this.reportsRepository.getProductSales(dto);
    return createResponse(data);
  }
}
