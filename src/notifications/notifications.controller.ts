import { Controller, Get, Req } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { Request } from 'express';
import { ApiResponse } from '@nestjs/swagger';
import { NotificationDto } from './dto/notification.dto';

@Controller('me/notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  @ApiResponse({ status: 200, type: [NotificationDto] })
  async create(@Req() req: Request & { user: { userId: number } }) {
    return await this.notificationsService.getNotifications(req.user.userId);
  }
}
