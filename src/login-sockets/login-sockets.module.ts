import { Module } from '@nestjs/common';
import { LoginSocketsGateway } from './login-sockets.gateway';
import { LoginSocketsService } from './login-sockets.service';

@Module({
  providers: [LoginSocketsGateway, LoginSocketsService]
})
export class LoginSocketsModule {}
