import { User } from "../user.model";
import * as AuthActions from "./auth.actions";

export interface AuthState {
  user: User;
}

const initialState: AuthState = {
  user: null
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
        user: loggedInUser
      };
    case AuthActions.LOGOUT:
      return {
        ...state,
        user: null
      };
    default:
      return state;
  }
}
