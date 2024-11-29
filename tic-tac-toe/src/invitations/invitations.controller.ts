import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Invitation } from './entities/invitaions.entity';
import { InvitationsService } from './invitations.service';
import {
  CreateInvitationDto,
  InvitationDto,
  InvitationType,
} from './dto/invitations.dto';
import { UUID } from 'crypto';
import * as slugid from 'slugid';

@ApiTags('invitations')
@Controller('invitations')
export class InvitationsController {
  constructor(private readonly invitationService: InvitationsService) {}

  @Post('create')
  @ApiOperation({ summary: 'Create a new invitation' })
  @ApiResponse({
    status: 201,
    description: 'Invitation created successfully',
    type: Invitation,
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiBearerAuth('JWT')
  async createInvitation(
    @Req() req,
    @Body() createInvitationDto: CreateInvitationDto,
  ): Promise<InvitationDto> {
    const { receiverId } = createInvitationDto;
    return this.invitationService.createInvitation(
      req.user,
      slugid.decode(receiverId) as UUID,
    );
  }

  @Patch(':id/accept')
  @ApiOperation({ summary: 'Accept an invitation' })
  @ApiResponse({
    status: 200,
    description: 'Invitation accepted successfully',
    type: InvitationDto,
  })
  @ApiResponse({ status: 404, description: 'Invitation not found' })
  @ApiBearerAuth('JWT')
  async acceptInvitation(
    @Req() req,
    @Param('id') invitationId: UUID,
  ): Promise<InvitationDto> {
    return this.invitationService.acceptInvitation(req.user, invitationId);
  }

  @Patch(':id/reject')
  @ApiOperation({ summary: 'Reject an invitation' })
  @ApiResponse({
    status: 200,
    description: 'Invitation rejected successfully',
    type: InvitationDto,
  })
  @ApiResponse({ status: 404, description: 'Invitation not found' })
  @ApiBearerAuth('JWT')
  async rejectInvitation(
    @Req() req,
    @Param('id') invitationId: UUID,
  ): Promise<InvitationDto> {
    return this.invitationService.rejectInvitation(req.user, invitationId);
  }

  @Get('user/:userId')
  @ApiQuery({ name: 'type', enum: InvitationType })
  @ApiOperation({ summary: 'Get all invitations by user ID' })
  @ApiResponse({
    status: 200,
    description: 'List of invitations',
    type: [InvitationDto],
  })
  @ApiResponse({ status: 404, description: 'No invitations found' })
  @ApiBearerAuth('JWT')
  async getInvitationsByUserId(
    @Param('userId') userId: string,
    @Query('type') _type: InvitationType = InvitationType.DEFAULT,
  ): Promise<InvitationDto[]> {
    try {
      return await this.invitationService.getInvitationsByUserId(
        slugid.decode(userId) as UUID,
        _type,
      );
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new NotFoundException('Failed to fetch invitations');
    }
  }

  @Get('me')
  @ApiQuery({ name: 'type', enum: InvitationType })
  @ApiOperation({ summary: 'Get all user invitatoins.' })
  @ApiResponse({
    status: 200,
    description: 'List user receive invitation.',
    type: [InvitationDto],
  })
  @ApiBearerAuth('JWT')
  async getUserInvitation(
    @Req() _req,
    @Query('type') _type: InvitationType = InvitationType.DEFAULT,
  ): Promise<InvitationDto[]> {
    return await this.invitationService.getInvitationsByUserId(
      _req.user.id,
      _type,
    );
  }
}
