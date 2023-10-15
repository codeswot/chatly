import { Controller, Get, Param } from '@nestjs/common';
import { ChatsService } from './chats.service';
import { Chat } from './chats.schema';

@Controller('chats')
export class ChatsController {
  constructor(private readonly chatService: ChatsService) {}

  @Get()
  async test(): Promise<string> {
    return 'TEST';
  }
  @Get(':currentUserId')
  async findAll(
    @Param('currentUserId') currentUserId: string,
  ): Promise<Chat[]> {
    const chats = await this.chatService.findAllByUserId(currentUserId);
    return chats;
  }
}
