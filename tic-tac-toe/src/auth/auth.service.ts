import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from 'src/users/dto/users.dto';
import { User } from 'src/users/entities/users.entity';
import { UsersService } from 'src/users/users.service';
import * as slugid from 'slugid';
import { SigninDto } from './dto/auth.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(
        private userService: UsersService, 
        private jwtService: JwtService
    ) {}

    async register(createUserDto: CreateUserDto): Promise<User> {
        const res = this.userService.create(createUserDto);
        return res;
    }

    async signIn(payload: SigninDto) {
        console.log("auth service", payload)
        var user: User;
        if (payload.username) {
            user = await this.userService.getUserByUserName(payload.username);
        } else if (payload.email) {
            user = await this.userService.getUserByEmail(payload.email);
        } else {
            throw new HttpException('Please fill in Username or Email.', HttpStatus.BAD_REQUEST);
        }
        console.log(user)
        await this.userService.verifyPassword(payload.password, user.password);
        const generateAccessToken = {
            id: slugid.encode(user.id),
            username: user.username,
            email: user.email,
            role: user.role,
            timeout: process.env.EXPIRESIN,
        };
        console.log("sigIn success")
        return {
            id: slugid.encode(user.id),
            username: user.username,
            email: user.email,
            role: user.role,
            accessToken: await this.jwtService.signAsync(generateAccessToken, {
                secret: `${process.env.SECRETKEY}`,
                expiresIn: `${process.env.EXPIRESIN}s`,
            }),
            timeout: process.env.EXPIRESIN,
        };
    }
}
