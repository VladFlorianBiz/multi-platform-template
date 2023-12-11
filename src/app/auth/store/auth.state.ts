/*************************************************************************************************
** Imports                                                                                      **
**************************************************************************************************/
//-- **Data Models** ----------------------------------------------------------------------------//
import { AuthDb, initialAuthDb } from './../models/auth.model';
import { DynamicLinkObj, initialDynamicLinkObj } from './../models/auth.model';
/************************************************************************************************************************
** Fe@ture State Variables                                                                                             **
**  -State Variables are persistent even when a page/component is destroyed UNLESS app is fully exited                 **
**  -Helps reduce extra calls to server as any calls made i.e. getUsers are stored in state variables until app exited **
**  -State Variables are the single source of state and can only be modified via fe@ture.reducer.ts                    **
**  -Access to state variables happens via fe@ture.selectors.ts and selectors can be imported into pages/components    ** 
*************************************************************************************************************************/

//-- Fe@ture State Variables -->
export interface AuthState {
    authUser: AuthDb;
    authenticated: boolean;
    dynamicLinkObj: DynamicLinkObj
}

//-- Initial Fe@ture State Variables -------->
export const AuthInitialState: AuthState = {
    authUser: initialAuthDb,
    authenticated: false,
    dynamicLinkObj: initialDynamicLinkObj
};
