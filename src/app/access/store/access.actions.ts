/*************************************************************************************************
** Imports                                                                                      **
**************************************************************************************************/
//-- **Core** -----------------------------------------------------------------------------------//
import { Action } from '@ngrx/store';
//-- **Data Models** ----------------------------------------------------------------------------//
import { AccessDb } from '../models/access.model';

/*************************************************************************************************
** Access Actions and their Payloads                                                           **
** - Actions are sent to the access.effects.ts which performs and executes action              **
** - Set and Success actions are sent to the access.reducer.ts which updates state variables   **
**************************************************************************************************/
export enum AccessActionTypes {
    GET_ACCESS_ARRAY                 = '[Access] Get Access array',
    GET_ACCESS_ARRAY_SUCCESS         = '[Access] Get Access array Success',

    GET_ACCESS                       = '[Access] Get Access',
    GET_ACCESS_SUCCESS               = '[Access] Get Access Success',

    UPDATE_ACCESS                    = '[Access] Update Access',
    UPDATE_ACCESS_SUCCESS            = '[Access] Update Access Success',

    CREATE_ACCESS                    = '[Access] Create Access',
    CREATE_ACCESS_SUCCESS            = '[Access] Create Access Success',

    DELETE_ACCESS                    = '[Access] Delete Access',
    DELETE_ACCESS_SUCCESS            = '[Access] Delete Access Success',

    SET_ACCESS                       = '[Access] Set Access',
    SET_CURRENT_ACCESS               = '[Access] Set Current Access',
    SET_CURRENT_ACCESS_LIST          = '[Access] Set Current Access List',
    ACTION_SUCCESS                   = '[Access] Action was successful',
}


//-- Get Access Array ---------------------------------------------------->
export class GetAccessArray implements Action {
    readonly type = AccessActionTypes.GET_ACCESS_ARRAY;
}

export class GetAccessArraySuccess implements Action {
    readonly type = AccessActionTypes.GET_ACCESS_ARRAY_SUCCESS;
    constructor(public payload: { accessArray: AccessDb [] }) { }
}

//-- Get Access ---------------------------------------->
export class GetAccess implements Action {
    readonly type = AccessActionTypes.GET_ACCESS;
    constructor(public payload: { accessId: string }) { }
}

export class GetAccessSuccess implements Action {
    readonly type = AccessActionTypes.GET_ACCESS_SUCCESS;
    constructor(public payload: { accessObj: AccessDb }) { }
}

//-- Update Access ---------------------------------------->
export class UpdateAccess implements Action {
    readonly type = AccessActionTypes.UPDATE_ACCESS;
    constructor(public payload: { accessObj: AccessDb; successToastMessage?: string; redirectUrl?: string; redirectDirection?: string;  }) { }
}

export class UpdateAccessSuccess implements Action {
    readonly type = AccessActionTypes.UPDATE_ACCESS_SUCCESS;
    constructor(public payload: { accessObj: AccessDb }) { }
}

//-- Create Access ----------------------------------------->
export class CreateAccess implements Action {
    readonly type = AccessActionTypes.CREATE_ACCESS;
    constructor(public payload: { accessObj: AccessDb; successToastMessage?: string; redirectUrl?: string; redirectDirection?: string;  }) { }
}

export class CreateAccessSuccess implements Action {
    readonly type = AccessActionTypes.CREATE_ACCESS_SUCCESS;
    constructor(public payload: { accessObj: AccessDb }) { }
}

//-- Delete Access ----------------------------------------->
export class DeleteAccess implements Action {
    readonly type = AccessActionTypes.DELETE_ACCESS;
    constructor(public payload: { accessObj: AccessDb; successToastMessage?: string; redirectUrl?: string; redirectDirection?: string;  }) { }
}

export class DeleteAccessSuccess implements Action {
    readonly type = AccessActionTypes.DELETE_ACCESS_SUCCESS;
    constructor(public payload: { accessObj: AccessDb }) { }
}

//-- Set Access -------------------------------------------->
export class SetAccess implements Action {
    readonly type = AccessActionTypes.SET_ACCESS;
    constructor(public payload: { accessObj: AccessDb }) { }
}

//-- Set Current Access -------------------------------------------->
export class SetCurrentAccess implements Action {
    readonly type = AccessActionTypes.SET_CURRENT_ACCESS;
    constructor(public payload: { currentAccess: AccessDb }) { }
}

//-- Set Current Access List-------------------------------------------->
export class SetCurrentAccessList implements Action {
    readonly type = AccessActionTypes.SET_CURRENT_ACCESS_LIST;
    constructor(public payload: { currentAccessList: AccessDb [] }) { }
}

//-- Action Success --------------------------------->
export class ActionSuccess implements Action {
    readonly type = AccessActionTypes.ACTION_SUCCESS;
}


export type AccessActions =
    | GetAccessArray
    | GetAccessArraySuccess

    | GetAccess
    | GetAccessSuccess

    | UpdateAccess
    | UpdateAccessSuccess

    | CreateAccess
    | CreateAccessSuccess

    | DeleteAccess
    | DeleteAccessSuccess

    | SetAccess
    | SetCurrentAccess
    | SetCurrentAccessList
    | ActionSuccess;
