/*************************************************************************************************
** Imports                                                                                      **
**************************************************************************************************/
//-- **Core** -----------------------------------------------------------------------------------//
import { Injectable } from '@angular/core';
import { tap, switchMap, catchError, take } from 'rxjs/operators';
import { withLatestFrom } from 'rxjs/operators';
import { finalize } from 'rxjs/operators';
import { of } from 'rxjs';
//-- **NgRx Data Store** ------------------------------------------------------------------------//
import { Actions, ofType, createEffect } from '@ngrx/effects';
import { AppState } from '../../app.reducer';
import { Store } from '@ngrx/store';
import * as AccessActions from './access.actions';
import * as ErrorActions from '../../error/store/error.actions';
import * as CoreActions from '../../core/store/core.actions';
//-- **NgRx Selectors** -------------------------------------------------------------------------//
import { selectCurrentUser } from '../../user/store/user.selectors';
import { selectAccessObj, selectCurrentAccessList } from './access.selectors';
//-- **Services/Helpers** -----------------------------------------------------------------------//
import { AccessDataObjHelper } from '../helpers/access-data-obj.helper';
import { FirebaseHelper } from '../../shared/helpers/firebase.helper';
import { AccessService } from '../services/access.service';
import { UiHelper } from '../../shared/helpers/ui.helper';
import { EmailDataObjHelper } from './../../email/helpers/email-data-obj.helper';
//-- **Data Models** ----------------------------------------------------------------------------//
import { initialLoadingModalConfig } from './../../core/models/core.model';
import { AccessDb, accessPermissionOptions } from '../models/access.model';

@Injectable()

/*****************************************************************************************************************************************
** Access Action Que                                                                                                                   
** (1)Que Listens for Access actions to come in with their payload found in access.actions.ts                                       
** (2)Que Processes Access actions USUALLY doing the following:                                                                       
**    -Enriches data payload via access-data-obj-helper.ts                                                                          
**    -Performs API service call                                                                                                      
**      -On success                                                                                                                    
**         -enriches api server response via (access)-data-obj-helper.ts                                                              
**         -dispatches corresponding success action with payload which usually updates the access state variables access.reducer.ts 
**           -On state variable update, access state variable selectors(access.selectors.ts) will update all of it's subscribers    
**      -On error dispatches corresponding error action                                                                                 
******************************************************************************************************************************************/
export class AccessEffects {
  constructor(
    private actions$: Actions,
    private uiHelper: UiHelper,
    private store: Store<AppState>,
    private firebaseHelper: FirebaseHelper,
    private accessService: AccessService,
    private accessDataObjHelper: AccessDataObjHelper,
    private emailDataObjHelper: EmailDataObjHelper,
  ) { }



  //-- Get Access Array ------------------------------------------------------------------------------------------>
  getAccessArray$ = createEffect(() => this.actions$.pipe(
    ofType<AccessActions.GetAccessArray>(AccessActions.AccessActionTypes.GET_ACCESS_ARRAY),
    tap(() => {
        this.store.dispatch(new CoreActions.SetLoadingModalConfig({loadingModalConfig: { show: true, message: 'Loading...' }}));
    }),
    withLatestFrom(this.store.select(selectCurrentUser), this.store.select(selectCurrentAccessList)),
    switchMap(([action, currentUser, accessList]) => {
      // console.log('**getAccessArray$**-action', action);




      // if (communityIds?.length > 0) {
        //-------------------------------------------------------------------------------------------------------------------------------------------------------->
        return this.accessService.getAccessArray().pipe(
          take(1),
          switchMap((accessResponse) => {
            const enrichedAccessArray: AccessDb[] = this.accessDataObjHelper.enrichAccessServerResponse(accessResponse);

            console.log('**getAccessArray$**-enrichedAccessArray', enrichedAccessArray);

            return [
              new AccessActions.GetAccessArraySuccess({ accessArray: [...enrichedAccessArray] }),
              new CoreActions.SetLoadingModalConfig({ loadingModalConfig: { ...initialLoadingModalConfig } })
            ]
          }),
          //-- Catch Error -------------------------------->
          catchError(error => {
            console.log('error in getAccessArray$', error);
            this.uiHelper.displayErrorAlert(error.message);
            return of(new ErrorActions.HandleError({
              error: { ...error },
              actionType: action.type,
              payload: null,
              insertError: true
            }));
          })
        );
      // } 

    }),
  ));

  //-- Get Access ------------------------------------------------------------------>
  getAccess$ = createEffect(() => this.actions$.pipe(
    ofType<AccessActions.GetAccess>(AccessActions.AccessActionTypes.GET_ACCESS),
    tap(() => {
      this.store.dispatch(new CoreActions.SetLoadingModalConfig({loadingModalConfig: { show: true, message: 'Loading...' }}));
    }),
    switchMap((action) => {
      const accessId = action?.payload?.accessId;

      // console.log('**getAccess$**-accessId', accessId);
      //----------------------------------------------------------------------------------------------------->
      return this.accessService.getAccess(accessId).pipe(
        switchMap((firebaseServerResponse) => {
          const enrichedAccessItems: AccessDb [] = this.accessDataObjHelper.enrichAccessServerResponse(firebaseServerResponse);
          const accessWithIdFound = (enrichedAccessItems?.length > 0);
          // console.log('**getAccess$**-enrichedAccessObj', enrichedAccessObj);

          if (accessWithIdFound) {
            return [
              new AccessActions.GetAccessSuccess({ accessObj: { ...enrichedAccessItems[0] } }),
              new CoreActions.SetLoadingModalConfig({ loadingModalConfig: { ...initialLoadingModalConfig } })
            ]
          } else {
            this.uiHelper.displayErrorAlert('Access Item not found');
            return [
              new CoreActions.SetLoadingModalConfig({ loadingModalConfig: { ...initialLoadingModalConfig } }),
              new CoreActions.NavigateToPreviousPage()
            ]
          }
        }),
        //-- Catch Error -------------------------------->
        catchError(error => {
          console.log('error in getAccess$', error);
          this.uiHelper.displayErrorAlert(error.message);
          return of(new ErrorActions.HandleError({ 
            error: { ...error }, 
            actionType: action.type, 
            payload: { ...action.payload }, 
            insertError: true }));
        })
      );
    }),
  ));

  //-- Create Access ------------------------------------------------------------------------------------------------------->
  createAccess$ = createEffect(() => this.actions$.pipe(
    ofType<AccessActions.CreateAccess>(AccessActions.AccessActionTypes.CREATE_ACCESS),
    tap(() => {
      this.store.dispatch(new CoreActions.SetLoadingModalConfig({loadingModalConfig: { show: true, message: 'Loading...' }}));
    }),
    withLatestFrom(this.store.select(selectCurrentUser)),
    switchMap(([action, currentUser]) => {
      const accessObj = action?.payload?.accessObj;
      const redirectUrl = action.payload?.redirectUrl;
      const redirectDirection = action?.payload?.redirectDirection;
      const successToastMessage = action?.payload?.successToastMessage;

      const dataObj = this.accessDataObjHelper.createAccess(accessObj, currentUser);
      console.log('**createAccess$**-dataObj', dataObj);

      const emailDataObjHelper = this.emailDataObjHelper.createNewAccessInviteEmail(dataObj?.stateUpdates?.accessObj,  currentUser, dataObj?.accessInsert?.lastEvent?.ids?.eventCorrelationId);
      console.log('**createAccess$**-emailDataObjHelper', emailDataObjHelper);


      //---------------------------------------------------------------------------------------------->
      return this.accessService.createAccessAndSendEmail(
        dataObj.accessInsert, 
        dataObj.eventInsert,
        emailDataObjHelper?.emailInsert,
        emailDataObjHelper?.eventInsert
        ).pipe(
        switchMap(() => {

          if (successToastMessage?.length > 0) {
            this.uiHelper.displayToast(successToastMessage, 1000, 'bottom');
          }

          return [
            new AccessActions.CreateAccessSuccess({ accessObj: dataObj.accessInsert }),
            new CoreActions.SetLoadingModalConfig({ loadingModalConfig: { ...initialLoadingModalConfig } })
          ]
        }),
        //-- Finalize ------------------------------------------------------------------------------------------------------------->
        finalize(() => {
          if (redirectUrl) {
            this.store.dispatch(new CoreActions.NavigateToPage({
              pageNavigation: {
                url: redirectUrl,
                animated: true,
                animatedDirection: redirectDirection,
                isRootPage: false,
                data: null,
              }
            }));
          }
        }),
        //-- Catch Error -------------------------------->
        catchError(error => {
          console.log('error in createAccess$', error);
          this.uiHelper.displayErrorAlert(error.message);
          return of(new ErrorActions.HandleError({
            error: { ...error },
            actionType: action.type,
            payload: null,
            insertError: true
          }));
        })
      );
    }),
  ));

  //-- Update Access --------------------------------------------------------------------->
  updateAccess$ = createEffect(() => this.actions$.pipe(
    ofType<AccessActions.UpdateAccess>(AccessActions.AccessActionTypes.UPDATE_ACCESS),
    tap(() => {
      this.store.dispatch(new CoreActions.SetLoadingModalConfig({loadingModalConfig: { show: true, message: 'Loading...' }}));
    }),
    withLatestFrom(this.store.select(selectAccessObj),  this.store.select(selectCurrentUser)),
    switchMap(([action, originalAccessObj, currentUser]) => {
      const accessObj = action?.payload?.accessObj;
      const redirectUrl = action?.payload?.redirectUrl;
      const redirectDirection = action?.payload?.redirectDirection;
      const successToastMessage = action?.payload?.successToastMessage;

      const dataObj = this.accessDataObjHelper.updateAccess(accessObj, originalAccessObj, currentUser);
      console.log('**updateAccess$**-dataObj', dataObj);
      //------------------------------------------------------------------------------------------------------>
      return this.accessService.updateAccess(dataObj.accessUpdate, dataObj.eventInsert).pipe(
        switchMap(() => {

          if (successToastMessage?.length > 0) {
            this.uiHelper.displayToast(successToastMessage, 1000, 'bottom');
          }

          return [
            new AccessActions.UpdateAccessSuccess({ accessObj: dataObj.stateUpdates.accessObj }),
            new CoreActions.SetLoadingModalConfig({ loadingModalConfig: { ...initialLoadingModalConfig } }),
          ]
        }),
        //-- Finalize ------------------------------------------------------------------------------------------------------------->
        finalize(() => {
          if (redirectUrl) {
            this.store.dispatch(new CoreActions.NavigateToPage({
              pageNavigation: {
                url: redirectUrl,
                animated: true,
                animatedDirection: redirectDirection,
                isRootPage: false,
                data: null,
              }
            }));
          }
        }),
        //-- Catch Error --------------------------------->
        catchError(error => {
          console.log('error in updateAccess$', error);
          this.uiHelper.displayErrorAlert(error.message);
          return of(new ErrorActions.HandleError({
            error: { ...error },
            actionType: action.type,
            payload: { ...action.payload },
            insertError: true
          }));
        })
      );
    }),
  ));


  //-- Delete Access --------------------------------------------------------------------->
  deleteAccess$ = createEffect(() => this.actions$.pipe(
    ofType<AccessActions.DeleteAccess>(AccessActions.AccessActionTypes.DELETE_ACCESS),
    tap(() => {
            this.store.dispatch(new CoreActions.SetLoadingModalConfig({loadingModalConfig: { show: true, message: 'Loading...' }}));
    }),
    withLatestFrom(this.store.select(selectCurrentUser)),
    switchMap(([action, currentUser]) => {
      const accessObj = action?.payload?.accessObj;
      const redirectUrl = action?.payload?.redirectUrl;
      const redirectDirection = action?.payload?.redirectDirection;
      const successToastMessage = action?.payload?.successToastMessage;

      const dataObj = this.accessDataObjHelper.deleteAccess(accessObj, currentUser);
      console.log('**deleteAccess$**-dataObj', dataObj);
      //------------------------------------------------------------------------------------------------------>
      return this.accessService.deleteAccess(dataObj.stateUpdates.accessObj.id, dataObj.eventInsert).pipe(
        switchMap(() => {

          if (successToastMessage?.length > 0) {
            this.uiHelper.displayToast(successToastMessage, 1000, 'bottom');
          }
                    
          return [
            new AccessActions.DeleteAccessSuccess({ accessObj: dataObj.stateUpdates.accessObj }),
            new CoreActions.SetLoadingModalConfig({ loadingModalConfig: { ...initialLoadingModalConfig } })          ]
        }),
        //-- Finalize ------------------------------------------------------------------------------------------------------------->
        finalize(() => {
          if (redirectUrl) {
            this.store.dispatch(new CoreActions.NavigateToPage({
              pageNavigation: {
                url: redirectUrl,
                animated: true,
                animatedDirection: redirectDirection,
                isRootPage: false,
                data: null,
              }
            }));
          }
        }),
        //-- Catch Error --------------------------------->
        catchError(error => {
          console.log('error in deleteAccess$', error);
          this.uiHelper.displayErrorAlert(error.message);
          return of(new ErrorActions.HandleError({
            error: { ...error },
            actionType: action.type,
            payload: { ...action.payload },
            insertError: true
          }));
        })
      );
    }),
  ));  
}
