/*************************************************************************************************
** Imports                                                                                      **
**************************************************************************************************/
//-- **NgRx State Variables + Actions** ---------------------------------------------------------//
import { EmailState, EmailStateInitialState, emailAdapter } from './email.state';
import { EmailActionTypes, EmailActions } from './email.actions';

/**********************************************************************************************************************************
** Email Reducer                                                                                                               **
**  -Reducer acts as a que that listens for set/success actions dispatched from the email.effects.ts file or a page/component  **
**  -The success/set actions uses its payload to update the email's state variables found at email.state.ts                  **
**  -The reducer only uses pure functions and it's the only place where the email's state variables can be modified            **
**  -Whenever state variables are changed affected selectors(email.selectors.ts) will automatically update with new value      **
***********************************************************************************************************************************/
export function emailReducer(state = EmailStateInitialState, action: EmailActions): EmailState {
    switch (action.type) {

        case EmailActionTypes.GET_EMAIL_ARRAY_SUCCESS: {
            return Object.assign({}, state, {
                emailArray: emailAdapter.setAll(action.payload.emailArray, state.emailArray),
            });
        }

        case EmailActionTypes.GET_EMAIL_SUCCESS: {
            return Object.assign({}, state, {
                emailObj: action.payload.emailObj,
            });
        }

        case EmailActionTypes.UPDATE_EMAIL_SUCCESS: {
            const emailObj = action.payload.emailObj;
            const changes = { id: emailObj.id, changes: { ...emailObj } };
            return Object.assign({}, state, {
                emailArray: emailAdapter.updateOne(changes, state.emailArray)
            });
        }

        case EmailActionTypes.CREATE_EMAIL_SUCCESS: {
            return Object.assign({}, state, {
                emailArray: emailAdapter.addOne(action.payload.emailObj, state.emailArray)
            });
        }

        case EmailActionTypes.DELETE_EMAIL_SUCCESS: {
            const id: string = action.payload.emailObj.id
            return Object.assign({}, state, {
                emailArray: emailAdapter.removeOne(action.payload?.emailObj?.id, state.emailArray)
            });
        }

        case EmailActionTypes.SET_EMAIL: {
            return Object.assign({}, state, {
                emailObj: action.payload.emailObj
            });
        }

        default:
            return state;
    }
}

export const { selectAll } = emailAdapter.getSelectors();
