import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from 'src/users/users.module';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './guard/auth.guard';

@Module({
  imports: [UsersModule,
    JwtModule.register({
      global: true,
      secret: `${process.env.SECRETKEY}`,
      signOptions: { expiresIn: `${process.env.EXPIRESIN}` },
    }),],
  providers: [
    AuthService,
    JwtService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    }
  ],
  controllers: [AuthController],
  exports: [AuthService]
})
export class AuthModule { }
