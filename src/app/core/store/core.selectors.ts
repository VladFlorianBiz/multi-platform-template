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

//-- Fe@ture State Variables ------------------------------------------------------------------->
export const getIsMobileViewState = (state: AppState) => state.core.isMobileView;
export const getNavBarConfigState = (state: AppState) => state.core.navBarConfig;
export const getAnimatePageViewState = (state: AppState) => state.core.animatePage;
export const getNetworkConnectionObjState = (state: AppState) => state.core.networkConnectionObj;
export const getIsNativeMobileAppState = (state: AppState) => state.core.isNativeMobileApp;
export const getSelectedPathState = (state: AppState) => state.core.selectedPath;
export const getLoadingModalConfigState = (state: AppState) => state.core.loadingModalConfig;
export const getPageNavigationState = (state: AppState) => state.core.pageNavigation;
export const getLastPageNavigationState = (state: AppState) => state.core.lastPageNavigation;
export const getUrlRedirectConfigState = (state: AppState) => state.core.urlRedirectConfig;
export const getIsLoadingState = (state: AppState) => state.core.isLoading;

//-- Fe@ture State Variable Selectors --------------->
export const selectNavBarConfig = createSelector(
  getNavBarConfigState,
  navBarConfig => navBarConfig
);


export const selectIsMobileView = createSelector(
  getIsMobileViewState,
  isMobileView => isMobileView
);

export const selectIsNativeMobileApp = createSelector(
  getIsNativeMobileAppState,
  isNativeMobileApp => isNativeMobileApp
);

export const selectAnimatePage = createSelector(
  getAnimatePageViewState,
  animatePage => animatePage
);

export const selectNetworkConnectionObj = createSelector(
  getNetworkConnectionObjState,
  networkConnectionObj => networkConnectionObj
);

export const selectSelectedPath = createSelector(
  getSelectedPathState,
  selectedPath => selectedPath
);

export const selectLoadingModalConfig = createSelector(
  getLoadingModalConfigState,
  loadingModalConfig => loadingModalConfig
);

export const selectPageNavigation = createSelector(
  getPageNavigationState,
  pageNavigation => pageNavigation
);

export const selectLastPageNavigation = createSelector(
  getLastPageNavigationState,
  lastPageNavigation => lastPageNavigation
);

export const selectUrlRedirectConfig = createSelector(
  getUrlRedirectConfigState,
  urlRedirectConfig => urlRedirectConfig
);

export const selectIsLoading = createSelector(
  getIsLoadingState,
  isLoading => isLoading
);

//-- Custom State Variable Selectors ----------------------->
