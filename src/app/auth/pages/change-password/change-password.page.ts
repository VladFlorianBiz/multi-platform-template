//--------------- Core ---------------------------------------------------------//
import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
//---------------DATA_STORE---------------------------------------------------//
import { AppState } from '../../../app.reducer';
import { Store } from '@ngrx/store';
import * as AuthActions from '../../store/auth.actions';
//--------------- Services/Helpers / Data Models --------------------------------------//
import { authErrorMsgs } from '../../models/auth.model';

@Component({
  selector: "page-change-password",
  templateUrl: "./change-password.page.html",
  styleUrls: ["./change-password.page.scss"]
})

export class ChangePasswordPage implements OnInit {
  formObj: FormGroup;
  errorMsgs = authErrorMsgs;
  inputTouchedOnce = {
    password: null,
    passwordConfirm: null,
  }
  formInitialized = false;

  constructor(
    private store: Store<AppState>,
    private fb: FormBuilder,
  ) { }

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    this.formObj = this.fb.group({
      password: ['', [Validators.compose([Validators.maxLength(20), Validators.minLength(8), Validators.required])]],
      passwordConfirm: ['', [Validators.compose([Validators.required])]],
    }, { validator: this.checkPasswords });
    
    this.formInitialized = true;
  }

  checkPasswords(group: FormGroup) {
    const pass = group.controls.password.value;
    const confirmPass = group.controls.passwordConfirm.value;
    return pass === confirmPass ? null : { notSame: true };
  }

  changePassword() {
    const password = this.formObj.value.password;
    if (this.formObj.valid) {
      this.store.dispatch(new AuthActions.ChangePassword({ password: password}));
    }
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

}
