import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class OwnerGuard implements CanActivate {
  constructor(
    private prisma: PrismaService,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const eventId = request.params.id || request.body.eventId || request.params.eventId;

    if (!eventId || !user) return false;

    const event = await this.prisma.event.findUnique({
      where: { id: eventId },
    });

    if (!event || event.creatorId !== user.id) {
      throw new ForbiddenException('You can only edit your own events');
    }

    request.event = event;
    return true;
  }
}
