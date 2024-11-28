import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsDate } from 'class-validator';
import { User } from '../../users/entities/users.entity';
import { Move } from '../../move/entities/move.entity';
import { UUID } from 'crypto';

export enum GameStatus {
  InProgress = 'InProgress',
  Completed = 'Completed',
}

export enum GameWinner {
  Player1 = 'Player1',
  Player2 = 'Player2',
  Draw = 'Draw',
  Null = null,
}

@Entity('games')
export class Game {
  @PrimaryGeneratedColumn()
  @ApiProperty({ description: 'Unique identifier for the game' })
  game_id: number;

  @ManyToOne(() => User, (user) => user.gamesAsPlayer1, { eager: true })
  @ApiProperty({ description: 'Player 1 of the game', type: () => User })
  player1: User;

  @ManyToOne(() => User, (user) => user.gamesAsPlayer2, { eager: true })
  @ApiProperty({ description: 'Player 2 of the game', type: () => User })
  player2: User;

  @Column()
  @ApiProperty({ description: 'Current Player turn' })
  currentTurn: UUID;

  @Column({ type: 'enum', enum: GameStatus, default: 'InProgress' })
  @ApiProperty({
    description: 'The current status of the game',
    enum: GameStatus,
    default: GameStatus.InProgress,
  })
  @IsEnum(GameStatus)
  status: string;

  @Column({ type: 'enum', enum: GameWinner, nullable: true })
  @ApiProperty({
    description:
      'The winner of the game. Can be Player1, Player2, Draw, or null if ongoing.',
    enum: GameWinner,
    nullable: true,
  })
  @IsOptional()
  @IsEnum(GameWinner)
  winner: string | null;

  @OneToMany(() => Move, (move) => move.game, { cascade: ['insert', 'update'] })
  @ApiProperty({
    description: 'List of moves made during the game',
    type: () => Move,
    isArray: true,
  })
  moves: Move[];

  @CreateDateColumn()
  @ApiProperty({ description: 'Timestamp when the game was created' })
  @IsDate()
  createdAt: Date;

  @UpdateDateColumn()
  @ApiProperty({ description: 'Timestamp when the game was last updated' })
  @IsDate()
  updatedAt: Date;
}
