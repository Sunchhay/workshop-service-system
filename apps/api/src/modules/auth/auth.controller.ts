import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';

import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Public } from '../../common/decorators/public.decorator';
import {
  createResponse,
} from '../../common/types/api-response.type';
import type { RequestUser } from '../../common/types/jwt-payload.type';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() dto: LoginDto) {
    const result = await this.authService.login(dto);
    return createResponse(result, 'Login successful');
  }

  @Get('me')
  async getMe(@CurrentUser() user: RequestUser) {
    const data = await this.authService.getMe(user.id);
    return createResponse(data);
  }
}
