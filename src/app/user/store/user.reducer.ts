/*************************************************************************************************
** Imports                                                                                      **
**************************************************************************************************/
//-- **NgRx State Variables + Actions** ---------------------------------------------------------//
import { UserState, UserStateInitialState, userAdapter } from './user.state';
import { UserActionTypes, UserActions } from './user.actions';

/**********************************************************************************************************************************
** User Reducer                                                                                                               **
**  -Reducer acts as a que that listens for set/success actions dispatched from the user.effects.ts file or a page/component  **
**  -The success/set actions uses its payload to update the user's state variables found at user.state.ts                  **
**  -The reducer only uses pure functions and it's the only place where the user's state variables can be modified            **
**  -Whenever state variables are changed affected selectors(user.selectors.ts) will automatically update with new value      **
***********************************************************************************************************************************/
export function userReducer(state = UserStateInitialState, action: UserActions): UserState {
    switch (action.type) {

        case UserActionTypes.GET_USER_ARRAY_SUCCESS: {
            return Object.assign({}, state, {
                userArray: userAdapter.setAll(action.payload.userArray, state.userArray),
            });
        }

        case UserActionTypes.GET_USER_SUCCESS: {
            return Object.assign({}, state, {
                userObj: action.payload.userObj,
            });
        }

        case UserActionTypes.UPDATE_USER_SUCCESS: {
            const userObj = action.payload.userObj;
            const changes = { id: userObj.id, changes: { ...userObj } };
            return Object.assign({}, state, {
                userArray: userAdapter.updateOne(changes, state.userArray),
                userObj: action.payload.userObj,
            });
        }

        case UserActionTypes.CREATE_USER_SUCCESS: {
            return Object.assign({}, state, {
                userArray: userAdapter.addOne(action.payload.userObj, state.userArray)
            });
        }

        case UserActionTypes.DELETE_USER_SUCCESS: {
            const id: string = action.payload.userObj.id
            return Object.assign({}, state, {
                userArray: userAdapter.removeOne(action.payload?.userObj?.id, state.userArray)
            });
        }

        case UserActionTypes.SET_USER: {
            return Object.assign({}, state, {
                userObj: action.payload.userObj
            });
        }

        case UserActionTypes.SET_CURRENT_USER: {
            return Object.assign({}, state, {
                currentUser: action.payload.currentUser
            });
        }

        default:
            return state;
    }
}

export const { selectAll } = userAdapter.getSelectors();
