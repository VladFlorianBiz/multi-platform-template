/*************************************************************************************************
 ** Imports                                                                                     **
 *************************************************************************************************/
//-- **Core** -----------------------------------------------------------------------------------//
import { Injectable } from '@angular/core';
import { from } from 'rxjs';
//-- **Data Models** ----------------------------------------------------------------------------//
import { EventDb } from '../models/event.model';
//-- **Firebase** -------------------------------------------------------------------------------//
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Injectable({
    providedIn: 'root'
})

/**************************************************************************************************
 **  API Service Calls                                                                           **
 **************************************************************************************************/
export class EventService {
    constructor(
        public fireStoreDB: AngularFirestore,
    ) { }

    //-- Insert Event ---------------------------------------------------------------------------------------->
    insertEvent(eventInsert: EventDb<any>) {
        return from(this.fireStoreDB.collection('event').doc(eventInsert.ids?.eventId).set({ ...eventInsert }));
    }
}
