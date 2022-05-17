import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { isArray, isObject } from 'class-validator';
import { map, Observable } from 'rxjs';

@Injectable()
export class RemovePasswordInterceptor implements NestInterceptor {
  removePasswordFromObject = (obj: any) => {
    if (isObject(obj) || isArray(obj)) {
      Object.keys(obj).forEach((key) => {
        if (isObject(obj[key])) {
          this.removePasswordFromObject(obj[key]);
        } else if (isArray(obj[key])) {
          obj[key] = obj[key].map((item) =>
            this.removePasswordFromObject(item)
          );
        } else if (key === 'password') {
          delete obj[key];
        }
      });
    }
    return obj;
  };

  intercept(_context: ExecutionContext, next: CallHandler): Observable<any> {
    return next
      .handle()
      .pipe(map((value) => this.removePasswordFromObject(value)));
  }
}
