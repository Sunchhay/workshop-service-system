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
import { ServicePricesModule } from './modules/service-prices/service-prices.module';
import { ReferenceBookModule } from './modules/reference-book/reference-book.module';
import { PaymentsModule } from './modules/payments/payments.module';
import { ProductsModule } from './modules/products/products.module';
import { ProductPricesModule } from './modules/product-prices/product-prices.module';
import { DashboardModule } from './modules/dashboard/dashboard.module';
import { ReportsModule } from './modules/reports/reports.module';
import { ExpensesModule } from './modules/expenses/expenses.module';
import { SalesModule } from './modules/sales/sales.module';
import { SettingsModule } from './modules/settings/settings.module';
import { ServicesModule } from './modules/services/services.module';
import { UsersModule } from './modules/users/users.module';
import { SuppliersModule } from './modules/suppliers/suppliers.module';
import { ProductSupplierPricesModule } from './modules/product-supplier-prices/product-supplier-prices.module';
import { CartsModule } from './modules/carts/carts.module';
import { CheckoutModule } from './modules/checkout/checkout.module';

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
    ServicePricesModule,
    ProductsModule,
    ProductPricesModule,
    MachineModelsModule,
    ReferenceBookModule,
    PaymentsModule,
    DashboardModule,
    ReportsModule,
    ExpensesModule,
    SalesModule,
    SettingsModule,
    SuppliersModule,
    ProductSupplierPricesModule,
    CartsModule,
    CheckoutModule,
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
export class AppModule { }
