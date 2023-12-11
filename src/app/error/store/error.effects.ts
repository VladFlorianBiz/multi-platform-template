/*************************************************************************************************
** Imports                                                                                      **
**************************************************************************************************/
//-- **Core** -----------------------------------------------------------------------------------//
import { Injectable } from '@angular/core';
import { switchMap, catchError, take } from 'rxjs/operators';
import { of } from 'rxjs';
//-- **NgRx Data Store** ------------------------------------------------------------------------//
import { Actions, ofType, createEffect } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { AppState } from './../../app.reducer';
import * as ErrorActions from './error.actions';
import * as CoreActions from './../../core/store/core.actions';
//-- **Data Models** ----------------------------------------------------------------------------//
import { initialLoadingModalConfig } from './../../core/models/core.model';

//-- **Services/Helpers** -----------------------------------------------------------------------//
import { UiHelper } from '../../shared/helpers/ui.helper';
import { ErrorService } from '../services/error.service';
import { ErrorDataObjHelper } from '../helpers/error-data-obj.helper';

@Injectable()

/*****************************************************************************************************************************************
** Fe@ture Action Que                                                                                                                   **
** (1)Que Listens for Fe@ture actions to come in with their payload found in (fe@ture).actions.ts                                       **
** (2)Que Processes Feature actions USUALLY doing the following:                                                                        **
**    -Enriches data payload via fe@ture-data-obj-helper.ts                                                                             **
**    -Performs API service call                                                                                                        **
**      -On success                                                                                                                     **
**         -enriches api server response via (fe@ture)-data-obj-helper.ts                                                               **
**         -dispatches corresponding success action with payload which usually updates the feature state variables (fe@ture).reducer.ts **
**           -On state variable update, feature state variable selectors(fe@ture.selectors.ts) will update all of it's subscribers      **
**      -On error dispatches corresponding error action                                                                                 **
******************************************************************************************************************************************/
export class ErrorEffects {
  constructor(
    private actions$: Actions,
    private errorService: ErrorService,
    private uiHelper: UiHelper,
    private store: Store<AppState>,
    private errorDataObjHelper: ErrorDataObjHelper,
  ) { }

  //-- Handle Error Action -------------------------------------------------------------//
  handleError$ = createEffect(() => {
    return this.actions$.pipe(
      ofType<ErrorActions.HandleError>(ErrorActions.ErrorActionTypes.HANDLE_ERROR),
      switchMap((action) => {
        const error: any = action.payload.error;
        const actionType: string = action.payload.actionType;
        const payload: any = action.payload.payload;
        const insertErrorFlag = action.payload.insertError;
        const dataObj = this.errorDataObjHelper.handleError(error, actionType, payload);
        //// console.log('handleError$--dataObj', dataObj);
        this.store.dispatch(new CoreActions.SetLoadingModalConfig({
          loadingModalConfig: { show: false }
        }
        ));
        //---------------------------------------------------------------------------------------------------//
        if (insertErrorFlag) {
          //------------------------------------------------------------//
          return this.errorService.insertError(dataObj.errorInsert).pipe(
            take(1),
            switchMap(() => {
              this.store.dispatch(new CoreActions.SetLoadingModalConfig({loadingModalConfig: {  ...initialLoadingModalConfig }}));
              this.uiHelper.displayErrorAlert(error.message);
              return of(new ErrorActions.HandleErrorSuccess({ lastError: dataObj?.stateUpdates?.lastError }));
            }),
            catchError(error => {
              // console.log('handleError$ -CatchError', error);
              this.store.dispatch(new CoreActions.SetLoadingModalConfig({loadingModalConfig: {  ...initialLoadingModalConfig }}));
              this.uiHelper.displayErrorAlert(error.message);
              return of(new ErrorActions.HandleErrorSuccess({ lastError: dataObj?.stateUpdates?.lastError }));
            })
          );
        } else {
          this.store.dispatch(new CoreActions.SetLoadingModalConfig({loadingModalConfig: {  ...initialLoadingModalConfig }}));
          return of(new ErrorActions.HandleErrorSuccess({ lastError: dataObj?.stateUpdates?.lastError }));
        }
      }),
    );
  })

}
