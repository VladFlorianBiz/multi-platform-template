/*************************************************************************************************
** Imports                                                                                      **
**************************************************************************************************/
//-- **Core** -----------------------------------------------------------------------------------//
import { Injectable } from '@angular/core';
import { tap, switchMap, catchError } from 'rxjs/operators';
import { withLatestFrom } from 'rxjs/operators';
import { finalize } from 'rxjs/operators';
import { of } from 'rxjs';
//-- **NgRx Data Store** ------------------------------------------------------------------------//
import { Actions, ofType, createEffect } from '@ngrx/effects';
import { AppState } from '../../app.reducer';
import { Store } from '@ngrx/store';
import * as UserActions from './user.actions';
import * as ErrorActions from '../../error/store/error.actions';
import * as CoreActions from '../../core/store/core.actions';
//-- **NgRx Selectors** -------------------------------------------------------------------------//
import { selectCurrentUser, selectUserObj } from './user.selectors';
//-- **Services/Helpers** -----------------------------------------------------------------------//
import { UserDataObjHelper } from '../helpers/user-data-obj.helper';
import { FirebaseHelper } from '../../shared/helpers/firebase.helper';
import { UserService } from '../services/user.service';
import { UiHelper } from '../../shared/helpers/ui.helper';
//-- **Data Models** ----------------------------------------------------------------------------//
import { initialLoadingModalConfig } from './../../core/models/core.model';
import { UserDb } from '../models/user.model';

@Injectable()

/*****************************************************************************************************************************************
** User Action Que                                                                                                                   
** (1)Que Listens for User actions to come in with their payload found in user.actions.ts                                       
** (2)Que Processes User actions USUALLY doing the following:                                                                       
**    -Enriches data payload via user-data-obj-helper.ts                                                                          
**    -Performs API service call                                                                                                      
**      -On success                                                                                                                    
**         -enriches api server response via (user)-data-obj-helper.ts                                                              
**         -dispatches corresponding success action with payload which usually updates the user state variables user.reducer.ts 
**           -On state variable update, user state variable selectors(user.selectors.ts) will update all of it's subscribers    
**      -On error dispatches corresponding error action                                                                                 
******************************************************************************************************************************************/
export class UserEffects {
  constructor(
    private actions$: Actions,
    private uiHelper: UiHelper,
    private store: Store<AppState>,
    private firebaseHelper: FirebaseHelper,
    private userService: UserService,
    private userDataObjHelper: UserDataObjHelper,
  ) { }



  //-- Get User Array ------------------------------------------------------------------------------------------>
  getUserArray$ = createEffect(() => this.actions$.pipe(
    ofType<UserActions.GetUserArray>(UserActions.UserActionTypes.GET_USER_ARRAY),
    tap(() => {
        this.store.dispatch(new CoreActions.SetLoadingModalConfig({loadingModalConfig: { show: true, message: 'Loading...' }}));
    }),
    switchMap((action) => {
      // console.log('**getUserArray$**-action', action);
      //-------------------------------------------------------------------------------------------------------------------------------------------------------->
      return this.userService.getUserArray().pipe(
        switchMap((firebaseServerResponse) => {
          const enrichedUserArray: UserDb[] = this.firebaseHelper.enrichFirebaseRes(firebaseServerResponse);

          // console.log('**getUserArray$**-enrichedUserArray', enrichedUserArray);

          return [
            new UserActions.GetUserArraySuccess({ userArray: [...enrichedUserArray] }),
            new CoreActions.SetLoadingModalConfig({ loadingModalConfig: { ...initialLoadingModalConfig } })
          ]
        }),
        //-- Catch Error -------------------------------->
        catchError(error => {
          console.log('error in getUserArray$', error);
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

  //-- Get User ------------------------------------------------------------------>
  getUser$ = createEffect(() => this.actions$.pipe(
    ofType<UserActions.GetUser>(UserActions.UserActionTypes.GET_USER),
    tap(() => {
      this.store.dispatch(new CoreActions.SetLoadingModalConfig({loadingModalConfig: { show: true, message: 'Loading...' }}));
    }),
    switchMap((action) => {
      const userId = action?.payload?.userId;

      // console.log('**getUser$**-userId', userId);
      //----------------------------------------------------------------------------------------------------->
      return this.userService.getUser(userId).pipe(
        switchMap((firebaseServerResponse) => {
          const enrichedUserItems: UserDb [] = this.userDataObjHelper.enrichUserServerResponse(firebaseServerResponse);
          const userWithIdFound = (enrichedUserItems?.length > 0);
          // console.log('**getUser$**-enrichedUserObj', enrichedUserObj);

          if (userWithIdFound) {
            return [
              new UserActions.GetUserSuccess({ userObj: { ...enrichedUserItems[0] } }),
              new CoreActions.SetLoadingModalConfig({ loadingModalConfig: { ...initialLoadingModalConfig } })
            ]
          } else {
            this.uiHelper.displayErrorAlert('User Item not found');
            return [
              new CoreActions.SetLoadingModalConfig({ loadingModalConfig: { ...initialLoadingModalConfig } }),
              new CoreActions.NavigateToPreviousPage()
            ]
          }
        }),
        //-- Catch Error -------------------------------->
        catchError(error => {
          console.log('error in getUser$', error);
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

  //-- Create User ------------------------------------------------------------------------------------------------------->
  createUser$ = createEffect(() => this.actions$.pipe(
    ofType<UserActions.CreateUser>(UserActions.UserActionTypes.CREATE_USER),
    tap(() => {
      this.store.dispatch(new CoreActions.SetLoadingModalConfig({loadingModalConfig: { show: true, message: 'Loading...' }}));
    }),
    withLatestFrom(this.store.select(selectCurrentUser)),
    switchMap(([action, currentUser]) => {
      const userObj = action?.payload?.userObj;
      const redirectUrl = action.payload?.redirectUrl;
      const redirectDirection = action?.payload?.redirectDirection;
      const successToastMessage = action?.payload?.successToastMessage;

      const dataObj = this.userDataObjHelper.createUser(userObj, currentUser);
      console.log('**createUser$**-dataObj', dataObj);
      //---------------------------------------------------------------------------------------------->
      return this.userService.createUser(dataObj.userInsert, dataObj.eventInsert).pipe(
        switchMap(() => {

          if (successToastMessage?.length > 0) {
            this.uiHelper.displayToast(successToastMessage, 1000, 'bottom');
          }

          return [
            new UserActions.CreateUserSuccess({ userObj: dataObj.userInsert }),
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
          console.log('error in createUser$', error);
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

  //-- Update User --------------------------------------------------------------------->
  updateUser$ = createEffect(() => this.actions$.pipe(
    ofType<UserActions.UpdateUser>(UserActions.UserActionTypes.UPDATE_USER),
    tap(() => {
      this.store.dispatch(new CoreActions.SetLoadingModalConfig({loadingModalConfig: { show: true, message: 'Loading...' }}));
    }),
    withLatestFrom(this.store.select(selectCurrentUser),  this.store.select(selectCurrentUser)),
    switchMap(([action, originalUserObj, currentUser]) => {
      const userObj = action?.payload?.userObj;
      const redirectUrl = action?.payload?.redirectUrl;
      const redirectDirection = action?.payload?.redirectDirection;
      const successToastMessage = action?.payload?.successToastMessage;


      const dataObj = this.userDataObjHelper.updateUser(userObj, originalUserObj, currentUser);
      console.log('**updateUser$**-dataObj', dataObj);
      //------------------------------------------------------------------------------------------------------>
      return this.userService.updateUser(dataObj.userUpdate, dataObj.eventInsert).pipe(
        switchMap(() => {

          if (successToastMessage?.length > 0) {
            this.uiHelper.displayToast(successToastMessage, 1000, 'bottom');
          }

          return [
            new UserActions.UpdateUserSuccess({ userObj: dataObj.stateUpdates.userObj }),
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
          console.log('error in updateUser$', error);
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


  //-- Delete User --------------------------------------------------------------------->
  deleteUser$ = createEffect(() => this.actions$.pipe(
    ofType<UserActions.DeleteUser>(UserActions.UserActionTypes.DELETE_USER),
    tap(() => {
            this.store.dispatch(new CoreActions.SetLoadingModalConfig({loadingModalConfig: { show: true, message: 'Loading...' }}));
    }),
    withLatestFrom(this.store.select(selectCurrentUser)),
    switchMap(([action, currentUser]) => {
      const userObj = action?.payload?.userObj;
      const redirectUrl = action?.payload?.redirectUrl;
      const redirectDirection = action?.payload?.redirectDirection;
      const successToastMessage = action?.payload?.successToastMessage;

      const dataObj = this.userDataObjHelper.deleteUser(userObj, currentUser);
      console.log('**deleteUser$**-dataObj', dataObj);
      //------------------------------------------------------------------------------------------------------>
      return this.userService.deleteUser(dataObj.stateUpdates.userObj.id, dataObj.eventInsert).pipe(
        switchMap(() => {

          if (successToastMessage?.length > 0) {
            this.uiHelper.displayToast(successToastMessage, 1000, 'bottom');
          }
                    
          return [
            new UserActions.DeleteUserSuccess({ userObj: dataObj.stateUpdates.userObj }),
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
          console.log('error in deleteUser$', error);
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
