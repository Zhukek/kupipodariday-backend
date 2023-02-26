import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { map, Observable } from "rxjs";
import { User } from "src/users/entities/user.entity";


@Injectable()
export class UserEmailInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
        return next
        .handle()
        .pipe(
            map((data: User | User[]) => {
                if (Array.isArray(data)) {
                    data.forEach(user => {
                        delete user.email;
                    })
                } else {
                    delete data.email;
                }

                return data
            })
        )
    }
}