import { AnimationController } from '@ionic/angular';
/*************************************************************************************************
** Imports                                                                                      **
**************************************************************************************************/
//-- **Core** -----------------------------------------------------------------------------------//
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil, withLatestFrom } from 'rxjs/operators';
import { distinctUntilChanged } from 'rxjs/operators';
import { ViewChild, ElementRef } from '@angular/core';
import { IonContent } from '@ionic/angular';
import { ScrollDetail } from '@ionic/angular';
//-- **NgRx Data Store** ------------------------------------------------------------------------//
import { Store } from '@ngrx/store';
import { AppState } from '../../../app.reducer';
import * as AccessActions from '../../store/access.actions';
import * as CoreActions from './../../../core/store/core.actions';
import * as MediaActions from './../../../media/store/media.actions';
//-- **NgRx Selectors** -------------------------------------------------------------------------//
import { selectAccessListWithMainPhoto, selectCurrentAccess, selectCurrentAccessList } from './../../store/access.selectors';
//-- **Data Models** ----------------------------------------------------------------------------//
import { AccessDb } from '../../models/access.model';
import { initialNavBarConfig, navBarTypeOptions } from '../../../core/models/core.model';
import { selectCurrentUser } from '../../../user/store/user.selectors';
import { UserDb, initialUserDb } from '../../../user/models/user.model';
import { accessPermissionOptions } from './../../models/access.model';
import { selectIsMobileView } from '../../../core/store/core.selectors';
//-- **Helpers/Services** -----------------------------------------------------------------------//


@Component({
  selector: 'app-access-list',
  templateUrl: './access-list.page.html',
  styleUrls: ['./access-list.page.scss'],
})

export class AccessListPage implements OnInit, OnDestroy {
  //---------------------------------------------------------------------------------------------->
  //-- Class Variables - Declare below and above constructor ------------------------------------->
  private destroy$: Subject<boolean> = new Subject<boolean>();
  accessList: AccessDb [] = [];
  currentUser: UserDb = { ...initialUserDb }
  accessPermissionOptions = accessPermissionOptions;
  hideNavBarFlag: boolean = false;
  leavingPage: boolean = true;
  isMobileView: boolean;
  
  showCreateCommunityModal: boolean = false;
  //-- Expand Navbar Vars ----------------------------------------------------------------------------> 
  // the element that you are observing (just add #scrollArea in the template) for this  query to work
  @ViewChild(IonContent) content: IonContent;

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
    private animationCtrl: AnimationController
  ) {
    // Run functions in class constructor(runs before ngOnInit & some imports may not be available) 
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


    // this.store.select(selectCurrentAccessList).pipe(takeUntil(this.destroy$)).subscribe(access => {
    //   // this.userAccessPermissions = [...access?.permissions] ?? [];
    // })



    //-----
    this.store.select(selectCurrentUser).pipe(
      distinctUntilChanged(),
      takeUntil(this.destroy$)
    ).subscribe(_user => {
      this.currentUser = { ..._user };
      console.log('this.currentUser', this.currentUser)
    })



    this.store.select(selectIsMobileView).pipe(
      takeUntil(this.destroy$),
    ).subscribe((isMobileView) => {
      console.log('ISMOBILEVIEW!!', isMobileView)
      this.isMobileView = isMobileView
    })

    this.store.select(selectAccessListWithMainPhoto).pipe(
      takeUntil(this.destroy$)
      ).subscribe((_accessArray) => {
        console.log('this._accessArray', _accessArray)

        const filterOutCurrentAccessProfile = _accessArray?.filter(item =>  item?.email?.toLowerCase() != this.currentUser?.email?.toLowerCase())
        this.accessList = [...filterOutCurrentAccessProfile]
        console.log('this.accessList', this.accessList)
    })

    this.store.dispatch(new AccessActions.GetAccessArray())
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
* @method goToAccessDetailPage
* @description Dispatches SetAccess action and navigates to the access detail page
* @return void
*/
  goToAccessDetailPage(accessObj: AccessDb): void {
    this.store.dispatch(new MediaActions.SetUnlinkedMedia({ unlinkedMedia: [] }))
    this.store.dispatch(new AccessActions.SetAccess({ accessObj: { ...accessObj } }))

    this.store.dispatch(new CoreActions.NavigateToPage({
      pageNavigation: {
        url: `/access/${accessObj?.id}/update`,
        animated: true,
        animatedDirection: 'forward',
        isRootPage: false,
        data: null,
      }
    }));
  }

  /**
* @method goToCreateAccessPage
* @description Navigates to the create access page
* @return void
*/
  goToCreateAccessPage(): void {
    this.store.dispatch(new MediaActions.SetUnlinkedMedia({ unlinkedMedia: [] }))
    this.store.dispatch(new CoreActions.NavigateToPage({
      pageNavigation: {
        url: '/access/create',
        animated: true,
        animatedDirection: 'forward',
        isRootPage: false,
        data: null,
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



  /**
* @method trackByFn
* @param index usually you want to pass this.formObj.value
* @param item usually you want to pass this.formObj.value

* @description angular automatically passes an index and the item from the list when using ` <div *ngFor="let item of accessList; trackBy: trackByFn"></div>` if an item has changed based on unique  identifier angular will re-render the dom for this component
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
    // console.log('Destroyed Access Dashboard Page');
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

}
