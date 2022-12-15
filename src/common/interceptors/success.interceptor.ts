import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class SuccessInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const reg = new RegExp(/\/log\/\d{4}-\d{2}-\d{2}\/\d{4}-\d{2}-\d{2}/);
    if (reg.test(context.getArgs()[0].url)) {
      return next.handle();
    } else {
      return next.handle().pipe(
        map((data) => ({
          result: true,
          data,
        })),
      );
    }
  }
}
