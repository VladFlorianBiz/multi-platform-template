/*************************************************************************************************
** Imports                                                                                      **
**************************************************************************************************/
//-- **Core** -----------------------------------------------------------------------------------//
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { takeUntil, withLatestFrom } from 'rxjs/operators';
//-- **NgRx Data Store** ------------------------------------------------------------------------//
import { Store } from '@ngrx/store';
import { AppState } from '../../../app.reducer';
import * as UserActions from '../../store/user.actions';
import * as CoreActions from './../../../core/store/core.actions';
//-- **NgRx Selectors** -------------------------------------------------------------------------//
import { selectUnlinkedMediaAndUserObj } from './../../store/user.selectors';
import { selectWho } from './../../../user/store/user.selectors';
//-- **Data Models** ----------------------------------------------------------------------------//
import { UserDb, initialUserDb,  } from './../../models/user.model';
import { MediaDb, mediaEvents, initialMediaDb } from './../../../media/models/media.model';
import { userDatabaseName } from './../../models/user.model';
import { LinkedMedia, mediaTypeOptions, } from './../../../media/models/media.model';
import { navBarTypeOptions } from './../../../core/models/core.model';
//-- **Helpers/Services** -----------------------------------------------------------------------//

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.page.html',
  styleUrls: ['./user-detail.page.scss'],
})

export class UserDetailPage implements OnInit, OnDestroy {
  //---------------------------------------------------------------------------------------------->
  //-- Class Variables - Declare below and above constructor ------------------------------------->
  private destroy$: Subject<boolean> = new Subject<boolean>();
  formObj: UntypedFormGroup;
  formInitialized = false;
  inputTouchedOnce = {
    //add form fields in initForm() here as well
    fullName: null,
  }
  userObj: UserDb = { ...initialUserDb };
  isViewOnlyMode: boolean = false;
  navBarTypeOptions = navBarTypeOptions;



  //------------------------------------------------->
  //-- Media ---------------------------------------->
  allMedia: LinkedMedia[] = []
  mainImageUrl;
  thumbnailMedia: LinkedMedia[] = []
  mainMedia: MediaDb[] = [];
  otherMedia: MediaDb[] = [];
  mainLinkedMedia: MediaDb[] = [];
  otherLinkedMedia: MediaDb[] = []
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
  //------------------------------------------------->

  /**
  * #region My folded comment block
  * @constructor Page Constructor
  * @description  Initialize Class and Dependencies(Imports), see SOME examples below.
  *							- Helpers: UiHelper, UserDataObjHelper, FirebaseHelper
  *							- Services: UserService
  *							- Ionic: NavController, ModalController
  *							- Form: FormBuilder
  *							- State: Store<AppState>
  * @return void
  * #endregion My folded comment block
  * 
  */

  constructor(
    private store: Store<AppState>,
    private fb: FormBuilder,
    private alertCtrl: AlertController,
    public route: ActivatedRoute,
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
    //-- Page parameters received from route url **see user-routing.module.ts**
    this.isViewOnlyMode = !this.route.snapshot.paramMap.get("viewOrUpdate")?.includes('update');

    console.log('isViewOnlyMode?', this.isViewOnlyMode)
    const userId = this.route.snapshot.paramMap.get("userId");

    //------------------------------------------------------------------------------->
    //-- Used For Linking Any Uploaded Files with feature --------------------------->
    this.mediaAdditionalIds = {
      userId: userId
    }
    this.rootStoragePathFolder = `${userDatabaseName}/${userId}/media`
    //------------------------------------------------------------------------------->
    this.store.select(selectUnlinkedMediaAndUserObj).pipe(
      withLatestFrom(this.store.select(selectWho)),
      takeUntil(this.destroy$),
    ).subscribe(([dataObj, _who]) => {
      this.who = { ..._who };
      this.mainMedia = [...dataObj?.mainMedia]
      this.otherMedia = [...dataObj?.otherMedia]
      this.mainLinkedMedia = [...dataObj?.mainLinkedMedia];
      this.otherLinkedMedia = [...dataObj?.otherLinkedMedia];
      this.allMedia = [...dataObj.allMedia];
      this.userObj = { ...dataObj?.userObj };

      //---------------------------------------------------------------------------->
      //-- IF **VIEW MODE** - Set Main Image Url + Set Thumbnails ------------------>
      if (this.isViewOnlyMode) {
        this.mainImageUrl = dataObj?.userObj?._local?.mainMedia?.downloadUrl;

        this.thumbnailMedia = (this.mainMedia?.length > 0)
          ? [...dataObj.allMedia?.filter(item => item?.id != this.mainMedia[0]?.id)]
          : [];
      }
    })


    //------------------------------------------------------------------------------------->
    //-- IF **VIEW MODE** - Dispatch Get User Action --------------------------------->
    if (this.isViewOnlyMode) {
      this.store.dispatch(new UserActions.GetUser({ userId: userId }));
    }

    //------------------------------------------------------------------------------------->
    //-- IF **Edit MODE** - Initialize Form ----------------------------------------------->
    if (this.isViewOnlyMode == false) {
      this.initForm();
    }
  }



  /**
  * @method changeMainImageUrl
  * @description Initializes formObj by setting initial form values and, Sets form validation logic.
  *							   - Access form value in typescript e.g. this.formObj?.value?.name
  *							   - Access form value in HTML e.g. {{formObj?.value?.name}}
  * @return void
  */
  changeMainImageUrl(linkedMedia: LinkedMedia): void {
    const allMedia = [...this.allMedia];
    this.thumbnailMedia = [...allMedia?.filter(item => item?.id != linkedMedia?.id)]
    this.mainImageUrl = linkedMedia?.downloadUrl;
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
    const user = { ...this.userObj };
    const fullName = user?.fullName ?? null;
    this.formObj = this.fb.group({  //**add any form fields that are added below in 'inputTouchedOnce' Object ***/
      fullName: [fullName, [Validators.required]],
    });

    this.formInitialized = true;
  }



  //-- Used for 
  addOrRemoveClassEvent({ elementId, className, addClassFlag, removeClassFlag }: { elementId: string, className: string, addClassFlag: boolean, removeClassFlag: boolean }) {
    console.log('add or remove class ran')
    if (addClassFlag) {
      const navBarConfig = {
        type: navBarTypeOptions.landing,
        expand: true
      }
      this.store.dispatch(new CoreActions.SetNavBarConfig({ navBarConfig }));
    } else {
      const navBarConfig = {
        type: navBarTypeOptions.landing,
        expand: false
      }
      this.store.dispatch(new CoreActions.SetNavBarConfig({ navBarConfig }));
    }
  }


  /**
  * @method onInputBlur
  * @param formControlName the from control name that was set when creating `this.formObj =`
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
  * @description Return to previous page by dispatching NavigateToPage
  * @return void
  */
  goBack(): void {
    if (this.formObj.valid && !this.isViewOnlyMode) {
      const userObj = this.generateUserObj(this.formObj.value, this.userObj, this.mainMedia, this.otherMedia);
      this.store.dispatch(new UserActions.UpdateUser({ userObj: { ...userObj } }))
    }

    console.log('made it in here')
    this.store.dispatch(new CoreActions.NavigateToPreviousPage());

    // this.store.dispatch(new CoreActions.NavigateToPage({
    //   pageNavigation: {
    //     url: "/user/list",
    //     animated: true,
    //     animatedDirection: 'back',
    //     isRootPage: true,
    //     data: null
    //   }
    // }));
  }


  /**
  * @method removeLinkedMedia
  * @param linkedMediaItem The linked media item that is going to be removed from the userObj
  * @description dispatches updateUser action when remove linked media event occurs and updates the userObj
  * @return void
  */
  removeLinkedMedia(linkedMediaItem: LinkedMedia): void {
    const oldUserObj: UserDb = this.generateUserObj(this.formObj.value, this.userObj, this.mainMedia, this.otherMedia);
    const updatedLinkedMedia = [...oldUserObj.linkedMedia].filter(item => item.id !== linkedMediaItem?.id)

    const updatedUserObj = {
      ...oldUserObj,
      linkedMedia: updatedLinkedMedia,
    }

    this.store.dispatch(new UserActions.UpdateUser({ userObj: { ...updatedUserObj } }))
  }


  /**
  * @method generateUserObj
  * @param _formValue pass the from value `this.formObj.value`
  * @param _user pass user object `this.userObj`
  * @param _mainMedia pass both unlinked and linked media items that are of type main
  * @param _otherMedia pass both unlinked and linked media items that are of type other
  * @description generates a new user object with the current form values, user, mainMedia, and other media
  * @return UserDb
  */
  generateUserObj(_formValue, _user, _mainMedia, _otherMedia): UserDb {
    const oldUserObj = { ..._user };
    const formValue = { ..._formValue };
    const mainMedia = [..._mainMedia];
    const otherMedia = [..._otherMedia];

    const allMedia = [...mainMedia, ...otherMedia]

    const linkedMedia = allMedia?.map(item => {
      return {
        id: item?.id,
        fileName: item?.fileName,
        fileExtension: item?.fileExtension, //**mediaTypeOptions**/ //e.g. 'mp4' | 'png'
        format: item?.format,               //**mediaFormatOptions** image | video | pdf
        downloadUrl: item?.downloadUrl,
        type: item?.type,                   //**mediaTypeOptions**/ userMainPhoto | userOtherPhotos | userMainVideos | userMainPhoto | userOtherPhotos etc
      }
    });

    const userObj: UserDb = {
      ...initialUserDb,
      ...oldUserObj,
      ...formValue,
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
      const userObj = this.generateUserObj(this.formObj.value, this.userObj, this.mainMedia, this.otherMedia);
      this.store.dispatch(new UserActions.UpdateUser({ userObj: { ...userObj }, redirectUrl: '/user/list', redirectDirection: 'back' }))
    }
  }


  /**
  * @method deleteUser
  * @description display's a confirmation modal for deleting a user if confirmed 'Delete User' Action gets dispatched.
  * @return void
  */
  deleteUser(): void {
    this.alertCtrl.create({
      header: 'Confirm',
      message: 'Are you sure you want to delete this user?',
      buttons: [{
        text: 'Cancel',
        role: 'cancel',
      }, {
        text: 'Confirm',
        handler: () => {
          this.store.dispatch(new UserActions.DeleteUser({ userObj: { ...this.userObj }, redirectUrl: '/user/list', redirectDirection: 'back' }));
        }
      }]
    }).then(alertEl => {
      alertEl.present();
    })
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
