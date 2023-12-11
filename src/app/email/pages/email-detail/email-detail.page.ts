/*************************************************************************************************
** Imports                                                                                      **
**************************************************************************************************/
//-- **Core** -----------------------------------------------------------------------------------//
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { NavController, AlertController } from '@ionic/angular';
import { takeUntil } from 'rxjs/operators';
//-- **NgRx Data Store** ------------------------------------------------------------------------//
import { Store } from '@ngrx/store';
import { AppState } from '../../../app.reducer';
import * as EmailActions from '../../store/email.actions';
//-- **NgRx Selectors** -------------------------------------------------------------------------//
import { selectEmailObj } from './../../store/email.selectors';
//-- **Data Models** ----------------------------------------------------------------------------//
import { EmailDb, initialEmailDb } from './../../models/email.model';
//-- **Helpers/Services** -----------------------------------------------------------------------//


@Component({
  selector: 'app-email-detail',
  templateUrl: './email-detail.page.html',
  styleUrls: ['./email-detail.page.scss'],
})

export class EmailDetailPage implements OnInit, OnDestroy {
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
  emailObj: EmailDb = { ...initialEmailDb };
  emailId: string = null;
  isViewOnlyMode: boolean = false;


  /**
  * @constructor Page Constructor
  * @description  Initialize Class and Dependencies(Imports), see SOME examples below.
  *							- Helpers: UiHelper, EmailDataObjHelper, FirebaseHelper
  *							- Services: EmailService
  *							- Ionic: NavController, ModalController
  *							- Form: FormBuilder
  *							- State: Store<AppState>
  * @return void
  */
  constructor(
    private store: Store<AppState>,
    private fb: FormBuilder,
    private navCtrl: NavController,
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
 *							- Can be used to subscribe to email selectors(email state variables/observable streams) 
 *							- Make sure you destroy any subscribed to streams on page destroy or else memory leaks can occur
 * @return void
 */
  ngOnInit(): void {
    //-- Page parameters received from route url **see email-routing.module.ts**
    this.isViewOnlyMode = !this.route.snapshot.paramMap.get("viewOrUpdate")?.includes('update');
    // console.log('pageParameters - isViewOnlyMode', this.isViewOnlyMode);

    this.store.select(selectEmailObj).pipe(takeUntil(this.destroy$)).subscribe(_emailObj => {
      this.emailObj = { ..._emailObj };
    })

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
    // const email = {...this.emailObj};
    // const name = email?.name ?? null;
    // const description = email?.description ?? null;
    // this.formObj = this.fb.group({  //**add any form fields that are added below in 'inputTouchedOnce' Object ***/
    //   name: [name, [Validators.required]], 
    //   description: [description, [Validators.required]],
    // });

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
  goBack(): void {
    this.navCtrl.navigateBack('/email/list', { animationDirection: 'back', animated: true });
  }


  /**
  * @method onSubmitForm
  * @description Ensures form is valid and dispatches "Update Email" Action.
  * @return void
  */
  onSubmitForm(): void {
    if (this.formObj.valid) {
      const formValue = this.formObj.value;

      const emailObj: EmailDb = {
        ...initialEmailDb,
        ...this.emailObj,
        ...formValue,
        // name: formValue.name,
        // description: formValue.description,
      }

      this.store.dispatch(new EmailActions.UpdateEmail({ emailObj: { ...emailObj }}))
      this.navCtrl.pop()
      // this.store.dispatch(new EmailActions.UpdateEmail({ emailObj: { ...emailObj }, redirectUrl: '/email/list', redirectDirection: 'back' }))
    }
  }


  /**
  * @method deleteEmail
  * @description display's a confirmation modal for deleting a email if confirmed 'Delete Email' Action gets dispatched.
  * @return void
  */
  deleteEmail(): void {
    this.alertCtrl.create({
      header: 'Confirm',
      message: 'Are you sure you want to delete this email?',
      buttons: [{
        text: 'Cancel',
        role: 'cancel',
      }, {
        text: 'Confirm',
        handler: () => {
          this.store.dispatch(new EmailActions.DeleteEmail({ emailObj: { ...this.emailObj }, redirectUrl: '/email/list', redirectDirection: 'back' }));
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
    // console.log('Destroyed Create Email Page');
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

}
