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
import * as mediaActions from './media.actions';
import * as ErrorActions from '../../error/store/error.actions';
import * as CoreActions from '../../core/store/core.actions';
//-- **NgRx Selectors** -------------------------------------------------------------------------//
import { selectCurrentUser } from '../../user/store/user.selectors';
import { selectMediaObj } from './media.selectors';
//-- **Services/Helpers** -----------------------------------------------------------------------//
import { MediaDataObjHelper } from '../helpers/media-data-obj.helper';
import { FirebaseHelper } from '../../shared/helpers/firebase.helper';
import { MediaService } from '../services/media.service';
import { UiHelper } from '../../shared/helpers/ui.helper';
//-- **Data Models** ----------------------------------------------------------------------------//
import { MediaDb } from '../models/media.model';
import { initialLoadingModalConfig } from './../../core/models/core.model';

@Injectable()

/*****************************************************************************************************************************************
** Media Action Que                                                                                                                   
** (1)Que Listens for Media actions to come in with their payload found in media.actions.ts                                       
** (2)Que Processes Media actions USUALLY doing the following:                                                                       
**    -Enriches data payload via media-data-obj-helper.ts                                                                          
**    -Performs API service call                                                                                                      
**      -On success                                                                                                                    
**         -enriches api server response via (media)-data-obj-helper.ts                                                              
**         -dispatches corresponding success action with payload which usually updates the media state variables media.reducer.ts 
**           -On state variable update, media state variable selectors(media.selectors.ts) will update all of it's subscribers    
**      -On error dispatches corresponding error action                                                                                 
******************************************************************************************************************************************/
export class MediaEffects {
  constructor(
    private actions$: Actions,
    private uiHelper: UiHelper,
    private store: Store<AppState>,
    private navCtrl: NavController,
    private firebaseHelper: FirebaseHelper,
    private mediaService: MediaService,
    private mediaDataObjHelper: MediaDataObjHelper,
  ) { }



  //-- Get Media Array ------------------------------------------------------------------------------------------>
  getMediaArray$ = createEffect(() => this.actions$.pipe(
    ofType<mediaActions.GetMediaArray>(mediaActions.MediaActionTypes.GET_MEDIA_ARRAY),
    tap(() => {
      this.store.dispatch(new CoreActions.SetLoadingModalConfig({loadingModalConfig: { show: true, message: 'Loading...' }}));
    }),
    switchMap((action) => {
      // console.log('**getMediaArray$**-action', action);
      //-------------------------------------------------------------------------------------------------------------------------------------------------------->
      return this.mediaService.getMediaArray().pipe(
        switchMap((firebaseServerResponse) => {
          this.store.dispatch(new CoreActions.SetLoadingModalConfig({loadingModalConfig: {  ...initialLoadingModalConfig }}));

          this.store.dispatch(new CoreActions.SetLoadingModalConfig({loadingModalConfig: {  ...initialLoadingModalConfig }}))
          const enrichedMediaArray: MediaDb[] = this.firebaseHelper.enrichFirebaseRes(firebaseServerResponse);

          console.log('**getMediaArray$**-enrichedMediaArray', enrichedMediaArray);
          return of(new mediaActions.GetMediaArraySuccess({ mediaArray: [...enrichedMediaArray] }));
        }),
        //-- Catch Error -------------------------------->
        catchError(error => {
          console.log('error in getMediaArray$', error);
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

  //-- Get Media ------------------------------------------------------------------>
  getMedia$ = createEffect(() => this.actions$.pipe(
    ofType<mediaActions.GetMedia>(mediaActions.MediaActionTypes.GET_MEDIA),
    tap(() => {
            this.store.dispatch(new CoreActions.SetLoadingModalConfig({loadingModalConfig: { show: true, message: 'Loading...' }}));
    }),
    switchMap((action) => {
      const mediaId = action?.payload?.mediaId;

      console.log('**getMedia$**-mediaId', mediaId);
      //----------------------------------------------------------------------------------------------------->
      return this.mediaService.getMedia(mediaId).pipe(
        switchMap((firebaseServerResponse) => {
          this.store.dispatch(new CoreActions.SetLoadingModalConfig({loadingModalConfig: {  ...initialLoadingModalConfig }}));
          const enrichedMediaObj: MediaDb = this.firebaseHelper.enrichFirebaseRes(firebaseServerResponse);
          // console.log('**getMedia$**-enrichedMediaObj', enrichedMediaObj);
          return of(new mediaActions.GetMediaSuccess({ mediaObj: { ...enrichedMediaObj } }));
        }),
        //-- Catch Error -------------------------------->
        catchError(error => {
          console.log('error in getMedia$', error);
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

  //-- Create Media -------------------------------------------------------------------->
  createMedia$ = createEffect(() => this.actions$.pipe(
    ofType<mediaActions.CreateMedia>(mediaActions.MediaActionTypes.CREATE_MEDIA),
    tap(() => {
            this.store.dispatch(new CoreActions.SetLoadingModalConfig({loadingModalConfig: { show: true, message: 'Loading...' }}));
    }),
    withLatestFrom(this.store.select(selectCurrentUser)),
    switchMap(([action, currentUser]) => {
      const mediaObj = action?.payload?.mediaObj;
      const redirectUrl = action.payload?.redirectUrl;
      const redirectDirection = action.payload?.redirectDirection;

      const dataObj = this.mediaDataObjHelper.createMedia(mediaObj, currentUser);
      console.log('**createMedia$**-dataObj', dataObj);
      //-------------------------------------------------------------------------------------------->
      return this.mediaService.createMedia(dataObj.mediaInsert, dataObj.eventInsert).pipe(
        switchMap(() => {
          this.store.dispatch(new CoreActions.SetLoadingModalConfig({loadingModalConfig: {  ...initialLoadingModalConfig }}));
          this.uiHelper.displayToast('Media was successfully created', 1000, 'bottom');
          return of(new mediaActions.CreateMediaSuccess({ mediaObj: dataObj.mediaInsert }));
        }),
        //-- Finalize ------------------------------------------------------------------------------------------------------------->
        finalize(() => {
          if (redirectUrl) {
            (redirectDirection === 'forward') ? this.navCtrl.navigateForward(redirectUrl) : this.navCtrl.navigateBack(redirectUrl);
          }
        }),
        //-- Catch Error -------------------------------->
        catchError(error => {
          console.log('error in createMedia$', error);
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

  //-- Update Media --------------------------------------------------------------------->
  updateMedia$ = createEffect(() => this.actions$.pipe(
    ofType<mediaActions.UpdateMedia>(mediaActions.MediaActionTypes.UPDATE_MEDIA),
    tap(() => {
            this.store.dispatch(new CoreActions.SetLoadingModalConfig({loadingModalConfig: { show: true, message: 'Loading...' }}));
    }),
    withLatestFrom(this.store.select(selectMediaObj),  this.store.select(selectCurrentUser)),
    switchMap(([action, originalMediaObj, currentUser]) => {
      const mediaObj = action?.payload?.mediaObj;
      const redirectUrl = action.payload?.redirectUrl;
      const redirectDirection = action.payload?.redirectDirection;

      const dataObj = this.mediaDataObjHelper.updateMedia(mediaObj, originalMediaObj, currentUser);
      console.log('**updateMedia$**-dataObj', dataObj);
      //------------------------------------------------------------------------------------------------------>
      return this.mediaService.updateMedia(dataObj.mediaUpdate, dataObj.eventInsert).pipe(
        switchMap(() => {
          this.store.dispatch(new CoreActions.SetLoadingModalConfig({loadingModalConfig: {  ...initialLoadingModalConfig }}));
          this.uiHelper.displayToast('Media was successfully updated', 1000, 'bottom');
          return of(new mediaActions.UpdateMediaSuccess({ mediaObj: dataObj.stateUpdates.mediaObj }));
        }),
        //-- Finalize ------------------------------------------------------------------------------------------------------------->
        finalize(() => {
          if (redirectUrl) {
            (redirectDirection === 'forward') ? this.navCtrl.navigateForward(redirectUrl) : this.navCtrl.navigateBack(redirectUrl);
          }
        }),
        //-- Catch Error --------------------------------->
        catchError(error => {
          console.log('error in updateMedia$', error);
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


  //-- Delete Media --------------------------------------------------------------------->
  deleteMedia$ = createEffect(() => this.actions$.pipe(
    ofType<mediaActions.DeleteMedia>(mediaActions.MediaActionTypes.DELETE_MEDIA),
    tap(() => {
            this.store.dispatch(new CoreActions.SetLoadingModalConfig({loadingModalConfig: { show: true, message: 'Loading...' }}));
    }),
    withLatestFrom(this.store.select(selectCurrentUser)),
    switchMap(([action, currentUser]) => {
      const mediaObj = action?.payload?.mediaObj;
      const redirectUrl = action.payload?.redirectUrl;
      const redirectDirection = action.payload?.redirectDirection;

      const dataObj = this.mediaDataObjHelper.deleteMedia(mediaObj,  currentUser);
      console.log('**deleteMedia$**-dataObj', dataObj);
      //------------------------------------------------------------------------------------------------------>
      return this.mediaService.deleteMedia(dataObj.stateUpdates.mediaObj.id, dataObj.eventInsert).pipe(
        switchMap(() => {
          this.store.dispatch(new CoreActions.SetLoadingModalConfig({loadingModalConfig: {  ...initialLoadingModalConfig }}));
          this.uiHelper.displayToast('Media was successfully deleted', 1000, 'bottom');
          return of(new mediaActions.DeleteMediaSuccess({ mediaObj: dataObj.stateUpdates.mediaObj }));
        }),
        //-- Finalize ------------------------------------------------------------------------------------------------------------->
        finalize(() => {
          if (redirectUrl) {
            (redirectDirection === 'forward') ? this.navCtrl.navigateForward(redirectUrl) : this.navCtrl.navigateBack(redirectUrl);
          }
        }),
        //-- Catch Error --------------------------------->
        catchError(error => {
          console.log('error in deleteMedia$', error);
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


  //-- Delete Unlinked Media --------------------------------------------------------------------->
  deleteUnlinkedMedia$ = createEffect(() => this.actions$.pipe(
    ofType<mediaActions.DeleteUnlinkedMedia>(mediaActions.MediaActionTypes.DELETE_UNLINKED_MEDIA),
    tap(() => {
      //       this.store.dispatch(new CoreActions.SetLoadingModalConfig({loadingModalConfig: { show: true, message: 'Loading...' }}));
    }),
    withLatestFrom(this.store.select(selectCurrentUser)),
    switchMap(([action, currentUser]) => {
      const mediaObj = action?.payload?.unlinkedMedia;

      const dataObj = this.mediaDataObjHelper.deleteMedia(mediaObj, currentUser);
      console.log('**deleteUnlinkedMedia$**-dataObj', dataObj);
      //------------------------------------------------------------------------------------------------------>
      return this.mediaService.deleteMedia(dataObj.stateUpdates.mediaObj.id, dataObj.eventInsert).pipe(
        switchMap(() => {
          this.uiHelper.displayToast('File was successfully deleted', 1000, 'bottom');

          this.store.dispatch(new CoreActions.SetLoadingModalConfig({loadingModalConfig: {  ...initialLoadingModalConfig }}));
          // this.uiHelper.displayToast('Media was successfully deleted', 1000, 'bottom');
          return of(new mediaActions.DeleteUnlinkedMediaSuccess({ id: dataObj.stateUpdates.mediaObj?.id }));
        }),
        //-- Catch Error --------------------------------->
        catchError(error => {
          console.log('error in deleteUnlinkedMedia$', error);
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
