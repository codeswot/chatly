// import { Observable } from 'rxjs';
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
// import { Observable } from 'rxjs';

import { Server, Socket } from 'socket.io';
import { ChatDto, DeleteChatDto, UpdateChatDto } from 'src/chats/chats.dto';
import { ChatsService } from 'src/chats/chats.service';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class EventsGateway {
  @WebSocketServer()
  server: Server;

  constructor(private readonly chatService: ChatsService) {}

  // Store room information
  private rooms = new Map<string, Set<Socket>>();

  // Helper function to join a room
  private joinRoom(socket: Socket, roomName: string) {
    if (!this.rooms.has(roomName)) {
      this.rooms.set(roomName, new Set<Socket>());
    }
    this.rooms.get(roomName).add(socket);
    socket.join(roomName);
  }

  // Helper function to leave a room
  private leaveRoom(socket: Socket, roomName: string) {
    if (this.rooms.has(roomName)) {
      this.rooms.get(roomName).delete(socket);
      if (this.rooms.get(roomName).size === 0) {
        this.rooms.delete(roomName);
      }
    }
    socket.leave(roomName);
  }

  @SubscribeMessage('msg')
  async message(
    @MessageBody() data: ChatDto,
    @ConnectedSocket() socket: Socket,
  ): Promise<any> {
    if (this.rooms.get(data.roomId)?.has(socket)) {
      // The socket is a member of the room, allow broadcasting
      this.server.to(data.roomId).emit('msg', { msg: data });
      //save to DB
      await this.chatService.create(data);
      return {
        event: 'msg',
        data: { msg: data },
      };
    } else {
      // Handle unauthorized access to the room
      // For example, you can emit an error event to the client
      socket.emit('error', 'Unauthorized access to the room');
    }
  }

  @SubscribeMessage('msg_upate')
  async messageUpdate(
    @MessageBody() data: UpdateChatDto,
    @ConnectedSocket() socket: Socket,
  ): Promise<any> {
    if (this.rooms.get(data.roomId)?.has(socket)) {
      // The socket is a member of the room, allow broadcasting
      this.server.to(data.roomId).emit('msg_upate', { msg: data });
      //save to DB
      await this.chatService.update(data.chatId, data);
      return {
        event: 'msg',
        data: { msg: data },
      };
    } else {
      // Handle unauthorized access to the room
      // For example, you can emit an error event to the client
      socket.emit('error', 'Unauthorized access to the room');
    }
  }

  @SubscribeMessage('msg_delete')
  async messageDelete(
    @MessageBody() data: DeleteChatDto,
    @ConnectedSocket() socket: Socket,
  ): Promise<any> {
    if (this.rooms.get(data.roomId)?.has(socket)) {
      // The socket is a member of the room, allow broadcasting
      this.server.to(data.roomId).emit('msg_delete', { msg: data });
      //save to DB
      await this.chatService.remove(data.chatId);
      return {
        event: 'msg',
        data: { msg: data },
      };
    } else {
      // Handle unauthorized access to the room
      // For example, you can emit an error event to the client
      socket.emit('error', 'Unauthorized access to the room');
    }
  }

  @SubscribeMessage('typing')
  typing(@MessageBody() data: any, @ConnectedSocket() socket: Socket): any {
    const d = JSON.parse(data);

    const roomId = d.roomId;
    const userTypingId = d.userTypingId;

    if (this.rooms.get(roomId)?.has(socket)) {
      this.server.to(roomId).emit('typing', userTypingId);

      return {
        event: 'typing',
        data: userTypingId,
      };
    } else {
      // Handle unauthorized access to the room
      // For example, you can emit an error event to the client
      socket.emit('error', 'Unauthorized access to the room');
    }
  }

  // Handle custom event for joining a room
  @SubscribeMessage('join_room')
  handleJoinRoom(
    @MessageBody() roomId: any,
    @ConnectedSocket() socket: Socket,
  ): void {
    this.joinRoom(socket, roomId);
  }

  // Handle client leaving a room (if needed)
  @SubscribeMessage('leave_room')
  handleLeaveRoom(
    @MessageBody() roomId: any,
    @ConnectedSocket() socket: Socket,
  ): void {
    this.leaveRoom(socket, roomId);
  }
}
