/* eslint-disable prettier/prettier */
import {
  BadRequestException,
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Req,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { GameService } from './game.service';
import { UUID } from 'crypto';
import { Move } from 'src/move/entities/move.entity';
import { GameBoardDto, MovePositionDto, UserHistory } from './dto/game.dto';

@ApiTags('games')
@Controller('games')
export class GameController {
  constructor(private readonly gameService: GameService) { }

  @Post('create/:invitationId')
  @ApiOperation({
    summary: 'Create a new game based on an accepted invitation',
  })
  @ApiResponse({
    status: 201,
    description: 'Game successfully created',
    type: GameBoardDto,
  })
  @ApiResponse({ status: 404, description: 'Invitation not found' })
  @ApiResponse({ status: 400, description: 'Invitation is not accepted' })
  @ApiBearerAuth('JWT')
  async createGame(@Req() _req, @Param('invitationId') invitationId: UUID): Promise<GameBoardDto> {
    try {
      return await this.gameService.createGame(invitationId);
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new BadRequestException('Failed to create game');
    }
  }

  @Get('me')
  @ApiOperation({ description: "player1 is X, player2 is O", summary: 'Get user game details' })
  @ApiResponse({ status: 200, description: 'Game retrieved successfully', type: [GameBoardDto] })
  @ApiResponse({ status: 404, description: 'Game not found' })
  @ApiBearerAuth('JWT')
  async getUserGame(@Req() _req): Promise<GameBoardDto[]> {
    try {
      return await this.gameService.getGameByUserId(_req.user.id);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new NotFoundException(`Failed to retrieve game with ID ${_req.user.id}`);
    }
  }

  @Get(':gameId')
  @ApiOperation({ description: "player1 is X, player2 is O", summary: 'Get game details by ID' })
  @ApiResponse({ status: 200, description: 'Game retrieved successfully', type: GameBoardDto })
  @ApiResponse({ status: 404, description: 'Game not found' })
  @ApiBearerAuth('JWT')
  async getGameById(@Req() _req, @Param('gameId') gameId: number): Promise<GameBoardDto> {
    try {
      return await this.gameService.getGameById(gameId);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new NotFoundException(`Failed to retrieve game with ID ${gameId}`);
    }
  }

  @Post(':gameId/move')
  @ApiOperation({ 
    description:"please fill number 0 - 8 for board position\n\n[0 1 2]\n\n[3 4 5]\n\n[6 7 8]\n\nplayer1 is X, player2 is O",
    summary: 'Make a move in the game' 
  })
  @ApiResponse({
    status: 201,
    description: 'Move successfully made',
    type: Move,
  })
  @ApiResponse({ status: 404, description: 'Game not found' })
  @ApiResponse({
    status: 400,
    description: 'Invalid move or not the player’s turn',
  })
  @ApiBearerAuth('JWT')
  async makeMove(
    @Req() _req,
    @Param('gameId') gameId: number,
    @Body() payload: MovePositionDto,
  ): Promise<GameBoardDto> {

    if (payload.position < 0 || payload.position > 8) {
      throw new BadRequestException(
        'Invalid position. Position must be between 0 and 8.',
      );
    }

    return await this.gameService.makeMove(gameId, _req.user, payload.position);
  }

  @Get('history/me')
  @ApiOperation({ description: "player1 is X, player2 is O", summary: 'Get user game details' })
  @ApiResponse({ status: 200, description: 'Game retrieved successfully', type: UserHistory })
  @ApiResponse({ status: 404, description: 'Game not found' })
  @ApiBearerAuth('JWT')
  async getUserGameHistory(@Req() _req): Promise<UserHistory> {
    return await this.gameService.getUserHistory(_req.user);
  }
}
