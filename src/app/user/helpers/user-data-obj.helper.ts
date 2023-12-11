/*************************************************************************************************
** Imports                                                                                      **
**************************************************************************************************/
//-- **Core** -----------------------------------------------------------------------------------//
import { Injectable } from '@angular/core';
//-- **Services/Helpers** -----------------------------------------------------------------------//
import { FirebaseHelper } from '../../shared/helpers/firebase.helper';
import * as dateHelper from '../../shared/helpers/date.helper';
//-- **Data Models** ----------------------------------------------------------------------------//
import { userFieldsToDeleteOnServerSend } from './../models/user.model';
import { UserLastEventIdentifierFields } from './../models/user.model';
import { eventOperationOptions } from '../../event/models/event.model';
import { environment } from '../../../environments/environment';
import { userDatabaseName } from './../models/user.model';
import { userDataVersion } from './../models/user.model';
import { initialUserDb } from './../models/user.model';
import { userEvents } from './../models/user.model';
import { EventDb } from '../../event/models/event.model';
import { UserDb } from '../../user/models/user.model';
import { mediaFormatOptions, mediaTypeOptions } from '../../media/models/media.model';


@Injectable({
    providedIn: 'root'
})

/*************************************************************************************************
**  Enriches Data For Api Calls/Actions                                                         **
**************************************************************************************************/
export class UserDataObjHelper {

    constructor(
        private firebaseHelper: FirebaseHelper
    ) { }

    createUser(user: UserDb, currentUser: UserDb, _eventCorrelationId?: string) {
        let stateUpdates: { userObj: UserDb } = { userObj: {...initialUserDb} };

        //--- Data Enrichment ------------------------------------>
        const noUserIdExists = !(user?.id?.length > 0);
        const mediaIds = user?.linkedMedia?.map(item => item?.id)

        //-- Set/Enrich Friendly Main Photo Url ------------------------------------------------------------------------------------------------------------------------------>
        const mainLinkedMedia = user?.linkedMedia?.filter(item => item?.type == mediaTypeOptions?.userMainMedia && item?.format == mediaFormatOptions?.image);
        const hasMainLinkedMedia = (mainLinkedMedia?.length > 0);
        const mainPhotoUrl = (hasMainLinkedMedia) ? mainLinkedMedia[0]?.downloadUrl : null;

        //-- Identifier Fields --------------------------------------------------->
        const userId = (noUserIdExists)
         ? this.firebaseHelper.generateFirebaseId()
         : user.id;

        const whoUserId = (currentUser?.id?.length > 0)
            ? currentUser?.id
            : environment.appName;

        const whoUserFullName = (currentUser?.id?.length > 0)
            ? currentUser.fullName
            : environment.appName;

        const eventId = this.firebaseHelper.generateFirebaseId();
        const noEventCorrelationIdExists = !(_eventCorrelationId?.length > 0);
        const eventCorrelationId = (noEventCorrelationIdExists)
            ? this.firebaseHelper.generateFirebaseId()
            : _eventCorrelationId;

        //--- User Obj ------------------------->
        const userObj: UserDb = {
            ...initialUserDb,
            ...user,
            id: userId,
            lastEvent: {
                ...user?.lastEvent,
                ids: {
                    ...initialUserDb?.lastEvent?.ids,
                    ...user?.lastEvent?.ids,
                    eventId,
                    eventCorrelationId,
                    userId,
                    mediaIds: mediaIds,
                    //add additional id's here
                }
            },
            display: {
                ...initialUserDb?.display,
                ...user?.display,
                mainPhotoUrl: mainPhotoUrl
            }
        };

        //-- Generate LastEvent Object ---------------------------------------->
        const lastEvent: EventDb<UserLastEventIdentifierFields> = {
            ...initialUserDb?.lastEvent,
            id: eventId,
            ids: {
             ...userObj?.lastEvent?.ids,
            },
            context: null,
            who: {
                id: whoUserId,
                name: whoUserFullName
            },
            what: {
                ...initialUserDb?.lastEvent.what,
                event: userEvents.create,
                databaseName: userDatabaseName,
                operation: eventOperationOptions.create,
                dataVersion: userDataVersion,
            },
            when: dateHelper.getTimeFromDateTimestamp(new Date()),
        }


        //-- User Insert ----------------------------------------->
        const userInsert: UserDb = {
            ...userObj,
            lastEvent,
            createdBy: {
                id: whoUserId,
                name: whoUserFullName
            },
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
                ...userInsert?.lastEvent?.what,
                obj: { ...userInsert }
            }
        }

        //-- State Updates ---------->
        stateUpdates.userObj = {
            ...userObj,
            lastEvent,
            createdBy: {
                id: whoUserId,
                name: whoUserFullName
            },
            createdAt: dateHelper.getTimeFromDateTimestamp(new Date())
        };

        return {
            eventInsert,
            userInsert,
            stateUpdates
        }
    }


    //-- Update user ------------------------------------------------------------------------------------//
    updateUser(user: UserDb, originalUserObj: UserDb, currentUser: UserDb, _eventCorrelationId?: string) {
        let stateUpdates: { userObj: UserDb } = { userObj: {...initialUserDb}  };

        const whoUserId = (currentUser?.id?.length > 0)
            ? currentUser?.id 
            : environment.appName;

        const whoUserFullName = (currentUser?.id?.length > 0)
            ? currentUser.fullName 
            : environment.appName;

        const mediaIds = user?.linkedMedia?.map(item => item?.id);
        //-- Set/Enrich Friendly Main Photo Url ------------------------------------------------------------------------------------------------------------------------------>
        const mainLinkedMedia = user?.linkedMedia?.filter(item => item?.type == mediaTypeOptions?.userMainMedia && item?.format == mediaFormatOptions?.image);
        const hasMainLinkedMedia = (mainLinkedMedia?.length > 0);
        const mainPhotoUrl = (hasMainLinkedMedia) ? mainLinkedMedia[0]?.downloadUrl : null;

        //-- Identifier Fields --------------------------------------------------->
        const eventId = this.firebaseHelper.generateFirebaseId();
        const noEventCorrelationIdExists = !(_eventCorrelationId?.length > 0);
        const eventCorrelationId = (noEventCorrelationIdExists)
            ? this.firebaseHelper.generateFirebaseId()
            : _eventCorrelationId;

        //--- User Obj -------------------------->
        const userObj: UserDb = {
            ...initialUserDb,
            ...originalUserObj,
            ...user,
            lastEvent: {
                ...originalUserObj?.lastEvent,
                ...user?.lastEvent,
                ids: {
                    ...initialUserDb?.lastEvent?.ids,
                    ...originalUserObj?.lastEvent?.ids,
                    ...user?.lastEvent?.ids,
                    eventId,
                    eventCorrelationId,
                    userId: whoUserId,
                    mediaIds: mediaIds,
                    //add additional id's here
                }
            },
            display: {
                ...initialUserDb?.display,
                ...originalUserObj?.display,
                ...user?.display,
                mainPhotoUrl: mainPhotoUrl
            }
        };


        //-- Generate LastEvent Object -------------------------------->
        const lastEvent: EventDb<UserLastEventIdentifierFields> = {
            ...initialUserDb?.lastEvent,
            id: eventId,
            ids: {
             ...userObj?.lastEvent?.ids,
            },
            context: null,
            who: {
                id: whoUserId,
                name: whoUserFullName
            },
            what: {
                ...initialUserDb?.lastEvent?.what,
                event: userEvents.update,
                databaseName: userDatabaseName,
                operation: eventOperationOptions.update,
                dataVersion: userDataVersion,
            },
            when: dateHelper.getTimeFromDateTimestamp(new Date()),
        }

        //-- User Update ------------->
        const userUpdate: UserDb = {
            ...userObj,
            lastEvent
        }

        //-- Delete Fields Before Sending To Server ------------------>
        userFieldsToDeleteOnServerSend.forEach(fieldToDelete => {
            try {
                delete userUpdate?.[fieldToDelete];
            }
            catch (error) {
                return;
            }
        });

        //-- Event Insert ---------------------------------------------->
        const eventInsert: EventDb<UserLastEventIdentifierFields> = {
            ...userUpdate.lastEvent,
            what: {
                ...userUpdate?.lastEvent?.what,
                obj: { ...userUpdate }
            }
        }

        //-- State Updates ---------->
        stateUpdates.userObj = {
            ...userObj,
            lastEvent
        };

        return {
            eventInsert,
            userUpdate,
            stateUpdates
        }
    }

    //-- Delete user --------------------------------------------------------//
    deleteUser(user: UserDb, currentUser: UserDb, _eventCorrelationId?: string) {
        let stateUpdates: { userObj: UserDb } = { userObj: {...initialUserDb} };

        const whoUserId = (currentUser?.id?.length > 0)
            ? currentUser?.id
            : environment.appName;

        const whoUserFullName = (currentUser?.id?.length > 0)
            ? currentUser.fullName
            : environment.appName;

        const mediaIds = user?.linkedMedia?.map(item => item?.id)

        //-- Identifier Fields --------------------------------------------------->
        const eventId = this.firebaseHelper.generateFirebaseId();
        const noEventCorrelationIdExists = !(_eventCorrelationId?.length > 0);
        const eventCorrelationId = (noEventCorrelationIdExists)
            ? this.firebaseHelper.generateFirebaseId()
            : _eventCorrelationId;

        //--- User Obj -------------------------->
        const userObj: UserDb = {
            ...initialUserDb,
            ...user,
            lastEvent: {
                ...user?.lastEvent,
                ids: {
                    ...initialUserDb?.lastEvent?.ids,
                    ...user?.lastEvent?.ids,
                    eventId,
                    eventCorrelationId,
                    userId: whoUserId,
                    mediaIds: mediaIds,
                    //add additional id's here
                }
            },
        };

        //-- Generate LastEvent Object -------------------------------->
        const lastEvent: EventDb<UserLastEventIdentifierFields> = {
            ...initialUserDb?.lastEvent,
            id: eventId,
            ids: {
               ...userObj?.lastEvent?.ids,
            },
            context: null,
            who: {
                id: whoUserId,
                name: whoUserFullName
            },
            what: {
                ...initialUserDb?.lastEvent?.what,
                event: userEvents.delete,
                databaseName: userDatabaseName,
                operation: eventOperationOptions.delete,
                dataVersion: userDataVersion,
            },
            when: dateHelper.getTimeFromDateTimestamp(new Date()),
        }

        //-- User Delete -------------->
        const userDelete: UserDb = {
            ...userObj,
            lastEvent
        }

        //-- Delete Fields Before Sending To Server ------------------>
        userFieldsToDeleteOnServerSend.forEach(fieldToDelete => {
            try {
                delete userDelete?.[fieldToDelete];
            }
            catch (error) {
                return;
            }
        });

        //-- Event Insert ---------------------------------------------->
        const eventInsert: EventDb<UserLastEventIdentifierFields> = {
            ...userDelete.lastEvent,
            what: {
                ...userDelete?.lastEvent?.what,
                obj: { ...userDelete }
            }
        }

        //-- State Updates ---------->
        stateUpdates.userObj = {
            ...userDelete
        };

        return {
            eventInsert,
            stateUpdates
        }
    }


    enrichUserServerResponse(serverResponse: any) {
        if (serverResponse?.docs) {
            return serverResponse.docs.map(doc => {
                //-- Check to see if 'lastEvent' field exists in order to enrich date fields -->
                const hasLastEventField = this.hasPropertyField(doc?.data(), 'lastEvent');
                const hasCreatedAtField = this.hasPropertyField(doc?.data(), 'createdAt');
                const hasDateOfBirthField = this.hasPropertyField(doc?.data(), 'dateOfBirth');

                //-- Has CreatedAt Field must convert dates ------------------------>
                let createdAt = { ...initialUserDb?.createdAt };
                if (hasCreatedAtField) {
                    createdAt = {
                        ...doc.data()?.createdAt,
                        timestamp: doc.data()?.createdAt?.timestamp?.toDate() ?? null
                    };
                }

                //-- Has lastEvent Field must convert dates ----------------------------->
                let lastEvent = { ...initialUserDb?.lastEvent };
                if (hasLastEventField) {
                    lastEvent = {
                        ...doc.data()?.lastEvent,
                        when: {
                            ...doc.data()?.lastEvent?.when,
                            timestamp: doc.data()?.lastEvent?.when?.timestamp?.toDate() ?? null
                        }
                    };
                }

                //-- Has lastEvent Field must convert dates ----------------------------->
                let dateOfBirth = initialUserDb?.dateOfBirth;
                if (hasDateOfBirthField) {
                    dateOfBirth = doc.data()?.dateOfBirth.toDate() ?? null;
                }

                return {
                    ...doc.data(),
                    dateOfBirth,
                    lastEvent,
                    createdAt
                };
            })
        }
        //---- Only Single Document Exists -------------------------------------------------------->
        else {
            return serverResponse.map(item => {
                const hasLastEventField = this.hasPropertyField(item?.payload.doc.data(), 'lastEvent');
                const hasCreatedAtField = this.hasPropertyField(item?.payload.doc.data(), 'createdAt');
                const hasDateOfBirthField = this.hasPropertyField(item?.payload.doc.data(), 'dateOfBirth');


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
                            timestamp: item?.payload.doc.data()?.lastEvent?.when?.timestamp?.toDate() ?? null
                        }
                    };
                }

                //-- Has hasDateOfBirthField Field must convert dates ----------------------------->
                let dateOfBirth = initialUserDb?.dateOfBirth;
                if (hasDateOfBirthField) {
                    dateOfBirth = item?.payload.doc.data()?.dateOfBirth?.toDate() ?? null;
                }

                return {
                    ...item?.payload.doc.data(),
                    dateOfBirth,
                    lastEvent,
                    createdAt

                };
            });
        }
    }


    hasPropertyField(obj, prop) {
        const proto = obj.__proto__ || obj.constructor.prototype;
        return (prop in obj) &&
            (!(prop in proto) || proto[prop] !== obj[prop]);
    }

}
