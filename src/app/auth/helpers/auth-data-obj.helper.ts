/*************************************************************************************************
** Imports                                                                                      **
**************************************************************************************************/
//-- **Core** -----------------------------------------------------------------------------------//
import { Injectable } from '@angular/core';
//-- **Data Models** ----------------------------------------------------------------------------//
import { EventDb, eventOperationOptions } from './../../event/models/event.model';
import {
  initialUserDb, UserLastEventIdentifierFields, userEvents, userDatabaseName,
  userDataVersion, userFieldsToDeleteOnServerSend
} from './../../user/models/user.model';
import { SignUpFormObj } from './../models/auth.model';
import { DynamicLinkObj } from './../models/auth.model';
//-- **Services/Helpers** -----------------------------------------------------------------------//
import { FirebaseHelper } from '../../shared/helpers/firebase.helper';
import * as dateHelper from './../../shared/helpers/date.helper';

@Injectable({
  providedIn: 'root'
})

/*************************************************************************************************
**  Enriches Data For Api Calls/Actions                                                         **
**************************************************************************************************/
export class AuthDataObjHelper {

  constructor(
    private firebaseHelper: FirebaseHelper,
  ) { }


  userSignUp(signUpFormObj: SignUpFormObj, userId: string) {
    //-- Identifier Fields --------------------------------------------------->
    const eventId = this.firebaseHelper.generateFirebaseId();
    const eventCorrelationId = this.firebaseHelper.generateFirebaseId();

    //-- Data Enrichment ----------------------------->
    const who = {
      name: signUpFormObj.fullName,
      id: userId
    };
    const email = signUpFormObj.email.toLowerCase();

    //---User Insert Obj--------------------->
    const userObj = {
      ...initialUserDb,
      id: userId,
      fullName: signUpFormObj.fullName,
      email: email,
      phone: signUpFormObj?.phone ?? null,
      dateOfBirth: signUpFormObj?.dateOfBirth ?? null,
      lastEvent: {
        ...initialUserDb?.lastEvent,
        ids: {
          ...initialUserDb?.lastEvent?.ids,
          userId: userId,
          eventId,
          eventCorrelationId
          //add additional id's here
        }
      }
    }

    //-- Generate LastEvent Object ---------------------------------------->
    const lastEvent: EventDb<UserLastEventIdentifierFields> = {
      ...initialUserDb?.lastEvent,
      id: eventId,
      ids: {
        ...userObj?.lastEvent?.ids
      },
      context: null,
      who,
      what: {
        ...initialUserDb?.lastEvent?.what,
        event: userEvents.create,
        databaseName: userDatabaseName,
        operation: eventOperationOptions?.create,
        dataVersion: userDataVersion,
      },
      when: dateHelper.getTimeFromDateTimestamp(new Date()),
    }

    //-- User Insert ------------------------------------------->
    const userInsert = {
      ...userObj,
      lastEvent,
      createdBy: who,
      createdAt: dateHelper.getTimeFromDateTimestamp(new Date())
    }

    //-- Delete Fields Before Sending To Server ------------------>
    userFieldsToDeleteOnServerSend.forEach(fieldToDelete => {
      try {
        delete userInsert?.[fieldToDelete];
      }
      catch (error) {
        return;
      }
    });

    //-- Event Insert ---------------------------------------------->
    const eventInsert: EventDb<UserLastEventIdentifierFields> = {
      ...userInsert.lastEvent,
      what: {
        ...userInsert.lastEvent.what,
        obj: { ...userInsert }
      }
    }

    return {
      userInsert,
      eventInsert
    };
  }


  determineRedirectUrl(dynamicLinkObj: DynamicLinkObj) {
    //---This could be in a data model/config file instead
    const redirectUrlOptions = {
      resetPassword: '/auth/change-password',
      recoverEmail: '/auth/recover-email',   //To do create this page
      verifyEmail: '/auth/email-verified'
    };

    //-------------------------------------------------------------------------------->
    let redirectUrl = redirectUrlOptions[dynamicLinkObj.mode];

    return redirectUrl;
  }
}
