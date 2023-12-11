/*************************************************************************************************
** Imports                                                                                      **
**************************************************************************************************/
//-- **Core** -----------------------------------------------------------------------------------//
import { Component, OnInit, OnDestroy } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
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
import { selectWho } from './../../../user/store/user.selectors';
import { selectUnlinkedMediaAndAccessObj } from '../../store/access.selectors';
//-- **Data Models** ----------------------------------------------------------------------------//
import { AccessDb, accessPermissionOptions, accessPermissionOptionsArray, initialAccessDb } from './../../models/access.model';
import { MediaDb, initialMediaDb, mediaEvents, LinkedMedia } from './../../../media/models/media.model';
import { accessDatabaseName } from './../../models/access.model';
import { mediaTypeOptions } from './../../../media/models/media.model';
//-- **Helpers/Services** -----------------------------------------------------------------------//
import { initialNavBarConfig, navBarTypeOptions } from '../../../core/models/core.model';
import { selectIsMobileView } from '../../../core/store/core.selectors';

@Component({
  selector: 'app-access-detail',
  templateUrl: './access-detail.page.html',
  styleUrls: ['./access-detail.page.scss'],
})

export class AccessDetailPage implements OnInit, OnDestroy {
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
  accessObj: AccessDb = { ...initialAccessDb };
  isViewOnlyMode: boolean = false;
  navBarTypeOptions = navBarTypeOptions;

  accessPermissionOptionsArray = accessPermissionOptionsArray;
  accessPermissionOptions = accessPermissionOptions;


  // Flags --------------------------------->
  showAddNewAccessGroupFlag: boolean = false;
  hideNavBarFlag: boolean = false;
  isMobileView: boolean;
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
  *							- Helpers: UiHelper, AccessDataObjHelper, FirebaseHelper
  *							- Services: AccessService
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




    //-- Page parameters received from route url **see access-routing.module.ts**
    this.isViewOnlyMode = !this.route.snapshot.paramMap.get("viewOrUpdate")?.includes('update');

    console.log('isViewOnlyMode?', this.isViewOnlyMode)
    const accessId = this.route.snapshot.paramMap.get("accessId");

    //------------------------------------------------------------------------------->
    //-- Used For Linking Any Uploaded Files with feature --------------------------->
    this.mediaAdditionalIds = {
      accessId: accessId
    }
    this.rootStoragePathFolder = `${accessDatabaseName}/${accessId}/media`
    //------------------------------------------------------------------------------->
    this.store.select(selectUnlinkedMediaAndAccessObj).pipe(
      withLatestFrom(this.store.select(selectWho)),
      takeUntil(this.destroy$),
    ).subscribe(([dataObj, _who]) => {
      this.who = { ..._who };
      this.mainMedia = [...dataObj?.mainMedia]
      this.otherMedia = [...dataObj?.otherMedia]
      this.mainLinkedMedia = [...dataObj?.mainLinkedMedia];
      this.otherLinkedMedia = [...dataObj?.otherLinkedMedia];
      this.allMedia = [...dataObj.allMedia];
      this.accessObj = { ...dataObj?.accessObj };
      console.log('accessObj', this.accessObj)




      //---------------------------------------------------------------------------->
      //-- IF **VIEW MODE** - Set Main Image Url + Set Thumbnails ------------------>
      if (this.isViewOnlyMode) {
        this.mainImageUrl = dataObj?.accessObj?._local?.mainMedia?.downloadUrl;

        this.thumbnailMedia = (this.mainMedia?.length > 0)
          ? [...dataObj.allMedia?.filter(item => item?.id != this.mainMedia[0]?.id)]
          : [];
      }
    })

    this.store.select(selectIsMobileView).pipe(
      takeUntil(this.destroy$),
    ).subscribe((isMobileView) => {
      this.isMobileView = isMobileView;
      if (isMobileView) {
        this.hideNavBarFlag = true;
        const navBarConfig = {
          type: navBarTypeOptions.blank,
          expand: false
        }
        this.store.dispatch(new CoreActions.SetNavBarConfig({ navBarConfig }));
      } else if (!isMobileView && !this.isViewOnlyMode) {
        const navBarConfig = {
          ...initialNavBarConfig,
          type: navBarTypeOptions.authenticated,
        }
        this.store.dispatch(new CoreActions.SetNavBarConfig({ navBarConfig }));
        this.hideNavBarFlag = false
      }
    })


    //------------------------------------------------------------------------------------->
    //-- IF **VIEW MODE** - Dispatch Get Access Action --------------------------------->
    if (this.isViewOnlyMode) {
      this.store.dispatch(new AccessActions.GetAccess({ accessId: accessId }));
    }

    //------------------------------------------------------------------------------------->
    //-- IF **Edit MODE** - Initialize Form ----------------------------------------------->
    if (this.isViewOnlyMode == false) {


      this.initForm();
    }
  }





  onCheckboxSelectionMulti(permissionChange) {
    const selectedPermissions = [...this.formObj.value.permissions];
    const permissionAlreadySelected = selectedPermissions.includes(permissionChange);
    const updatedAccess = (permissionAlreadySelected)
      ? [...selectedPermissions.filter(ability => ability !== permissionChange)]
      : [...selectedPermissions, permissionChange];

      console.log('updatedAccess', updatedAccess)
    this.formObj.patchValue({
      permissions: [...updatedAccess],
    }, {
      onlySelf: true
    })
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
    const access = { ...this.accessObj };
    const email = access?.email ?? null;
    const permissions = access?.permissions ?? [];
    this.formObj = this.fb.group({  //**add any form fields that are added below in 'inputTouchedOnce' Object ***/
      email: [email, [Validators.required]],
      permissions: [permissions, []],
    });

    console.log('tgus.form', this.formObj)

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
    // this.store.dispatch(new CoreActions.NavigateToPreviousPage());
    this.store.dispatch(new CoreActions.NavigateToPreviousPage({url: "/access/list"}));
  }


  /**
  * @method removeLinkedMedia
  * @param linkedMediaItem The linked media item that is going to be removed from the accessObj
  * @description dispatches updateAccess action when remove linked media event occurs and updates the accessObj
  * @return void
  */
  removeLinkedMedia(linkedMediaItem: LinkedMedia): void {
    const oldAccessObj: AccessDb = this.generateAccessObj(this.formObj.value, this.accessObj, this.mainMedia, this.otherMedia);
    const updatedLinkedMedia = [...oldAccessObj.linkedMedia].filter(item => item.id !== linkedMediaItem?.id)

    const updatedAccessObj = {
      ...oldAccessObj,
      linkedMedia: updatedLinkedMedia,
    }

    this.store.dispatch(new AccessActions.UpdateAccess({ accessObj: { ...updatedAccessObj } }))
  }




  /**
  * @method generateAccessObj
  * @param _formValue pass the from value `this.formObj.value`
  * @param _access pass access object `this.accessObj`
  * @param _mainMedia pass both unlinked and linked media items that are of type main
  * @param _otherMedia pass both unlinked and linked media items that are of type other
  * @description generates a new access object with the current form values, access, mainMedia, and other media
  * @return AccessDb
  */
  generateAccessObj(_formValue, _access, _mainMedia, _otherMedia): AccessDb {
    const oldAccessObj = { ..._access };
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
        type: item?.type,                   //**mediaTypeOptions**/ userMainPhoto | userOtherPhotos | userMainVideos | accessMainPhoto | accessOtherPhotos etc
        originalFileName: item?.originalFileName
      }
    });



    const accessObj: AccessDb = {
      ...initialAccessDb,
      ...oldAccessObj,
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
    if (this.formObj.valid) {
      const accessObj = this.generateAccessObj(this.formObj.value, this.accessObj, this.mainMedia, this.otherMedia);
      this.store.dispatch(new AccessActions.UpdateAccess({ accessObj: { ...accessObj }, redirectUrl: '/access/list', redirectDirection: 'back' }))
    }
  }


  /**
  * @method deleteAccess
  * @description display's a confirmation modal for deleting a access if confirmed 'Delete Access' Action gets dispatched.
  * @return void
  */
  deleteAccess(): void {
    this.alertCtrl.create({
      header: 'Confirm',
      message: 'Are you sure you want to delete this access?',
      buttons: [{
        text: 'Cancel',
        role: 'cancel',
      }, {
        text: 'Confirm',
        handler: () => {
          this.store.dispatch(new AccessActions.DeleteAccess({ accessObj: { ...this.accessObj }, redirectUrl: '/access/list', redirectDirection: 'back' }));
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
    // console.log('Destroyed Create Access Page');
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

}
