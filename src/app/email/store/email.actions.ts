/*************************************************************************************************
** Imports                                                                                      **
**************************************************************************************************/
//-- **Core** -----------------------------------------------------------------------------------//
import { Action } from '@ngrx/store';
//-- **Data Models** ----------------------------------------------------------------------------//
import { EmailDb } from '../models/email.model';

/*************************************************************************************************
** Email Actions and their Payloads                                                           **
** - Actions are sent to the email.effects.ts which performs and executes action              **
** - Set and Success actions are sent to the email.reducer.ts which updates state variables   **
**************************************************************************************************/
export enum EmailActionTypes {
    GET_EMAIL_ARRAY                 = '[Email] Get Email array',
    GET_EMAIL_ARRAY_SUCCESS         = '[Email] Get Email array Success',

    GET_EMAIL                       = '[Email] Get Email',
    GET_EMAIL_SUCCESS               = '[Email] Get Email Success',

    UPDATE_EMAIL                    = '[Email] Update Email',
    UPDATE_EMAIL_SUCCESS            = '[Email] Update Email Success',

    CREATE_EMAIL                    = '[Email] Create Email',
    CREATE_EMAIL_SUCCESS            = '[Email] Create Email Success',

    DELETE_EMAIL                    = '[Email] Delete Email',
    DELETE_EMAIL_SUCCESS            = '[Email] Delete Email Success',

    SET_EMAIL                       = '[Email] Set Email',
    ACTION_SUCCESS                                     = '[Email] Action was successful',
}

//-- Get Email Array ---------------------------------------------------->
export class GetEmailArray implements Action {
    readonly type = EmailActionTypes.GET_EMAIL_ARRAY;
}

export class GetEmailArraySuccess implements Action {
    readonly type = EmailActionTypes.GET_EMAIL_ARRAY_SUCCESS;
    constructor(public payload: { emailArray: EmailDb [] }) { }
}

//-- Get Email ---------------------------------------->
export class GetEmail implements Action {
    readonly type = EmailActionTypes.GET_EMAIL;
    constructor(public payload: { emailId: string }) { }
}

export class GetEmailSuccess implements Action {
    readonly type = EmailActionTypes.GET_EMAIL_SUCCESS;
    constructor(public payload: { emailObj: EmailDb }) { }
}

//-- Update Email ---------------------------------------->
export class UpdateEmail implements Action {
    readonly type = EmailActionTypes.UPDATE_EMAIL;
    constructor(public payload: { emailObj: EmailDb, redirectUrl?: string; redirectDirection?: string  }) { }
}

export class UpdateEmailSuccess implements Action {
    readonly type = EmailActionTypes.UPDATE_EMAIL_SUCCESS;
    constructor(public payload: { emailObj: EmailDb }) { }
}

//-- Create Email ----------------------------------------->
export class CreateEmail implements Action {
    readonly type = EmailActionTypes.CREATE_EMAIL;
    constructor(public payload: { emailObj: EmailDb, redirectUrl?: string; redirectDirection?: string  }) { }
}

export class CreateEmailSuccess implements Action {
    readonly type = EmailActionTypes.CREATE_EMAIL_SUCCESS;
    constructor(public payload: { emailObj: EmailDb }) { }
}

//-- Delete Email ----------------------------------------->
export class DeleteEmail implements Action {
    readonly type = EmailActionTypes.DELETE_EMAIL;
    constructor(public payload: { emailObj: EmailDb, redirectUrl?: string; redirectDirection?: string  }) { }
}

export class DeleteEmailSuccess implements Action {
    readonly type = EmailActionTypes.DELETE_EMAIL_SUCCESS;
    constructor(public payload: { emailObj: EmailDb }) { }
}

//-- Set Email -------------------------------------------->
export class SetEmail implements Action {
    readonly type = EmailActionTypes.SET_EMAIL;
    constructor(public payload: { emailObj: EmailDb }) { }
}

//-- Action Success --------------------------------->
export class ActionSuccess implements Action {
    readonly type = EmailActionTypes.ACTION_SUCCESS;
}

export type EmailActions =
    | GetEmailArray
    | GetEmailArraySuccess

    | GetEmail
    | GetEmailSuccess

    | UpdateEmail
    | UpdateEmailSuccess

    | CreateEmail
    | CreateEmailSuccess

    | DeleteEmail
    | DeleteEmailSuccess

    | SetEmail
    | ActionSuccess;
