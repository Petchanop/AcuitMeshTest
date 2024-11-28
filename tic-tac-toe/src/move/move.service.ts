import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Move } from './entities/move.entity';
import { Repository } from 'typeorm';
import { CreateMoveDto } from './dto/move.dto';

@Injectable()
export class MoveService {
  constructor(
    @InjectRepository(Move)
    public moveRepository: Repository<Move>,
  ) {}

  async createMove(payload: CreateMoveDto): Promise<Move> {
    const move = await this.moveRepository.create(payload);
    return move;
  }
}
