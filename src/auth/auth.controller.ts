import { AuthService } from './auth.service';
import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthDTO, SignInDTO } from './types';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {
    console.log(`I'm AuthController, b!tch.`);
  }

  @Post('signup')
  signup(@Body() dto: AuthDTO) {
    return this.authService.signup(dto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('signin')
  signin(@Body() data: SignInDTO) {
    return this.authService.signin(data);
  }
}
