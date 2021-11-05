import { HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Actions, createEffect, Effect, ofType } from "@ngrx/effects";
import { Observable, of } from "rxjs";
import { catchError, map, switchMap, tap } from "rxjs/operators";
import { AuthService } from "../auth.service";

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

  constructor(private actions: Actions,
     private router: Router,
     private authService: AuthService) {}

  @Effect({ dispatch: true })
  authLogin = this.actions.pipe(
    ofType(AuthActions.LOGIN_START),
    switchMap((authData: AuthActions.LoginStart) => {
      return this.authService.sendLoginRequest(authData.payload)
        .pipe(map(handleAuthFunc), catchError(handleErrorFunc))
    })
  );

  @Effect({ dispatch: false })
  authSuccess = this.actions.pipe(
    ofType(AuthActions.LOGIN),
    tap(() => this.router.navigate(['/']))
  );

  @Effect({ dispatch: true })
  signUpStart = this.actions.pipe(
    ofType(AuthActions.SIGNUP_START),
    switchMap((authData: AuthActions.SignUpStart) => {
      return this.authService.sendSignUpRequest(authData.payload)
        .pipe(map(handleAuthFunc), catchError(handleErrorFunc))
    })
  );

  // authLogin = createEffect(() => this.actions.pipe(
  //   ofType(AuthActions.LOGIN_START),
  //   switchMap((authData: AuthActions.LoginStart) => {
  //     return this.authorise(authData)
  //       .pipe(
  //         map(authResponse => this.convertToAuthActionLogin(authResponse)),
  //         catchError(errorRs => of(new AuthActions.LoginFail(this.convertToErrorMessage(errorRs))))
  //       )
  //   })
  // ));

  // authSuccess = createEffect(
  //   () => this.actions.pipe(
  //     ofType(AuthActions.LOGIN),
  //     tap(() => this.router.navigate(['/']))
  //   ),
  //   { dispatch: false }
  // );
}

const handleAuthFunc = function (rsData: AuthResponse): AuthActions.Login {
  const expirationDate: Date = new Date(new Date().getTime() + (Number.parseInt(rsData.expiresIn) * 1000));
  return new AuthActions.Login(
    { email: rsData.email, userId: rsData.localId, token: rsData.idToken, expirationDate: expirationDate }
  );
};

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
