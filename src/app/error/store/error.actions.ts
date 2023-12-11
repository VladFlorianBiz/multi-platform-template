/*************************************************************************************************
** Imports                                                                                      **
**************************************************************************************************/
//-- **Core** -----------------------------------------------------------------------------------//
import { Action } from '@ngrx/store';
//-- **Data Models** ----------------------------------------------------------------------------//
import { ErrorDb } from '../models/error.model';

/*************************************************************************************************
** Fe@ture Actions and their Payloads                                                           **
** - Actions are sent to the fe@ture.effects.ts which performs and executes action              **
** - Set and Success actions are sent to the fe@ture.reducer.ts which updates state variables   **
**************************************************************************************************/
export enum ErrorActionTypes {
  HANDLE_ERROR                   = '[Error] Handle Error',
  HANDLE_ERROR_SUCCESS           = '[Error] Handle Error Success',

  ACTION_SUCCESS                 = '[Error] Action was Successful',
}

//-- Handle Error ----------------------------------------------------------------------------------------->
export class HandleError implements Action {
  readonly type = ErrorActionTypes.HANDLE_ERROR;
  constructor(public payload: { error: ErrorDb, actionType: any, payload: any, insertError: boolean; }) { }
}

export class HandleErrorSuccess implements Action {
  readonly type = ErrorActionTypes.HANDLE_ERROR_SUCCESS;
  constructor(public payload: { lastError: ErrorDb }) { }
}

//-- Action Success ------------------------------->
export class ActionSuccess implements Action {
  readonly type = ErrorActionTypes.ACTION_SUCCESS;
}

export type ErrorActions =
| HandleError
| HandleErrorSuccess

| ActionSuccess;
