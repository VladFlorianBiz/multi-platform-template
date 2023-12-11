/*************************************************************************************************
** Imports                                                                                      **
**************************************************************************************************/
//-- **Core** -----------------------------------------------------------------------------------//
import { Injectable } from '@angular/core';
import { tap, switchMap, catchError } from 'rxjs/operators';
import { withLatestFrom } from 'rxjs/operators';
import { finalize } from 'rxjs/operators';
import { NavController } from '@ionic/angular';
import { of } from 'rxjs';
//-- **NgRx Data Store** ------------------------------------------------------------------------//
import { Actions, ofType, createEffect } from '@ngrx/effects';
import { AppState } from '../../app.reducer';
import { Store } from '@ngrx/store';
import * as emailActions from './email.actions';
import * as ErrorActions from '../../error/store/error.actions';
import * as CoreActions from '../../core/store/core.actions';
//-- **NgRx Selectors** -------------------------------------------------------------------------//
import { selectCurrentUser } from '../../user/store/user.selectors';
import { selectEmailObj } from './email.selectors';
//-- **Services/Helpers** -----------------------------------------------------------------------//
import { EmailDataObjHelper } from '../helpers/email-data-obj.helper';
import { FirebaseHelper } from '../../shared/helpers/firebase.helper';
import { EmailService } from '../services/email.service';
import { UiHelper } from '../../shared/helpers/ui.helper';
//-- **Data Models** ----------------------------------------------------------------------------//
import { EmailDb } from '../models/email.model';
import { initialLoadingModalConfig } from './../../core/models/core.model';

@Injectable()

/*****************************************************************************************************************************************
** Email Action Que                                                                                                                   
** (1)Que Listens for Email actions to come in with their payload found in email.actions.ts                                       
** (2)Que Processes Email actions USUALLY doing the following:                                                                       
**    -Enriches data payload via email-data-obj-helper.ts                                                                          
**    -Performs API service call                                                                                                      
**      -On success                                                                                                                    
**         -enriches api server response via (email)-data-obj-helper.ts                                                              
**         -dispatches corresponding success action with payload which usually updates the email state variables email.reducer.ts 
**           -On state variable update, email state variable selectors(email.selectors.ts) will update all of it's subscribers    
**      -On error dispatches corresponding error action                                                                                 
******************************************************************************************************************************************/
export class EmailEffects {
  constructor(
    private actions$: Actions,
    private uiHelper: UiHelper,
    private store: Store<AppState>,
    private navCtrl: NavController,
    private firebaseHelper: FirebaseHelper,
    private emailService: EmailService,
    private emailDataObjHelper: EmailDataObjHelper,
  ) { }



  //-- Get Email Array ------------------------------------------------------------------------------------------>
  getEmailArray$ = createEffect(() => this.actions$.pipe(
    ofType<emailActions.GetEmailArray>(emailActions.EmailActionTypes.GET_EMAIL_ARRAY),
    tap(() => {
            this.store.dispatch(new CoreActions.SetLoadingModalConfig({loadingModalConfig: { show: true, message: 'Loading...' }}));
    }),
    switchMap((action) => {
      // console.log('**getEmailArray$**-action', action);
      //-------------------------------------------------------------------------------------------------------------------------------------------------------->
      return this.emailService.getEmailArray().pipe(
        switchMap((firebaseServerResponse) => {
          this.store.dispatch(new CoreActions.SetLoadingModalConfig({loadingModalConfig: {  ...initialLoadingModalConfig }}));
          const enrichedEmailArray: EmailDb[] = this.firebaseHelper.enrichFirebaseRes(firebaseServerResponse);

          console.log('**getEmailArray$**-enrichedEmailArray', enrichedEmailArray);
          return of(new emailActions.GetEmailArraySuccess({ emailArray: [...enrichedEmailArray] }));
        }),
        //-- Catch Error -------------------------------->
        catchError(error => {
          console.log('error in getEmailArray$', error);
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

  //-- Get Email ------------------------------------------------------------------>
  getEmail$ = createEffect(() => this.actions$.pipe(
    ofType<emailActions.GetEmail>(emailActions.EmailActionTypes.GET_EMAIL),
    tap(() => {
            this.store.dispatch(new CoreActions.SetLoadingModalConfig({loadingModalConfig: { show: true, message: 'Loading...' }}));
    }),
    switchMap((action) => {
      const emailId = action?.payload?.emailId;

      console.log('**getEmail$**-emailId', emailId);
      //----------------------------------------------------------------------------------------------------->
      return this.emailService.getEmail(emailId).pipe(
        switchMap((firebaseServerResponse) => {
          this.store.dispatch(new CoreActions.SetLoadingModalConfig({loadingModalConfig: {  ...initialLoadingModalConfig }}));
          const enrichedEmailObj: EmailDb = this.firebaseHelper.enrichFirebaseRes(firebaseServerResponse);
          // console.log('**getEmail$**-enrichedEmailObj', enrichedEmailObj);
          return of(new emailActions.GetEmailSuccess({ emailObj: { ...enrichedEmailObj } }));
        }),
        //-- Catch Error -------------------------------->
        catchError(error => {
          console.log('error in getEmail$', error);
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

  //-- Create Email -------------------------------------------------------------------->
  createEmail$ = createEffect(() => this.actions$.pipe(
    ofType<emailActions.CreateEmail>(emailActions.EmailActionTypes.CREATE_EMAIL),
    tap(() => {
            this.store.dispatch(new CoreActions.SetLoadingModalConfig({loadingModalConfig: { show: true, message: 'Loading...' }}));
    }),
    withLatestFrom(this.store.select(selectCurrentUser)),
    switchMap(([action, currentUser]) => {
      const emailObj = action?.payload?.emailObj;
      const redirectUrl = action.payload?.redirectUrl;
      const redirectDirection = action.payload?.redirectDirection;

      const dataObj = this.emailDataObjHelper.createEmail(emailObj, currentUser);
      console.log('**createEmail$**-dataObj', dataObj);
      //-------------------------------------------------------------------------------------------->
      return this.emailService.createEmail(dataObj.emailInsert, dataObj.eventInsert).pipe(
        switchMap(() => {
          this.store.dispatch(new CoreActions.SetLoadingModalConfig({loadingModalConfig: {  ...initialLoadingModalConfig }}));
          this.uiHelper.displayToast('Email was successfully created', 1000, 'bottom');
          return of(new emailActions.CreateEmailSuccess({ emailObj: dataObj.emailInsert }));
        }),
        //-- Finalize ------------------------------------------------------------------------------------------------------------->
        finalize(() => {
          if (redirectUrl) {
            (redirectDirection === 'forward') ? this.navCtrl.navigateForward(redirectUrl) : this.navCtrl.navigateBack(redirectUrl);
          }
        }),
        //-- Catch Error -------------------------------->
        catchError(error => {
          console.log('error in createEmail$', error);
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

  //-- Update Email --------------------------------------------------------------------->
  updateEmail$ = createEffect(() => this.actions$.pipe(
    ofType<emailActions.UpdateEmail>(emailActions.EmailActionTypes.UPDATE_EMAIL),
    tap(() => {
            this.store.dispatch(new CoreActions.SetLoadingModalConfig({loadingModalConfig: { show: true, message: 'Loading...' }}));
    }),
    withLatestFrom(this.store.select(selectEmailObj),  this.store.select(selectCurrentUser)),
    switchMap(([action, originalEmailObj, currentUser]) => {
      const emailObj = action?.payload?.emailObj;
      const redirectUrl = action.payload?.redirectUrl;
      const redirectDirection = action.payload?.redirectDirection;

      const dataObj = this.emailDataObjHelper.updateEmail(emailObj, originalEmailObj, currentUser);
      console.log('**updateEmail$**-dataObj', dataObj);
      //------------------------------------------------------------------------------------------------------>
      return this.emailService.updateEmail(dataObj.emailUpdate, dataObj.eventInsert).pipe(
        switchMap(() => {
          this.store.dispatch(new CoreActions.SetLoadingModalConfig({loadingModalConfig: {  ...initialLoadingModalConfig }}));
          this.uiHelper.displayToast('Email was successfully updated', 1000, 'bottom');
          return of(new emailActions.UpdateEmailSuccess({ emailObj: dataObj.stateUpdates.emailObj }));
        }),
        //-- Finalize ------------------------------------------------------------------------------------------------------------->
        finalize(() => {
          if (redirectUrl) {
            (redirectDirection === 'forward') ? this.navCtrl.navigateForward(redirectUrl) : this.navCtrl.navigateBack(redirectUrl);
          }
        }),
        //-- Catch Error --------------------------------->
        catchError(error => {
          console.log('error in updateEmail$', error);
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


  //-- Delete Email --------------------------------------------------------------------->
  deleteEmail$ = createEffect(() => this.actions$.pipe(
    ofType<emailActions.DeleteEmail>(emailActions.EmailActionTypes.DELETE_EMAIL),
    tap(() => {
            this.store.dispatch(new CoreActions.SetLoadingModalConfig({loadingModalConfig: { show: true, message: 'Loading...' }}));
    }),
    withLatestFrom(this.store.select(selectCurrentUser)),
    switchMap(([action, currentUser]) => {
      const emailObj = action?.payload?.emailObj;
      const redirectUrl = action.payload?.redirectUrl;
      const redirectDirection = action.payload?.redirectDirection;

      const dataObj = this.emailDataObjHelper.deleteEmail(emailObj,  currentUser);
      console.log('**deleteEmail$**-dataObj', dataObj);
      //------------------------------------------------------------------------------------------------------>
      return this.emailService.deleteEmail(dataObj.stateUpdates.emailObj.id, dataObj.eventInsert).pipe(
        switchMap(() => {
          this.store.dispatch(new CoreActions.SetLoadingModalConfig({loadingModalConfig: {  ...initialLoadingModalConfig }}));
          this.uiHelper.displayToast('Email was successfully deleted', 1000, 'bottom');
          return of(new emailActions.DeleteEmailSuccess({ emailObj: dataObj.stateUpdates.emailObj }));
        }),
        //-- Finalize ------------------------------------------------------------------------------------------------------------->
        finalize(() => {
          if (redirectUrl) {
            (redirectDirection === 'forward') ? this.navCtrl.navigateForward(redirectUrl) : this.navCtrl.navigateBack(redirectUrl);
          }
        }),
        //-- Catch Error --------------------------------->
        catchError(error => {
          console.log('error in deleteEmail$', error);
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
