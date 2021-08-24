import { HttpEvent, HttpHandler, HttpInterceptor, HttpParams, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { exhaustMap, take } from "rxjs/operators";
import { AuthService } from "./auth.service";

@Injectable()
export class AuthInterceptorService implements HttpInterceptor {

  constructor(private authService: AuthService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return this.authService.user.pipe(
      take(1),
      exhaustMap(user => {
        const isRqToFirebase: boolean = request.url.indexOf('eugenes-ng-course-recipe-book-default-rtdb.firebaseio.com') > 0;
        return next.handle(
          isRqToFirebase && user
            ? request.clone({params: new HttpParams().append('auth', user.token)})
            : request
        );
      })
    );
  }

}
