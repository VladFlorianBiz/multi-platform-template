/*************************************************************************************************
** Imports                                                                                      **
**************************************************************************************************/
//-- **Core** -----------------------------------------------------------------------------------//
import { Injectable } from '@angular/core';
//-- **Services/Helpers** -----------------------------------------------------------------------//
import { FirebaseHelper } from '../../shared/helpers/firebase.helper';
import * as dateHelper from './../../shared/helpers/date.helper';
//-- **Data Models** ----------------------------------------------------------------------------//
import { initialErrorDb, ErrorDb } from './../models/error.model';
import { environment } from './../../../environments/environment';
import { initialEventDb } from '../../event/models/event.model';

@Injectable({
  providedIn: 'root'
})

/*************************************************************************************************
**  Enriches Data For Api Calls/Actions                                                         **
**************************************************************************************************/
export class ErrorDataObjHelper {
  initialModifiedFields = [];

  constructor(
    private firebaseHelper: FirebaseHelper,
  ) { }

  //-- Handle Error ---------------------------------------------------------------->
  handleError(error: any, actionType: string, payload: any) {
    let stateUpdates: { lastError: ErrorDb } = { lastError: { ...initialErrorDb } };
    const errorId = this.firebaseHelper.generateFirebaseId();

    //-- Enrich Data ---------------------------------------------------------------->
    const lastEventObj = payload?.lastEvent ?? { ...initialEventDb };
    const lastEventCreatedByEmptyOrDoesNotExist = lastEventObj?.createdBy?.id == null
    const createdBy = (lastEventCreatedByEmptyOrDoesNotExist)
      ? { id: environment?.appName, name: environment?.appName }
      : { ...lastEventObj?.createdBy };
    const extraDetails = error?.extraDetails ?? null;

    //-- Error Insert -------------------------------------------->
    const errorInsert = {
      ...initialErrorDb,
      id: errorId,
      actionType,
      payload: { ...payload },
      errorMessage: error?.message,
      errorStack: { ...error },
      extraDetails,
      createdBy: { ...createdBy },
      createdAt: dateHelper.getTimeFromDateTimestamp(new Date())
    };

    //-- State Updates ------------------------>
    stateUpdates.lastError = { ...errorInsert };

    return {
      errorInsert: { ...errorInsert },
      stateUpdates
    }
  }
}