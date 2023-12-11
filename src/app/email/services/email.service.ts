/*************************************************************************************************
** Imports                                                                                      **
**************************************************************************************************/
//-- **Core** -----------------------------------------------------------------------------------//
import { Injectable } from '@angular/core';
import { from } from 'rxjs';
//-- **Data Models** ----------------------------------------------------------------------------//
import { EventDb } from '../../event/models/event.model';
import { EmailDb, EmailLastEventIdentifierFields } from './../models/email.model';
//-- **Firebase** -------------------------------------------------------------------------------//
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Injectable({
    providedIn: 'root'
})

/*************************************************************************************************
**  API Service Calls                                                                           **
**************************************************************************************************/
export class EmailService {
    constructor(
        public fireStoreDB: AngularFirestore,
    ) { }


    getEmailArray () {
        return this.fireStoreDB.collection<EmailDb>('email').get();
    };

    getEmail(emailId: string) {
        return this.fireStoreDB.collection<EmailDb>('email', ref => ref.where('id', '==', emailId)).get();
    };

    createEmail(emailInsert: EmailDb, eventInsert: EventDb<EmailLastEventIdentifierFields>) {
        const batch = this.fireStoreDB.firestore.batch();

        //-- Insert Email ----------------------------------------------------------------------------------->
        const emailInsertDbRef = this.fireStoreDB.collection<EmailDb>('email').doc(emailInsert.id).ref;
        batch.set(emailInsertDbRef, emailInsert);

        //-- Event Insert -------------------------------------------------------------------------------------------------------------->
        const eventInsertDbRef = this.fireStoreDB.collection<EventDb<EmailLastEventIdentifierFields>>('event').doc(eventInsert.id).ref;
        batch.set(eventInsertDbRef, eventInsert);

        return from(batch.commit());
    };

    updateEmail(emailUpdate: EmailDb, eventUpdate: EventDb<EmailLastEventIdentifierFields>) {
        const batch = this.fireStoreDB.firestore.batch();

        //-- Update Email ---------------------------------------------------------------------------------->
        const emailUpdateDbRef = this.fireStoreDB.collection<EmailDb>('email').doc(emailUpdate.id).ref;
        batch.set(emailUpdateDbRef, emailUpdate);

        //-- Event Insert -------------------------------------------------------------------------------------------------------------->
        const eventUpdateDbRef = this.fireStoreDB.collection<EventDb<EmailLastEventIdentifierFields>>('event').doc(eventUpdate.id).ref;
        batch.set(eventUpdateDbRef, eventUpdate);

        return from(batch.commit());
    };


    deleteEmail(emailId: string, eventDelete: EventDb<EmailLastEventIdentifierFields>) {
        const batch = this.fireStoreDB.firestore.batch();

        //-- Delete Email ----------------------------------------------------------------->
        const emailDeleteDbRef = this.fireStoreDB.collection('email').doc(emailId).ref;
        batch.delete(emailDeleteDbRef);

        //-- Event Insert -------------------------------------------------------------------->
        const eventDeleteDbRef = this.fireStoreDB.collection('event').doc(eventDelete.id).ref;
        batch.set(eventDeleteDbRef, eventDelete);

        return from(batch.commit());
    };

}
