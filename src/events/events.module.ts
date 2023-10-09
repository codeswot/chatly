import { Module } from '@nestjs/common';
import { EventsGateway } from './events.gateway';
import { ChatsModule } from 'src/chats/chats.module';

@Module({
  imports: [ChatsModule],
  providers: [EventsGateway],
  exports: [EventsGateway],
})
export class EventsModule {}
