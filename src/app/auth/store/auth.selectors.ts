/*************************************************************************************************
** Imports                                                                                      **
**************************************************************************************************/
//-- **Core** -----------------------------------------------------------------------------------//
import { AppState } from './../../app.reducer';
import { createSelector } from '@ngrx/store';

/**********************************************************************************************************************************
** Fe@ture Selectors                                                                                                             **
**  -Selectors are the way to access feature state variables found in (feature.state)                                            **
**  -Pages and Components import selectors in order to access state variables in a stream like approach(Observable).             **
**  -Whenever state variables are changed via feature.reducer.ts any affected selectors will automatically update with new value **
**  -Selectors are extremely powerful when it comes to enriching data or combining other state variables into custom selectors   **
***********************************************************************************************************************************/

//-- Fe@ture State Variables ---------------------------------------------------------->
export const getAuthAuthenticatedState = (state: AppState) => state.auth.authenticated;
export const getAuthUserObjState = (state: AppState) => state.auth.authUser;
export const getDynamicLinkObjState = (state: AppState) => state.auth.dynamicLinkObj;

//-- Fe@ture State Variable Selectors --------------->
export const selectIsAuthenticated = createSelector(
  getAuthAuthenticatedState,
  isAuthenticated => isAuthenticated
);

export const selectAuthUser = createSelector(
  getAuthAuthenticatedState,
  authUser => authUser
);

export const selectDynamicLinkObj = createSelector(
  getDynamicLinkObjState,
  dynamicLinkObj => dynamicLinkObj
);

//-- Custom State Variable Selectors ----------------------------------------------->
export const selectTokenDetails = createSelector(
  getAuthUserObjState,
  autUserObj => autUserObj.stsTokenManager
);