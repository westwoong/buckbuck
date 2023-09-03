import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ORMModule } from './config/ORM.module';

@Module({
  imports: [ORMModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
