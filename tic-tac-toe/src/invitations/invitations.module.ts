import { Module } from '@nestjs/common';
import { InvitationsService } from './invitations.service';
import { InvitationsController } from './invitations.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Invitation } from './entities/invitaions.entity';
import { JwtService } from '@nestjs/jwt';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from 'src/auth/guard/auth.guard';

@Module({
  imports: [TypeOrmModule.forFeature([Invitation])],
  providers: [
    InvitationsService,
    JwtService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
  controllers: [InvitationsController],
  exports: [TypeOrmModule, InvitationsService],
})
export class InvitationsModule {}
