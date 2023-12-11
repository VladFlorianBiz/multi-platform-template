//--------------- Core ------------------------------------------------------------------------//
import { Component, Input } from "@angular/core";
import { NavController, NavParams, PopoverController, MenuController } from '@ionic/angular';
//---------------DATA_STORE------------------------------------------------------------------//
import { Store } from '@ngrx/store';
import { AppState } from './../../../../../app.reducer';
import * as accessActions  from './../../../../../access/store/access.actions';
//--------------- Data Models ----------------------------------------------------------------------//
import {
  AccessDb,
  accessViewOptions,
  initialAccessDb
} from './../../../../../access/models/access.model';

@Component({
  selector: 'app-select-access-menu',
  templateUrl: './select-access-menu.component.html',
  styleUrls: ['./select-access-menu.component.scss'],
})
export class SelectAccessMenuComponent {
  isMobileView: boolean;
  accessProfilesList: AccessDb[];
  currentAccessProfile: AccessDb;
  accessViewOptions = accessViewOptions;
  accessView;

  constructor(
    private store: Store<AppState>,
    private navCtrl: NavController,
    private navParams: NavParams,
    private popOverCtrl: PopoverController,
    private menuCtrl: MenuController,
  ) {
    this.accessView = this.navParams.data.accessView
    this.currentAccessProfile = this.navParams.data.currentAccessProfile;
    this.isMobileView = this.navParams.data.isMobileView;
    this.accessProfilesList = [...this.navParams.data.accessProfiles].filter(accesProfile => accesProfile.id !== this.currentAccessProfile.id);
   }

  selectAccessProfile(accessProfile) {
    this.popOverCtrl.dismiss();
    if (this.isMobileView) { this.menuCtrl.close('sideMenu') }
    this.store.dispatch(new accessActions.SelectClientAccessProfile({ accessProfile: { ...accessProfile } }))
  }

  closeMenu(){
    this.popOverCtrl.dismiss();
  }

  selectUserProfile() {
    this.popOverCtrl.dismiss();
    if (this.isMobileView) { this.menuCtrl.close('sideMenu') }
    // const accessView = accessViewOptions.user; 
    // this.store.dispatch(new accessActions.SelectClientAccessProfileSuccess({ currentClientAccessProfile: { ...initialAccessDb } }))
    // this.store.dispatch(new accessActions.SetAccessView({ accessView: accessView }));
    // this.navCtrl.navigateRoot('/user/dashboard', { animationDirection: 'forward' });
    this.navCtrl.navigateRoot('/access/select-access', { animationDirection: 'back' });
  }

} 