import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from 'src/users/dto/users.dto';
import { SigninDto } from './dto/auth.dto';
import { Public } from './decorator/auth.decorator';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Public()
    @Post('/register')
    @ApiOperation({ 
        description: "required username email and password.", 
        summary: 'use for register new user.'
    })
    @ApiCreatedResponse({
        description: 'register user',
    })
    async register(@Body() createUser: CreateUserDto) {
        const res = await this.authService.register(createUser);
        return res;
    }

    @Public()
    @Post('/signin')
    @ApiOperation({ 
        description: "use only username or email with password.", 
        summary: 'use for sign in.' 
    })
    @ApiCreatedResponse({
        description: 'user sign in',
    })
    async signIn(@Body() payload: SigninDto){
        console.log("signin",payload);
        const res = await this.authService.signIn(payload);
        return res;
    }
}
