import { IsEnum, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

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
