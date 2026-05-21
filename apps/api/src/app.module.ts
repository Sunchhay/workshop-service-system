import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { validate } from './config/env.validation';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard';
import { RolesGuard } from './common/guards/roles.guard';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { CustomersModule } from './modules/customers/customers.module';
import { MachineModelsModule } from './modules/machine-models/machine-models.module';
import { PriceCatalogModule } from './modules/price-catalog/price-catalog.module';
import { ReferenceBookModule } from './modules/reference-book/reference-book.module';
import { InvoicesModule } from './modules/invoices/invoices.module';
import { PaymentsModule } from './modules/payments/payments.module';
import { ProductsModule } from './modules/products/products.module';
import { DashboardModule } from './modules/dashboard/dashboard.module';
import { ExpensesModule } from './modules/expenses/expenses.module';
import { SalesModule } from './modules/sales/sales.module';
import { ServiceJobsModule } from './modules/service-jobs/service-jobs.module';
import { ServicesModule } from './modules/services/services.module';
import { UsersModule } from './modules/users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate,
    }),
    PrismaModule,
    AuthModule,
    UsersModule,
    CustomersModule,
    ServicesModule,
    PriceCatalogModule,
    MachineModelsModule,
    ReferenceBookModule,
    InvoicesModule,
    PaymentsModule,
    ProductsModule,
    DashboardModule,
    ExpensesModule,
    SalesModule,
    ServiceJobsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    // JwtAuthGuard runs first — validates token, sets request.user
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    // RolesGuard runs second — checks request.user.role against @Roles()
    { provide: APP_GUARD, useClass: RolesGuard },
  ],
})
export class AppModule {}
