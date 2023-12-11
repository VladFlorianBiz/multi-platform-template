/*************************************************************************************************
** Imports                                                                                      **
**************************************************************************************************/
//-- **Core** -----------------------------------------------------------------------------------//
import { Injectable } from '@angular/core';
import { from } from 'rxjs';
//-- **Firebase** -------------------------------------------------------------------------------//
import { AngularFirestore } from '@angular/fire/compat/firestore';
//-- **Data Models** ----------------------------------------------------------------------------//
import { ErrorDb } from './../models/error.model';

@Injectable({
    providedIn: 'root'
})

/*************************************************************************************************
**  API Service Calls                                                                           **
**************************************************************************************************/
export class ErrorService {
    constructor(
        public fireStoreDB: AngularFirestore,
    ) { }

    //-- Insert Error ------------------------------------------------------------------------------->
    insertError(errorInsert: ErrorDb) {
        return from(this.fireStoreDB.collection('error').doc(errorInsert.id).set({ ...errorInsert }));
    }
}
