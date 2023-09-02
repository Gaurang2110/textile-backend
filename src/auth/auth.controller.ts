import { Body, Controller, Post } from '@nestjs/common';
import { LoginDTO } from './dto/login.dto';
import { AuthService } from './auth.service';
import {
  ForgotPasswordDTO,
  UpdatePasswordDTO,
} from './dto/forgot-password.dto';

@Controller({
  path: 'auth',
  version: '1',
})
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() dto: LoginDTO): Promise<IResponse> {
    const resp = await this.authService.login(dto);
    return { message: 'Login successfully.', data: resp };
  }

  @Post('forgot-password')
  async forgotPassword(@Body() dto: ForgotPasswordDTO): Promise<IResponse> {
    const resp = await this.authService.forgotPassword(dto);
    return { message: 'Verification code sent successfully.', data: resp };
  }

  @Post('update-password')
  async updatePassword(@Body() dto: UpdatePasswordDTO): Promise<IResponse> {
    const resp = await this.authService.updatePassword(dto);
    return { message: 'Password updated successfully.', data: resp };
  }
}
