/*************************************************************************************************
** Imports                                                                                      **
**************************************************************************************************/
//-- **NgRx State Variables + Actions** ---------------------------------------------------------//
import { ErrorInitialState, ErrorState  } from './error.state';
import { ErrorActionTypes, ErrorActions } from './error.actions';

/**********************************************************************************************************************************
** Fe@ture Reducer                                                                                                               **
**  -Reducer acts as a que that listens for set/success actions dispatched from the fe@ture.effects.ts file or a page/component  **
**  -The success/set actions uses its payload to update the fe@ture's state variables found at fe@ture.state.ts                  **
**  -The reducer only uses pure functions and it's the only place where the fe@ture's state variables can be modified            **
**  -Whenever state variables are changed affected selectors(fe@ture.selectors.ts) will automatically update with new value      **
***********************************************************************************************************************************/
export function errorReducer(state = ErrorInitialState, action: ErrorActions): ErrorState {
  switch (action.type) {

    case ErrorActionTypes.HANDLE_ERROR_SUCCESS: {
      return Object.assign({}, state, {
        lastError: action.payload.lastError
      });
    }

    default:
      return state;
  }
}