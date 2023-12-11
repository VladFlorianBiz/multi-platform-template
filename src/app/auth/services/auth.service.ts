/*************************************************************************************************
** Imports                                                                                      **
**************************************************************************************************/
//-- **Core** -----------------------------------------------------------------------------------//
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { from } from 'rxjs';
//-- **Firebase** -------------------------------------------------------------------------------//
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Injectable({
  providedIn: 'root'
})

/*************************************************************************************************
**  API Service Calls                                                                           **
**************************************************************************************************/
export class AuthService {
  constructor(
    public http: HttpClient,
    public fireStoreAuth: AngularFireAuth,
  ) { }

  //-- Login In ---------------------------------------------------------------->
  login(email, password) {
    // firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL)
    return from(this.fireStoreAuth.signInWithEmailAndPassword(email, password));
  }

  //-- Log Out ------------------------------->
  logout() {
    return from(this.fireStoreAuth.signOut());
  }

  //-- Sign Up -------------------------------------------------------------------->
  signup(email, password) {
    return from(this.fireStoreAuth.createUserWithEmailAndPassword(email, password));
  }


  //-- Change Password ---------------------------------------------------->
  changePassword(oobCode, password) {
    return from(this.fireStoreAuth.confirmPasswordReset(oobCode, password));
  }

  //------ Verify Password Reset Code ------------------------------------//
  verifyPasswordResetCode(oobCode) {
    return from(this.fireStoreAuth.verifyPasswordResetCode(oobCode));
  }

  //-------Verify Email--------------------------------------------//
  verifyEmail(oodCode) {
    return from(this.fireStoreAuth.applyActionCode(oodCode));
  }

  //-- Forgot Password ----------------------------------------->
  forgotPassword(email) {
    return from(this.fireStoreAuth.sendPasswordResetEmail(email));
  }

  setPersistence() {
    return from(this.fireStoreAuth.setPersistence('local'))
  }

  //-- Send Email Verification ---------------------------------------------------------->
  sendEmailVerification() {
    return from(this.fireStoreAuth.currentUser.then(user => user.sendEmailVerification()))
  }

  //-- Listen To Auth Changes ----------->
  listenToAuthChanges() {
    return this.fireStoreAuth.authState;
  }


}