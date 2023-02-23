import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, NotFoundException } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { JwtGuard } from 'src/auth/guards/jwtGuard';

@Controller('users')
@UseGuards(JwtGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @Get('me')
  async getMe(@Req() req: {user: User}): Promise<User> {
    const me = await this.usersService.findById(req.user.id)

    if (!me) {
      throw new NotFoundException();
    }

    return me;
  }

  @Get(':name')
  async findbyName(@Param('name') name: string): Promise<User> {
    const user = await this.usersService.findByName(name)

    if (!user) {
      throw new NotFoundException();
    }

    return user
  }

  @Patch('me')
  async updateMe(
    @Body() dto: UpdateUserDto, 
    @Req() req: {user: User}
    ): Promise<User> {
      const me = await this.usersService.findById(req.user.id)

      if (!me) {
        throw new NotFoundException();
      }

      return this.usersService.updateById(me.id, dto)
  }

  @Post('find')
  async findMany(@Body() body: {query: string}): Promise<User[]> {
    return this.usersService.findMany(body.query)
  }

  /* @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  } */
}
