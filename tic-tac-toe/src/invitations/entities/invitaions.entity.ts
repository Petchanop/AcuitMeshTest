import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  Column,
  CreateDateColumn,
  OneToOne,
  JoinColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { User } from '../../users/entities/users.entity';
import { UUID } from 'crypto';
import { Game } from 'src/game/entities/game.entity';

export enum InvitationStatus {
  Pending = 'Pending',
  Accepted = 'Accepted',
  Rejected = 'Rejected',
}

@Entity('invitations')
export class Invitation {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty({ description: 'Unique identifier for the invitation' })
  invitation_id: UUID;

  @OneToOne(() => Game, (game) => game.invitation)
  @JoinColumn()
  game: Game | null;

  @ManyToOne(() => User, (user) => user.sentInvitations, { eager: true })
  @ApiProperty({
    description: 'The user who sent the invitation',
    type: () => User,
  })
  sender: User;

  @ManyToOne(() => User, (user) => user.receivedInvitations, { eager: true })
  @ApiProperty({
    description: 'The user who received the invitation',
    type: () => User,
  })
  receiver: User;

  @Column({
    type: 'enum',
    enum: InvitationStatus,
    default: InvitationStatus.Pending,
  })
  @ApiProperty({ description: 'Status of the invitation' })
  @IsEnum(InvitationStatus)
  @IsNotEmpty()
  status: InvitationStatus;

  @CreateDateColumn()
  @ApiProperty({ description: 'Timestamp when the invitation was created' })
  created_at: Date;

  @UpdateDateColumn({ nullable: true })
  updated_at: Date;
}
