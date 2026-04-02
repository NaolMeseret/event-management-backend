import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { EventsController } from './events.controller';
import { EventsService } from './events.service';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  imports: [
    MulterModule.register({
      dest: './uploads',
    }),
  ],
  controllers: [EventsController],
  providers: [EventsService, PrismaService],
})
export class EventsModule {}
