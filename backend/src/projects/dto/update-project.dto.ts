import { IsDateString, IsIn, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';
import { TODO_PRIORITIES } from '../../todos/schemas/todo.schema';

export class UpdateProjectDto {
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  name?: string;

  @IsOptional()
  @IsIn(TODO_PRIORITIES)
  priority?: string;

  @IsOptional()
  @IsString()
  @MaxLength(4)
  leadInitials?: string;

  @IsOptional()
  @IsString()
  leadColor?: string;

  @IsOptional()
  @IsDateString()
  dueDate?: string;
}
