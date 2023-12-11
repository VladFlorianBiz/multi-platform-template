/*************************************************************************************************
** Imports                                                                                      **
**************************************************************************************************/
//-- **Core** -----------------------------------------------------------------------------------//
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil, withLatestFrom } from 'rxjs/operators';
//-- **NgRx Data Store** ------------------------------------------------------------------------//
import { Store } from '@ngrx/store';
import { AppState } from '../../../app.reducer';
import * as CoreActions from '../../store/core.actions';
import * as MediaActions from '../../../media/store/media.actions';
//-- **NgRx Selectors** -------------------------------------------------------------------------//
//-- **Data Models** ----------------------------------------------------------------------------//
import { initialNavBarConfig, navBarTypeOptions } from '../../models/core.model';
import { selectCurrentAccess } from '../../../access/store/access.selectors';
import { accessPermissionOptions } from '../../../access/models/access.model';
//-- **Helpers/Services** -----------------------------------------------------------------------//


@Component({
  selector: 'app-components',
  templateUrl: './components.page.html',
  styleUrls: ['./components.page.scss'],
})

export class ComponentsPage implements OnInit, OnDestroy {
  //---------------------------------------------------------------------------------------------->
  //-- Class Variables - Declare below and above constructor ------------------------------------->
  private destroy$: Subject<boolean> = new Subject<boolean>();
  accessPermissionOptions = accessPermissionOptions;
  userAccessPermissions: string[] = [];

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
  ) {
    // Run functions in class constructor(runs before ngOnInit & some imports may not be available) 
    //
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
    const navBarConfig = {
      ...initialNavBarConfig,
      type: navBarTypeOptions.authenticated,
    }
    this.store.dispatch(new CoreActions.SetNavBarConfig({ navBarConfig }));


    this.store.select(selectCurrentAccess).pipe(takeUntil(this.destroy$)).subscribe(access => {
      this.userAccessPermissions = [...access?.permissions] ?? []
      console.log('userAccessPermissions', this.userAccessPermissions);
    })
  }



  

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
