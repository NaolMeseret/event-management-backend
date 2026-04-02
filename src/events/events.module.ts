import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { EventsController } from './events.controller';
import { EventsService } from './events.service';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  imports: [
MulterModule.register({
      dest: './uploads/events',
      limits: {
        fileSize: 10 * 1024 * 1024, // 10MB
      },
      fileFilter: (req, file, callback) => {
        if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
          return callback(new Error('Only image files are allowed!'), false);
        }
        callback(null, true);
      },
    }),
  ],
  controllers: [EventsController],
  providers: [EventsService, PrismaService],
})
export class EventsModule {}
