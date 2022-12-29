import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Response, Request } from 'express';
@Catch()
export class ErrorExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status =
      exception instanceof HttpException ? exception.getStatus() : 500;
    if (process.env.NODE_ENV === 'dev') {
      console.log('Error : ' + exception);
    }
    const error =
      exception instanceof HttpException
        ? (exception.getResponse() as
            | string
            | { error: string; statusCode: number; message: string | string[] })
        : 'Internal server error';

    if (typeof error === 'string') {
      response.status(status).json({
        result: false,
        statusCode: status,
        method: request.method,
        path: request.url,
        error,
      });
    } else {
      response.status(status).json({
        result: false,
        statusCode: status,
        method: request.method,
        path: request.url,
        ...error,
      });
    }
  }
}
