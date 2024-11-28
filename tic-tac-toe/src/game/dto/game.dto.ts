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
  invitationId: UUID;
  gameId: number;
  winner: string;
  player1: string;
  player2: string;
  board: string[];

  constructor(partial: Partial<GameBoardDto>) {
    Object.assign(this, partial);
  }
}
