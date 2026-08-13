import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Todo, TodoSchema } from '../todos/schemas/todo.schema';
import { User, UserSchema } from '../users/schemas/user.schema';
import { Subtask, SubtaskSchema } from './schemas/subtask.schema';
import { SubtasksController } from './subtasks.controller';
import { SubtasksService } from './subtasks.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Subtask.name, schema: SubtaskSchema },
      { name: Todo.name, schema: TodoSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  controllers: [SubtasksController],
  providers: [SubtasksService],
})
export class SubtasksModule {}
