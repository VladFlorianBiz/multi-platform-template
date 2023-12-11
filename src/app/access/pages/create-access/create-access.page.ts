/*************************************************************************************************
** Imports                                                                                      **
**************************************************************************************************/
//-- **Core** -----------------------------------------------------------------------------------//
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { withLatestFrom } from 'rxjs/operators';
//-- **NgRx Data Store** ------------------------------------------------------------------------//
import { Store } from '@ngrx/store';
import { AppState } from '../../../app.reducer';
import * as AccessActions from '../../store/access.actions';

import * as CoreActions from './../../../core/store/core.actions';
//-- **NgRx Selectors** -------------------------------------------------------------------------//
import { selectUnlinkedMedia } from './../../../media/store/media.selectors';
import {  selectCurrentUser, selectWho } from './../../../user/store/user.selectors';
//-- **Data Models** ----------------------------------------------------------------------------//
import { AccessDb, accessPermissionOptions, accessPermissionOptionsArray, initialAccessDb } from './../../models/access.model';
import { MediaDb, initialMediaDb, mediaEvents } from './../../../media/models/media.model';
import { accessDatabaseName } from './../../models/access.model';
import { mediaTypeOptions } from './../../../media/models/media.model';
//-- **Helpers/Services** -----------------------------------------------------------------------//
import { FirebaseHelper } from './../../../shared/helpers/firebase.helper';
import { initialNavBarConfig, navBarTypeOptions } from '../../../core/models/core.model';
import { regexValidators } from '../../../shared/helpers/validators.helper';
import { selectCurrentAccess, selectCurrentAccessList } from '../../store/access.selectors';
import { selectIsMobileView } from '../../../core/store/core.selectors';


@Component({
  selector: 'app-create-access',
  templateUrl: './create-access.page.html',
  styleUrls: ['./create-access.page.scss'],
})

export class CreateAccessPage implements OnInit, OnDestroy {
  //---------------------------------------------------------------------------------------------->
  //-- Class Variables - Declare below and above constructor ------------------------------------->
  private destroy$: Subject<boolean> = new Subject<boolean>();
  formObj: UntypedFormGroup;
  formInitialized = false;
  inputTouchedOnce = {
     //add form fields in initForm() here as well
    email: null,
    permissions: null,
  }
  accessObj: AccessDb = {...initialAccessDb};
  accessId: string = null;

  accessPermissionOptionsArray = accessPermissionOptionsArray;
  accessPermissionOptions = accessPermissionOptions;

  // Flags --------------------------------->
  hideNavBarFlag: boolean = false;
  isMobileView: boolean;
  //------------------------------------------------->
  //-- Media ---------------------------------------->
  unlinkedMedia: MediaDb[] = [];
  mainMedia: MediaDb [] = [];
  otherMedia: MediaDb[] = []
  //------------------------------------------------->
  mediaEvents = mediaEvents;
  mediaAdditionalIds: any = {}
  mediaTypeOptions = mediaTypeOptions;
  rootStoragePathFolder = null;
  who: { id?: string; name?: string; } = {
    id: null,
    name: null
  };
  initialMediaDb = initialMediaDb;
  //-------------------------------------------------->

/**
* @constructor Page Constructor
* @description  Initialize Class and Dependencies(Imports), see SOME examples below.
*							- Helpers: UiHelper, AccessDataObjHelper, FirebaseHelper
*							- Services: AccessService
*							- Ionic: NavController, ModalController
*							- Form: FormBuilder
*							- State: Store<AppState>
* @return void
*/
  constructor(
    private store: Store<AppState>,
    private fb: FormBuilder,
    private firebaseHelper: FirebaseHelper,
  ) {
    // Run functions in class constructor(runs before ngOnInit & some imports me not be available) 
    //
   }

  /**
 * @method ngOnInit
 * @description Angular page life cycle method that runs after class and its dependencies have been initialized.
 *							Imports are available to be used at this point
 *							- can be used to initialize form
 *							- Can be used to subscribe to access selectors(access state variables/observable streams) 
 *							- Make sure you destroy any subscribed to streams on page destroy or else memory leaks can occur
 * @return void
 */
  ngOnInit(): void {
    const navBarConfig = {
      ...initialNavBarConfig,
      type: navBarTypeOptions.authenticated,
    }
    this.store.dispatch(new CoreActions.SetNavBarConfig({ navBarConfig }));



    this.store.select(selectIsMobileView).pipe(
      takeUntil(this.destroy$),
    ).subscribe((isMobileView) => {
      this.isMobileView = isMobileView;
      if (isMobileView) {
        this.hideNavBarFlag = true;
        const navBarConfig = {
          type: navBarTypeOptions.blank,
          expand: true
        }
        this.store.dispatch(new CoreActions.SetNavBarConfig({ navBarConfig }));
      } else {
        const navBarConfig = {
          ...initialNavBarConfig,
          type: navBarTypeOptions.authenticated,
        }
        this.store.dispatch(new CoreActions.SetNavBarConfig({ navBarConfig }));
        this.hideNavBarFlag = false
      }
    })

    //-------------------------------------------------------------------------------------------------------------------->
    //-- Used For Linking Any Uploaded Files with feature ---------------------------------------------------------------->
    this.accessId = this.firebaseHelper.generateFirebaseId();
    this.mediaAdditionalIds  = {
      accessId: this.accessId
    }
    this.rootStoragePathFolder = `${accessDatabaseName}/${this.accessId}/media`
    //--- Select All UnlinkedMedia Items --------------------------------------------------------------------------------->
    this.store.select(selectUnlinkedMedia).pipe(
      takeUntil(this.destroy$),
      withLatestFrom((this.store.select(selectWho)))
    ).subscribe(([_unlinkedMedia, who]) => {
      this.who = { ...who };
      this.unlinkedMedia = [..._unlinkedMedia];
      this.mainMedia = (_unlinkedMedia?.length > 0) 
      ? [...this.unlinkedMedia?.filter(item => item?.type === mediaTypeOptions.accessMainMedia)]
      : []
      //--------------------------------------------------------------------------------------------->
      this.otherMedia = (_unlinkedMedia?.length > 0) 
          ? [...this.unlinkedMedia?.filter(item => item.type === mediaTypeOptions.accessOtherMedia)]
          : [];
    })
    //-------------------------------------------------------------------------------------------------------------------->


    this.initForm();
  }


  /**
  * @method initForm
  * @description Initializes formObj by setting initial form values and, Sets form validation logic.
  *							   - Access form value in typescript e.g. this.formObj?.value?.name
  *							   - Access form value in HTML e.g. {{formObj?.value?.name}}
  * @return void
  */
  initForm(): void {
    //---------------------------------------------------------------------------/
    //**add any form fields that are added below in 'inputTouchedOnce' Object ***/
    this.formObj = this.fb.group({
      email: ['', [Validators.compose([Validators.pattern(regexValidators.email), Validators.required, Validators.minLength(1)])]],
      permissions: [[], []],
    });

    this.formInitialized = true;
  }



/**
* @method onInputBlur
* @description Checks if the form input has been touched at least once and then updates 'inputTouchedOnce' object.
*							   - When form input loses focus the ionBlur event occurs
*							   - HTML Example. <ion-input legacy="true"  (ionBlur)="onInputBlur('name')"></ion-input>
* @return void
*/
  onInputBlur(formControlName) {
    const inputHasBeenTouchedAtLeastOnce = this.inputTouchedOnce[formControlName] == true;
    const inputTouchedOnceLastValue = { ...this.inputTouchedOnce }

    if (!inputHasBeenTouchedAtLeastOnce || !this.formInitialized) {
      const formFieldTouchUpdateValue = (this.inputTouchedOnce[formControlName] == null)
        ? true
        : false;

      this.inputTouchedOnce = {
        ...inputTouchedOnceLastValue,
        [formControlName]: formFieldTouchUpdateValue
      }
    }
  }


  /**
  * @method goBack
  * @description Return to previous page using NavControl
  * @return void
  */
  goBack():void {
    this.store.dispatch(new CoreActions.NavigateToPreviousPage({ url: "/access/list" }));
  }



  onCheckboxSelectionMulti(permissionChange) {
      const selectedPermissions = [...this.formObj.value.permissions];
      const permissionAlreadySelected = selectedPermissions.includes(permissionChange);
      const updatedAccess = (permissionAlreadySelected)
        ? [...selectedPermissions.filter(ability => ability !== permissionChange)]
        : [...selectedPermissions, permissionChange];

      this.formObj.patchValue({
        permissions: [...updatedAccess],
      },{
        onlySelf: true
      })
  }


  /**
  * @method generateAccessObj
  * @param _formValue usually you want to pass this.formObj.value
  * @param _unlinkedMedia unlinked media items
  * @description generates a new access object with the current form values and any unlinked media items
  * @return AccessDb
  */
  generateAccessObj(_formValue, _unlinkedMedia): AccessDb {
    const formValue = {..._formValue};

    const unlinkedMedia = [..._unlinkedMedia]
    const linkedMedia = unlinkedMedia?.map(item => {
      return {
        id: item?.id,
        fileName: item?.fileName,
        fileExtension: item?.fileExtension, //**mediaTypeOptions**/ //e.g. 'mp4' | 'png'
        format: item?.format,               //**mediaFormatOptions** image | video | pdf
        downloadUrl: item?.downloadUrl,
        type: item?.type,                   //**mediaTypeOptions**/ userMainPhoto | userOtherPhotos | userMainVideos | accessMainPhoto | accessOtherPhotos etc
        originalFileName: item?.originalFileName
      }
    })

    //------------------------------------------------------------------------------------------------------------>
    const accessObj: AccessDb = {
      ...initialAccessDb,
      id: this.accessId,
      email: formValue.email,
      permissions: formValue?.permissions,
      linkedMedia,
    }
    return {
      ...accessObj
    }
  }

  /**
  * @method onSubmitForm
  * @description Ensures form is valid and dispatches "Update Access" Action.
  * @return void
  */
  onSubmitForm(): void {
    console.log('this.formObj', this.formObj)
    if (this.formObj.valid) {
      const accessObj = this.generateAccessObj(this.formObj?.value, this.unlinkedMedia);

      this.store.dispatch(new AccessActions.CreateAccess({ accessObj: { ...accessObj }, redirectUrl: '/access/list', redirectDirection: 'back' }))
    }
  }

  /**
  * @method ngOnDestroy
  * @description Angular page life cycle method that runs when page is being destroyed 
  *							- Generally used to clean up any subscribed streams/observables to prevent data leaks
  * @return void
  */
  ngOnDestroy(): void {
    // console.log('Destroyed Create Access Page');
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

}
