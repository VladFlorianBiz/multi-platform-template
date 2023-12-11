import { selectUrlRedirectConfig } from './core.selectors';
/*************************************************************************************************
** Imports                                                                                      **
**************************************************************************************************/
//-- **Core** -----------------------------------------------------------------------------------//
import { Injectable } from '@angular/core';
import { tap, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { withLatestFrom } from 'rxjs/operators';
//-- **NgRx Data Store** ------------------------------------------------------------------------//
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { AppState } from '../../app.reducer';
import { Store } from '@ngrx/store';
import { selectPageNavigation } from './core.selectors';
import { selectLastPageNavigation } from './core.selectors';
import * as CoreActions from './core.actions';
//-- **Data Models** ----------------------------------------------------------------------------//
import { initialLoadingModalConfig } from './../../core/models/core.model';
import { PageNavigation } from './../models/core.model';

//-- **Services/Helpers** -----------------------------------------------------------------------//
import { UiHelper } from './../../shared/helpers/ui.helper';

@Injectable()
/*****************************************************************************************************************************************
** Core Action Que                                                                                                                      **
** (1)Que Listens for Core actions to come in with their payload found in core.actions.ts                                               **
** (2)Que Processes Feature actions USUALLY doing the following:                                                                        **
**    -Enriches data payload via core-data-obj-helper.ts                                                                                **
**    -Performs API service call                                                                                                        **
**      -On success                                                                                                                     **
**         -enriches api server response via core-data-obj-helper.ts                                                                    **
**         -dispatches corresponding success action with payload which usually updates the feature state variables core.reducer.ts      **
**           -On state variable update, feature state variable selectors(core.selectors.ts) will update all of it's subscribers         **
**      -On error dispatches corresponding error action                                                                                 **
******************************************************************************************************************************************/
export class CoreEffects {
  constructor(
    private actions$: Actions,
    private uiHelper: UiHelper,
    private store: Store<AppState>,
  ) { }

  //------------------------------------------------------------------------------------------------------->
  //-- No Changes Detected Action ------------------------------------------------------------------------->
  noChangesDetected$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(CoreActions.CoreActionTypes.NO_CHANGES_DETECTED),
      tap(() => {
        this.store.dispatch(new CoreActions.SetLoadingModalConfig({loadingModalConfig: {  ...initialLoadingModalConfig }}));
        this.uiHelper.displayToast('No Changes Detected', 1000, 'bottom');
      }),
      switchMap(() => {
        return of(new CoreActions.ActionSuccess());
      }),
    )
  });


  //------------------------------------------------------------------------------------------------------------------------------------------------->
  //-- Navigate To Page Action ---------------------------------------------------------------------------------------------------------------------->
  navigateToPage$ = createEffect(() => {
    return this.actions$.pipe(
      ofType<CoreActions.NavigateToPage>(CoreActions.CoreActionTypes.NAVIGATE_TO_PAGE),
      withLatestFrom(this.store.select(selectPageNavigation)),
      switchMap(([action, _lastPageNavigation]) => {
        const lastPageNavigation = { ..._lastPageNavigation };
        const pageNavigation = action.payload.pageNavigation;
        return of(new CoreActions.NavigateToPageSuccess({ pageNavigation: { ...pageNavigation }, lastPageNavigation: { ...lastPageNavigation } }));
      }),
    )
  });

  //---------------------------------------------------------------------------------------------------------------------------------------------------------->
  //-- Navigate To Previous Page Action ---------------------------------------------------------------------------------------------------------------------->
  navigateToPreviousPage$ = createEffect(() => {
    return this.actions$.pipe(
      ofType<CoreActions.NavigateToPreviousPage>(CoreActions.CoreActionTypes.NAVIGATE_TO_PREVIOUS_PAGE),
      withLatestFrom(
        this.store.select(selectPageNavigation), 
        this.store.select(selectLastPageNavigation),
        this.store.select(selectUrlRedirectConfig)
        ),
      switchMap(([action, _lastPageNavigation, newPageNavigation, _urlRedirectConfig ]) => {
        const backUpUrl = action?.payload?.url;
        const lastPageNavigation: PageNavigation = { ..._lastPageNavigation };

        const noPreviousPageExists = !(lastPageNavigation?.url?.length > 0) 

        const url = (noPreviousPageExists && noPreviousPageExists) 
          ? backUpUrl 
          : newPageNavigation.url;



        const pageNavigation: PageNavigation = {
          ...newPageNavigation,
          url: url,
          animatedDirection: 'back'
        }
        

        console.log('lastPagaeNavigation', pageNavigation)
        return of(new CoreActions.NavigateToPreviousPageSuccess({ pageNavigation: { ...pageNavigation }, lastPageNavigation: { ...lastPageNavigation } }));
      }),
    )
  });



}
