import { SubscribeMessage, WebSocketGateway, MessageBody, ConnectedSocket, OnGatewayConnection, OnGatewayDisconnect, WebSocketServer } from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { UsersService } from '../users/users.service';
import { MessagesService } from './messages.service';

@WebSocketGateway({ cors: {origin: '*'} }) // change it
export class MessagesGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    private readonly usersService: UsersService,
    private readonly messagesService: MessagesService
  ) {}

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  @WebSocketServer() server: Server;

  @SubscribeMessage('direct-message')
  async handleDM(
    @MessageBody() data: { senderId: number; receiverUsername: string; content: string },
    @ConnectedSocket() client: Socket
  ) {
    const receiver = await this.usersService.findByEmail(data.receiverUsername);
    if (!receiver) {
      client.emit('error', { message: 'User not found'} );
      return;
    }

    const message = await this.messagesService.sendMessage( data.senderId, receiver.id, data.content, );

    client.emit('direct-message',message);
    client.broadcast.emit('direct-message', message);
  }
}
