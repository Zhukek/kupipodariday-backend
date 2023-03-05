import { Inject, Injectable } from '@nestjs/common';
import { compare, genSalt, hash } from 'bcrypt';

@Injectable()
export class HashService {
  @Inject('CONFIG')
  private config;

  async hash(pass: string): Promise<string> {
    const rounds = this.config.saltLength;
    const salt = await genSalt(Number(rounds));
    return await hash(pass, salt);
  }

  async compare(pass: string, hash: string): Promise<boolean> {
    return await compare(pass, hash);
  }
}
