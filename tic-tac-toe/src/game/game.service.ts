import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Game, GameStatus, GameWinner } from './entities/game.entity';
import { DataSource, Repository } from 'typeorm';
import { Move } from '../move/entities/move.entity';
import { UUID } from 'crypto';
import { Invitation } from '../invitations/entities/invitaions.entity';
import { User } from '../users/entities/users.entity';
import { GameBoardDto, UserHistory } from './dto/game.dto';

@Injectable()
export class GameService {
  constructor(
    @InjectRepository(Game)
    private gameRepository: Repository<Game>,
    private dataSource: DataSource,
  ) {}

  availablePosition(game: Game, position: number): boolean {
    const positions = game.moves.map((move) => move.position);
    const result = !positions.includes(position);
    return result;
  }

  checkHorizontal(positions: number[]): boolean {
    const horizontal = 3;
    let result = false;
    for (let i = 0; i < 9; i += horizontal) {
      const winningLine = [i, i + 1, i + 2];
      if (winningLine.every((num) => positions.includes(num))) {
        result = true;
        return result;
      }
    }
    return result;
  }

  checkVertical(positions: number[]): boolean {
    const vertical = 3;
    let result = false;
    for (let i = 0; i < 3; i++) {
      const winningLine = [i, i + vertical, i + 2 * vertical];
      if (winningLine.every((num) => positions.includes(num))) {
        result = true;
        return result;
      }
    }
    return result;
  }

  checkDiagonal(positions: number[]): boolean {
    if (positions.length < 3) {
      return false;
    }
    const diagonalLeft = [0, 4, 8];
    const diagonalRight = [2, 4, 6];
    if (diagonalLeft.every((num) => positions.includes(num))) {
      return true;
    }
    if (diagonalRight.every((num) => positions.includes(num))) {
      return true;
    }
    return false;
  }

  checkWinner(game: Game, currentTurn: UUID): boolean {
    const move = game.moves.filter((move) => move.player.id == currentTurn);
    const position = move.map((item) => item.position);
    return this.checkHorizontal(position)
      ? true
      : this.checkVertical(position)
        ? true
        : this.checkDiagonal(position)
          ? true
          : false;
  }

  async createGameBoard(game: Game, moves: Move[]): Promise<string[]> {
    const rows = 3;
    const cols = 3;
    const board = Array.from({ length: rows }, (_, row) =>
      Array.from({ length: cols }, (_, col) => (row * cols + col).toString()),
    );

    // Fill the board based on moves
    if (typeof moves !== 'undefined') {
      moves.forEach((move) => {
        const col = move.position % 3;
        const row = Math.floor(move.position / 3);
        board[row][col] = move.player.id === game.player1.id ? 'X' : 'O';
      });
    }

    return board.map((row) => {
      return row.join('');
    });
  }

  async createGameDto(game: Game): Promise<GameBoardDto> {
    const result = new GameBoardDto({
      gameId: game.game_id,
      invitationId: game.invitation?.invitation_id,
      winner: game.winner,
      player1: game.player1.username,
      player1Move: game.moves
        .filter((move) => move.player.id == game.player1.id)
        .map((move) => move.position),
      player2: game.player2.username,
      player2Move: game.moves
        .filter((move) => move.player.id == game.player2.id)
        .map((move) => move.position),
      status: game.status,
      currentTurn:
        game.player1.id === game.currentTurn
          ? game.player1.username
          : game.player2.username,
      board: await this.createGameBoard(game, game.moves),
    });
    return result;
  }

  async createGame(invitationId: UUID): Promise<GameBoardDto> {
    const invitation = await this.dataSource.getRepository(Invitation).findOne({
      where: { invitation_id: invitationId },
      relations: ['sender', 'receiver'],
    });

    if (!invitation) {
      throw new NotFoundException(
        `Invitation with ID ${invitationId} not found`,
      );
    }

    if (invitation.status !== 'Accepted') {
      throw new BadRequestException(
        `Invitation must be accepted to create a game`,
      );
    }

    // Create the game using sender and receiver
    const game = new Game();
    game.invitation = invitation;
    game.player1 = invitation.receiver;
    game.player2 = invitation.sender;
    game.currentTurn = invitation.receiver.id; // Assume the sender starts the game
    game.status = GameStatus.InProgress;
    game.moves = [];

    const gameDto = await this.gameRepository.save(game);
    return await this.createGameDto(gameDto);
  }

  async makeMove(
    gameId: number,
    player: User,
    position: number,
  ): Promise<GameBoardDto> {
    const game = await this.gameRepository.findOne({
      where: { game_id: gameId },
      relations: ['player1', 'player2', 'moves'],
    });
    if (game.status !== GameStatus.InProgress) {
      throw new HttpException('Game is not in progress', HttpStatus.CONFLICT);
    }
    if (game.currentTurn !== player.id) {
      throw new HttpException('It is not your turn', HttpStatus.BAD_REQUEST);
    }

    const move = new Move();
    move.game = game;
    move.player = player;
    if (this.availablePosition(game, position)) {
      move.position = position;
      await this.dataSource.getRepository(Move).create(move);
    } else {
      throw new HttpException(
        'Cannot move to this position.',
        HttpStatus.BAD_REQUEST,
      );
    }
    game.moves = [...game.moves, move];

    if (this.checkWinner(game, game.currentTurn)) {
      game.winner =
        game.currentTurn === game.player1.id
          ? GameWinner.Player1
          : GameWinner.Player2;
      game.status = GameStatus.Completed;
    } else {
      // Switch turn to the other player
      game.currentTurn =
        game.currentTurn === game.player1.id
          ? game.player2.id
          : game.player1.id;
      // Update game status or other logic here (e.g., checking for a win)
      if (game.moves.length == 9) {
        game.winner = GameWinner.Draw;
        game.status = GameStatus.Completed;
      }
    }
    await this.dataSource.manager.save(game);

    const result = new GameBoardDto({
      gameId: game.game_id,
      winner: game.winner,
      player1: game.player1.id,
      player1Move: game.moves
        .filter((move) => move.player == game.player1)
        .map((move) => move.position),
      player2: game.player2.id,
      player2Move: game.moves
        .filter((move) => move.player == game.player1)
        .map((move) => move.position),
      board: await this.createGameBoard(game, game.moves),
    });

    return result;
  }

  async getGameById(gameId: number): Promise<GameBoardDto> {
    // Fetch the game with its players and moves relations
    const game = await this.gameRepository.findOne({
      where: { game_id: gameId },
      relations: ['player1', 'player2', 'moves'],
    });

    // Throw an exception if the game is not found
    if (!game) {
      throw new NotFoundException(`Game with ID ${gameId} not found`);
    }

    return await this.createGameDto(game);
  }

  async getGameByUserId(userId: UUID): Promise<GameBoardDto[]> {
    console.log('get game by user id', userId);
    const result = await this.dataSource.getRepository(Game).find({
      where: [{ player1: { id: userId } }, { player2: { id: userId } }],
      relations: ['player1', 'player2', 'moves'],
    });
    return await Promise.all(
      result.map(async (game) => await this.createGameDto(game)),
    );
  }

  async getGameBoard(
    gameId: number,
  ): Promise<{ currentturn: string; boardGame: string[] }> {
    // Fetch the game
    const game = await this.dataSource.getRepository(Game).findOne({
      where: { game_id: gameId },
      relations: ['player1', 'player2'],
    });

    if (!game) {
      throw new NotFoundException(`Game with ID ${gameId} not found`);
    }

    // Fetch all moves for the game
    const moves = await this.dataSource.getRepository(Move).find({
      where: { game: { game_id: gameId } },
      relations: ['player'],
    });

    // Initialize the board with empty strings
    return {
      currentturn:
        game.player1.id === game.currentTurn
          ? game.player1.username
          : game.player2.username,
      boardGame: await this.createGameBoard(game, moves),
    };
  }

  async getUserHistory(user: User): Promise<UserHistory> {
    const result = await this.dataSource.getRepository(Game).find({
      where: [
        { player1: { id: user.id } },
        { player2: { id: user.id } },
        { status: GameStatus.Completed },
      ],
      relations: ['player1', 'player2', 'moves'],
    });
    const win = result.filter((game) => game.winner == user.username);
    const draw = result.filter((game) => game.winner == GameWinner.Draw);
    const userHistory = new UserHistory({
      gamePlayed: result.length,
      win: win.length,
      draw: draw.length,
      loss: result.length - (win.length + draw.length),
    });
    return userHistory;
  }
}
