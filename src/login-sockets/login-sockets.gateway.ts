import {
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayDisconnect,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { LoginSocketsService } from './login-sockets.service';
@WebSocketGateway({
  transports: ['websocket'],
  cors: true,
  pingTimeout: 5000,
  pingInterval: 500,
})
export class LoginSocketsGateway implements OnGatewayDisconnect {
  constructor(private readonly loginSocketsService: LoginSocketsService) {}
  handleDisconnect(@ConnectedSocket() client: any) {
    throw new Error('Method not implemented.');
  }
  server: Server;

  @SubscribeMessage('login')
  async login(@ConnectedSocket() client: any, payload) {
    await this.loginSocketsService.login(client, payload);
  }
}
