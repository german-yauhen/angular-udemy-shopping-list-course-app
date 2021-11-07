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
        .pipe(map(this.handleAuthFunc), catchError(this.handleError))
    })
  );

  @Effect({ dispatch: true })
  signUpStart = this.actions.pipe(
    ofType(AuthActions.SIGNUP_START),
    switchMap((authData: AuthActions.SignUpStart) => {
      return this.authService.sendSignUpRequest(authData.payload)
        .pipe(map(this.handleAuthFunc), catchError(this.handleError))
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
    map(() => this.handleAutoLogin())
  );

  private handleAutoLogin(): AuthActions.Login | AuthActions.NoAutoLogin {
    const userData: string = localStorage.getItem('userData');
    if (!userData) {
      return new AuthActions.NoAutoLogin();
    }
    const userDataObj: { email: string, id: string, _token: string, _tokenExpirationDate: string } = JSON.parse(userData);
    const expDate: Date = new Date(userDataObj._tokenExpirationDate);
    const loadedUser: User = new User(userDataObj.email, userDataObj.id, userDataObj._token, expDate);
    if (loadedUser.token) {
      return new AuthActions.Login(
        { email: loadedUser.email, userId: loadedUser.id, token: loadedUser.token, expirationDate: expDate }
      )
    }
    return new AuthActions.NoAutoLogin();
  }

  private handleAuthFunc(rsData: AuthResponse): AuthActions.Login {
    const expirationDate: Date = new Date(new Date().getTime() + (Number.parseInt(rsData.expiresIn) * 1000));
    const newUser: User = new User(rsData.email, rsData.localId, rsData.idToken, expirationDate);
    localStorage.setItem('userData', JSON.stringify(newUser));
    return new AuthActions.Login(
      { email: rsData.email, userId: rsData.localId, token: rsData.idToken, expirationDate: expirationDate }
    );
  };

  private handleError(errorResponse: HttpErrorResponse): Observable<AuthActions.AuthFail> {
    let errorMessage: string = 'An unknown error occurred!';
    if (!errorResponse.error || !errorResponse.error.error) {
      return of(new AuthActions.AuthFail(errorMessage));
    }
    switch (errorResponse.error.error.message) {
      case 'EMAIL_EXISTS':
        errorMessage = 'The email address is already in use by another account';
        break;
      case 'OPERATION_NOT_ALLOWED':
        errorMessage = 'Password sign-in is disabled for this project';
        break;
      case 'TOO_MANY_ATTEMPTS_TRY_LATER':
        errorMessage = 'We have blocked all requests from this device due to unusual activity. Try again later';
        break;

      case 'EMAIL_NOT_FOUND':
        errorMessage = 'There is no user associated with provided email address. The user may have been deleted';
        break;
      case 'INVALID_PASSWORD':
        errorMessage = 'The password is invalid or the user does not have a password';
        break;
      case 'USER_DISABLED':
        errorMessage = 'The user account has been disabled by an administrator';
        break;
    }
    return of(new AuthActions.AuthFail(errorMessage));
  };

}
