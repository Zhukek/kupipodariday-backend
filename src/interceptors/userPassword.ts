import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { map, Observable } from "rxjs";
import { User } from "src/users/entities/user.entity";


@Injectable()
export class UserPasswordInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
        return next
        .handle()
        .pipe(
            map((data: User | User[]) => {
                if (Array.isArray(data)) {
                    data.forEach(user => {
                        delete user.password;
                    })
                } else {
                    delete data.password;
                }

                return data
            })
        )
    }
}