import { Module } from '@nestjs/common';
import { CodeCounterService } from './code-counter.service';
import { CodeCounterController } from './code-counter.controller';

@Module({
  controllers: [CodeCounterController],
  providers: [CodeCounterService],
})
export class CodeCounterModule {}
