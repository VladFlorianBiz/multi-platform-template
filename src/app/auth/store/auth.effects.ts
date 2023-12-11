
/*************************************************************************************************
** Imports                                                                                      **
**************************************************************************************************/
//-- **Core** -----------------------------------------------------------------------------------//
import { Injectable } from '@angular/core';
import { map, tap, switchMap, catchError, take } from 'rxjs/operators';
import { of, forkJoin, throwError } from 'rxjs';
import { withLatestFrom } from 'rxjs/operators';
import { finalize } from 'rxjs/operators';
//-- **Services/Helpers** -----------------------------------------------------------------------//
import { UserService } from './../../user/services/user.service';
import { AuthService } from './../services/auth.service';
import { AccessService } from './../../access/services/access.service';
import { AuthDataObjHelper } from '../helpers/auth-data-obj.helper';
import { UiHelper } from './../../shared/helpers/ui.helper';
import { AccessDataObjHelper } from './../../access/helpers/access-data-obj.helper';
import { UserDataObjHelper } from '../../user/helpers/user-data-obj.helper';
//-- **Data Store** -----------------------------------------------------------------------------//
import { Actions, ofType, createEffect } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { AppState } from './../../app.reducer';
import * as AuthActions from './auth.actions';
import * as UserActions from './../../user/store/user.actions';
import * as ErrorActions from './../../error/store/error.actions';
import * as CoreActions from './../../core/store/core.actions';
import * as AccessActions from './../../access/store/access.actions';
import { selectDynamicLinkObj } from './auth.selectors';
import { selectNetworkConnectionObj } from './../../core/store/core.selectors';
//-- **Data Models** ----------------------------------------------------------------------------//
import { initialNavBarConfig, navBarTypeOptions } from './../../core/models/core.model';
import { initialDynamicLinkObj, dynamicLinkModeOptions, AuthDb } from './../models/auth.model';
import { initialLoadingModalConfig } from './../../core/models/core.model';
import { AccessDb } from '../../access/models/access.model';
import { mediaTypeOptions } from '../../media/models/media.model';
import { UserDb } from '../../user/models/user.model';

@Injectable()
/*****************************************************************************************************************************************
** Auth Action Que                                                                                                                      **
** (1)Que Listens for Auth actions to come in with their payload found in auth.actions.ts                                               **
** (2)Que Processes Feature actions USUALLY doing the following:                                                                        **
**    -Enriches data payload via auth-data-obj-helper.ts                                                                                **
**    -Performs API service call                                                                                                        **
**      -On success                                                                                                                     **
**         -enriches api server response via auth-data-obj-helper.ts                                                                    **
**         -dispatches corresponding success action with payload which usually updates the feature state variables auth.reducer.ts      **
**           -On state variable update, feature state variable selectors(auth.selectors.ts) will update all of it's subscribers         **
**      -On error dispatches corresponding error action                                                                                 **
******************************************************************************************************************************************/
export class AuthEffects {
  constructor(
    private actions$: Actions,
    private store: Store<AppState>,
    private authService: AuthService,
    private userService: UserService,
    private authDataObjHelper: AuthDataObjHelper,
    private uiHelper: UiHelper,
    private userDataObjHelper: UserDataObjHelper,
    private accessService: AccessService,
    private accessDataObjHelper: AccessDataObjHelper,
  ) { }

  //---------------------------------------------------------------------------------------------------------------------------------------------->
  //-- Login Action ------------------------------------------------------------------------------------------------------------------------------>
  login$ = createEffect(() => this.actions$.pipe(
    ofType<AuthActions.Login>(AuthActions.AuthActionTypes.LOGIN),
    tap(() => {
      this.store.dispatch(new CoreActions.SetLoadingModalConfig({ loadingModalConfig: { show: true, message: 'Loading...' } }));
    }),
    withLatestFrom(this.store.select(selectNetworkConnectionObj)),
    switchMap(([action, deviceId]) => {
      const credentials = action.payload;

      return this.authService.setPersistence().pipe(
        take(1),
        switchMap(() => {
          //#3 Login --------------------------------------------------------------------------------------------------------------------------->
          return this.authService.login(credentials.email, credentials.password).pipe(
            take(1),
            map((authRes: any) => {
              return authRes.user.toJSON();
            }),
            switchMap((authUser: AuthDb) => {
              if (!authUser.emailVerified) {
                this.store.dispatch(new CoreActions.SetLoadingModalConfig({ loadingModalConfig: { ...initialLoadingModalConfig } }));
                this.uiHelper.displayMessageAlert('Email Unverified', 'Check your main email ' + credentials.email + ' and verify your account.');
                return this.authService.sendEmailVerification().pipe(
                  take(1),
                  switchMap(() => {
                    console.log('send email verification!! :)')
                    return of(new AuthActions.ActionSuccess());
                  }),
                  catchError(error => throwError(error))
                )
              }
              //--- Email Is verified 
              else {
                //#4 Get User Details + accessProfiles --------------------------------------------------------------------------------//
                return forkJoin([
                  this.userService.getUserByEmail(authUser.email).pipe(take(1), catchError(error => throwError(error))),
                  this.accessService.getAccessByEmail(authUser.email?.toLowerCase()).pipe(take(1), catchError(error => throwError(error))),
                ]).pipe(
                  take(1),
                  switchMap(([user, accessList]) => {

                    const enrichedUser: UserDb = this.userDataObjHelper.enrichUserServerResponse(user)[0];
                    console.log('****', enrichedUser)
                    const enrichedAccessList: AccessDb[] = this.accessDataObjHelper.enrichAccessServerResponse(accessList);
                    console.log('****enrichedAccessList', enrichedAccessList)

                    const accessItemsNotInitialized = enrichedAccessList?.filter(item => item.name == null)
                    const mustInitializeAccessItems = (accessItemsNotInitialized?.length > 0);

                    const userMainLinkedMedia = enrichedUser?.linkedMedia?.filter(item => item?.type == mediaTypeOptions.accessMainMedia)

                    //---**********************************
                    //-- Must Initialize Some Access Items
                    if (mustInitializeAccessItems) {
                      const toUpdateAccessItems = accessItemsNotInitialized?.map(item => {
                        const accessMainLinkedMedia = item?.linkedMedia?.filter(item => item?.type == mediaTypeOptions.accessMainMedia)
                        const hasMainLinkedMedia = (accessMainLinkedMedia?.length > 0);

                        const linkedMedia = (hasMainLinkedMedia) ? [...item.linkedMedia] : [...item?.linkedMedia, ...userMainLinkedMedia]
                        const enrichedAccessItem: AccessDb = {
                          ...item,
                          name: enrichedUser?.fullName,
                          phone: enrichedUser?.phone,
                          linkedMedia
                        }

                        const accessDataObj = this.accessDataObjHelper.updateAccess(enrichedAccessItem, item, enrichedUser)

                        return {
                          accessUpdate: accessDataObj.accessUpdate,
                          eventInsert: accessDataObj.eventInsert
                        }
                      })

                      return this.accessService.updateMultipleAccessItems(toUpdateAccessItems).pipe(
                        take(1),
                        switchMap(() => {
                          const navBarConfig = {
                            ...initialNavBarConfig,
                            type: navBarTypeOptions.authenticated,
                          }

                          return [
                            new CoreActions.SetNavBarConfig({ navBarConfig }),
                            new UserActions.SetCurrentUser({ currentUser: { ...enrichedUser } }),
                            new AuthActions.LoginSuccess({ authUser: { ...authUser } }),
                            new AccessActions.SetCurrentAccessList({ currentAccessList: enrichedAccessList }),
                            new CoreActions.NavigateToPage({
                              pageNavigation: {
                                url: 'user/account',
                                animated: true,
                                animatedDirection: 'forward',
                                isRootPage: true,
                                data: null
                              }
                            }),
                            new CoreActions.SetLoadingModalConfig({ loadingModalConfig: { show: false } })
                          ];
                        }),
                        catchError(error => throwError(error))
                      )
                    }

                    else {
                      //---***************************************
                      //-- All Access Items Have been initialized 
                      console.log('enrichedUser', enrichedUser);
                      console.log('enrichedAccessProfiles', enrichedAccessList);
                      const navBarConfig = {
                        ...initialNavBarConfig,
                        type: navBarTypeOptions.authenticated,
                      }

                      return [
                        new CoreActions.SetNavBarConfig({ navBarConfig }),
                        new UserActions.SetCurrentUser({ currentUser: { ...enrichedUser } }),
                        new AuthActions.LoginSuccess({ authUser: { ...authUser } }),
                        new AccessActions.SetCurrentAccessList({ currentAccessList: enrichedAccessList }),
                        new CoreActions.NavigateToPage({
                          pageNavigation: {
                            url: 'user/account',
                            animated: true,
                            animatedDirection: 'forward',
                            isRootPage: true,
                            data: null
                          }
                        }),
                        new CoreActions.SetLoadingModalConfig({ loadingModalConfig: { show: false } })
                      ];
                    }
                  }),
                  catchError(error => throwError(error))
                )
              }
            }),
            catchError(error => throwError(error))
          );
        }),
        catchError(error => {
          console.log('error login$ Online Scenario', error);
          this.uiHelper.displayErrorAlert(error.message);
          return of(new ErrorActions.HandleError({ error: { ...error }, actionType: action.type, payload: { ...action.payload }, insertError: false }));
        })
      )
    }),
  ));

  //------------LOGOUT---------------------------------------//
  logOut$ = createEffect(() => this.actions$.pipe(
    ofType<AuthActions.Logout>(AuthActions.AuthActionTypes.LOGOUT),
    tap(() => {
      this.store.dispatch(new CoreActions.SetLoadingModalConfig({ loadingModalConfig: { show: true, message: 'Loading...' } }));
    }),
    switchMap((action) => {
      //-------------------------------------------------------------------------------------------------------------------------------------------//
      return this.authService.logout().pipe(
        switchMap(() => {
          this.store.dispatch(new CoreActions.SetLoadingModalConfig({ loadingModalConfig: { ...initialLoadingModalConfig } }));;
          this.uiHelper.displayToast('Logged out successfully', 1000, 'bottom');
          return [
            new AuthActions.LogoutSuccess(),
            new CoreActions.SetNavBarConfig({
              navBarConfig: {
                type: navBarTypeOptions.blank,
                expand: true
              }
            }),
            new CoreActions.NavigateToPage({
              pageNavigation: {
                url: "/auth/login",
                animated: true,
                animatedDirection: 'back',
                isRootPage: true,
                data: null
              }
            }),
          ]
        }),
        catchError(error => {
          // console.log('error logOut$', error);
          this.uiHelper.displayErrorAlert(error.message);
          return of(new ErrorActions.HandleError({ error: { ...error }, actionType: action.type, payload: { ...action.payload }, insertError: false }));
        }),
      );
    })
  ));

  //----------------------SIGN UP---------------------------------//
  signUp$ = createEffect(() => this.actions$.pipe(
    ofType<AuthActions.SignUp>(AuthActions.AuthActionTypes.SIGN_UP),
    tap(() => {
      this.store.dispatch(new CoreActions.SetLoadingModalConfig({ loadingModalConfig: { show: true, message: 'Loading...' } }));
      // this.audioHelper.play('save');
    }),
    switchMap((action) => {
      const signUpFormObj = action.payload.signUpFormObj;
      //#1 Sign up-----------------------------------------------------------------------//
      return this.authService.signup(signUpFormObj.email, signUpFormObj.password).pipe(
        map((firebaseRes: any) => {
          console.log("firebaseRes", firebaseRes)
          return (typeof (firebaseRes.user) !== 'undefined')
            ? firebaseRes.user.toJSON()
            : firebaseRes;
        }),
        switchMap((authUser: AuthDb) => {
          const dataObj = this.authDataObjHelper.userSignUp(signUpFormObj, authUser.uid);
          console.log("dataObj", dataObj)
          //#2 Insert User In UserDb + Send Email Verification Email ----------------------------------------------------------------------------------//
          return forkJoin([
            this.userService.createUser(dataObj.userInsert, dataObj.eventInsert).pipe(take(1), catchError(error => throwError(error))),
            this.authService.sendEmailVerification().pipe(take(1), catchError(error => throwError(error)))
          ]).pipe(
            take(1),
            switchMap(() => {
              this.store.dispatch(new CoreActions.SetLoadingModalConfig({ loadingModalConfig: { ...initialLoadingModalConfig } }))

              this.store.dispatch(new CoreActions.NavigateToPage({
                pageNavigation: {
                  url: "/auth/login",
                  animated: true,
                  animatedDirection: 'back',
                  isRootPage: true,
                  data: null,
                }
              }));

              this.uiHelper.displayMessageAlert('Account created!', 'Check your email for verification link');
              return [
                new AuthActions.SignUpSuccess(),
                new CoreActions.NavigateToPage({
                  pageNavigation: {
                    url: "/auth/login",
                    animated: true,
                    animatedDirection: 'back',
                    isRootPage: true,
                    data: null
                  }
                }),
              ]
            }),
            catchError(error => {
              return throwError(error);
            }),
          );
        }),
        catchError(error => {
          // console.log('error in signUp', error);
          const safePayload = action.payload;
          delete safePayload.signUpFormObj.password;
          delete safePayload.signUpFormObj.passwordConfirm;

          this.uiHelper.displayErrorAlert(error?.message ?? error);
          return of(new ErrorActions.HandleError({ error: { ...error }, actionType: action.type, payload: { ...action.payload }, insertError: true }));
        })
      );
    }),
  ));

  // ------------FORGOT PASSWORD----------------------------------------------//
  forgotPassword$ = createEffect(() => this.actions$.pipe(
    ofType<AuthActions.ForgotPassword>(AuthActions.AuthActionTypes.FORGOT_PASSWORD),
    tap(() => {
      this.store.dispatch(new CoreActions.SetLoadingModalConfig({ loadingModalConfig: { show: true, message: 'Loading...' } }));
      // this.audioHelper.play('save');
    }),
    switchMap((action) => {
      const email = action.payload.email;
      //----------------------------------------------------------------------------------------------------------------------------------------------//
      return this.authService.forgotPassword(email).pipe(
        switchMap(() => {
          this.store.dispatch(new CoreActions.SetLoadingModalConfig({ loadingModalConfig: { ...initialLoadingModalConfig } }));;
          this.uiHelper.displayToast('Password Reset Link Sent!  Check your  email at ' + email, 4000, 'bottom');
          return of(new AuthActions.ActionSuccess());
        }),
        catchError(error => {
          console.log('error in forgotPassword$', error);
          this.uiHelper.displayErrorAlert(error.message);
          return of(new ErrorActions.HandleError({ error: { ...error }, actionType: action.type, payload: { ...action.payload }, insertError: false }));
        }),
      )
    }),
  ));

  //----------- Change Password ---------------------------------------------------------------//
  changePassword$ = createEffect(() => this.actions$.pipe(
    ofType<AuthActions.ChangePassword>(AuthActions.AuthActionTypes.CHANGE_PASSWORD),
    tap(() => {
      this.store.dispatch(new CoreActions.SetLoadingModalConfig({ loadingModalConfig: { show: true, message: 'Loading...' } }));
      // this.audioHelper.play('save');
    }),
    withLatestFrom(this.store.select(selectDynamicLinkObj)),
    switchMap(([action, dynamicLinkObj]) => {
      const password = action.payload.password;
      //-------------------------------------------------------------------------------------------------------------------------------------------//
      return this.authService.changePassword(dynamicLinkObj.oobCode, password).pipe(
        switchMap(() => {
          return [
            new AuthActions.ChangePasswordSuccess(),
            new CoreActions.NavigateToPage({
              pageNavigation: {
                url: "/auth/login",
                animated: true,
                animatedDirection: 'back',
                isRootPage: true,
                data: null
              }
            }),
          ]
        }),
        finalize(() => {
          this.store.dispatch(new CoreActions.SetLoadingModalConfig({ loadingModalConfig: { ...initialLoadingModalConfig } }));;
          this.uiHelper.displayMessageAlert('Successful Password Change', 'Login again with your new password');
        }),
        catchError(error => {
          // console.log('error logOut$', error);
          this.uiHelper.displayErrorAlert(error?.message ?? error);
          return of(new ErrorActions.HandleError({ error: { ...error }, actionType: action.type, payload: { ...action.payload }, insertError: false }));
        }),
      );
    })
  ));

  //----------- Verify Email --------------------------------------------//
  verifyEmail$ = createEffect(() => this.actions$.pipe(
    ofType<AuthActions.VerifyEmail>(AuthActions.AuthActionTypes.VERIFY_EMAIL),
    tap(() => {
      //       this.store.dispatch(new CoreActions.SetLoadingModalConfig({loadingModalConfig: { show: true, message: 'Loading...' }}));
    }),
    switchMap((action) => {
      const oodCode = action.payload.oodCode;
      //--------------------------------------------------------------------------------------------------------------------------------------------//
      return this.authService.verifyEmail(oodCode).pipe(
        switchMap(() => {
          this.store.dispatch(new CoreActions.SetLoadingModalConfig({ loadingModalConfig: { ...initialLoadingModalConfig } }));;
          return of(new AuthActions.VerifyEmailSuccess());
        }),
        catchError(error => {
          // console.log('error verifyEmail$', error);
          this.uiHelper.displayErrorAlert(error?.message ?? error);
          return of(new ErrorActions.HandleError({ error: { ...error }, actionType: action.type, payload: { ...action.payload }, insertError: false }));
        }),
      );
    })
  ));

  //----------- Verify Dynamic Link Code -------------------------------------------------------//
  verifyDynamicLinkCode$ = createEffect(() => this.actions$.pipe(
    ofType<AuthActions.VerifyDynamicLinkCode>(AuthActions.AuthActionTypes.VERIFY_DYNAMIC_LINK_CODE),
    tap(() => {
      this.store.dispatch(new CoreActions.SetLoadingModalConfig({ loadingModalConfig: { show: true, message: 'Loading...' } }));
    }),
    switchMap((action) => {
      const dynamicLinkObj = { ...initialDynamicLinkObj, ...action.payload.dynamicLinkObj };
      console.log('dynamicLinkObj', dynamicLinkObj)
      //----------------------------------------------------------------------------------------------------------------------------------------------//
      return this.authService.verifyPasswordResetCode(dynamicLinkObj.oobCode).pipe(
        switchMap((email) => {


          console.log('verifyPasswordResetCode WORKED')

          const validDynamicLinkObj = { ...dynamicLinkObj, email, oobCodeValid: true };
          const redirectUrl = this.authDataObjHelper.determineRedirectUrl(validDynamicLinkObj);
          this.store.dispatch(new CoreActions.SetLoadingModalConfig({ loadingModalConfig: { ...initialLoadingModalConfig } }));


          console.log('redirectUrl', redirectUrl)
          this.store.dispatch(new CoreActions.NavigateToPage({
            pageNavigation: {
              url: redirectUrl,
              animated: true,
              animatedDirection: 'forward',
              isRootPage: false,
              data: null,
            }
          }));

          if (dynamicLinkObj.mode === dynamicLinkModeOptions.verifyEmail) {
            return [
              new AuthActions.VerifyEmail({ oodCode: dynamicLinkObj.oobCode }),
              new AuthActions.VerifyDynamicLinkCodeSuccess({ dynamicLinkObj: validDynamicLinkObj }),
            ]
          }


          else {
            console.log('enetered else')
            return [
              new AuthActions.VerifyDynamicLinkCodeSuccess({ dynamicLinkObj: validDynamicLinkObj }),
            ];
          }
        }),
        catchError(error => {
          this.store.dispatch(new CoreActions.SetLoadingModalConfig({ loadingModalConfig: { ...initialLoadingModalConfig } }));;
          console.log('error verifyDynamicLinkCode$', error);
          this.uiHelper.displayErrorAlert(error?.message ?? error);
          return [
            new ErrorActions.HandleError({ error: { ...error }, actionType: action.type, payload: { ...action.payload }, insertError: false }),
            new CoreActions.NavigateToPage({
              pageNavigation: {
                url: "/auth/login",
                animated: true,
                animatedDirection: 'back',
                isRootPage: true,
                data: null
              }
            }),
          ]
        }),
      );
    })
  ));

  //------------------Listen to Auth Changes ---------------------------------------------//
  listenToAuthChanges$ = createEffect(() => this.actions$.pipe(
    ofType<AuthActions.ListenToAuthChanges>(AuthActions.AuthActionTypes.LISTEN_TO_AUTH_CHANGES),
    switchMap((action) => {
      //-------------------------------------------------------------------------------------------------------------------------------------------------//
      return this.authService.listenToAuthChanges().pipe(
        map((firebaseRes: any) => {
          if (firebaseRes !== null) {
            return (typeof (firebaseRes.user) !== 'undefined')
              ? firebaseRes.user.toJSON()
              : firebaseRes;
          } else {
            return firebaseRes;
          }
        }),
        switchMap((authUser: AuthDb) => {
          if (!authUser) {
            this.store.dispatch(new AuthActions.SetUnauthenticated());
          }
          return of(new AuthActions.ListenToAuthChangesSuccess({ authUser: { ...authUser } }));
        }),
        catchError(error => {
          // console.log('error in listenToAccessChanges$', error);
          this.uiHelper.displayErrorAlert(error.message);
          return of(new ErrorActions.HandleError({ error: { ...error }, actionType: action.type, payload: { ...action.payload }, insertError: true }));
        })
      );
    }),
  ));
}
