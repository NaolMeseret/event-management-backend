import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import { EventsController } from './events.controller';
import { EventsService } from './events.service';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  imports: [
    MulterModule.registerAsync({
      useFactory: () => ({
        storage: diskStorage({
          destination: './uploads/events',
          filename: (req, file, cb) => {
            const ext = file.mimetype.split('/')[1];
            cb(null, `${uuidv4()}.${ext}`);
          },
        }),
        limits: {
          fileSize: 10 * 1024 * 1024, // 10MB
        },
        fileFilter: (req, file, callback) => {
          if (!file.mimetype.match(/^(image\/(jpg|jpeg|png|gif))$/)) {
            return callback(new Error('Only image files are allowed!'), false);
          }
          callback(null, true);
        },
      }),
    }),
  ],
  controllers: [EventsController],
  providers: [EventsService],
})
export class EventsModule {}
