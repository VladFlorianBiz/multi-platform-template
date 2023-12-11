//--------------- Core -------------------------------------------------------------------------------------------------------//
import { Component, OnInit } from "@angular/core";
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
//-------------- Data Store -------------------------------------------------------------------------------------------------//
import { AppState } from './../../../app.reducer';
import { Store } from '@ngrx/store';
import * as CoreActions from './../../../core/store/core.actions';
import * as AuthActions from './../../store/auth.actions';
//-------------- Services/Helpers -------------------------------------------------------------------------------------------//
import { regexValidators } from '../../../shared/helpers/validators.helper';
//-------------- Date Models  -----------------------------------------------------------------------------------------------//
import { authErrorMsgs } from '../../models/auth.model';
import { navBarTypeOptions } from "../../../core/models/core.model";
//-------------- Components -------------------------------------------------------------------------------------------------//
import { TermsAndConditionsModalComponent } from './../../components/terms-conditions-modal/terms-conditions-modal.component';

@Component({
  selector: "page-sign-up",
  templateUrl: "./sign-up.page.html",
  styleUrls: ["./sign-up.page.scss"]
})

export class SignUpPage implements OnInit {
  phoneMask = ['(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/,];
  formObj: UntypedFormGroup;
  inputTouchedOnce = {
    fullName: null,
    dateOfBirth: null,
    email: null,
    phone: null,
    password: null,
    passwordConfirm: null,
  }
  formInitialized = false;
  errorMsgs = authErrorMsgs;
  defaultDate

  constructor(
    private store: Store<AppState>,
    private fb: UntypedFormBuilder,
    private modalCtrl: ModalController,
  ) { }

  ngOnInit() {
    const navBarConfig = {
      type: navBarTypeOptions.blank,
      expand: true
    }
    this.store.dispatch(new CoreActions.SetNavBarConfig({ navBarConfig }));

    this.defaultDate = new Date().toISOString().substring(0, 10);
    this.initForm();
  }

  initForm() {
    this.formObj = this.fb.group({
      fullName: ['', [Validators.required]],
      email: ['', [Validators.compose([Validators.pattern(regexValidators.email), Validators.required, Validators.minLength(1)])]],
      phone: ['', []],
      password: ['', [Validators.compose([Validators.maxLength(20), Validators.minLength(8), Validators.required])]],
      passwordConfirm: ['', [Validators.compose([Validators.required])]],
      agreedToTerms: [null, [Validators.compose([Validators.required])]],
      
    }, { validator: this.checkPasswords });

    this.formInitialized = true;
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

  checkPasswords(group) {
    const pass = group.value.password;
    const confirmPass = group.value.passwordConfirm;
    return pass === confirmPass ? null : { notSame: true };
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

  onCreateAccount() {
    const formValue = this.formObj.value;
    const dateOfBirth = new Date()

    if (this.formObj.valid) {
      this.store.dispatch(new AuthActions.SignUp({ signUpFormObj: { ...formValue, dateOfBirth: dateOfBirth } }))
    }
  }

  getDate(e) {
    let date = new Date(e.target.value).toISOString().substring(0, 10);
    this.formObj.get('dateOfBirth').setValue(date, {
      onlyself: true
    })
  }

  async openTerms() {
    const termsAndConditionsModal = await this.modalCtrl.create({
      component: TermsAndConditionsModalComponent,
      cssClass: 'updateAccessModal',
      animated: true,
      showBackdrop: true,

    });
    termsAndConditionsModal.present();
  }


}
