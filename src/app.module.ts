import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CodeCounterModule } from './code-counter/code-counter.module';

@Module({
  imports: [CodeCounterModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
