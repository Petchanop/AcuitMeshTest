import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/users.entity';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from 'src/auth/guard/auth.guard';
import { RolesGuard } from './guard/roles.guard';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [
    UsersService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
  controllers: [UsersController],
  exports: [TypeOrmModule, UsersService],
})
export class UsersModule { }
