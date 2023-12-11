/*************************************************************************************************
** Imports                                                                                      **
**************************************************************************************************/
//-- **NgRx State Variables + Actions** ---------------------------------------------------------//
import { AuthInitialState, AuthState } from './auth.state';
import { AuthActionTypes, AuthActions } from './auth.actions';

/**********************************************************************************************************************************
** Fe@ture Reducer                                                                                                               **
**  -Reducer acts as a que that listens for set/success actions dispatched from the fe@ture.effects.ts file or a page/component  **
**  -The success/set actions uses its payload to update the fe@ture's state variables found at fe@ture.state.ts                  **
**  -The reducer only uses pure functions and it's the only place where the fe@ture's state variables can be modified            **
**  -Whenever state variables are changed affected selectors(fe@ture.selectors.ts) will automatically update with new value      **
***********************************************************************************************************************************/
export function authReducer(state = AuthInitialState, action: AuthActions): AuthState {
  switch (action.type) {

    case AuthActionTypes.LOGIN_SUCCESS: {
      return Object.assign({}, state, {
        authenticated: true,
      });
    }

    case AuthActionTypes.SET_UNAUTHENTICATED: {
      return Object.assign({}, state, {
        ...AuthInitialState
      });
    }

    case AuthActionTypes.UPDATE_DYNAMIC_LINK_OBJ: {
      return Object.assign({}, state, {
        dynamicLinkObj: { ...state.dynamicLinkObj, ...action.payload.dynamicLinkObj }
      });
    }

    case AuthActionTypes.VERIFY_DYNAMIC_LINK_CODE_SUCCESS: {
      return Object.assign({}, state, {
        dynamicLinkObj: action.payload.dynamicLinkObj
      });
    }

    case AuthActionTypes.LOGOUT_SUCCESS: {
      return Object.assign({}, state, {
        ...AuthInitialState
      });
    }

    default:
      return state;
  }
}
