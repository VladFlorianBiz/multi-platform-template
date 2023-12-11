/*************************************************************************************************
** Imports                                                                                      **
**************************************************************************************************/
//-- **Core** -----------------------------------------------------------------------------------//
import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { Subject } from 'rxjs';
import { IonContent } from '@ionic/angular';
//-- **NgRx Data Store** ------------------------------------------------------------------------//
import { Store } from '@ngrx/store';
import { AppState } from '../../../app.reducer';
import * as CoreActions from '../../store/core.actions';
//-- **NgRx Selectors** -------------------------------------------------------------------------//
//-- **Data Models** ----------------------------------------------------------------------------//
import { navBarTypeOptions } from '../../models/core.model';
//-- **Helpers/Services** -----------------------------------------------------------------------//


@Component({
  selector: 'app-about',
  templateUrl: './about.page.html',
  styleUrls: ['./about.page.scss'],
})

export class AboutPage implements OnInit, OnDestroy {
  //---------------------------------------------------------------------------------------------->
  //-- Class Variables - Declare below and above constructor ------------------------------------->
  private destroy$: Subject<boolean> = new Subject<boolean>();
  //-- Expand Navbar Vars ----------------------------------------------------------------------------> 
  // the element that you are observing (just add #scrollArea in the template) for this  query to work
  @ViewChild('scrollArea') scrollArea: ElementRef;
  @ViewChild(IonContent) content: IonContent;

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
  ) {
    // Run functions in class constructor(runs before ngOnInit & some imports me not be available) 
    //
  }

  /**
 * @method ngOnInit
 * @description Angular page life cycle method that runs after class and its dependencies have been initialized.
 *							Imports are available to be used at this point
 *							- can be used to initialize form
 *							- Can be used to subscribe to about selectors(about state variables/observable streams) 
 *							- Make sure you destroy any subscribed to streams on page destroy or else memory leaks can occur
 * @return void
 */
  ngOnInit(): void {
    // this.store.selectCurrentUser).pipe(takeUntil(this.destroy$)).subscribe(userObj => {
    //   this.userObj = { ..._userObj };
    // })

  }


  ionViewWillEnter() {
    // Scrolls to the top of the content area
    this.content.scrollToTop();
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
  * @method ngOnDestroy
  * @description Angular page life cycle method that runs when page is being destroyed 
  *							- Generally used to clean up any subscribed streams/observables to prevent data leaks
  * @return void
  */
  ngOnDestroy(): void {
    // console.log('Destroyed Create About Page');
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

}
