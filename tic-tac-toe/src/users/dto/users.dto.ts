import { ApiProperty } from '@nestjs/swagger';
import {
  IsAlphanumeric,
  IsEmail,
  IsNotEmpty,
  Matches,
  MinLength,
} from 'class-validator';
import { UserRole } from '../entities/users.entity';
import { Timestamp } from 'typeorm';

export const passwordRegEx =
  /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/;

export class CreateUserDto {
  @IsNotEmpty()
  @MinLength(3, { message: 'Username must have atleast 3 characters.' })
  @IsAlphanumeric(undefined, {
    message: 'Username does not allow other than alpha numeric chars.',
  })
  @ApiProperty()
  username: string;

  @IsNotEmpty()
  @IsEmail(undefined, { message: 'Please provide valid Email.' })
  @ApiProperty()
  email: string;

  @IsNotEmpty()
  @Matches(passwordRegEx, {
    message: `Password must contain Minimum 8 and maximum 20 characters, 
        at least one uppercase letter, 
        one lowercase letter, 
        one number and 
        one special character`,
  })
  @ApiProperty()
  password: string;

  @ApiProperty()
  role: UserRole;
}

export class PaginationUserDto {
  @ApiProperty()
  page: number;

  @ApiProperty()
  pageSize: number;
}

export class UpdateUserDto {
  @IsEmail(undefined, { message: 'Please provide valid Email.' })
  @ApiProperty()
  email: string;

  @Matches(passwordRegEx, {
    message: `Password must contain Minimum 8 and maximum 20 characters, 
        at least one uppercase letter, 
        one lowercase letter, 
        one number and 
        one special character`,
  })
  @ApiProperty()
  password: string;
}

export class UserResponseDto {
  id: string;
  username: string;
  email: string;
  role: string;
  created_at: Timestamp;
  updated_at: Timestamp;

  constructor(partial: Partial<UserResponseDto>) {
    Object.assign(this, partial);
  }
}
