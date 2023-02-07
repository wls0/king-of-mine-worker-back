import {
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { JwtService } from '@nestjs/jwt';
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private jwtService: JwtService) {
    super();
  }
  validateToken(token: string) {
    try {
      //관리자, 유저 분기 처리예정
      const verify = this.jwtService.verify(token, { secret: process.env.JWT });
      return verify;
    } catch (e) {
      switch (e.message) {
        case 'jwt expired':
        case 'invalid token':
        case 'jwt malformed':
        case 'jwt signature is required':
        case 'invalid signature':
          throw new UnauthorizedException();
      }
    }
  }

  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const { authorization } = request.headers;
    if (authorization === undefined) {
      throw new ForbiddenException();
    }
    const token = authorization.replace('Bearer ', '');
    request.user = this.validateToken(token);
    return true;
  }
}
