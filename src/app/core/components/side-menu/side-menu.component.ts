//--------------- Core --------------------------------------------------------------------------------------//
import { Component, OnInit, Input } from "@angular/core";
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
//--------------- Data Store --------------------------------------------------------------------------------//
import { AppState } from '../../../app.reducer';
import { Store } from '@ngrx/store';
import * as AuthActions from './../../../auth/store/auth.actions';
import * as CoreActions from './../../store/core.actions';
import { selectSelectedPath } from '../../store/core.selectors';
//---------------Data Models ------------------------------------------------------------------------------//
import { AccessDb, accessPermissionOptions, initialAccessDb } from './../../../access/models/access.model';
import { UserDb, initialUserDb } from "../../../user/models/user.model";
import { selectCurrentUser } from "../../../user/store/user.selectors";
import { selectCurrentAccessList } from "../../../access/store/access.selectors";

@Component({
  selector: "app-side-menu",
  templateUrl: "./side-menu.component.html",
  styleUrls: ["./side-menu.component.scss"]
})

export class SideMenuComponent implements OnInit {
  //-- Inputs/Core ------------------------>
  // @Input() user: UserDb;
  @Input() enabled: boolean;
  @Input() isMobile: boolean;

  private destroy$: Subject<boolean> = new Subject<boolean>();
  selectedPath = '';
  user: UserDb = { ...initialUserDb }
  isAuthenticated: boolean = false;
  userAccessPermissions: string[] = [];
  accessPermissionOptions = accessPermissionOptions;
  access: AccessDb = { ...initialAccessDb };
  
  //-- Data Models ----------------------------------->



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
  ) {

  }

  ngOnInit() {
    this.store.select(selectSelectedPath).pipe(takeUntil(this.destroy$)).subscribe(selectedPath => {
      this.selectedPath = selectedPath;
    })

    this.store.select(selectCurrentUser).pipe(takeUntil(this.destroy$)).subscribe(_user => {
      this.isAuthenticated = _user?.id?.length > 0;
      this.user = { ..._user }
    })

    this.store.select(selectCurrentAccessList).pipe(takeUntil(this.destroy$)).subscribe(accessList => {
      const allAccessListItems = accessList?.reduce((acc, item) => [...acc, ...item.permissions], []);
      this.userAccessPermissions = allAccessListItems ?? [];
    })
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



  logout() {
    this.store.dispatch(new AuthActions.Logout());
  }


}
