import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Store } from "@ngrx/store";
import { Observable } from "rxjs";
import { apikey } from "./sec.key";
import { User } from "./user.model";
import * as fromApp from "../store/app.reducer";
import * as AuthActions from "./store/auth.actions";

export interface AuthResponse {
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean;
}

@Injectable({providedIn: 'root'})
export class AuthService {

  private tokenExpirationTimer: any;

  constructor(private httpClient: HttpClient, private router: Router, private appStore: Store<fromApp.AppState>) {}

  sendLoginRequest(loginData: { email: string; password: string }): Observable<AuthResponse> {
    return this.httpClient.post<AuthResponse>(
      'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=' + apikey,
      {
        email: loginData.email,
        password: loginData.password,
        returnSecureToken: true
      }
    )
  }

  sendSignUpRequest(signUpData: { email: string; password: string; }): Observable<AuthResponse> {
    return this.httpClient.post<AuthResponse>(
      'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=' + apikey,
      {
        email: signUpData.email,
        password: signUpData.password,
        returnSecureToken: true
      }
    )
  }

  navigateLogout(): void {
    this.router.navigate(['/auth']);
  }

  navigateLogin(): void {
    this.router.navigate(['/'])
  }

  readUser(): { email: string, id: string, _token: string, _tokenExpirationDate: string } {
    const userData: string = localStorage.getItem('userData');
    if (!userData) {
      return null;
    }
    return JSON.parse(userData);
  }

  logout(): void {
    this.appStore.dispatch(new AuthActions.Logout());
    this.router.navigate(['/auth']);
    localStorage.removeItem('userData');
    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
    }
    this.tokenExpirationTimer = null;
  }

  autoLogin(): void {
    const userData: string = localStorage.getItem('userData');
    if (!userData) {
      return;
    }
    const userDataObj: {
      email: string,
      id: string,
      _token: string,
      _tokenExpirationDate: string
    } = JSON.parse(userData);
    const loadedUser: User = new User(userDataObj.email, userDataObj.id, userDataObj._token, new Date(userDataObj._tokenExpirationDate));
    if (loadedUser.token) {
      this.appStore.dispatch(new AuthActions.Login(
        { email: loadedUser.email, userId: loadedUser.id, token: loadedUser.token, expirationDate: new Date(userDataObj._tokenExpirationDate) }
      ));
      const expirationDuration: number = new Date(userDataObj._tokenExpirationDate).getTime() - new Date().getTime();
      this.autoLogout(expirationDuration);
    }
  }

  autoLogout(expirationDurationMs: number): void {
    this.tokenExpirationTimer = setTimeout(() => {
      this.logout();
    }, expirationDurationMs);
  }

  // signUp(email: string, password: string): Observable<AuthResponse> {
  //   return this.sendSignUpRequest({ email: email, password: password })
  //     .pipe(
  //       tap(responseData => {
  //         this.handleAuthentication(
  //           responseData.email, responseData.localId, responseData.idToken, Number.parseInt(responseData.expiresIn)
  //         );
  //       }),
  //       catchError(errorResponse => {
  //         return throwError(this.handleErrorMessage(errorResponse));
  //       })
  //     );
  // }

  // login(email: string, password: string): Observable<AuthResponse> {
  //   return this.sendLoginRequest({email: email, password: password}).pipe(
  //     tap(responseData => {
  //       this.handleAuthentication(
  //         responseData.email, responseData.localId, responseData.idToken, Number.parseInt(responseData.expiresIn)
  //       );
  //     }),
  //     catchError(errorResponse => {
  //       return throwError(this.handleErrorMessage(errorResponse));
  //     })
  //   );
  // }

  // private handleAuthentication(email: string, userId: string, token: string, expiresIn: number) {
  //   const expirationDate: Date = new Date(new Date().getTime() + (expiresIn * 1000));
  //   const newUser: User = new User(email, userId, token, expirationDate);
  //   this.appStore.dispatch(new AuthActions.Login(
  //     {email: newUser.email, token: newUser.token, userId: newUser.id, expirationDate: expirationDate}
  //   ));
  //   this.autoLogout(expiresIn * 1000);
  //   localStorage.setItem('userData', JSON.stringify(newUser));
  // }

  // private handleErrorMessage(errorResponse: HttpErrorResponse): string {
  //   if (!errorResponse.error || !errorResponse.error.error) {
  //     return 'An unknown error occurred!';
  //   }
  //   switch (errorResponse.error.error.message) {
  //     case 'EMAIL_EXISTS': return 'The email address is already in use by another account';
  //     case 'OPERATION_NOT_ALLOWED': return 'Password sign-in is disabled for this project';
  //     case 'TOO_MANY_ATTEMPTS_TRY_LATER': return 'We have blocked all requests from this device due to unusual activity. Try again later';

  //     case 'EMAIL_NOT_FOUND': return 'There is no user associated with provided email address. The user may have been deleted';
  //     case 'INVALID_PASSWORD': return 'The password is invalid or the user does not have a password';
  //     case 'USER_DISABLED': return 'The user account has been disabled by an administrator';
  //   }
  // }

}
