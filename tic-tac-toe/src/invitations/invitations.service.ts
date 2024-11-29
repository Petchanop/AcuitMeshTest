import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Invitation, InvitationStatus } from './entities/invitaions.entity';
import { DataSource, Repository } from 'typeorm';
import { User } from 'src/users/entities/users.entity';
import { UUID } from 'crypto';
import { InvitationAcceptedEvent } from './events/invitations-accepted.event';
import { EventEmitter2 } from '@nestjs/event-emitter';
import {
  InvitationDto,
  InvitationType,
  UserDataDto,
} from './dto/invitations.dto';

@Injectable()
export class InvitationsService {
  constructor(
    @InjectRepository(Invitation)
    public invitationRepository: Repository<Invitation>,
    private dataSource: DataSource,
    private eventEmitter: EventEmitter2,
  ) {}

  createUserDataDto(
    userId: UUID,
    username: string,
    email: string,
  ): UserDataDto {
    const userData = new UserDataDto({
      id: userId,
      username: username,
      email: email,
    });
    return userData;
  }

  createInvitationDto(result: Invitation): InvitationDto {
    const senderDto = this.createUserDataDto(
      result.sender.id,
      result.sender.username,
      result.sender.email,
    );
    const receiverDto = this.createUserDataDto(
      result.receiver.id,
      result.receiver.username,
      result.receiver.email,
    );
    const responseInvitationData = new InvitationDto({
      id: result.invitation_id,
      sender: senderDto,
      receiver: receiverDto,
      status: result.status,
    });
    return responseInvitationData;
  }

  async createInvitation(
    sender: User,
    receiverId: UUID,
  ): Promise<InvitationDto> {
    if (sender.id == receiverId) {
      throw new HttpException(
        'You cannot send invitation to yourself.',
        HttpStatus.BAD_REQUEST,
      );
    }
    const invitation = new Invitation();
    const receiver = await this.dataSource.getRepository(User).findOne({
      where: {
        id: receiverId,
      },
    });
    invitation.sender = sender; // Populate sender
    invitation.receiver = receiver; // Populate receiver
    invitation.status = InvitationStatus.Pending; // Default status
    const result = await this.invitationRepository.save(invitation);
    const responseInvitationData = this.createInvitationDto(result);
    return responseInvitationData;
  }

  async acceptInvitation(
    user: User,
    invitationId: UUID,
  ): Promise<InvitationDto> {
    const invitation = await this.invitationRepository.findOne({
      where: [
        { invitation_id: invitationId },
        { receiver: { id: user.id } },
        { status: InvitationStatus.Pending },
      ],
    });
    if (invitation) {
      invitation.status = InvitationStatus.Accepted;
      const invitationAcceptedEvent = new InvitationAcceptedEvent();
      invitationAcceptedEvent.name = invitation.invitation_id;
      invitationAcceptedEvent.description = `${invitation.sender} vs ${invitation.receiver} at invitaion id ${invitation.invitation_id}`;
      const result = await this.invitationRepository.save(invitation);
      this.eventEmitter.emit('invitation.accepted', invitationAcceptedEvent);
      const responseInvitationData = this.createInvitationDto(result);
      return responseInvitationData;
    }
    throw new Error('Invitation not found');
  }

  // Reject an invitation
  async rejectInvitation(
    user: User,
    invitationId: UUID,
  ): Promise<InvitationDto> {
    const invitation = await this.invitationRepository.findOne({
      where: [
        { invitation_id: invitationId },
        { receiver: { id: user.id } },
        { status: InvitationStatus.Pending },
      ],
    });
    if (invitation) {
      invitation.status = InvitationStatus.Rejected;
      const result = await this.invitationRepository.save(invitation);
      const responseInvitationData = this.createInvitationDto(result);
      return responseInvitationData;
    }
    throw new Error('Invitation not found');
  }

  async getInvitationsByUserId(
    userId: UUID,
    type: string,
  ): Promise<InvitationDto[]> {
    console.log(userId, type);
    let invitations: Invitation[];
    switch (type) {
      case InvitationType.DEFAULT:
        invitations = await this.dataSource.getRepository(Invitation).find({
          where: [{ sender: { id: userId } }, { receiver: { id: userId } }],
          relations: ['sender', 'receiver'],
        });

        if (!invitations.length) {
          throw new NotFoundException(
            `No invitations found for user with ID ${userId}`,
          );
        }
        break;

      case InvitationType.RECEIVER:
        invitations = await this.dataSource.getRepository(Invitation).find({
          where: { receiver: { id: userId } },
          relations: ['receiver'],
        });

        if (!invitations.length) {
          throw new NotFoundException(
            `No invitations send to user with ID ${userId}`,
          );
        }
        break;

      case InvitationType.SENDER:
        invitations = await this.dataSource.getRepository(Invitation).find({
          where: { sender: { id: userId } },
          relations: ['sender'],
        });

        if (!invitations.length) {
          throw new NotFoundException(
            `No invitations send from user with ID ${userId}`,
          );
        }
        break;
    }
    return invitations.map((item) => this.createInvitationDto(item));
  }
}
