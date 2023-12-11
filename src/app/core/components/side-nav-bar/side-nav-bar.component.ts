//--------------- Core --------------------------------------------------------------------------------------//
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
//--------------- Data Store --------------------------------------------------------------------------------//
import { AppState } from '../../../app.reducer';
import { Store } from '@ngrx/store';
import * as AuthActions from './../../../auth/store/auth.actions';
import * as CoreActions from './../../store/core.actions';
import { selectSelectedPath } from './../../store/core.selectors';
import { selectCurrentUser } from '../../../user/store/user.selectors';
//--------------- Data Models --------------------------------------------------------------------------------//
import { UserDb, initialUserDb } from './../../../user/models/user.model';
import { selectCurrentAccess, selectCurrentAccessList } from '../../../access/store/access.selectors';
import { AccessDb, accessPermissionOptions, initialAccessDb } from './../../../access/models/access.model';


@Component({
  selector: 'app-side-nav-bar',
  templateUrl: './side-nav-bar.component.html',
  styleUrls: ['./side-nav-bar.component.scss'],
})
export class SideNavBarComponent implements OnInit, OnDestroy {
  //---------------------------------------------------------->
  //-- Class Variables - Declare below and above constructor ->
  //---------------------------------------------------------->
  private destroy$: Subject<boolean> = new Subject<boolean>();
  selectedPath = '';
  user: UserDb = {...initialUserDb}
  isAuthenticated;
  userAccessPermissions: string [] =[];
  accessPermissionOptions = accessPermissionOptions;
  access: AccessDb = {...initialAccessDb};

  //-- Nav Bar Options ---->
  navBarOptions = {
    home: {
      label: 'Home',
      order: 1,
      subHeader: false,
      url: '/home',
    },
    access: {
      label: 'Access',
      order: 2,
      subHeader: false,
      url: '/access/list',
    },
    login: {
      label: 'Login',
      order: 3,
      subHeader: false,
      url: '/auth/login',
    },
    components: {
      label: 'components',
      order: 4,
      subHeader: false,
      url: '/components',
    },
    user: {
      label: 'User',
      order: 5,
      subHeader: false,
      url: '/user/account',
    },

  }

  //-- Set current Nav bar --------------------->
  currentNavBarOption = this.navBarOptions.home
  previousNavBarOption = this.navBarOptions.home

  constructor(
    private store: Store<AppState>,
  ) { }

  ngOnInit() {
    this.store.select(selectSelectedPath).pipe(takeUntil(this.destroy$)).subscribe(selectedPath => {
      this.selectedPath = selectedPath;
    })

    this.store.select(selectCurrentUser).pipe(takeUntil(this.destroy$)).subscribe(_user => {
      this.isAuthenticated = _user?.id?.length > 0;
      this.user  = {..._user}
    })

    this.store.select(selectCurrentAccessList).pipe(takeUntil(this.destroy$)).subscribe(accessList => {
      const allAccessListItems = accessList?.reduce((acc, item) => [...acc, ...item.permissions], []);
      this.userAccessPermissions = allAccessListItems ?? [];
      console.log('userACCESSSS', this.access)
      console.log('this.userAccessPermissions', this.userAccessPermissions)
    })
  }

  goToLoginPage() {
    this.previousNavBarOption = { ...this.currentNavBarOption };
    this.currentNavBarOption = { ...this.navBarOptions.login };

    this.store.dispatch(new CoreActions.NavigateToPage({
      pageNavigation: {
        url: this.currentNavBarOption?.url,
        animated: true,
        animatedDirection: 'forward',
        isRootPage: true,
        data: null
      }
    }));
  }


  goToPage(navbarOption) {
    this.previousNavBarOption = { ...this.currentNavBarOption };
    this.currentNavBarOption = { ...navbarOption };

    let direction = 'forward';
    if (this.currentNavBarOption.order <= this.previousNavBarOption?.order) {
      direction = 'back'
    }

    this.store.dispatch(new CoreActions.NavigateToPage({
      pageNavigation: {
        url: this.currentNavBarOption?.url,
        animated: true,
        animatedDirection: direction,
        isRootPage: true,
        data: null
      }
    }));
  }
 
  logout() {
    this.store.dispatch(new AuthActions.Logout());
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
