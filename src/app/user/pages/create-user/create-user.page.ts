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
import * as UserActions from '../../store/user.actions';
import * as CoreActions from './../../../core/store/core.actions';
//-- **NgRx Selectors** -------------------------------------------------------------------------//
import { selectUnlinkedMedia } from './../../../media/store/media.selectors';
import {  selectWho } from './../../../user/store/user.selectors';
//-- **Data Models** ----------------------------------------------------------------------------//
import { UserDb, initialUserDb } from './../../models/user.model';
import { MediaDb, initialMediaDb, mediaEvents } from './../../../media/models/media.model';
import { userDatabaseName } from './../../models/user.model';
import { mediaTypeOptions } from './../../../media/models/media.model';

//-- **Helpers/Services** -----------------------------------------------------------------------//
import { FirebaseHelper } from './../../../shared/helpers/firebase.helper';
@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.page.html',
  styleUrls: ['./create-user.page.scss'],
})

export class CreateUserPage implements OnInit, OnDestroy {
  //---------------------------------------------------------------------------------------------->
  //-- Class Variables - Declare below and above constructor ------------------------------------->
  private destroy$: Subject<boolean> = new Subject<boolean>();
  formObj: UntypedFormGroup;
  formInitialized = false;
  inputTouchedOnce = {
     //add form fields in initForm() here as well
    name: null,
    description: null,
  }
  userObj: UserDb = {...initialUserDb};
  userId: string = null;
  
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
*							- Helpers: UiHelper, UserDataObjHelper, FirebaseHelper
*							- Services: UserService
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
 *							- Can be used to subscribe to user selectors(user state variables/observable streams) 
 *							- Make sure you destroy any subscribed to streams on page destroy or else memory leaks can occur
 * @return void
 */
  ngOnInit(): void {
    //-------------------------------------------------------------------------------------------------------------------->
    //-- Used For Linking Any Uploaded Files with feature ---------------------------------------------------------------->
    this.userId = this.firebaseHelper.generateFirebaseId();
    this.mediaAdditionalIds  = {
      userId: this.userId
    }
    this.rootStoragePathFolder = `${userDatabaseName}/${this.userId}/media`
    //--- Select All UnlinkedMedia Items --------------------------------------------------------------------------------->
    this.store.select(selectUnlinkedMedia).pipe(
      takeUntil(this.destroy$),
      withLatestFrom((this.store.select(selectWho)))
    ).subscribe(([_unlinkedMedia, who]) => {
      this.who = { ...who };
      this.unlinkedMedia = [..._unlinkedMedia];
      this.mainMedia = (_unlinkedMedia?.length > 0) 
      ? [...this.unlinkedMedia?.filter(item => item?.type === mediaTypeOptions.userMainMedia)]
      : []
      //--------------------------------------------------------------------------------------------->
      this.otherMedia = (_unlinkedMedia?.length > 0) 
          ? [...this.unlinkedMedia?.filter(item => item.type === mediaTypeOptions.userOtherMedia)]
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
      name: ['', [Validators.required]],
      description: ['', [Validators.required]],
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
    this.store.dispatch(new CoreActions.NavigateToPage({
      pageNavigation: {
        url: "/user/list",
        animated: true,
        animatedDirection: 'back',
        isRootPage: true,
        data: null
      }
    }));
  }

  /**
  * @method generateUserObj
  * @param _formValue usually you want to pass this.formObj.value
  * @param _unlinkedMedia unlinked media items
  * @description generates a new user object with the current form values and any unlinked media items
  * @return UserDb
  */
  generateUserObj(_formValue, _unlinkedMedia): UserDb {
    const formValue = {..._formValue};

    const unlinkedMedia = [..._unlinkedMedia]
    const linkedMedia = unlinkedMedia?.map(item => {
      return {
        id: item?.id,
        fileName: item?.fileName,
        fileExtension: item?.fileExtension, //**mediaTypeOptions**/ //e.g. 'mp4' | 'png'
        format: item?.format,               //**mediaFormatOptions** image | video | pdf
        downloadUrl: item?.downloadUrl,
        type: item?.type,                   //**mediaTypeOptions**/ userMainPhoto | userOtherPhotos | userMainVideos | userMainPhoto | userOtherPhotos etc
        originalFileName: item?.originalFileName
      }
    })

    const userObj: UserDb = {
      ...initialUserDb,
      ...formValue,
      id: this.userId,
      // name: formValue.name,
      // description: formValue.description,
      linkedMedia,
    }
    return {
      ...userObj
    }
  }

  /**
  * @method onSubmitForm
  * @description Ensures form is valid and dispatches "Update User" Action.
  * @return void
  */
  onSubmitForm(): void {
    if (this.formObj.valid) {
      const userObj = this.generateUserObj(this.formObj?.value, this.unlinkedMedia);

      this.store.dispatch(new UserActions.CreateUser({ userObj: { ...userObj }, redirectUrl: '/user/list', redirectDirection: 'back' }))
    }
  }

  /**
  * @method ngOnDestroy
  * @description Angular page life cycle method that runs when page is being destroyed 
  *							- Generally used to clean up any subscribed streams/observables to prevent data leaks
  * @return void
  */
  ngOnDestroy(): void {
    // console.log('Destroyed Create User Page');
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

}
