import { HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Actions, Effect, ofType } from "@ngrx/effects";
import { Observable, of } from "rxjs";
import { catchError, map, switchMap, tap } from "rxjs/operators";
import { AuthService } from "../auth.service";
import { User } from "../user.model";

import * as AuthActions from './auth.actions';

export interface AuthResponse {
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean;
}

@Injectable()
export class AuthEffects {

  constructor(private actions: Actions, private authService: AuthService) {}

  @Effect({ dispatch: true })
  authLogin = this.actions.pipe(
    ofType(AuthActions.LOGIN_START),
    switchMap((authData: AuthActions.LoginStart) => {
      return this.authService.sendLoginRequest(authData.payload)
        .pipe(map(this.handleAuthFunc), catchError(handleErrorFunc))
    })
  );

  @Effect({ dispatch: true })
  signUpStart = this.actions.pipe(
    ofType(AuthActions.SIGNUP_START),
    switchMap((authData: AuthActions.SignUpStart) => {
      return this.authService.sendSignUpRequest(authData.payload)
        .pipe(map(this.handleAuthFunc), catchError(handleErrorFunc))
    })
  );

  @Effect({ dispatch: false })
  authSuccess = this.actions.pipe(
    ofType(AuthActions.LOGIN),
    tap(() => this.authService.navigateLogin())
  );

  @Effect({ dispatch: false })
  logout = this.actions.pipe(
    ofType(AuthActions.LOGOUT),
    tap(() => {
      localStorage.removeItem('userData');
      this.authService.navigateLogout();
    })
  );

  @Effect({ dispatch: true })
  autoLogin = this.actions.pipe(
    ofType(AuthActions.AUTO_LOGIN),
    map(() => {
      const userData: string = localStorage.getItem('userData');
      if (!userData) {
        return new AuthActions.NoAutoLogin();
      }
      const userDataObj: { email: string, id: string, _token: string, _tokenExpirationDate: string } = JSON.parse(userData);
      const loadedUser: User = new User(userDataObj.email, userDataObj.id, userDataObj._token, new Date(userDataObj._tokenExpirationDate));
      if (loadedUser.token) {
        return new AuthActions.Login(
          { email: loadedUser.email, userId: loadedUser.id, token: loadedUser.token, expirationDate: new Date(userDataObj._tokenExpirationDate) }
        )
      }
      return new AuthActions.NoAutoLogin();
    })
  );

  private handleAuthFunc(rsData: AuthResponse): AuthActions.Login {
    const expirationDate: Date = new Date(new Date().getTime() + (Number.parseInt(rsData.expiresIn) * 1000));
    const newUser: User = new User(rsData.email, rsData.localId, rsData.idToken, expirationDate);
    localStorage.setItem('userData', JSON.stringify(newUser));
    return new AuthActions.Login(
      { email: rsData.email, userId: rsData.localId, token: rsData.idToken, expirationDate: expirationDate }
    );
  };

  // private doAutoLogin(): void {
  //   const userData: string = localStorage.getItem('userData');
  //   if (!userData) {
  //     return;
  //   }
  //   const userDataObj: {
  //     email: string,
  //     id: string,
  //     _token: string,
  //     _tokenExpirationDate: string
  //   } = JSON.parse(userData);
  //   const loadedUser: User = new User(userDataObj.email, userDataObj.id, userDataObj._token, new Date(userDataObj._tokenExpirationDate));
  //   if (loadedUser.token) {
  //     this.appStore.dispatch(new AuthActions.Login(
  //       { email: loadedUser.email, userId: loadedUser.id, token: loadedUser.token, expirationDate: new Date(userDataObj._tokenExpirationDate) }
  //     ));
  //     const expirationDuration: number = new Date(userDataObj._tokenExpirationDate).getTime() - new Date().getTime();
  //     this.autoLogout(expirationDuration);
  //   }
  // }

}

const handleErrorFunc = function (errorResponse: HttpErrorResponse): Observable<AuthActions.AuthFail> {
  let errorMessage: string = 'An unknown error occurred!';
  if (!errorResponse.error || !errorResponse.error.error) {
    return of(new AuthActions.AuthFail(errorMessage));
  }
  switch (errorResponse.error.error.message) {
    case 'EMAIL_EXISTS': errorMessage = 'The email address is already in use by another account';
    case 'OPERATION_NOT_ALLOWED': errorMessage = 'Password sign-in is disabled for this project';
    case 'TOO_MANY_ATTEMPTS_TRY_LATER': errorMessage = 'We have blocked all requests from this device due to unusual activity. Try again later';

    case 'EMAIL_NOT_FOUND': errorMessage = 'There is no user associated with provided email address. The user may have been deleted';
    case 'INVALID_PASSWORD': errorMessage = 'The password is invalid or the user does not have a password';
    case 'USER_DISABLED': errorMessage = 'The user account has been disabled by an administrator';
  }
  return of(new AuthActions.AuthFail(errorMessage));
};
