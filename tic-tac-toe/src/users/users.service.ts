import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import {
  CreateUserDto,
  PaginationUserDto,
  UpdateUserDto,
  UserResponseDto,
} from './dto/users.dto';
import { User } from './entities/users.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { UUID } from 'crypto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    public userRepository: Repository<User>,
    private dataSource: DataSource,
  ) {}

  async verifyPassword(password: string, dbPassword: string): Promise<boolean> {
    const isPasswordMatch = await bcrypt.compare(password, dbPassword);
    if (!isPasswordMatch) {
      throw new UnauthorizedException();
    }
    return isPasswordMatch;
  }

  async checkUserAlreadyExists(createUserDto: CreateUserDto): Promise<boolean> {
    let user: User;
    let userByEmail: User;
    if (createUserDto.username) {
      user = await this.userRepository.findOne({
        where: { username: createUserDto.username },
      });
    }
    if (createUserDto.email) {
      userByEmail = await this.userRepository.findOne({
        where: { email: createUserDto.email },
      });
    }
    if (user || userByEmail) {
      return true;
    }
    return false;
  }

  async hashPassword(password: string): Promise<string> {
    const hashPassword = await bcrypt.hash(password, await bcrypt.genSalt());
    return hashPassword;
  }
  async create(createUserDto: CreateUserDto): Promise<UserResponseDto> {
    if (await this.checkUserAlreadyExists(createUserDto)) {
      throw new HttpException(
        'Username or Email already exists',
        HttpStatus.CONFLICT,
      );
    }
    const user: User = new User({
      username: createUserDto.username,
      email: createUserDto.email,
      password: await this.hashPassword(createUserDto.password),
      role: createUserDto.role,
    });
    this.dataSource.getRepository(User).save(user);
    return new UserResponseDto(user);
  }

  async findAll(query: PaginationUserDto): Promise<UserResponseDto[]> {
    const { page, pageSize } = query;
    const skip = (page - 1) * pageSize;
    const users = await this.userRepository.find({
      take: pageSize,
      skip: skip,
    });
    return users.map((user) => new UserResponseDto(user));
  }

  async getUserByUserName(username: string): Promise<User> | null {
    const user = await this.userRepository.findOneBy({ username });
    if (!user) throw new HttpException('User not Found', HttpStatus.NOT_FOUND);
    return user;
  }

  async getUserById(id: UUID): Promise<User> | null {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) throw new HttpException('User not Found', HttpStatus.NOT_FOUND);
    return user;
  }

  async getUserByEmail(email: string): Promise<User> | null {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) throw new HttpException('User not Found', HttpStatus.NOT_FOUND);
    return user;
  }

  async update(id: UUID, updateUserDto: UpdateUserDto): Promise<User> {
    const user: User = await this.userRepository.findOne({ where: { id } });
    if (!user) throw new HttpException('User not Found', HttpStatus.NOT_FOUND);
    try {
      updateUserDto.password = await this.hashPassword(updateUserDto.password);
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
    const updated = Object.assign(user, updateUserDto);
    return this.userRepository.save(updated);
  }

  async remove(id: UUID): Promise<{ affected?: number }> {
    return this.userRepository.delete(id);
  }
}
