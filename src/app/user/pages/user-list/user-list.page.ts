/*************************************************************************************************
** Imports                                                                                      **
**************************************************************************************************/
//-- **Core** -----------------------------------------------------------------------------------//
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { distinctUntilChanged } from 'rxjs/operators';
//-- **NgRx Data Store** ------------------------------------------------------------------------//
import { Store } from '@ngrx/store';
import { AppState } from '../../../app.reducer';
import * as UserActions from '../../store/user.actions';
import * as CoreActions from './../../../core/store/core.actions';
import * as MediaActions from './../../../media/store/media.actions';
//-- **NgRx Selectors** -------------------------------------------------------------------------//
import { selectUserArray } from './../../store/user.selectors';
//-- **Data Models** ----------------------------------------------------------------------------//
import { UserDb } from '../../models/user.model';
//-- **Helpers/Services** -----------------------------------------------------------------------//


@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.page.html',
  styleUrls: ['./user-list.page.scss'],
})

export class UserListPage implements OnInit, OnDestroy {
  //---------------------------------------------------------------------------------------------->
  //-- Class Variables - Declare below and above constructor ------------------------------------->
  private destroy$: Subject<boolean> = new Subject<boolean>();
  userList: UserDb [] = [];
  

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
    // Run functions in class constructor(runs before ngOnInit & some imports may not be available) 
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
    this.store.select(selectUserArray).pipe(
      distinctUntilChanged(), 
      takeUntil(this.destroy$)
      ).subscribe(_userArray => {
      this.userList = [..._userArray];
      console.log('this.userList', this.userList)
    })

    this.store.dispatch(new UserActions.GetUserArray())
  }



  /**
* @method goToUserDetailPage
* @description Dispatches SetUser action and navigates to the user detail page
* @return void
*/
  goToUserDetailPage(userObj: UserDb): void {
    this.store.dispatch(new MediaActions.SetUnlinkedMedia({ unlinkedMedia: [] }))
    this.store.dispatch(new UserActions.SetUser({ userObj: { ...userObj } }))

    this.store.dispatch(new CoreActions.NavigateToPage({
      pageNavigation: {
        url: `/user/${userObj?.id}/update`,
        animated: true,
        animatedDirection: 'forward',
        isRootPage: false,
        data: null,
      }
    }));
  }

  /**
* @method goToCreateUserPage
* @description Navigates to the create user page
* @return void
*/
  goToCreateUserPage(): void {
    this.store.dispatch(new MediaActions.SetUnlinkedMedia({ unlinkedMedia: [] }))
    this.store.dispatch(new CoreActions.NavigateToPage({
      pageNavigation: {
        url: '/user/create',
        animated: true,
        animatedDirection: 'forward',
        isRootPage: false,
        data: null,
      }
    }));
  }

  /**
* @method trackByFn
* @param index usually you want to pass this.formObj.value
* @param item usually you want to pass this.formObj.value

* @description angular automatically passes an index and the item from the list when using ` <div *ngFor="let item of userList; trackBy: trackByFn"></div>` if an item has changed based on unique  identifier angular will re-render the dom for this component
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
    // console.log('Destroyed User Dashboard Page');
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

}
