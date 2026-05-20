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
import { PriceCatalogModule } from './modules/price-catalog/price-catalog.module';
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
