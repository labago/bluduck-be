import { BadRequestException, CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { Observable } from "rxjs";
import { catchError } from 'rxjs/operators';


@Injectable()
export class GlobalErrorHandler implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    // next.handle() is an Observable of the controller's result value
    return next.handle()
    .pipe(catchError(error => {
      if (error instanceof TypeError) {
        throw new BadRequestException(error.message);
      } else {
        throw error;
      }
    }));
  }
}