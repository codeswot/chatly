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

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class EventsGateway {
  @WebSocketServer()
  server: Server;

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
  message(@MessageBody() data: any, @ConnectedSocket() socket: Socket): any {
    const d = JSON.parse(data);
    const roomName = d.room;
    const body = d.body;

    if (this.rooms.get(roomName)?.has(socket)) {
      // The socket is a member of the room, allow broadcasting
      this.server.to(roomName).emit('msg', { msg: JSON.stringify(body) });
      //save to DB

      return {
        event: 'msg',
        data: { msg: JSON.stringify(body) },
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

    const roomName = d.room;
    const userTypingId = d.userTypingId;

    if (this.rooms.get(roomName)?.has(socket)) {
      this.server.to(roomName).emit('typing', userTypingId);

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
    @MessageBody() data: any,
    @ConnectedSocket() socket: Socket,
  ): void {
    const roomName = data.room;
    this.joinRoom(socket, roomName);
  }

  // Handle client leaving a room (if needed)
  @SubscribeMessage('leave_room')
  handleLeaveRoom(
    @MessageBody() data: any,
    @ConnectedSocket() socket: Socket,
  ): void {
    const roomName = data.room;
    this.leaveRoom(socket, roomName);
  }
}
