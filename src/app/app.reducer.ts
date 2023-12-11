/*************************************************************************************************
** Imports                                                                                      **
**************************************************************************************************/
//-- **Core** -----------------------------------------------------------------------------------//
import { ActionReducerMap, MetaReducer, ActionReducer, Action } from '@ngrx/store';
//-- **Feature State Variables/Reducers** -------------------------------------------------------//
import * as coreReducer from './core/store/core.reducer';
import { CoreState } from './core/store/core.state';
import * as authReducer from './auth/store/auth.reducer';
import { AuthState } from './auth/store/auth.state';
import * as errorReducer from './error/store/error.reducer';
import { ErrorInitialState, ErrorState } from './error/store/error.state';
import * as userReducer from './user/store/user.reducer';
import { UserState, UserStateInitialState } from './user/store/user.state';
import { mediaReducer } from './media/store/media.reducer';
import { MediaState, MediaStateInitialState } from './media/store/media.state';
import { emailReducer } from './email/store/email.reducer';
import { EmailState, EmailStateInitialState } from './email/store/email.state';
import { localStorageReducer } from './local-storage/store/local-storage.reducer';
import { LocalStorageState } from './local-storage/store/local-storage.state';
import { accessReducer } from './access/store/access.reducer';
import { AccessState, AccessStateInitialState } from './access/store/access.state';

//-- Main App State Variable -->
export interface AppState {
  core: CoreState;
  auth: AuthState;
  error: ErrorState;
  user: UserState;
  media: MediaState;
  email: EmailState;
  localStorage: LocalStorageState;
  access: AccessState;

}

//-- Main App State Reducer -------------------------->
export const reducers: ActionReducerMap<AppState> = {
  core: coreReducer.coreReducer,
  auth: authReducer.authReducer,
  user: userReducer.userReducer,
  error: errorReducer.errorReducer,
  media: mediaReducer,
  email: emailReducer,
  localStorage: localStorageReducer,
  access: accessReducer,

};


//-- Main App Clear State On Actions  --------------------------------------------------//
export function clearState(reducer: ActionReducer<AppState>): ActionReducer<AppState> {
  return function (state: AppState | undefined, action: Action): AppState {
    if (action.type === '[Auth] Logout Success') {
      state = {
        ...state,
        core: state.core,
        auth: state.auth,
        user: { ...UserStateInitialState },
        access: { ...AccessStateInitialState },
        error: { ...ErrorInitialState },
        media: { ...MediaStateInitialState },
        email: { ...EmailStateInitialState },
        localStorage: state.localStorage,
      }
    }
    return reducer(state, action);
  };
}

export const metaReducers: MetaReducer<AppState>[] = [clearState];
