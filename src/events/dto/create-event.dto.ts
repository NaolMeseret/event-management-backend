import { IsString, IsNumber, IsOptional, IsUUID, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class StepDto {
  title: string;
  description?: string;
  order: number;
}

class AmenityDto {
  name: string;
  icon?: string;
}

export class CreateEventDto {
  @IsString()
  title: string;

  @IsString()
  slug: string;

  @IsString()
  description: string;

  @IsNumber()
  duration: number;

  @IsUUID()
  categoryId: string;
}
