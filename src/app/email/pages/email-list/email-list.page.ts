/*************************************************************************************************
** Imports                                                                                      **
**************************************************************************************************/
//-- **Core** -----------------------------------------------------------------------------------//
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { NavController } from '@ionic/angular';
import { takeUntil } from 'rxjs/operators';
//-- **NgRx Data Store** ------------------------------------------------------------------------//
import { Store } from '@ngrx/store';
import { AppState } from '../../../app.reducer';
import * as EmailActions from '../../store/email.actions';
//-- **NgRx Selectors** -------------------------------------------------------------------------//
import { selectEmailArray } from './../../store/email.selectors';
//-- **Data Models** ----------------------------------------------------------------------------//
import { EmailDb } from '../../models/email.model';
//-- **Helpers/Services** -----------------------------------------------------------------------//


@Component({
  selector: 'app-email-list',
  templateUrl: './email-list.page.html',
  styleUrls: ['./email-list.page.scss'],
})

export class EmailListPage implements OnInit, OnDestroy {
  //---------------------------------------------------------------------------------------------->
  //-- Class Variables - Declare below and above constructor ------------------------------------->
  private destroy$: Subject<boolean> = new Subject<boolean>();
  emailList: EmailDb [] = [];
  

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
    private navCtrl: NavController,
  ) {
    // Run functions in class constructor(runs before ngOnInit & some imports may not be available) 
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
    this.store.select(selectEmailArray).pipe(takeUntil(this.destroy$)).subscribe(_emailArray => {
      this.emailList = [..._emailArray];
      console.log('this.emailList', this.emailList)
    })

    this.store.dispatch(new EmailActions.GetEmailArray())
  }



  /**
* @method goToEmailDetailPage
* @description Dispatches SetEmail action and navigates to the email detail page
* @return void
*/
  goToEmailDetailPage(emailObj: EmailDb): void {
    this.store.dispatch(new EmailActions.SetEmail({ emailObj: { ...emailObj } }))
    this.navCtrl.navigateForward(`/email/${emailObj?.id}/update`, { animated: true, animationDirection: 'forward' })
  }

  /**
* @method goToCreateEmailPage
* @description Navigates to the create email page
* @return void
*/
  goToCreateEmailPage(): void {
    this.navCtrl.navigateForward('/email/create', { animated: true, animationDirection: 'forward' })
  }


    trackByFn(index, item) {
      return item?.id;
    }



  /**
  * @method ngOnDestroy
  * @description Angular page life cycle method that runs when page is being destroyed 
  *							- Generally used to clean up any subscribed streams/observables to prevent data leaks
  * @return void
  */
  ngOnDestroy(): void {
    // console.log('Destroyed Email Dashboard Page');
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

}
