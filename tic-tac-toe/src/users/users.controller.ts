import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseInterceptors,
  UsePipes,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { UsersService } from './users.service';
import { User, UserRole } from './entities/users.entity';
import {
  CreateUserDto,
  PaginationUserDto,
  UpdateUserDto,
} from './dto/users.dto';
import { Roles } from './decorator/roles.decorator';
import { SlugIdInterceptor } from 'src/interceptors/slugid.interceptor';
import { SlugIdPipe } from './pipe/id.pipe';
import { UUID } from 'crypto';

@ApiTags('users')
@Controller('users')
@UseInterceptors(SlugIdInterceptor)
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Post()
  @Roles(UserRole.ADMIN)
  @ApiOperation({
    description: 'create user by username, email and password.',
    summary: 'create user.',
  })
  @ApiCreatedResponse({
    description: 'create user',
    type: User,
  })
  @ApiBearerAuth('JWT')
  create(@Body() createUserDto: CreateUserDto): Promise<User> {
    const res = this.userService.create(createUserDto);
    return res;
  }

  @Get('/me')
  @Roles(UserRole.USER, UserRole.ADMIN)
  @ApiOperation({
    description: 'Retrieving user data by user accesstoken',
    summary: 'get user personal data.',
  })
  @ApiCreatedResponse({
    description: 'Get current user account information',
  })
  @ApiBearerAuth('JWT')
  async getMe(@Req() req) {
    const user = req.user;
    const me = this.userService.getUserById(user.id);
    return me;
  }

  @Patch('/me')
  @Roles(UserRole.USER, UserRole.ADMIN)
  @ApiOperation({
    description: 'Update user data by user accesstoken',
    summary: 'update user personal data.',
  })
  @ApiCreatedResponse({
    description: 'update user',
    type: UpdateUserDto,
  })
  @ApiBearerAuth('JWT')
  async userUpdate(@Req() req, @Body() updateUserDto: UpdateUserDto) {
    const user = req.user;
    console.log(user);
    const res = await this.userService.update(user.id, updateUserDto);
    return res;
  }

  @Get()
  @ApiOperation({
    description: 'for admin use for retriving users data.',
    summary: 'get all users.',
  })
  @ApiCreatedResponse({
    description: 'reponse all users to admin',
    type: User,
  })
  @ApiBearerAuth('JWT')
  async findAll(@Query() query: PaginationUserDto): Promise<User[]> {
    const users = this.userService.findAll(query);
    return users;
  }

  @Get(':id')
  @Roles(UserRole.ADMIN)
  @UsePipes(new SlugIdPipe())
  @ApiOperation({
    description: 'for admin use for retriving user data by id.',
    summary: 'get user by id.',
  })
  @ApiCreatedResponse({
    description: 'reponse user by user id',
    type: User,
  })
  @ApiBearerAuth('JWT')
  async getUserById(@Param('id') id: UUID): Promise<User> {
    const user = await this.userService.getUserById(id);
    return user;
  }

  @Get('/username/:username')
  @Roles(UserRole.ADMIN)
  @ApiOperation({
    description: 'for admin use for retriving user data by username.',
    summary: 'get user by username.',
  })
  @ApiCreatedResponse({
    description: 'reponse user by user name',
    type: User,
  })
  @ApiBearerAuth('JWT')
  async getUserByUserName(
    @Param('username') username: string,
  ): Promise<User> | null {
    const user = await this.userService.getUserByUserName(username);
    return user;
  }

  @Get('/email/:email')
  @Roles(UserRole.ADMIN)
  @ApiOperation({
    description: 'for admin use for retriving user data by email.',
    summary: 'get user by email.',
  })
  @ApiCreatedResponse({
    description: 'reponse get user by email',
    type: User,
  })
  @ApiBearerAuth('JWT')
  async getUserByEmail(@Param('email') email: string): Promise<User> | null {
    const user = await this.userService.getUserByEmail(email);
    return user;
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN)
  @UsePipes(SlugIdPipe)
  @ApiOperation({
    description: 'for Admin update user by id.',
    summary: 'update user data by id.',
  })
  @ApiCreatedResponse({
    description: 'update user by user id',
    type: UpdateUserDto,
  })
  @ApiBearerAuth('JWT')
  async update(@Param('id') id: UUID, @Body() updateUserDto: UpdateUserDto) {
    console.log('admin update', id, updateUserDto);
    const user = await this.userService.update(id, updateUserDto);
    return user;
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @UsePipes(SlugIdPipe)
  @ApiOperation({
    description: 'for Admin delete user by id.',
    summary: 'delete user by id.',
  })
  @ApiCreatedResponse({
    description: 'delete user by user id',
    type: UpdateUserDto,
  })
  @ApiBearerAuth('JWT')
  remove(@Param('id') id: UUID) {
    return this.userService.remove(id);
  }
}
