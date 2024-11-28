import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { InvitationAcceptedEvent } from '../events/invitations-accepted.event';
import { GameService } from 'src/game/game.service';
import { UUID } from 'crypto';

@Injectable()
export class InvitationAcceptedListener {
  constructor(private readonly gameService: GameService) {}
  @OnEvent('invitation.accepted')
  handleOrderCreatedEvent(event: InvitationAcceptedEvent) {
    // handle and process "InvitationAcceptedEvent" event
    console.log(event);
    this.gameService.createGame(event.name as UUID);
  }
}
