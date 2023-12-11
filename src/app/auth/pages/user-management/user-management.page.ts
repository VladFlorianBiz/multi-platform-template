//--------------- Core -----------------------------------------------------------//
import { Component, OnDestroy } from "@angular/core";
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
//---------------DATA_STORE-----------------------------------------------------//
import { AppState } from '../../../app.reducer';
import { Store } from '@ngrx/store';
import * as AuthActions from '../../store/auth.actions';
//---------------Data Models---------------------------------------------------//
import { DynamicLinkObj } from '../../models/auth.model';

@Component({
  selector: "page-user-management",
  templateUrl: "./user-management.page.html",
  styleUrls: ["./user-management.page.scss"]
})

export class UserManagementPage implements  OnDestroy {
  //-- Core -------------------------------------------------->
  private destroy$: Subject<boolean> = new Subject<boolean>();
  dynamicLinkObj

  constructor(
    private store: Store<AppState>,
    private activatedRoute: ActivatedRoute,
  ) {
    this.activatedRoute.queryParams.pipe(takeUntil(this.destroy$)).subscribe((dynamicLinkObj: DynamicLinkObj) => {
      this.dynamicLinkObj = dynamicLinkObj;
      console.log('dynamicLinkObj', dynamicLinkObj)

      if (typeof (this.dynamicLinkObj.mode) !== 'undefined') {
        this.store.dispatch(new AuthActions.VerifyDynamicLinkCode({ dynamicLinkObj: this.dynamicLinkObj }));
      }
    });
   }

  // ionViewDidEnter() {
  //   if (typeof (this.dynamicLinkObj.mode) !== 'undefined') {
  //     this.store.dispatch(new AuthActions.VerifyDynamicLinkCode({ dynamicLinkObj: this.dynamicLinkObj }));
  //   }
  // }

  ngOnDestroy() {
   // console.log('Destroyed User Management Page');
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
