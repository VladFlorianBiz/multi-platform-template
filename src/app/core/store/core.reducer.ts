/*************************************************************************************************
** Imports                                                                                      **
**************************************************************************************************/
//-- **NgRx State Variables + Actions** ---------------------------------------------------------//
import { CoreState, CoreStateInitialState } from './core.state';
import { CoreActionTypes, CoreActions } from './core.actions';

/**********************************************************************************************************************************
** Fe@ture Reducer                                                                                                               **
**  -Reducer acts as a que that listens for set/success actions dispatched from the fe@ture.effects.ts file or a page/component  **
**  -The success/set actions uses its payload to update the fe@ture's state variables found at fe@ture.state.ts                  **
**  -The reducer only uses pure functions and it's the only place where the fe@ture's state variables can be modified            **
**  -Whenever state variables are changed affected selectors(fe@ture.selectors.ts) will automatically update with new value      **
***********************************************************************************************************************************/
export function coreReducer(state = CoreStateInitialState, action: CoreActions): CoreState {
  switch (action.type) {

    case CoreActionTypes.SET_IS_MOBILE_VIEW: {
      return Object.assign({}, state, {
        isMobileView: action.payload.isMobileView
      });
    }

    case CoreActionTypes.SET_NAV_CONFIG: {
      // const navBarConfig = {
      //   ...state.navBarConfig,
      //   ...action.payload
      // }
      return Object.assign({}, state, {
        navBarConfig: action.payload.navBarConfig
      });
    }

    case CoreActionTypes.SET_IS_NATIVE_MOBILE_APP: {
      return Object.assign({}, state, {
        isNativeMobileApp: action.payload.isNativeMobileApp
      });
    }

    case CoreActionTypes.SET_NETWORK_CONNECTION: {
      return Object.assign({}, state, {
        networkConnectionObj: action.payload.networkConnectionObj
      });
    }

    case CoreActionTypes.SET_SELECTED_PATH: {
      return Object.assign({}, state, {
        selectedPath: action.payload.selectedPath
      });
    }
      

    case CoreActionTypes.SET_ANIMATE_PAGE: {
      return Object.assign({}, state, {
        animatePage: action.payload.animatePage
      });
    }

    case CoreActionTypes.SET_LOADING_MODAL_CONFIG: {
      return Object.assign({}, state, {
        loadingModalConfig: action.payload.loadingModalConfig,
      });
    }


    case CoreActionTypes.NAVIGATE_TO_PAGE_SUCCESS: {
      return Object.assign({}, state, {
        pageNavigation: action.payload.pageNavigation,
        lastPageNavigation: action.payload.lastPageNavigation,
      });
    }

    case CoreActionTypes.NAVIGATE_TO_PREVIOUS_PAGE_SUCCESS: {
      return Object.assign({}, state, {
        pageNavigation: action.payload.pageNavigation,
        lastPageNavigation: action.payload.lastPageNavigation,
      });
    }


    case CoreActionTypes.SET_IS_LOADING: {
      return Object.assign({}, state, {
        isLoading: action.payload.isLoading,
      });
    }

    default:
      return state;
  }
}

