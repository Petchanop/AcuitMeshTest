import { Module } from '@nestjs/common';
import { GameController } from './game.controller';
import { MoveService } from '../move/move.service';
import { Game } from './entities/game.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GameService } from './game.service';
import { AuthGuard } from 'src/auth/guard/auth.guard';
import { JwtService } from '@nestjs/jwt';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [TypeOrmModule.forFeature([Game])],
  controllers: [GameController],
  providers: [
    GameService,
    JwtService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class GameModule {}
