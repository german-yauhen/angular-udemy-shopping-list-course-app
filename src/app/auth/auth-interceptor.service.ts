import { HttpEvent, HttpHandler, HttpInterceptor, HttpParams, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { exhaustMap, take, map } from "rxjs/operators";
import * as fromApp from "../store/app.reducer";
import { Store } from "@ngrx/store";

@Injectable()
export class AuthInterceptorService implements HttpInterceptor {

  constructor(private appStore: Store<fromApp.AppState>) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return this.appStore.select('auth').pipe(
      take(1),
      map(authState => authState.user),
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
