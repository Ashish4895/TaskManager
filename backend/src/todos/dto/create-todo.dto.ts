import { IsDateString, IsIn, IsMongoId, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';
import { TODO_PRIORITIES, TODO_STATUSES } from '../schemas/todo.schema';

export class CreateTodoDto {
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  title: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;

  @IsOptional()
  @IsIn(TODO_STATUSES)
  status?: string;

  @IsOptional()
  @IsIn(TODO_PRIORITIES)
  priority?: string;

  @IsOptional()
  @IsDateString()
  dueDate?: string;

  @IsOptional()
  @IsMongoId()
  projectId?: string;
}
