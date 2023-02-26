import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { map, Observable } from "rxjs";
import { Wish } from "src/wishes/entities/wish.entity";


@Injectable()
export class WishOwnerInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
        return next
        .handle()
        .pipe(
            map((data: Wish[] | Wish) => {
                if (Array.isArray(data)) {
                    data.forEach(wish => {
                        delete wish.owner.password;
                        delete wish.owner.email
                    })
                } else {
                    delete data.owner.password;
                    delete data.owner.email;
                }

                return data
            })
        )
    }
}