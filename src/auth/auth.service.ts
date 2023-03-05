import { Injectable, UnauthorizedException } from '@nestjs/common';
import { User } from 'src/users/entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { HashService } from 'src/hash/hash.service';
import { usernameOrPassError } from 'src/utils/errors';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
    private hashService: HashService,
  ) {}

  auth(user: User) {
    const payload = { sub: user.id };

    return { access_token: this.jwtService.sign(payload) };
  }

  async validatePassword(username: string, pass: string) {
    const user = await this.usersService.findByName(username);

    if (!user) {
      throw new UnauthorizedException(usernameOrPassError);
    }

    const isCorrect = this.hashService.compare(pass, user.password);

    if (!isCorrect) {
      throw new UnauthorizedException(usernameOrPassError);
    }

    return user;
  }
}
