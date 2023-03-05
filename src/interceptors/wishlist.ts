import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';
import { Wishlist } from 'src/wishlists/entities/wishlist.entity';

@Injectable()
export class WishlistInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    return next.handle().pipe(
      map((data: Wishlist[] | Wishlist) => {
        if (Array.isArray(data)) {
          data.forEach((wishlist) => {
            delete wishlist.user.password;
            delete wishlist.user.email;
            wishlist.items.forEach((item) => {
              delete item.offers;
              delete item.owner;
            });
          });
        } else {
          delete data.user.password;
          delete data.user.email;
          data.items.forEach((item) => {
            delete item.offers;
            delete item.owner;
          });
        }

        return data;
      }),
    );
  }
}
