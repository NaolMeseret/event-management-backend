import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateEventDto } from './dto/create-event.dto';

@Injectable()
export class EventsService {
  constructor(private prisma: PrismaService) {}

  async findAll(query: any) {
    const { page = 1, limit = 10, categoryId, creatorId, durationMin, durationMax, amenities, search } = query;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (categoryId) where.categoryId = categoryId;
    if (creatorId) where.creatorId = creatorId;
    if (durationMin || durationMax) {
      where.duration = {};
      if (durationMin) where.duration.gte = parseInt(durationMin);
      if (durationMax) where.duration.lte = parseInt(durationMax);
    }
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }
    if (amenities) {
      where.amenities = { some: { name: { in: amenities.split(',') } } };
    }

    const [events, total] = await Promise.all([
      this.prisma.event.findMany({
        where,
skip: Number(skip),
take: Number(limit),
        include: {
          category: true,
          creator: { select: { id: true, name: true, email: true } },
          featuredImage: true,
          _count: { select: { likes: true, comments: true } },
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.event.count({ where }),
    ]);

    return {
      events,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit)),
      },
    };
  }

  async findOne(id: string) {
    return this.prisma.event.findUnique({
      where: { id },
      include: {
        category: true,
        creator: true,
        images: true,
        steps: true,
        amenities: true,
        likes: { include: { user: true } },
        comments: { include: { user: true } },
        ratings: true,
      },
    });
  }

async create(dto: CreateEventDto, userId: string) {
    return this.prisma.$transaction(async (tx) => {
      const slug = dto.slug || dto.title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '').replace(/\-+/g, '-');
      const event = await tx.event.create({
        data: {
          title: dto.title,
          slug,
          description: dto.description,
          duration: dto.duration,
          creator: {
            connect: { id: userId }
          },
          category: {
            connect: { id: dto.categoryId }
          },
          steps: dto.steps ? {
            create: dto.steps.map((step, index) => ({
              title: step.title,
              description: step.description,
              order: index + 1
            }))
          } : undefined,
          amenities: dto.amenities ? {
            create: dto.amenities.map((amenity: any) => ({
              name: amenity.name,
              icon: amenity.icon
            }))
          } : undefined,
        },
        include: {
          category: true,
          creator: { select: { id: true, name: true, email: true } },
          steps: true,
          amenities: true,
        }
      });
      return event;
    });
  }

  async update(id: string, dto: any) {
    return this.prisma.event.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: string) {
    return this.prisma.event.delete({
      where: { id },
    });
  }

  async uploadImages(eventId: string, files: Express.Multer.File[]) {
    const paths = files.map(file => file.path);
    await this.prisma.eventImage.createMany({
      data: paths.map((path, index) => ({
        eventId,
        path,
        order: index,
      })),
    });
    return { message: 'Images uploaded', paths };
  }

  // Like, bookmark, comment, rate methods similar
}
