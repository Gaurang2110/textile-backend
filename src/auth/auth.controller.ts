import { Body, Controller, Post } from '@nestjs/common';
import { loginDTO } from './dto/login.dto';
import { AuthService } from './auth.service';

@Controller({
  path: 'auth',
  version: '1',
})
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(
    @Body() dto: loginDTO,
  ): Promise<{ message: string; data: Record<string, any> }> {
    const resp = await this.authService.login(dto);
    return { message: 'Login successfully.', data: resp };
  }
}
