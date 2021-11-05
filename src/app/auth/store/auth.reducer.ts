import { User } from "../user.model";
import * as AuthActions from "./auth.actions";

export interface AuthState {
  user: User;
  authErrorMsg: string;
  loading: boolean
}

const initialState: AuthState = {
  user: null,
  authErrorMsg: null,
  loading: false
}

export function authReducer(state = initialState, action: AuthActions.AuthActions) {
  switch (action.type) {
    case AuthActions.LOGIN:
      const loggedInUser: User = new User(
        action.payload.email,
        action.payload.userId,
        action.payload.token,
        action.payload.expirationDate
      );
      return {
        ...state,
        user: loggedInUser,
        authErrorMsg: null,
        loading: false
      };
    case AuthActions.LOGOUT:
      return {
        ...state,
        user: null,
        loading: false
      };
    case AuthActions.LOGIN_START:
    case AuthActions.SIGNUP_START:
      return {
        ...state,
        authErrorMsg: null,
        loading: true
      };
    case AuthActions.AUTH_FAIL:
      return {
        ...state,
        user: null,
        authErrorMsg: action.payload,
        loading: false
      };
    case AuthActions.CLEAR_ERROR:
      return {
        ...state,
        authErrorMsg: null
      }
    default:
      return state;
  }
}
