import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, Max, Min } from 'class-validator';
import { UUID } from 'crypto';

export class MovePositionDto {
  @ApiProperty({ description: 'The user ID of the receiver' })
  @IsInt()
  @IsNotEmpty()
  @Min(0)
  @Max(8)
  position: number;
}

export class GameBoardDto {
  gameId: number;
  invitationId: UUID;
  winner: string;
  player1: string;
  player1Move: number[];
  player2: string;
  player2Move: number[];
  currentTurn: string;
  status: string;
  board: string[];

  constructor(partial: Partial<GameBoardDto>) {
    Object.assign(this, partial);
  }
}

export class UserHistory {
  gamePlayed: number;
  win: number;
  draw: number;
  loss: number;

  constructor(partial: Partial<UserHistory>) {
    Object.assign(this, partial);
  }
}

export class MatchHistory {
  game_id: string;
  winner: string;
  player1Move: number[];
  player2Move: number[];

  constructor(partial: Partial<MatchHistory>) {
    Object.assign(this, partial);
  }
}
