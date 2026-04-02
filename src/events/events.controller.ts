import { Controller, Get, Post, Put, Delete, Param, Body, Query, UseGuards, UseInterceptors, UploadedFiles, ParseUUIDPipe } from '@nestjs/common';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { OwnerGuard } from '../common/guards/owner.guard';
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { Public } from '../common/decorators/public.decorator'; // optional

@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Get()
  findAll(@Query() query: any) {
    return this.eventsService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.eventsService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
create(@CurrentUser() user, @Body() createEventDto: CreateEventDto) {
    return this.eventsService.create(createEventDto, user.id);
  }

  @UseGuards(JwtAuthGuard, OwnerGuard)
  @Put(':id')
  update(@Param('id') id: string, @Body() updateEventDto: any) {
    return this.eventsService.update(id, updateEventDto);
  }

  @UseGuards(JwtAuthGuard, OwnerGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.eventsService.remove(id);
  }

  @Post(':id/images')
  @UseGuards(JwtAuthGuard, OwnerGuard)
  @UseInterceptors(FilesInterceptor('images', 10))
  uploadImages(@Param('id') id: string, @UploadedFiles() files: Express.Multer.File[]) {
    return this.eventsService.uploadImages(id, files);
  }
}
