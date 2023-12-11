import { initialUrlRedirectConfig, UrlRedirectConfig } from './../models/core.model';
/*************************************************************************************************
** Imports                                                                                      **
**************************************************************************************************/
//-- **Data Models** ----------------------------------------------------------------------//
import { NetworkConnectionDb, initialNetworkConnectionDb } from './../models/network.model';
import { NavBarConfig, initialNavBarConfig } from './../models/core.model';
import { PageNavigation, initialPageNavigation } from './../models/core.model';
import { initialLoadingModalConfig, LoadingModalConfig } from './../models/core.model';

/************************************************************************************************************************
** Fe@ture State Variables                                                                                             **
**  -State Variables are persistent even when a page/component is destroyed UNLESS app is fully exited                 **
**  -Helps reduce extra calls to server as any calls made i.e. getUsers are stored in state variables until app exited **
**  -State Variables are the single source of state and can only be modified via fe@ture.reducer.ts                    **
**  -Access to state variables happens via fe@ture.selectors.ts and selectors can be imported into pages/components    ** 
*************************************************************************************************************************/

//-- Feature State Variables -------------->
export interface CoreState {
    isMobileView: boolean;
    navBarConfig: NavBarConfig;
    animatePage: boolean;
    networkConnectionObj: NetworkConnectionDb
    isNativeMobileApp: boolean;
    selectedPath: string;
    loadingModalConfig: LoadingModalConfig;
    pageNavigation: PageNavigation;
    lastPageNavigation: PageNavigation;
    urlRedirectConfig: UrlRedirectConfig;
    isLoading: boolean;

}

//-- Initial Feature State Variables --------------->
export const CoreStateInitialState: CoreState = {
    isMobileView: true,
    navBarConfig: {
        ...initialNavBarConfig
    },
    animatePage: false,
    networkConnectionObj: initialNetworkConnectionDb,
    isNativeMobileApp: false,
    selectedPath: '',
    loadingModalConfig: {...initialLoadingModalConfig},
    pageNavigation: { ...initialPageNavigation },
    lastPageNavigation: { ...initialPageNavigation },
    urlRedirectConfig: {...initialUrlRedirectConfig},
    isLoading: false

};
