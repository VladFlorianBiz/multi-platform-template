//--------------- Core -----------------------------------------------------------//
import { Component } from "@angular/core";
//------------- Data Store --------------------------------------------------------//
import { AppState } from './../../../app.reducer';
import { Store } from '@ngrx/store';
import * as CoreActions from './../../../core/store/core.actions';

@Component({
  selector: "page-email-verified",
  templateUrl: "./email-verified.page.html",
  styleUrls: ["./email-verified.page.scss"]
})

export class EmailVerifiedPage {
  constructor(
    private store: Store<AppState>,
  ) {}

  goToLogin() {
    this.store.dispatch(new CoreActions.NavigateToPage({
      pageNavigation: {
        url: "/auth/login",
        animated: true,
        animatedDirection: 'back',
        isRootPage: true,
        data: null
      }
    }));
  }

}
