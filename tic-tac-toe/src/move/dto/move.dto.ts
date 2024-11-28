import { Max, Min } from 'class-validator';
import { Game } from 'src/game/entities/game.entity';
import { User } from 'src/users/entities/users.entity';

export class CreateMoveDto {
  @Min(0)
  @Max(8)
  position: number;

  player: User;

  game: Game;
}
