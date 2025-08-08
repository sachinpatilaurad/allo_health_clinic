// backend/src/queue/queue.controller.ts

import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { QueueService } from './queue.service';
import { CreateQueuePatientDto } from './dto/create-queue-patient.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UpdateQueueStatusDto } from './dto/update-queue-status.dto';

@UseGuards(JwtAuthGuard) // Protect all queue-related actions
@Controller('queue')
export class QueueController {
  constructor(private readonly queueService: QueueService) {}

  @Post()
  create(@Body() createQueuePatientDto: CreateQueuePatientDto) {
    return this.queueService.create(createQueuePatientDto);
  }

  @Get()
  findAll() {
    return this.queueService.findAll();
  }

  @Patch(':id/status')
  updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateQueueStatusDto: UpdateQueueStatusDto,
  ) {
    return this.queueService.updateStatus(id, updateQueueStatusDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.queueService.remove(id);
  }
}