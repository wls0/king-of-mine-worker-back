import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { JwtService } from '@nestjs/jwt';
import { jwtPayload } from './jwt.payload';
import { ForbiddenException } from '@nestjs/common/exceptions/forbidden.exception';

function validateToken(token: string) {
  const jwtService = new JwtService();
  try {
    const verify = jwtService.verify(token, { secret: process.env.JWT });
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
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const { authorization } = request.headers;
    if (authorization === undefined) {
      throw new UnauthorizedException();
    }
    const token = authorization.replace('Bearer ', '');
    const userData: jwtPayload = validateToken(token);
    if (!userData.status) {
      throw new ForbiddenException();
    }
    request.user = userData;
    return true;
  }
}

@Injectable()
export class ManagerAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const { authorization } = request.headers;
    if (authorization === undefined) {
      throw new UnauthorizedException();
    }
    const token = authorization.replace('Bearer ', '');
    const userData: jwtPayload = validateToken(token);
    if (userData.accessLevel) {
      throw new ForbiddenException();
    }
    request.user = userData;
    return true;
  }
}
