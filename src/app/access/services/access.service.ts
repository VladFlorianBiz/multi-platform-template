/*************************************************************************************************
** Imports                                                                                      **
**************************************************************************************************/
//-- **Core** -----------------------------------------------------------------------------------//
import { Injectable } from '@angular/core';
import { from } from 'rxjs';
//-- **Data Models** ----------------------------------------------------------------------------//
import { EventDb } from '../../event/models/event.model';
import { AccessDb, AccessLastEventIdentifierFields } from './../models/access.model';
//-- **Firebase** -------------------------------------------------------------------------------//
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { EmailDb, EmailLastEventIdentifierFields } from '../../email/models/email.model';

@Injectable({
    providedIn: 'root'
})

/*************************************************************************************************
**  API Service Calls                                                                           **
**************************************************************************************************/
export class AccessService {
    constructor(
        public fireStoreDB: AngularFirestore,
    ) { }


    getAccessArray () {
        return this.fireStoreDB.collection<AccessDb>('access').get();
    };

   

    getAccessByEmail(email: string) {
        return this.fireStoreDB.collection<AccessDb>('access', ref => ref.where('email', '==', email)).get();
    };

    getAccess(accessId: string) {
        return this.fireStoreDB.collection<AccessDb>('access', ref => ref.where('id', '==', accessId)).get();
    };

    createAccess(accessInsert: AccessDb, eventInsert: EventDb<AccessLastEventIdentifierFields>) {
        const batch = this.fireStoreDB.firestore.batch();

        //-- Insert Access ----------------------------------------------------------------------------------->
        const accessInsertDbRef = this.fireStoreDB.collection<AccessDb>('access').doc(accessInsert.id).ref;
        batch.set(accessInsertDbRef, accessInsert);

        //-- Event Insert -------------------------------------------------------------------------------------------------------------->
        const eventInsertDbRef = this.fireStoreDB.collection<EventDb<AccessLastEventIdentifierFields>>('event').doc(eventInsert.id).ref;
        batch.set(eventInsertDbRef, eventInsert);

        return from(batch.commit());
    };

    updateAccess(accessUpdate: AccessDb, eventUpdate: EventDb<AccessLastEventIdentifierFields>) {
        const batch = this.fireStoreDB.firestore.batch();

        //-- Update Access ---------------------------------------------------------------------------------->
        const accessUpdateDbRef = this.fireStoreDB.collection<AccessDb>('access').doc(accessUpdate.id).ref;
        batch.set(accessUpdateDbRef, accessUpdate);

        //-- Event Insert -------------------------------------------------------------------------------------------------------------->
        const eventUpdateDbRef = this.fireStoreDB.collection<EventDb<AccessLastEventIdentifierFields>>('event').doc(eventUpdate.id).ref;
        batch.set(eventUpdateDbRef, eventUpdate);

        return from(batch.commit());
    };


    deleteAccess(accessId: string, eventDelete: EventDb<AccessLastEventIdentifierFields>) {
        const batch = this.fireStoreDB.firestore.batch();

        //-- Delete Access ----------------------------------------------------------------->
        const accessDeleteDbRef = this.fireStoreDB.collection('access').doc(accessId).ref;
        batch.delete(accessDeleteDbRef);

        //-- Event Insert -------------------------------------------------------------------->
        const eventDeleteDbRef = this.fireStoreDB.collection('event').doc(eventDelete.id).ref;
        batch.set(eventDeleteDbRef, eventDelete);

        return from(batch.commit());
    };


    updateMultipleAccessItems(updates: {accessUpdate: AccessDb, eventInsert: EventDb<AccessLastEventIdentifierFields>} []) {
        const batch = this.fireStoreDB.firestore.batch();

        updates.forEach(update => {
            //-- Update Access ---------------------------------------------------------------------------------->
            const accessUpdateDbRef = this.fireStoreDB.collection<AccessDb>('access').doc(update?.accessUpdate.id).ref;
            batch.set(accessUpdateDbRef, update?.accessUpdate);

            //-- Event Insert -------------------------------------------------------------------------------------------------------------->
            const eventInsertDbRef = this.fireStoreDB.collection<EventDb<AccessLastEventIdentifierFields>>('event').doc(update.eventInsert?.id).ref;
            batch.set(eventInsertDbRef, update.eventInsert);
        })


        return from(batch.commit());
    };


    createAccessAndSendEmail(
        accessInsert: AccessDb, 
        eventInsert: EventDb<AccessLastEventIdentifierFields>,
        emailInsert: EmailDb, 
        emailEventInsert: EventDb<AccessLastEventIdentifierFields>
        ) {
        const batch = this.fireStoreDB.firestore.batch();

        //-- Insert Access ----------------------------------------------------------------------------------->
        const accessInsertDbRef = this.fireStoreDB.collection<AccessDb>('access').doc(accessInsert.id).ref;
        batch.set(accessInsertDbRef, accessInsert);

        //-- Access Insert Event Insert -------------------------------------------------------------------------------------------------------------->
        const eventInsertDbRef = this.fireStoreDB.collection<EventDb<AccessLastEventIdentifierFields>>('event').doc(eventInsert.id).ref;
        batch.set(eventInsertDbRef, eventInsert);

        //-- Insert Email ----------------------------------------------------------------------------------->
        const emailInsertDbRef = this.fireStoreDB.collection<EmailDb>('email').doc(emailInsert.id).ref;
        batch.set(emailInsertDbRef, emailInsert);

        //-- Email Insert Event Insert -------------------------------------------------------------------------------------------------------------->
        const emailEventInsertDbRef = this.fireStoreDB.collection<EventDb<EmailLastEventIdentifierFields>>('event').doc(emailEventInsert.id).ref;
        batch.set(emailEventInsertDbRef, emailEventInsert);

        return from(batch.commit());
    };

}
