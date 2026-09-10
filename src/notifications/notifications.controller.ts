import { Controller, Post, Req } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { Request } from 'express';

@Controller('me/notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Post()
  async create(@Req() req: Request & { user: { userId: number } }) {
    return await this.notificationsService.getNotifications(req.user.userId);
  }
}
