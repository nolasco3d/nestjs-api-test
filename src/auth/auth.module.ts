import { Module } from '@nestjs/common';
import { AuthController } from './auto.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {
  constructor() {}
}
