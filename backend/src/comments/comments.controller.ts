import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import type { AuthenticatedRequest } from '../auth/types/authenticated-request';
import { CreateCommentDto } from './dto/create-comment.dto';
import { CommentsService } from './comments.service';

@Controller('todo/:todoId/comment')
@UseGuards(JwtAuthGuard)
export class CommentsController {
  constructor(private commentsService: CommentsService) {}

  @Get()
  findAll(@Req() req: AuthenticatedRequest, @Param('todoId') todoId: string) {
    return this.commentsService.findAll(req.user.userId, todoId);
  }

  @Post()
  create(
    @Req() req: AuthenticatedRequest,
    @Param('todoId') todoId: string,
    @Body() dto: CreateCommentDto,
  ) {
    return this.commentsService.create(req.user.userId, todoId, dto);
  }

  @Delete(':id')
  remove(
    @Req() req: AuthenticatedRequest,
    @Param('todoId') todoId: string,
    @Param('id') id: string,
  ) {
    return this.commentsService.remove(req.user.userId, todoId, id);
  }
}
