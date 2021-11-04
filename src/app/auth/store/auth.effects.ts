import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Actions, Effect, ofType } from "@ngrx/effects";
import { Observable, of } from "rxjs";
import { catchError, map, switchMap } from "rxjs/operators";
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

  @Effect()
  authLogin = this.actions.pipe(
    ofType(AuthActions.LOGIN_START),
    switchMap((authData: AuthActions.LoginStart) => {
      return this.authorise(authData).pipe(
        map(this.convertToAuthActionLogin),
        catchError(error => {
          return of();
        })
      )
    })
  );

  constructor(private actions: Actions, private httpClient: HttpClient) {}

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

  private convertToAuthActionLogin(rsData: AuthResponse): Observable<AuthActions.Login> {
    const expirationDate: Date = new Date(new Date().getTime() + (Number.parseInt(rsData.expiresIn) * 1000));
    return of(
      new AuthActions.Login(
        { email: rsData.email, userId: rsData.localId, token: rsData.idToken, expirationDate: expirationDate }
      )
    );
  }
}

