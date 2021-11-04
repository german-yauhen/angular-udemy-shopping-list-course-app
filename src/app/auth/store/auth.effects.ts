import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Actions, createEffect, Effect, ofType } from "@ngrx/effects";
import { Observable, of } from "rxjs";
import { catchError, map, switchMap, tap } from "rxjs/operators";
import { apikey } from "../sec.key";

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

  constructor(private actions: Actions, private httpClient: HttpClient, private router: Router) {}

  @Effect()
  authLogin = this.actions.pipe(
    ofType(AuthActions.LOGIN_START),
    switchMap((authData: AuthActions.LoginStart) => {
      return this.authorise(authData)
        .pipe(
          map(authResponse => this.convertToAuthActionLogin(authResponse)),
          catchError(errorRs => of(new AuthActions.LoginFail(this.convertToErrorMessage(errorRs))))
        )
    })
  );

  authSuccess = createEffect(
    () => this.actions.pipe(
      ofType(AuthActions.LOGIN),
      tap(() => this.router.navigate(['/']))
    ),
    { dispatch: false }
  );

  private authorise(authData: AuthActions.LoginStart): Observable<AuthResponse> {
    return this.httpClient.post<AuthResponse>(
      'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=' + apikey,
      {
        email: authData.payload.email,
        password: authData.payload.password,
        returnSecureToken: true
      }
    )
  }

  private convertToAuthActionLogin(rsData: AuthResponse): AuthActions.Login {
    const expirationDate: Date = new Date(new Date().getTime() + (Number.parseInt(rsData.expiresIn) * 1000));
    return new AuthActions.Login(
      { email: rsData.email, userId: rsData.localId, token: rsData.idToken, expirationDate: expirationDate }
    );
  }

  private convertToErrorMessage(errorResponse: HttpErrorResponse): string {
    if (!errorResponse.error || !errorResponse.error.error) {
      return 'An unknown error occurred!';
    }
    switch (errorResponse.error.error.message) {
      case 'EMAIL_EXISTS': return 'The email address is already in use by another account';
      case 'OPERATION_NOT_ALLOWED': return 'Password sign-in is disabled for this project';
      case 'TOO_MANY_ATTEMPTS_TRY_LATER': return 'We have blocked all requests from this device due to unusual activity. Try again later';

      case 'EMAIL_NOT_FOUND': return 'There is no user associated with provided email address. The user may have been deleted';
      case 'INVALID_PASSWORD': return 'The password is invalid or the user does not have a password';
      case 'USER_DISABLED': return 'The user account has been disabled by an administrator';
    }
  }
}

