import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { BehaviorSubject, Observable, Subject, throwError } from "rxjs";
import { catchError, tap } from "rxjs/operators";
import { User } from "./user.model";

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

  user: BehaviorSubject<User> = new BehaviorSubject<User>(null);

  private tokenExpirationTimer: any;

  constructor(private httpClient: HttpClient, private router: Router) {}

  signUp(email: string, password: string): Observable<AuthResponse> {
    return this.httpClient
      .post<AuthResponse>(
        'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyDNrwYWXtTFXSY6rucPFQK1kZnD5c5kX1M',
        {
          email: email,
          password: password,
          returnSecureToken: true
        }
      ).pipe(
        tap(responseData => {
          this.handleAuthentication(
            responseData.email, responseData.localId, responseData.idToken, Number.parseInt(responseData.expiresIn)
          );
        }),
        catchError(errorResponse => {
          return throwError(this.handleErrorMessage(errorResponse));
        })
      );
  }

  login(email: string, password: string): Observable<AuthResponse> {
    return this.httpClient.post<AuthResponse>(
      'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyDNrwYWXtTFXSY6rucPFQK1kZnD5c5kX1M',
      {
        email: email,
        password: password,
        returnSecureToken: true
      }
    ).pipe(
      tap(responseData => {
        this.handleAuthentication(
          responseData.email, responseData.localId, responseData.idToken, Number.parseInt(responseData.expiresIn)
        );
      }),
      catchError(errorResponse => {
        return throwError(this.handleErrorMessage(errorResponse));
      })
    );
  }

  logout(): void {
    this.user.next(null);
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
      this.user.next(loadedUser);
      const expirationDuration: number = new Date(userDataObj._tokenExpirationDate).getTime() - new Date().getTime();
      this.autoLogout(expirationDuration);
    }
  }

  autoLogout(expirationDurationMs: number): void {
    this.tokenExpirationTimer = setTimeout(() => {
      this.logout();
    }, expirationDurationMs);
  }

  private handleAuthentication(email: string, userId: string, token: string, expiresIn: number) {
    const expirationDate: Date = new Date(new Date().getTime() + (expiresIn * 1000));
    const newUser: User = new User(email, userId, token, expirationDate);
    this.user.next(newUser);
    this.autoLogout(expiresIn * 1000);
    localStorage.setItem('userData', JSON.stringify(newUser));

  }

  private handleErrorMessage(errorResponse: HttpErrorResponse): string {
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
