/*************************************************************************************************
** Imports                                                                                      **
**************************************************************************************************/
//-- **NgRx State Variables + Actions** ---------------------------------------------------------//
import { AccessState, AccessStateInitialState, accessAdapter } from './access.state';
import { AccessActionTypes, AccessActions } from './access.actions';

/**********************************************************************************************************************************
** Access Reducer                                                                                                               **
**  -Reducer acts as a que that listens for set/success actions dispatched from the access.effects.ts file or a page/component  **
**  -The success/set actions uses its payload to update the access's state variables found at access.state.ts                  **
**  -The reducer only uses pure functions and it's the only place where the access's state variables can be modified            **
**  -Whenever state variables are changed affected selectors(access.selectors.ts) will automatically update with new value      **
***********************************************************************************************************************************/
export function accessReducer(state = AccessStateInitialState, action: AccessActions): AccessState {
    switch (action.type) {

        case AccessActionTypes.GET_ACCESS_ARRAY_SUCCESS: {
            return Object.assign({}, state, {
                currentAccessList: accessAdapter.setAll(action.payload.accessArray, state.currentAccessList),
            });
        }

        case AccessActionTypes.GET_ACCESS_SUCCESS: {
            return Object.assign({}, state, {
                accessObj: action.payload.accessObj,
            });
        }

        case AccessActionTypes.UPDATE_ACCESS_SUCCESS: {
            const accessObj = action.payload.accessObj;
            const changes = { id: accessObj.id, changes: { ...accessObj } };
            const currentAccess = (state?.currentAccess?.id == accessObj?.id) ? {...accessObj} : {...state?.currentAccess};
            return Object.assign({}, state, {
                currentAccessList: accessAdapter.updateOne(changes, state.currentAccessList),
                accessObj: action.payload.accessObj,
                currentAccess: currentAccess,
            });
        }

        case AccessActionTypes.CREATE_ACCESS_SUCCESS: {
            const currentAccess = (state?.currentAccess?.id == action.payload.accessObj?.id) ? { ...action.payload.accessObj } : { ...state?.currentAccess };

            return Object.assign({}, state, {
                currentAccessList: accessAdapter.addOne(action.payload.accessObj, state.currentAccessList),
                currentAccess: currentAccess,
            });
        }

        case AccessActionTypes.DELETE_ACCESS_SUCCESS: {
            const id: string = action.payload.accessObj.id
            return Object.assign({}, state, {
                currentAccessList: accessAdapter.removeOne(action.payload?.accessObj?.id, state.currentAccessList)
            });
        }

        case AccessActionTypes.SET_ACCESS: {
            return Object.assign({}, state, {
                accessObj: action.payload.accessObj
            });
        }

        case AccessActionTypes.SET_CURRENT_ACCESS: {
            return Object.assign({}, state, {
                currentAccess: action.payload.currentAccess
            });
        }

        case AccessActionTypes.SET_CURRENT_ACCESS_LIST: {
            return Object.assign({}, state, {
                currentAccessList: accessAdapter.setAll(action.payload.currentAccessList, state.currentAccessList),
            });
        }

        default:
            return state;
    }
}

export const { selectAll } = accessAdapter.getSelectors();
