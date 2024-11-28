import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as slugid from 'slugid';

export interface Response<T> {
    data: T;
}

@Injectable()
export class SlugIdInterceptor<T> implements NestInterceptor<T, Response<T>> {
    constructor() {}

    transformObjectIdtoSlugId(item: any) : Observable<Response<T>> {
        if ('id' in item)
            return { ...item, id: slugid.encode(item.id) };
        return item;
    }

    transformDataIdtoSlugId(next: CallHandler): Observable<Response<T>> {
        return next.handle().pipe(map(data => (
            Array.isArray(data) ? data.map(item => {
                return this.transformObjectIdtoSlugId(item); 
            }) : 'id' in data ? { ...data, id: slugid.encode(data.id)} : data 
        )));
    }

    intercept(context: ExecutionContext, next: CallHandler): Observable<Response<T>> {
        console.log("interceptor");
        return this.transformDataIdtoSlugId(next);
    }
}