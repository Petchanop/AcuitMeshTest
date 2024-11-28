import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Timestamp,
  UpdateDateColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { UUID } from 'crypto';
import { Game } from '../../game/entities/game.entity';
import { ApiProperty } from '@nestjs/swagger';
import { Invitation } from '../../invitations/entities/invitaions.entity';

export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
}

@Entity()
export class User {
  /**
   * this decorator will help to auto generate id for the table.
   */
  @PrimaryGeneratedColumn('uuid')
  id: UUID;

  @Column({ type: 'varchar', length: 50, nullable: false })
  username: string;

  @Column({ type: 'varchar', length: 100, nullable: false })
  email: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  @Exclude()
  password: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.USER,
  })
  role: UserRole;

  @OneToMany(() => Game, (game) => game.player1, { cascade: true })
  @ApiProperty({
    description: 'Games where the user is player 1',
    type: () => Game,
    isArray: true,
  })
  gamesAsPlayer1: Game[];

  @OneToMany(() => Game, (game) => game.player2, { cascade: true })
  @ApiProperty({
    description: 'Games where the user is player 2',
    type: () => Game,
    isArray: true,
  })
  gamesAsPlayer2: Game[];

  @OneToMany(() => Invitation, (invitation) => invitation.sender)
  @ApiProperty({
    description: 'Invitations sent by the user',
    type: () => Invitation,
    isArray: true,
  })
  sentInvitations: Invitation[];

  @OneToMany(() => Invitation, (invitation) => invitation.receiver)
  @ApiProperty({
    description: 'Invitations received by the user',
    type: () => Invitation,
    isArray: true,
  })
  receivedInvitations: Invitation[];

  @CreateDateColumn({ nullable: false })
  created_at: Timestamp;

  @UpdateDateColumn({ nullable: false })
  updated_at: Timestamp;

  constructor(partial: Partial<User>) {
    Object.assign(this, partial);
  }
}
