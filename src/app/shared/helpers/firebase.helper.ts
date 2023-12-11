import { initialEventDb } from './../../event/models/event.model';
import { initialUserDb } from './../../user/models/user.model';
/*************************************************************************************************
** Imports                                                                                      **
**************************************************************************************************/
//-- **Core** -----------------------------------------------------------------------------------//
import { Injectable } from '@angular/core';
import { of } from 'rxjs';
//-- **Firebase** -------------------------------------------------------------------------------//
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireFunctions } from '@angular/fire/compat/functions';
import { take } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})

export class FirebaseHelper {

  constructor(
    private fireStoreDB: AngularFirestore,
    private fireFunction: AngularFireFunctions,
  ) { }

  test() {
    return this.fireFunction.httpsCallable('chatWithAI')({ country: 'France'})

    
  }

  enrichFirebaseRes(serverResponse: any) {
    if (serverResponse?.docs) {
      return serverResponse.docs.map(doc => {
        //-- Check to see if 'lastEvent' field exists in order to enrich date fields -->
        const hasLastEventField = this.hasPropertyField(doc?.data(), 'lastEvent');
        const hasCreatedAtField = this.hasPropertyField(doc?.data(), 'createdAt');


        //-- Has CreatedAt Field must convert dates ------------------------>
        let createdAt = {...initialUserDb.createdAt};
        if (hasCreatedAtField) {
          createdAt = {
            ...doc.data()?.createdAt,
            timestamp: doc.data()?.createdAt?.timestamp?.toDate() ?? null
          };
        }

        //-- Has lastEvent Field must convert dates ----------------------------->
        let lastEvent = { ...initialEventDb };
        if (hasLastEventField) {
          lastEvent = {
            ...doc.data()?.lastEvent,
            when: {
              ...doc.data()?.lastEvent?.when,
              timestamp: doc.data()?.lastEvent?.when?.timestamp?.toDate() ?? null
            }
          };
        }

        return {
          ...doc.data(),
          lastEvent,
          createdAt
        };
      });
    }
    //---- Only Single Document Exists ------------------------------------------------->
    else {
      return serverResponse.map(item => {
        const hasLastEventField = this.hasPropertyField(item?.payload.doc.data(), 'lastEvent');
        const hasCreatedAtField = this.hasPropertyField(item?.payload.doc.data(), 'createdAt');

        //-- Has CreatedAt Field must convert dates ----------------------------------->
        let createdAt = { ...initialUserDb?.createdAt };
        if (hasCreatedAtField) {
          createdAt = {
            ...item?.payload.doc.data()?.createdAt,
            timestamp: item?.payload.doc.data()?.createdAt?.timestamp?.toDate() ?? null
          };
        }

        //-- Has lastEvent Field must convert dates ----------------------------->
        let lastEvent = { ...initialUserDb?.lastEvent };
        if (hasLastEventField) {
          //-- Enrich Last Event Date + Set Last Event Obj ----------------------------------->
          lastEvent = {
            ...item?.payload.doc.data()?.lastEvent,
            when: {
              ...item?.payload.doc.data()?.lastEvent?.when,
              timestamp: item?.payload?.doc.data()?.lastEvent?.when?.timestamp?.toDate() ?? null
            }
          };
        }

        return {
          ...item?.payload.doc.data(),
          lastEvent,
          createdAt
        };
      });
    }
  }


  hasPropertyField(obj, prop) {
    var proto = obj.__proto__ || obj.constructor.prototype;
    return (prop in obj) &&
      (!(prop in proto) || proto[prop] !== obj[prop]);
  }


  enrichDocument(serverResponse: any) {
    //-- Check to see if 'lastEvent' field exists in order to enrich date fields -->
    const hasLastEventField = this.hasPropertyField(serverResponse?.data(), 'lastEvent');
    const hastCreatedAtField = this.hasPropertyField(serverResponse?.data(), 'createdAt');

    //-- Has LastEvent Field ------------------------------------------------->
    if (hasLastEventField && hastCreatedAtField) {
      const createdAt = {
        ...serverResponse.data()?.createdAt,
        timestamp: serverResponse.data()?.createdAt?.timestamp?.toDate() ?? null
      }

      //-- Enrich Last Event Date + Set Last Event Obj --------------------->
      const lastEvent = {
        ...serverResponse.data()?.lastEvent,
        when: {
          ...serverResponse.data()?.lastEvent?.when,
          timestamp: serverResponse.data()?.lastEvent?.when?.timestamp?.toDate() ?? null
        }
      }

      return {
        ...serverResponse.data(),
        lastEvent,
        createdAt
      }
    }
    //-- No LastEvent Field -->
    else {
      return {
        ...serverResponse.data()
      }
    }
  }

  generateFirebaseId () {
    return this.fireStoreDB.createId();
  }

  mockObservable() {
    return of(null)
  } 

}
