import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { Project, ProjectDocument } from './schemas/project.schema';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectModel(Project.name) private projectModel: Model<ProjectDocument>,
  ) {}

  create(userId: string, dto: CreateProjectDto) {
    return this.projectModel.create({
      name: dto.name.trim(),
      priority: dto.priority ?? 'none',
      leadInitials: dto.leadInitials ?? 'DX',
      leadColor: dto.leadColor ?? '#8b5cf6',
      dueDate: dto.dueDate ? new Date(dto.dueDate) : undefined,
      user: new Types.ObjectId(userId),
    });
  }

  findAll(userId: string) {
    return this.projectModel
      .find({ user: new Types.ObjectId(userId) })
      .sort({ createdAt: -1 });
  }

  async update(userId: string, id: string, dto: UpdateProjectDto) {
    const project = await this.projectModel.findOneAndUpdate(
      { _id: id, user: new Types.ObjectId(userId) },
      {
        ...(dto.name !== undefined && { name: dto.name.trim() }),
        ...(dto.priority !== undefined && { priority: dto.priority }),
        ...(dto.leadInitials !== undefined && { leadInitials: dto.leadInitials }),
        ...(dto.leadColor !== undefined && { leadColor: dto.leadColor }),
        ...(dto.dueDate !== undefined && {
          dueDate: dto.dueDate ? new Date(dto.dueDate) : null,
        }),
      },
      { new: true },
    );

    if (!project) throw new NotFoundException('Project not found');
    return project;
  }

  async remove(userId: string, id: string) {
    const project = await this.projectModel.findOneAndDelete({
      _id: id,
      user: new Types.ObjectId(userId),
    });
    if (!project) throw new NotFoundException('Project not found');
    return { message: 'Project deleted' };
  }
}
