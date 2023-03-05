import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';
import { Offer } from 'src/offers/entities/offer.entity';

@Injectable()
export class OfferInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    return next.handle().pipe(
      map((data: Offer | Offer[]) => {
        if (Array.isArray(data)) {
          data.forEach((offer) => {
            delete offer.user.password;
            delete offer.item.owner.password;
            delete offer.item.owner.email;
          });
        } else {
          delete data.user.password;
          delete data.item.owner.password;
          delete data.item.owner.email;
        }

        return data;
      }),
    );
  }
}
