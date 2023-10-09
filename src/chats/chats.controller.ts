import { Controller, Get, Param } from '@nestjs/common';
import { ChatsService } from './chats.service';
import { Chat } from './chats.schema';

@Controller('chats')
export class ChatsController {
  constructor(private readonly chatService: ChatsService) {}

  @Get(':roomId')
  async findAll(@Param('roomId') roomId: string): Promise<Chat[]> {
    return this.chatService.findAllByRoomId(roomId);
  }
}
