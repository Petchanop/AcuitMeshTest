import { IsEnum, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { InvitationStatus } from '../entities/invitaions.entity';
import { UUID } from 'crypto';

export enum InvitationType {
  SENDER = 'sender',
  RECEIVER = 'receiver',
  DEFAULT = 'all',
}

export class CreateInvitationDto {
  @ApiProperty({ description: 'The user ID of the receiver' })
  @IsNotEmpty()
  receiverId: string;
}

export class TypeInvitationDto {
  @ApiProperty({ enum: InvitationType, description: 'sender or receiver type' })
  @IsEnum(InvitationType, { each: true })
  @IsNotEmpty()
  type: InvitationType;
}

export class UserDataDto {
  id: UUID;
  username: string;
  email: string;

  constructor(partial: Partial<UserDataDto>) {
    Object.assign(this, partial);
  }
}

export class InvitationDto {
  id: string;
  sender: UserDataDto;
  receiver: UserDataDto;
  status: InvitationStatus;

  constructor(partial: Partial<InvitationDto>) {
    Object.assign(this, partial);
  }
}
