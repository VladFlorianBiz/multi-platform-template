/*************************************************************************************************
** Imports                                                                                      **
**************************************************************************************************/
//-- **Core** -----------------------------------------------------------------------------------//
import { Action } from '@ngrx/store';
//-- **Data Models** ----------------------------------------------------------------------------//
import { UserDb } from '../models/user.model';

/*************************************************************************************************
** User Actions and their Payloads                                                           **
** - Actions are sent to the user.effects.ts which performs and executes action              **
** - Set and Success actions are sent to the user.reducer.ts which updates state variables   **
**************************************************************************************************/
export enum UserActionTypes {
    GET_USER_ARRAY                 = '[User] Get User array',
    GET_USER_ARRAY_SUCCESS         = '[User] Get User array Success',

    GET_USER                       = '[User] Get User',
    GET_USER_SUCCESS               = '[User] Get User Success',

    UPDATE_USER                    = '[User] Update User',
    UPDATE_USER_SUCCESS            = '[User] Update User Success',

    CREATE_USER                    = '[User] Create User',
    CREATE_USER_SUCCESS            = '[User] Create User Success',

    DELETE_USER                    = '[User] Delete User',
    DELETE_USER_SUCCESS            = '[User] Delete User Success',

    SET_USER                       = '[User] Set User',
    SET_CURRENT_USER               = '[User] Set Current User',
    ACTION_SUCCESS                 = '[User] Action was successful',
}


//-- Get User Array ---------------------------------------------------->
export class GetUserArray implements Action {
    readonly type = UserActionTypes.GET_USER_ARRAY;
}

export class GetUserArraySuccess implements Action {
    readonly type = UserActionTypes.GET_USER_ARRAY_SUCCESS;
    constructor(public payload: { userArray: UserDb [] }) { }
}

//-- Get User ---------------------------------------->
export class GetUser implements Action {
    readonly type = UserActionTypes.GET_USER;
    constructor(public payload: { userId: string }) { }
}

export class GetUserSuccess implements Action {
    readonly type = UserActionTypes.GET_USER_SUCCESS;
    constructor(public payload: { userObj: UserDb }) { }
}

//-- Update User ---------------------------------------->
export class UpdateUser implements Action {
    readonly type = UserActionTypes.UPDATE_USER;
    constructor(public payload: { userObj: UserDb; successToastMessage?: string; redirectUrl?: string; redirectDirection?: string;  }) { }
}

export class UpdateUserSuccess implements Action {
    readonly type = UserActionTypes.UPDATE_USER_SUCCESS;
    constructor(public payload: { userObj: UserDb }) { }
}

//-- Create User ----------------------------------------->
export class CreateUser implements Action {
    readonly type = UserActionTypes.CREATE_USER;
    constructor(public payload: { userObj: UserDb; successToastMessage?: string; redirectUrl?: string; redirectDirection?: string;  }) { }
}

export class CreateUserSuccess implements Action {
    readonly type = UserActionTypes.CREATE_USER_SUCCESS;
    constructor(public payload: { userObj: UserDb }) { }
}

//-- Delete User ----------------------------------------->
export class DeleteUser implements Action {
    readonly type = UserActionTypes.DELETE_USER;
    constructor(public payload: { userObj: UserDb; successToastMessage?: string; redirectUrl?: string; redirectDirection?: string;  }) { }
}

export class DeleteUserSuccess implements Action {
    readonly type = UserActionTypes.DELETE_USER_SUCCESS;
    constructor(public payload: { userObj: UserDb }) { }
}

//-- Set User -------------------------------------------->
export class SetUser implements Action {
    readonly type = UserActionTypes.SET_USER;
    constructor(public payload: { userObj: UserDb }) { }
}

//-- Set Current User -------------------------------------------->
export class SetCurrentUser implements Action {
    readonly type = UserActionTypes.SET_CURRENT_USER;
    constructor(public payload: { currentUser: UserDb }) { }
}

//-- Action Success --------------------------------->
export class ActionSuccess implements Action {
    readonly type = UserActionTypes.ACTION_SUCCESS;
}


export type UserActions =
    | GetUserArray
    | GetUserArraySuccess

    | GetUser
    | GetUserSuccess

    | UpdateUser
    | UpdateUserSuccess

    | CreateUser
    | CreateUserSuccess

    | DeleteUser
    | DeleteUserSuccess

    | SetUser
    | SetCurrentUser
    | ActionSuccess;
