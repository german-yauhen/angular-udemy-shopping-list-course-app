import { Action } from "@ngrx/store";

export const LOGIN_START = '[Auth] Login Start';
export const AUTH_FAIL = '[Auth] Auth Fail';
export const LOGIN = '[Auth] Login';
export const LOGOUT = '[Auth] Logout';
export const SIGNUP_START = '[Auth] SignUp Start';
export const CLEAR_ERROR = '[Auth] Clear error';

export class Login implements Action {
  readonly type = LOGIN;

  constructor(public payload: {email: string, userId: string, token: string, expirationDate: Date}) {}

}

export class Logout implements Action {
  readonly type = LOGOUT;
}

export class LoginStart implements Action {
  readonly type = LOGIN_START;

  constructor(public payload: {email: string; password: string}) {}

}

export class SignUpStart implements Action {
  readonly type = SIGNUP_START;

  constructor(public payload: {email: string; password: string}) {}

}

export class AuthFail implements Action {
  readonly type = AUTH_FAIL;

  constructor(public payload: string) {}

}

export class ClearError implements Action {
  readonly type = CLEAR_ERROR;
}

export type AuthActions = Login | Logout | LoginStart | AuthFail | SignUpStart | ClearError;
