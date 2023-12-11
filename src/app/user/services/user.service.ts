/*************************************************************************************************
** Imports                                                                                      **
**************************************************************************************************/
//-- **Core** -----------------------------------------------------------------------------------//
import { Injectable } from '@angular/core';
import { from } from 'rxjs';
//-- **Data Models** ----------------------------------------------------------------------------//
import { EventDb } from '../../event/models/event.model';
import { UserDb, UserLastEventIdentifierFields } from './../models/user.model';
//-- **Firebase** -------------------------------------------------------------------------------//
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Injectable({
    providedIn: 'root'
})

/*************************************************************************************************
**  API Service Calls                                                                           **
**************************************************************************************************/
export class UserService {
    constructor(
        public fireStoreDB: AngularFirestore,
    ) { }


    getUserArray () {
        return this.fireStoreDB.collection<UserDb>('user').get();
    };

    getUser(userId: string) {
        return this.fireStoreDB.collection<UserDb>('user', ref => ref.where('id', '==', userId)).get();
    };

    getUserByEmail(email: string) {
        return this.fireStoreDB.collection<UserDb>('user', ref => ref.where('email', '==', email)).get();
    };

    createUser(userInsert: UserDb, eventInsert: EventDb<UserLastEventIdentifierFields>) {
        const batch = this.fireStoreDB.firestore.batch();

        //-- Insert User ----------------------------------------------------------------------------------->
        const userInsertDbRef = this.fireStoreDB.collection<UserDb>('user').doc(userInsert.id).ref;
        batch.set(userInsertDbRef, userInsert);

        //-- Event Insert -------------------------------------------------------------------------------------------------------------->
        const eventInsertDbRef = this.fireStoreDB.collection<EventDb<UserLastEventIdentifierFields>>('event').doc(eventInsert.id).ref;
        batch.set(eventInsertDbRef, eventInsert);

        return from(batch.commit());
    };

    updateUser(userUpdate: UserDb, eventUpdate: EventDb<UserLastEventIdentifierFields>) {
        const batch = this.fireStoreDB.firestore.batch();

        //-- Update User ---------------------------------------------------------------------------------->
        const userUpdateDbRef = this.fireStoreDB.collection<UserDb>('user').doc(userUpdate.id).ref;
        batch.set(userUpdateDbRef, userUpdate);

        //-- Event Insert -------------------------------------------------------------------------------------------------------------->
        const eventUpdateDbRef = this.fireStoreDB.collection<EventDb<UserLastEventIdentifierFields>>('event').doc(eventUpdate.id).ref;
        batch.set(eventUpdateDbRef, eventUpdate);

        return from(batch.commit());
    };


    deleteUser(userId: string, eventDelete: EventDb<UserLastEventIdentifierFields>) {
        const batch = this.fireStoreDB.firestore.batch();

        //-- Delete User ----------------------------------------------------------------->
        const userDeleteDbRef = this.fireStoreDB.collection('user').doc(userId).ref;
        batch.delete(userDeleteDbRef);

        //-- Event Insert -------------------------------------------------------------------->
        const eventDeleteDbRef = this.fireStoreDB.collection('event').doc(eventDelete.id).ref;
        batch.set(eventDeleteDbRef, eventDelete);

        return from(batch.commit());
    };

}
