import {
  BadRequestException,
  Body,
  Controller,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UsersService } from 'src/users/users.service';
import {
  emailAlreadyExistsError,
  usernameAlreadyExistsError,
} from 'src/utils/errors';
import { AuthService } from './auth.service';
import { LocalGuard } from './guards/localGuard';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @UseGuards(LocalGuard)
  @Post('signin')
  async signin(@Req() req): Promise<{ access_token: string }> {
    return this.authService.auth(req.user);
  }

  @Post('signup')
  async signup(@Body() createUserDto: CreateUserDto) {
    const userByEmail = await this.usersService.findByEmail(
      createUserDto.email,
    );
    if (userByEmail) {
      throw new BadRequestException(emailAlreadyExistsError);
    }

    const userByUsername = await this.usersService.findByName(
      createUserDto.username,
    );
    if (userByUsername) {
      throw new BadRequestException(usernameAlreadyExistsError);
    }

    const user = await this.usersService.create(createUserDto);
    return this.authService.auth(user);
  }
}
