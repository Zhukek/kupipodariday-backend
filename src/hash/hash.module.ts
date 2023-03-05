import { Module } from '@nestjs/common';
import { configProvider } from 'src/config/config.provider';
import { HashService } from './hash.service';

@Module({
  providers: [HashService, configProvider],
  exports: [HashService],
})
export class HashModule {}
