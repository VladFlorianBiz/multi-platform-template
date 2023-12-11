import { DynamicLinkObj } from './../models/auth.model';
/*************************************************************************************************
** Imports                                                                                      **
**************************************************************************************************/
//-- **Core** -----------------------------------------------------------------------------------//
import { Action } from '@ngrx/store';
//-- **Data Models** ----------------------------------------------------------------------------//
import { AuthDb } from '../models/auth.model';

/*************************************************************************************************
** Fe@ture Actions and their Payloads                                                           **
** - Actions are sent to the fe@ture.effects.ts which performs and executes action              **
** - Set and Success actions are sent to the fe@ture.reducer.ts which updates state variables   **
**************************************************************************************************/
export enum AuthActionTypes {
  LOGIN                                     = '[Auth] Login',
  LOGIN_SUCCESS                             = '[Auth] Login Success',

  SIGN_UP                                   = '[Auth] Sign Up',
  SIGN_UP_SUCCESS                            = '[Auth] Sign Up Success',

  FORGOT_PASSWORD                           = '[Auth] Forgot Password',
  FORGOT_PASSWORD_SUCCESS                   = '[Auth] Forgot Password Success',

  LOGOUT                                    = '[Auth] Logout',
  LOGOUT_SUCCESS                            = '[Auth] Logout Success',

  LISTEN_TO_AUTH_CHANGES                    = '[Auth] Listen to Auth Changes',
  LISTEN_TO_AUTH_CHANGES_SUCCESS            = '[Auth] Listen to Auth Changes Success',

  VERIFY_EMAIL                              = '[Auth] Verify Email',
  VERIFY_EMAIL_SUCCESS                      = '[Auth] Verify Email Success',

  VERIFY_DYNAMIC_LINK_CODE                  = '[Auth] Verify Dynamic Link Code',
  VERIFY_DYNAMIC_LINK_CODE_SUCCESS          = '[Auth] Verify Dynamic Link Code Success',
  UPDATE_DYNAMIC_LINK_OBJ                   = '[Auth] Update Dynamic Link Obj',

  CHANGE_PASSWORD                           = '[Auth] Change Password',
  CHANGE_PASSWORD_SUCCESS                   = '[Auth] Change Password Success',

  SET_UNAUTHENTICATED                       = '[Auth] Set Unathenticated',
  ACTION_SUCCESS                            = '[Auth] Action was Successful',
}


//---------------------Sign Up------------------------------------//
export class SignUp implements Action {
  readonly type = AuthActionTypes.SIGN_UP;
  constructor(public payload: { signUpFormObj: any }) { }
}

export class SignUpSuccess implements Action {
  readonly type = AuthActionTypes.SIGN_UP_SUCCESS;
  constructor(public payload: any = null) { }
}



//-- Login------------------------------------------------------------->
export class Login implements Action {
  readonly type = AuthActionTypes.LOGIN;
  constructor(public payload: { email: string, password: string }) { }
}

export class LoginSuccess implements Action {
  readonly type = AuthActionTypes.LOGIN_SUCCESS;
  constructor(public payload: { authUser: AuthDb }) { }

  
}

//-- Forgot Password ------------------------------>
export class ForgotPassword implements Action {
  readonly type = AuthActionTypes.FORGOT_PASSWORD;
  constructor(public payload: { email: string }) { }
}

export class ForgotPasswordSuccess implements Action {
  readonly type = AuthActionTypes.FORGOT_PASSWORD_SUCCESS;
  constructor(public payload: any = null) { }
}

//-- Logout --------------------------------->
export class Logout implements Action {
  readonly type = AuthActionTypes.LOGOUT;
  constructor(public payload: any = null) { }
}

export class LogoutSuccess implements Action {
  readonly type = AuthActionTypes.LOGOUT_SUCCESS;
  constructor(public payload: any = null) { }
}

//-- Listen For Auth Changes  ----------------------------->
export class ListenToAuthChanges implements Action {
  readonly type = AuthActionTypes.LISTEN_TO_AUTH_CHANGES;
  constructor(public payload: any = null) { }
}

export class ListenToAuthChangesSuccess implements Action {
  readonly type = AuthActionTypes.LISTEN_TO_AUTH_CHANGES_SUCCESS;
  constructor(public payload: { authUser: AuthDb }) { }
}

//-- Change Password ------------------------------------>
export class ChangePassword implements Action {
  readonly type = AuthActionTypes.CHANGE_PASSWORD;
  constructor(public payload: { password: string }) { }
}

export class ChangePasswordSuccess implements Action {
  readonly type = AuthActionTypes.CHANGE_PASSWORD_SUCCESS;
  constructor(public payload: any = null) { }
}

//-- Verify Email ------------------------------------>
export class VerifyEmail implements Action {
  readonly type = AuthActionTypes.VERIFY_EMAIL;
  constructor(public payload: { oodCode: string }) { }
}

export class VerifyEmailSuccess implements Action {
  readonly type = AuthActionTypes.VERIFY_EMAIL_SUCCESS;
  constructor(public payload: any = null) { }
}

//------------------Verify Dynamic Link Code  ----------------------//
export class VerifyDynamicLinkCode implements Action {
  readonly type = AuthActionTypes.VERIFY_DYNAMIC_LINK_CODE;
  constructor(public payload: { dynamicLinkObj: DynamicLinkObj }) { }
}

export class VerifyDynamicLinkCodeSuccess implements Action {
  readonly type = AuthActionTypes.VERIFY_DYNAMIC_LINK_CODE_SUCCESS;
  constructor(public payload: { dynamicLinkObj: DynamicLinkObj }) { }
}


//----------------Update Dynamic Link Obj--------------------------------//
export class UpdateDynamicLinkObj implements Action {
  readonly type = AuthActionTypes.UPDATE_DYNAMIC_LINK_OBJ;
  constructor(public payload: { dynamicLinkObj: DynamicLinkObj }) { }
}




//-- Set unathenticated ------------------------------->
export class SetUnauthenticated implements Action {
  readonly type = AuthActionTypes.SET_UNAUTHENTICATED;
  constructor(public payload: any = null) { }
}

//-- Action Success ----------------------------->
export class ActionSuccess implements Action {
  readonly type = AuthActionTypes.ACTION_SUCCESS;
}


export type AuthActions =
  | Login
  | LoginSuccess

  | ForgotPassword
  | ForgotPasswordSuccess

  | Logout
  | LogoutSuccess

  | ListenToAuthChanges
  | ListenToAuthChangesSuccess

  | ChangePassword
  | ChangePasswordSuccess

  | VerifyEmail
  | VerifyEmailSuccess

  | SetUnauthenticated
| VerifyDynamicLinkCode
| VerifyDynamicLinkCodeSuccess
| UpdateDynamicLinkObj

  | ActionSuccess;
