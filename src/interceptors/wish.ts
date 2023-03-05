import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';
import { Wish } from 'src/wishes/entities/wish.entity';

@Injectable()
export class WishInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    return next.handle().pipe(
      map((data: Wish[] | Wish) => {
        if (Array.isArray(data)) {
          data.forEach((wish) => {
            delete wish.owner.password;
            delete wish.owner.email;
            wish.offers.forEach((offer) => {
              if (offer?.user?.password) {
                delete offer.user.password;
              }
            });
          });
        } else {
          delete data.owner.password;
          delete data.owner.email;
          data.offers.forEach((offer) => {
            if (offer?.user?.password) {
              delete offer.user.password;
            }
            if (offer?.user?.offers) {
              offer.user.offers.map((offer) => offer.id);
            }
          });
        }

        return data;
      }),
    );
  }
}
