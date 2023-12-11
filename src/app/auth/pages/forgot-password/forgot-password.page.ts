//--------------- Core ----------------------------------------------------------------------------//
import { Component, OnInit } from "@angular/core";
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Subject, take, takeUntil } from 'rxjs';
//--------------- Data Store ----------------------------------------------------------------------//
import { AppState } from '../../../app.reducer';
import { Store } from '@ngrx/store';
import * as CoreActions from './../../../core/store/core.actions';
import * as AuthActions from '../../store/auth.actions';
import { selectCurrentUser } from "../../../user/store/user.selectors";
//--------------- Services/Helpers ----------------------------------------------------------------//
import { regexValidators } from '../../../shared/helpers/validators.helper';
//------------- Data Models -----------------------------------------------------------------------//
import { authErrorMsgs } from '../../models/auth.model';
import { navBarTypeOptions } from "../../../core/models/core.model";
import { UserDb, initialUserDb } from "../../../user/models/user.model";


@Component({
  selector: "page-forgot-password",
  templateUrl: "./forgot-password.page.html",
  styleUrls: ["./forgot-password.page.scss"]
})

export class ForgotPasswordPage implements OnInit {
  //-- Core Variables ------------------------------------------->
  private destroy$: Subject<boolean> = new Subject<boolean>();
  currentUser: UserDb = { ...initialUserDb }
  //-----------------------------------
  formObj: UntypedFormGroup;
  inputTouchedOnce = {
    email: null,
  }
  formInitialized = false;
  errorMsgs = authErrorMsgs;


  constructor(
    private store: Store<AppState>,
    private fb: UntypedFormBuilder,
  ) { }

  ngOnInit() {
    const navBarConfig = {
      type: navBarTypeOptions.blank,
      expand: true
    }
    this.store.dispatch(new CoreActions.SetNavBarConfig({ navBarConfig }));


    this.store.select(selectCurrentUser).pipe(
      take(1),
    ).subscribe((currentUser) => {
      this.currentUser = { ...currentUser }
    })

    this.initForm();
  }

  initForm() {
    const currentUser = {...this.currentUser}
    console.log('currentUser!!', currentUser)

    const email = (currentUser?.email && currentUser?.email?.length > 0  ) ? currentUser?.email : '';

    this.formObj = this.fb.group({
      email: [email, Validators.compose([Validators.pattern(regexValidators.email), Validators.required, Validators.minLength(1)])],
    });
    this.formInitialized = true;
  }

  onInputBlur(formControlName) {
    const inputHasBeenTouchedAtLeastOnce = this.inputTouchedOnce[formControlName] == true;
    const inputTouchedOnceLastValue = { ...this.inputTouchedOnce }

    if (!inputHasBeenTouchedAtLeastOnce || !this.formInitialized) {
      const formFieldTouchUpdateValue = (this.inputTouchedOnce[formControlName] == null)
        ? true
        : false;


      this.inputTouchedOnce = {
        ...inputTouchedOnceLastValue,
        [formControlName]: formFieldTouchUpdateValue
      }
    }
  }

  onResetPassword() {
    const email = this.formObj.value.email;
    if (this.formObj.valid) {
      this.store.dispatch(new AuthActions.ForgotPassword({email: email}));
    }
  }

  goBack() {
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


  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

}
