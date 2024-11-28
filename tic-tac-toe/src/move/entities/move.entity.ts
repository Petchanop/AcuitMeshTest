import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  Column,
  CreateDateColumn,
  JoinColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, Min, Max } from 'class-validator';
import { Game } from '../../game/entities/game.entity';
import { User } from '../../users/entities/users.entity';

@Entity('moves')
export class Move {
  @PrimaryGeneratedColumn()
  @ApiProperty({ description: 'Unique identifier for the move' })
  move_id: number;

  @ManyToOne(() => Game, (game) => game.moves, {
    eager: true,
    cascade: ['insert', 'update'],
  })
  @ApiProperty({
    description: 'The game in which the move was made',
    type: () => Game,
  })
  @JoinColumn({ name: 'game_id' })
  game: Game;

  @ManyToOne(() => User, { eager: true })
  @ApiProperty({ description: 'Player who make a move', type: () => User })
  player: User;

  @Column({ type: 'int' })
  @ApiProperty({
    description: 'Position of the move (1-9 on the Tic Tac Toe board)',
  })
  @IsInt()
  @IsNotEmpty()
  @Min(1)
  @Max(9)
  position: number;

  @CreateDateColumn()
  @ApiProperty({ description: 'Timestamp when the move was made' })
  @IsNotEmpty()
  createdAt: Date;
}
