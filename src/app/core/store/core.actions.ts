import { LoadingModalConfig, PageNavigation, UrlRedirectConfig } from './../models/core.model';
/*************************************************************************************************
** Imports                                                                                      **
**************************************************************************************************/
//-- **Core** -----------------------------------------------------------------------------------//
import { Action } from '@ngrx/store';
//-- **Data Models** ----------------------------------------------------------------------------//
import { NetworkConnectionDb } from './../models/network.model';
import { NavBarConfig } from './../models/core.model';

/*************************************************************************************************
** Fe@ture Actions and their Payloads                                                           **
** - Actions are sent to the fe@ture.effects.ts which performs and executes action              **
** - Set and Success actions are sent to the fe@ture.reducer.ts which updates state variables   **
**************************************************************************************************/
export enum CoreActionTypes {
  SET_IS_MOBILE_VIEW                            = '[Core] Set Is Mobile View',

  SET_NAV_CONFIG                                = '[Core] Set nav config',

  SET_IS_NATIVE_MOBILE_APP                      = '[Core] Set is Native Mobile App',

  SET_ANIMATE_PAGE                              = '[Core] Set Animate Page',

  SET_NETWORK_CONNECTION                        = '[Core] Set Network Connection',

  SET_SELECTED_PATH                             = '[Core] Set Selected Path',

  NAVIGATE_TO_PAGE                              = '[Core] Navigate to Page',
  NAVIGATE_TO_PAGE_SUCCESS                      = '[Core] Navigate to Page Success',

  NAVIGATE_TO_PREVIOUS_PAGE                     = '[Core] Navigate to Previous Page',
  NAVIGATE_TO_PREVIOUS_PAGE_SUCCESS             = '[Core] Navigate to Previous Page Success',

  SET_URL_REDIRECT_CONFIG                      = '[Core] Set Url Redirect Config',

  SET_LOADING_MODAL_CONFIG                      = '[Core] Set Loading Modal Config',
  SET_IS_LOADING                                = '[Core] Set Is Loading',

  NO_CHANGES_DETECTED                           = '[Core] No Changes Detected',
  ACTION_SUCCESS                                = '[Core] Action was Successful',
}

//-- Set Nav Config---------------------------------------->
export class SetNavBarConfig implements Action {
  readonly type = CoreActionTypes.SET_NAV_CONFIG;
  constructor(public payload: { navBarConfig: NavBarConfig }) { }
}

//-- Set Is Mobile View ----------------------------------->
export class SetIsMobileView implements Action {
  readonly type = CoreActionTypes.SET_IS_MOBILE_VIEW;
  constructor(public payload: { isMobileView: boolean }) { }
}

//-- Set Is Native Mobile App ---------------------------------->
export class SetIsNativeMobileApp implements Action {
  readonly type = CoreActionTypes.SET_IS_NATIVE_MOBILE_APP;
  constructor(public payload: { isNativeMobileApp: boolean }) { }
}

//-- Set Animate Page ------------------------------------>
export class SetAnimatePage implements Action {
  readonly type = CoreActionTypes.SET_ANIMATE_PAGE;
  constructor(public payload: { animatePage: boolean }) { }
}

//-- Set Network Connection --------------------------------------------------->
export class SetNetworkConnection implements Action {
  readonly type = CoreActionTypes.SET_NETWORK_CONNECTION;
  constructor(public payload: { networkConnectionObj: NetworkConnectionDb }) { }
}

//-- Set Selected Path ------------------------------------>
export class SetSelectedPath implements Action {
  readonly type = CoreActionTypes.SET_SELECTED_PATH;
  constructor(public payload: { selectedPath: string; }) { }
}


//------------------------------------------------------------------------------------------------------->
//-- Navigate to page------------------------------------------------------------------------------------>
export class NavigateToPage implements Action {
  readonly type = CoreActionTypes.NAVIGATE_TO_PAGE;
  constructor(public payload: { pageNavigation: PageNavigation} ) { }
}
//------------------------------------------------------------------------------------------------------->
export class NavigateToPageSuccess implements Action {
  readonly type = CoreActionTypes.NAVIGATE_TO_PAGE_SUCCESS;
  constructor(public payload: { pageNavigation: PageNavigation, lastPageNavigation: PageNavigation }) { }
}
//--------------------------------------------------------------------------------------->


//------------------------------------------------------------------------------------------------------->
//-- Navigate to previous page--------------------------------------------------------------------------->
export class NavigateToPreviousPage implements Action {
  readonly type = CoreActionTypes.NAVIGATE_TO_PREVIOUS_PAGE;
  constructor(public payload?: {url?: string }) { }

}
//------------------------------------------------------------------------------------------------------->
export class NavigateToPreviousPageSuccess implements Action {
  readonly type = CoreActionTypes.NAVIGATE_TO_PREVIOUS_PAGE_SUCCESS;
  constructor(public payload: { pageNavigation: PageNavigation, lastPageNavigation: PageNavigation }) { }
}
//------------------------------------------------------------------------------------------------------->


//--------------------------------------------------------------------------->
//-- Set Loader Config ------------------------------------------------------>
export class SetLoadingModalConfig implements Action {
  readonly type = CoreActionTypes.SET_LOADING_MODAL_CONFIG;
  constructor(public payload: { loadingModalConfig: LoadingModalConfig }) { }
}


//------------------------------------------------------------------------->
//-- Set Url Redirect Config ---------------------------------------------->
export class SetUrlRedirectConfig implements Action {
  readonly type = CoreActionTypes.SET_URL_REDIRECT_CONFIG;
  constructor(public payload: { urlRedirectConfig: UrlRedirectConfig }) { }
}
//------------------------------------------------------------------------->

//--------------------------------------------------------------------------->
//-- Set Is Loading  -------------------------------------------------------->
export class SetIsLoading implements Action {
  readonly type = CoreActionTypes.SET_IS_LOADING;
  constructor(public payload: { isLoading: boolean }) { }
}

//-- No Changes Detected ---------------------------->
export class NoChangesDetected implements Action {
  readonly type = CoreActionTypes.NO_CHANGES_DETECTED;
  constructor(public payload: any = null) { }
}

//-- Action Success ----------------------------->
export class ActionSuccess implements Action {
  readonly type = CoreActionTypes.ACTION_SUCCESS;
  constructor(public payload: any = null) { }
}

export type CoreActions =
  | SetNavBarConfig
  | SetIsMobileView

  | SetIsNativeMobileApp

  | SetAnimatePage

  | SetNetworkConnection
  

  | SetSelectedPath

  | SetLoadingModalConfig

  | NavigateToPage
  | NavigateToPageSuccess

  | NavigateToPreviousPage
  | NavigateToPreviousPageSuccess

  | SetUrlRedirectConfig
  | SetIsLoading
  
  | NoChangesDetected
  | ActionSuccess;
