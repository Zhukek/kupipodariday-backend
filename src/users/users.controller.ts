import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
  Req,
  NotFoundException,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { JwtGuard } from 'src/auth/guards/jwtGuard';
import { UserPasswordInterceptor } from 'src/interceptors/userPassword';
import { UserEmailInterceptor } from 'src/interceptors/userEmail';
import { Wish } from 'src/wishes/entities/wish.entity';
import { WishInterceptor } from 'src/interceptors/wish';

@Controller('users')
@UseGuards(JwtGuard)
@UseInterceptors(UserPasswordInterceptor)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  async getMe(@Req() req: { user: User }): Promise<User> {
    const me = await this.usersService.findById(req.user.id);

    if (!me) {
      throw new NotFoundException();
    }

    return me;
  }

  @Get(':name')
  @UseInterceptors(UserEmailInterceptor)
  async findbyName(@Param('name') name: string): Promise<User> {
    const user = await this.usersService.findByName(name);

    if (!user) {
      throw new NotFoundException();
    }

    return user;
  }

  @Patch('me')
  async updateMe(
    @Body() dto: UpdateUserDto,
    @Req() req: { user: User },
  ): Promise<User> {
    const me = await this.usersService.findById(req.user.id);

    if (!me) {
      throw new NotFoundException();
    }

    return this.usersService.updateById(me.id, dto);
  }

  @Post('find')
  async findMany(@Body() body: { query: string }): Promise<User[]> {
    return this.usersService.findMany(body.query);
  }

  @Get('me/wishes')
  @UseInterceptors(WishInterceptor)
  async getMyWishes(@Req() req: { user: User }): Promise<Wish[]> {
    return this.usersService.getWishesByUserName(req.user.username);
  }

  @Get(':username/wishes')
  @UseInterceptors(WishInterceptor)
  async getUserWishes(@Param('username') username: string): Promise<Wish[]> {
    const user = await this.usersService.findByName(username);

    if (!user) {
      throw new NotFoundException();
    }

    return this.usersService.getWishesByUserName(username);
  }
}
