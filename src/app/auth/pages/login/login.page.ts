//-------------- Core -------------------------------------------------------------//
import { Component, OnInit } from "@angular/core";
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
//------------- Data Store --------------------------------------------------------//
import { AppState } from './../../../app.reducer';
import { Store } from '@ngrx/store';
import * as CoreActions from './../../../core/store/core.actions';
import * as AuthActions from './../../store/auth.actions';
//------------- Data Models -------------------------------------------------------//
import { authErrorMsgs } from '../../models/auth.model';
import { regexValidators } from '../../../shared/helpers/validators.helper';
import { initialNavBarConfig, navBarTypeOptions } from './../../../core/models/core.model';

@Component({
  selector: "page-login",
  templateUrl: "./login.page.html",
  styleUrls: ["./login.page.scss"]
})

export class LoginPage implements OnInit {
  formObj: UntypedFormGroup;
  inputTouchedOnce = {
    email: null,
    password: null
  }
  formInitialized = false;
  errorMsgs = authErrorMsgs;

  constructor(
    private store: Store<AppState>,
    private fb: UntypedFormBuilder,
  ) { }

  ngOnInit() {
    const navBarConfig = {
      ...initialNavBarConfig,
      type: navBarTypeOptions.blank,
    }
    this.store.dispatch(new CoreActions.SetNavBarConfig({ navBarConfig  }));

    this.initForm();
  }

  ionViewWillEnter() {
    const navBarConfig = {
      ...initialNavBarConfig,
      type: navBarTypeOptions.blank,
    }
    this.store.dispatch(new CoreActions.SetNavBarConfig({ navBarConfig }));
  }

  initForm() {
    this.formObj = this.fb.group({
      email: ['', [Validators.compose([Validators.pattern(regexValidators.email), Validators.required, Validators.minLength(1)])]],
      password: ['', [Validators.compose([Validators.maxLength(20), Validators.minLength(8), Validators.required])]],
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
      // console.log('inputTouchedOnce-', this.inputTouchedOnce);
    }

  }

  onSignUp(): void {
    this.store.dispatch(new CoreActions.NavigateToPage({ pageNavigation: { 
      url: "/auth/sign-up",
      animated: true,
      animatedDirection: 'forward',
      isRootPage: false,
      data: null,
     }}));
  }

  onForgotPassword(): void {
    this.store.dispatch(new CoreActions.NavigateToPage({
      pageNavigation: {
        url: "/auth/forgot-password",
        animated: true,
        animatedDirection: 'forward',
        isRootPage: false,
        data: null
      }
    }));
  }

  onLogin(): void {
    const formValue = this.formObj.value;
    if (this.formObj.valid) {
      this.store.dispatch(new AuthActions.Login({ email: formValue.email, password: formValue.password }));
    }
  }

}
