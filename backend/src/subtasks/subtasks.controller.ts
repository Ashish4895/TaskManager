import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import type { AuthenticatedRequest } from '../auth/types/authenticated-request';
import { CreateSubtaskDto } from './dto/create-subtask.dto';
import { UpdateSubtaskDto } from './dto/update-subtask.dto';
import { SubtasksService } from './subtasks.service';

@Controller('todo/:todoId/subtask')
@UseGuards(JwtAuthGuard)
export class SubtasksController {
  constructor(private subtasksService: SubtasksService) {}

  @Get()
  findAll(@Req() req: AuthenticatedRequest, @Param('todoId') todoId: string) {
    return this.subtasksService.findAll(req.user.userId, todoId);
  }

  @Post()
  create(
    @Req() req: AuthenticatedRequest,
    @Param('todoId') todoId: string,
    @Body() dto: CreateSubtaskDto,
  ) {
    return this.subtasksService.create(req.user.userId, todoId, dto);
  }

  @Put(':id')
  update(
    @Req() req: AuthenticatedRequest,
    @Param('todoId') todoId: string,
    @Param('id') id: string,
    @Body() dto: UpdateSubtaskDto,
  ) {
    return this.subtasksService.update(req.user.userId, todoId, id, dto);
  }

  @Delete(':id')
  remove(
    @Req() req: AuthenticatedRequest,
    @Param('todoId') todoId: string,
    @Param('id') id: string,
  ) {
    return this.subtasksService.remove(req.user.userId, todoId, id);
  }
}
