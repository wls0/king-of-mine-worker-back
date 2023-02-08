import {
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayDisconnect,
  ConnectedSocket,
  MessageBody,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { LoginSocketsService } from './login-sockets.service';
@WebSocketGateway(4000, {
  transports: ['websocket'],
  cors: true,
  pingTimeout: 5000,
  pingInterval: 500,
})
export class LoginSocketsGateway implements OnGatewayDisconnect {
  constructor(private readonly loginSocketsService: LoginSocketsService) {}
  @WebSocketServer()
  server: Server;

  async handleDisconnect(@ConnectedSocket() client: any) {
    await this.loginSocketsService.disconnect(client.id);
  }

  @SubscribeMessage('login')
  async login(@ConnectedSocket() client: any, @MessageBody() payload) {
    const result = await this.loginSocketsService.login(client.id, payload);
    const { event, data, message, socket } = result;
    if (event === 'error') {
      this.server.to([socket, client.id]).emit(event, { data, message });
    } else {
      this.server.to(socket).emit(event, { data, message });
    }
    return;
  }
}
