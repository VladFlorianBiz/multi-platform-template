import { initialUserDb } from './../../models/user.model';
/*************************************************************************************************
** Imports                                                                                      **
**************************************************************************************************/
//-- **Core** -----------------------------------------------------------------------------------//
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil} from 'rxjs/operators';
import { ViewChild, ElementRef } from '@angular/core';
import { IonContent } from '@ionic/angular';
import { ScrollDetail } from '@ionic/angular';
import { AnimationController } from '@ionic/angular';
//-- **NgRx Data Store** ------------------------------------------------------------------------//
import { Store } from '@ngrx/store';
import { AppState } from '../../../app.reducer';
import * as CoreActions from '../../../core/store/core.actions';
import * as MediaActions from '../../../media/store/media.actions';
//-- **NgRx Selectors** -------------------------------------------------------------------------//
import { selectCurrentAccessList } from '../../../access/store/access.selectors';
//-- **Data Models** ----------------------------------------------------------------------------//
import { initialNavBarConfig, navBarTypeOptions } from '../../../core/models/core.model';
import { AccessDb, accessPermissionOptions } from '../../../access/models/access.model';
import { selectIsMobileView } from '../../../core/store/core.selectors';
import { selectCurrentUser } from '../../store/user.selectors';
import { UserDb } from '../../models/user.model';
//-- **Helpers/Services** -----------------------------------------------------------------------//


@Component({
  selector: 'app-user-account',
  templateUrl: './user-account.page.html',
  styleUrls: ['./user-account.page.scss'],
})

export class UserAccountPage implements OnInit, OnDestroy {
  //---------------------------------------------------------------------------------------------->
  //-- Class Variables - Declare below and above constructor ------------------------------------->
  private destroy$: Subject<boolean> = new Subject<boolean>();
  accessPermissionOptions = accessPermissionOptions;
  currentAccessList: AccessDb[] = [];
  hideNavBarFlag:boolean = false;
  leavingPage: boolean = true;
  isMobileView: boolean = false;

  showMustLoginToContinueModal = false
  userIsAuthenticated = false;
  currentUser: UserDb = {...initialUserDb}

  //-- Expand Navbar Vars ----------------------------------------------------------------------------> 
  // the element that you are observing (just add #scrollArea in the template) for this  query to work
  @ViewChild(IonContent) content: IonContent;


  /**
  * @constructor Page Constructor
  * @description  Initialize Class and Dependencies(Imports), see SOME examples below.
  *							- Helpers: UiHelper, AiUserDataObjHelper, FirebaseHelper
  *							- Services: AiUserService
  *							- Ionic: NavController, ModalController
  *							- Form: FormBuilder
  *							- State: Store<AppState>
  * @return void
  */
  constructor(
    private store: Store<AppState>,
    private animationCtrl: AnimationController

  ) {
    // Run functions in class constructor(runs before ngOnInit & some imports may not be available) 
    //
  }



  handleScroll(ev: CustomEvent<ScrollDetail>) {
    // console.log('scroll', ev.detail);

    if (this.isMobileView) {
      const topPosition = ev.detail.currentY
      const showHideNavBarFlag = topPosition > 40;

      if (showHideNavBarFlag && this.hideNavBarFlag == false) {
        this.hideNavBarFlag = true;
        const navBarConfig = {
          type: navBarTypeOptions.blank,
          expand: true
        }
        this.store.dispatch(new CoreActions.SetNavBarConfig({ navBarConfig }));
      }
      else if (!showHideNavBarFlag && this.hideNavBarFlag == true) {
        this.hideNavBarFlag = false;
        const navBarConfig = {
          type: navBarTypeOptions.authenticated,
          expand: false
        }
        this.store.dispatch(new CoreActions.SetNavBarConfig({ navBarConfig }));
      }
    }
  }





  

  /**
 * @method ngOnInit
 * @description Angular page life cycle method that runs after class and its dependencies have been initialized.
 *							Imports are available to be used at this point
 *							- can be used to initialize form
 *							- Can be used to subscribe to aiUser selectors(aiUser state variables/observable streams) 
 *							- Make sure you destroy any subscribed to streams on page destroy or else memory leaks can occur
 * @return void
 */
  ngOnInit(): void {
    

    this.store.select(selectCurrentAccessList).pipe(takeUntil(this.destroy$)).subscribe(accessList => {
      this.currentAccessList = [...new Set(accessList)];
      console.log('this.currentAccessList', this.currentAccessList)
    })


    //------------------------------------------------------>
    this.store.select(selectIsMobileView).pipe(
      takeUntil(this.destroy$),
    ).subscribe((isMobileView) => {
      console.log('ISMOBILEVIEW!!', isMobileView)
      this.isMobileView = isMobileView
    })

    //----------------------------------------->
    this.store.select(selectCurrentUser).pipe(
      takeUntil(this.destroy$),
    ).subscribe((_user) => {
      const isAuthenticated = (_user?.id?.length > 0);
      this.userIsAuthenticated = isAuthenticated;
      this.currentUser = {..._user}
    })

  }


  setShowLoginToContinueModal(_value) {
    this.showMustLoginToContinueModal = _value
  }


  onChangePlan() {
    this.store.dispatch(new CoreActions.NavigateToPage({
      pageNavigation: {
        url: "home#pricing",
        animated: false,
        animatedDirection: 'back',
        isRootPage: true,
        data: null
      }
    }));
  }






  ionViewWillEnter() {
    const navBarConfig = {
      ...initialNavBarConfig,
      type: navBarTypeOptions.authenticated,
    }
    this.store.dispatch(new CoreActions.SetNavBarConfig({ navBarConfig }));
    // Scrolls to the top of the content area
    this.content.scrollToTop();
    this.leavingPage = false;

  }


  ionViewWillLeave() {
    // Scrolls to the top of the content area
    this.leavingPage = true
  }

  onChangePassword() {
    this.store.dispatch(new CoreActions.NavigateToPage({
      pageNavigation: {
        url: "auth/forgot-password",
        animated: false,
        animatedDirection: 'back',
        isRootPage: true,
        data: null
      }
    }));
    this.showMustLoginToContinueModal = false;
  }


  goToLoginPage() {
    this.store.dispatch(new CoreActions.NavigateToPage({
      pageNavigation: {
        url: "auth/login",
        animated: false,
        animatedDirection: 'back',
        isRootPage: true,
        data: null
      }
    }));
    this.showMustLoginToContinueModal = false;

  }


  enterAnimation = (baseEl: HTMLElement) => {
    const root = baseEl.shadowRoot;

    const backdropAnimation = this.animationCtrl
      .create()
      .addElement(root.querySelector('ion-backdrop')!)
      .fromTo('opacity', '0.01', 'var(--backdrop-opacity)');

    const wrapperAnimation = this.animationCtrl
      .create()
      .addElement(root.querySelector('.modal-wrapper')!)
      .keyframes([
        { offset: 0, opacity: '0', transform: 'scale(0)' },
        { offset: 1, opacity: '0.99', transform: 'scale(1)' },
      ]);

    return this.animationCtrl
      .create()
      .addElement(baseEl)
      .easing('ease-out')
      .duration(400)
      .addAnimation([backdropAnimation, wrapperAnimation]);
  };

  leaveAnimation = (baseEl: HTMLElement) => {
    return this.enterAnimation(baseEl).direction('reverse').duration(100)
  };



  /**
* @method trackByFn
* @param index usually you want to pass this.formObj.value
* @param item usually you want to pass this.formObj.value

* @description angular automatically passes an index and the item from the list when using ` <div *ngFor="let item of aiUserList; trackBy: trackByFn"></div>` if an item has changed based on unique  identifier angular will re-render the dom for this component
* @return void
*/
    trackByFn(index, item): string {
      return item?.id;
    }



  /**
  * @method ngOnDestroy
  * @description Angular page life cycle method that runs when page is being destroyed 
  *							- Generally used to clean up any subscribed streams/observables to prevent data leaks
  * @return void
  */
  ngOnDestroy(): void {
    // console.log('Destroyed AiUser Dashboard Page');
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

}
