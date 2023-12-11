/*************************************************************************************************
** Imports                                                                                      **
**************************************************************************************************/
//-- **Core** -----------------------------------------------------------------------------------//
import { Injectable } from '@angular/core';
//-- **Services/Helpers** -----------------------------------------------------------------------//
import { FirebaseHelper } from '../../shared/helpers/firebase.helper';
import * as dateHelper from '../../shared/helpers/date.helper';
//-- **Data Models** ----------------------------------------------------------------------------//
import { accessFieldsToDeleteOnServerSend } from './../models/access.model';
import { AccessLastEventIdentifierFields } from './../models/access.model';
import { eventOperationOptions } from '../../event/models/event.model';
import { environment } from '../../../environments/environment';
import { accessDatabaseName } from './../models/access.model';
import { initialEventDb } from '../../event/models/event.model';
import { accessDataVersion } from './../models/access.model';
import { initialAccessDb } from './../models/access.model';
import { accessEvents } from './../models/access.model';
import { EventDb } from '../../event/models/event.model';
import { AccessDb } from './../models/access.model';
import { UserDb } from './../../user/models/user.model';
import { mediaFormatOptions, mediaTypeOptions } from '../../media/models/media.model';


@Injectable({
    providedIn: 'root'
})

/*************************************************************************************************
**  Enriches Data For Api Calls/Actions                                                         **
**************************************************************************************************/
export class AccessDataObjHelper {

    constructor(
        private firebaseHelper: FirebaseHelper
    ) { }


    createAccess(access: AccessDb, currentUser: UserDb, _eventCorrelationId?: string) {
        let stateUpdates: { accessObj: AccessDb } = { accessObj: { ...initialAccessDb } };

        //--- Data Enrichment ------------------------------------>
        const currentUserIdExists = (currentUser?.id?.length > 0);
        const whoUserId = (currentUserIdExists)
            ? currentUser?.id
            : environment.appName;

        const whoUserFullName = (currentUserIdExists)
            ? currentUser.fullName
            : environment.appName;

        const noAccessIdExists = !(access?.id?.length > 0);

        const mediaIds = access?.linkedMedia?.map(item => item?.id)

        //-- Set/Enrich Friendly Main Photo Url ------------------------------------------------------------------------------------------------------------------------------>
        const mainLinkedMedia = access?.linkedMedia?.filter(item => item?.type == mediaTypeOptions?.accessMainMedia && item?.format == mediaFormatOptions?.image);
        const hasMainLinkedMedia = (mainLinkedMedia?.length > 0);
        const mainPhotoUrl = (hasMainLinkedMedia) ? mainLinkedMedia[0]?.downloadUrl : null;

        //-- Identifier Fields --------------------------------------------------->
        const accessId = (noAccessIdExists)
            ? this.firebaseHelper.generateFirebaseId()
            : access.id;

        const eventId = this.firebaseHelper.generateFirebaseId();
        const noEventCorrelationIdExists = !(_eventCorrelationId?.length > 0);
        const eventCorrelationId = (noEventCorrelationIdExists)
            ? this.firebaseHelper.generateFirebaseId()
            : _eventCorrelationId;

        //-- Enrich Data ---------------------------------------------------------------------->
        const email = access?.email?.toLowerCase();
        console.log('access', access)



        const updatedPermissions = [...access?.permissions]
        const permissions = [...new Set(updatedPermissions)];

        //--- Access Obj ------------------------->
        const accessObj: AccessDb = {
            ...initialAccessDb,
            ...access,
            email,
            permissions,
            id: accessId,
            lastEvent: {
                ...access?.lastEvent,
                ids: {
                    ...initialAccessDb?.lastEvent?.ids,
                    ...access?.lastEvent?.ids,
                    eventId,
                    eventCorrelationId,
                    userId: whoUserId,
                    mediaIds: mediaIds,
                    accessId,
                    //add additional id's here
                }
            },
            display: {
                ...initialAccessDb?.display,
                ...access?.display,
                mainPhotoUrl: mainPhotoUrl
            }
        };

        //-- Generate LastEvent Object ---------------------------------------->
        const lastEvent: EventDb<AccessLastEventIdentifierFields> = {
            ...initialAccessDb?.lastEvent,
            id: eventId,
            ids: {
                ...accessObj?.lastEvent?.ids,
            },
            context: null,
            who: {
                id: whoUserId,
                name: whoUserFullName
            },
            what: {
                ...initialAccessDb?.lastEvent.what,
                event: accessEvents.create,
                databaseName: accessDatabaseName,
                operation: eventOperationOptions.create,
                dataVersion: accessDataVersion,
            },
            when: dateHelper.getTimeFromDateTimestamp(new Date()),
        }


        //-- Access Insert ----------------------------------------->
        const accessInsert: AccessDb = {
            ...accessObj,
            lastEvent,
            createdBy: {
                id: whoUserId,
                name: whoUserFullName
            },
            createdAt: dateHelper.getTimeFromDateTimestamp(new Date())
        }

        //-- Delete Fields Before Sending To Server ------------------>
        accessFieldsToDeleteOnServerSend.forEach(fieldToDelete => {
            try {
                delete accessInsert?.[fieldToDelete];
            }
            catch (error) {
                return;
            }
        });

        //-- Event Insert ---------------------------------------------->
        const eventInsert: EventDb<AccessLastEventIdentifierFields> = {
            ...accessInsert.lastEvent,
            what: {
                ...accessInsert?.lastEvent?.what,
                obj: { ...accessInsert }
            }
        }

        //-- State Updates ---------->
        stateUpdates.accessObj = {
            ...accessObj,
            lastEvent,
            createdBy: {
                id: whoUserId,
                name: whoUserFullName
            },
            createdAt: dateHelper.getTimeFromDateTimestamp(new Date())
        };

        return {
            eventInsert,
            accessInsert,
            stateUpdates
        }
    }


    //-- Update access --------------------------------------------------------------//
    updateAccess(access: AccessDb, originalAccessObj: AccessDb, currentUser: UserDb, _eventCorrelationId?: string) {
        let stateUpdates: { accessObj: AccessDb } = { accessObj: { ...initialAccessDb } };

        const noUserIdExists = !(currentUser?.id?.length > 0);
        const whoUserId = (noUserIdExists)
            ? environment.appName
            : currentUser.id;

        const whoUserFullName = (noUserIdExists)
            ? environment.appName
            : currentUser.fullName;

        const mediaIds = access?.linkedMedia?.map(item => item?.id);

        //-- Set/Enrich Friendly Main Photo Url ------------------------------------------------------------------------------------------------------------------------------>
        const mainLinkedMedia = access?.linkedMedia?.filter(item => item?.type == mediaTypeOptions?.accessMainMedia && item?.format == mediaFormatOptions?.image);
        const hasMainLinkedMedia = (mainLinkedMedia?.length > 0);
        const mainPhotoUrl = (hasMainLinkedMedia) ? mainLinkedMedia[0]?.downloadUrl : null;

        //-- Identifier Fields --------------------------------------------------->
        const eventId = this.firebaseHelper.generateFirebaseId();
        const noEventCorrelationIdExists = !(_eventCorrelationId?.length > 0);
        const eventCorrelationId = (noEventCorrelationIdExists)
            ? this.firebaseHelper.generateFirebaseId()
            : _eventCorrelationId;

        //-- Enrich Data ---------------------------------------------------------------------->
        const email = access?.email?.toLowerCase();


        const updatedPermissions = [...access?.permissions]
        const permissions = [...new Set(updatedPermissions)];

        //--- Access Obj -------------------------->
        const accessObj: AccessDb = {
            ...initialAccessDb,
            ...originalAccessObj,
            ...access,
            email,
            permissions,
            lastEvent: {
                ...originalAccessObj?.lastEvent,
                ...access?.lastEvent,
                ids: {
                    ...initialAccessDb?.lastEvent?.ids,
                    ...originalAccessObj?.lastEvent?.ids,
                    ...access?.lastEvent?.ids,
                    eventId,
                    eventCorrelationId,
                    userId: whoUserId,
                    mediaIds: mediaIds,
                    accessId: originalAccessObj?.id,
                    //add additional id's here
                }
            },
            display: {
                ...initialAccessDb?.display,
                ...originalAccessObj?.display,
                ...access?.display,
                mainPhotoUrl: mainPhotoUrl
            }

        };

        console.log('access?.linkedMedia', access?.linkedMedia)


        //-- Generate LastEvent Object -------------------------------->
        const lastEvent: EventDb<AccessLastEventIdentifierFields> = {
            ...initialAccessDb?.lastEvent,
            id: eventId,
            ids: {
                ...accessObj?.lastEvent?.ids,
            },
            context: null,
            who: {
                id: whoUserId,
                name: whoUserFullName
            },
            what: {
                ...initialAccessDb?.lastEvent?.what,
                event: accessEvents.update,
                databaseName: accessDatabaseName,
                operation: eventOperationOptions.update,
                dataVersion: accessDataVersion,
            },
            when: dateHelper.getTimeFromDateTimestamp(new Date()),
        }

        //-- Access Update ------------->
        const accessUpdate: AccessDb = {
            ...accessObj,
            lastEvent
        }

        //-- Delete Fields Before Sending To Server ------------------>
        accessFieldsToDeleteOnServerSend.forEach(fieldToDelete => {
            try {
                delete accessUpdate?.[fieldToDelete];
            }
            catch (error) {
                return;
            }
        });

        //-- Event Insert ---------------------------------------------->
        const eventInsert: EventDb<AccessLastEventIdentifierFields> = {
            ...accessUpdate.lastEvent,
            what: {
                ...accessUpdate?.lastEvent?.what,
                obj: { ...accessUpdate }
            }
        }

        //-- State Updates ---------->
        stateUpdates.accessObj = {
            ...accessObj,
            lastEvent
        };

        return {
            eventInsert,
            accessUpdate,
            stateUpdates
        }
    }

    //-- Delete access --------------------------------------------------------//
    deleteAccess(access: AccessDb, currentUser: UserDb, _eventCorrelationId?: string) {
        let stateUpdates: { accessObj: AccessDb } = { accessObj: { ...initialAccessDb } };

        const noUserIdExists = !(currentUser?.id?.length > 0);
        const whoUserId = (noUserIdExists)
            ? environment.appName
            : currentUser.id;

        const whoUserFullName = (noUserIdExists)
            ? environment.appName
            : currentUser.fullName;

        const mediaIds = access?.linkedMedia?.map(item => item?.id)

        //-- Identifier Fields --------------------------------------------------->
        const eventId = this.firebaseHelper.generateFirebaseId();
        const noEventCorrelationIdExists = !(_eventCorrelationId?.length > 0);
        const eventCorrelationId = (noEventCorrelationIdExists)
            ? this.firebaseHelper.generateFirebaseId()
            : _eventCorrelationId;

        //--- Access Obj -------------------------->
        const accessObj: AccessDb = {
            ...initialAccessDb,
            ...access,
            lastEvent: {
                ...access?.lastEvent,
                ids: {
                    ...initialAccessDb?.lastEvent?.ids,
                    ...access?.lastEvent?.ids,
                    eventId,
                    eventCorrelationId,
                    userId: whoUserId,
                    mediaIds: mediaIds,
                    accessId: access?.id,
                    //add additional id's here
                }
            },
        };

        //-- Generate LastEvent Object -------------------------------->
        const lastEvent: EventDb<AccessLastEventIdentifierFields> = {
            ...initialAccessDb?.lastEvent,
            id: eventId,
            ids: {
                ...accessObj?.lastEvent?.ids,
            },
            context: null,
            who: {
                id: whoUserId,
                name: whoUserFullName
            },
            what: {
                ...initialAccessDb?.lastEvent?.what,
                event: accessEvents.delete,
                databaseName: accessDatabaseName,
                operation: eventOperationOptions.delete,
                dataVersion: accessDataVersion,
            },
            when: dateHelper.getTimeFromDateTimestamp(new Date()),
        }

        //-- Access Delete -------------->
        const accessDelete: AccessDb = {
            ...accessObj,
            lastEvent
        }

        //-- Delete Fields Before Sending To Server ------------------>
        accessFieldsToDeleteOnServerSend.forEach(fieldToDelete => {
            try {
                delete accessDelete?.[fieldToDelete];
            }
            catch (error) {
                return;
            }
        });

        //-- Event Insert ---------------------------------------------->
        const eventInsert: EventDb<AccessLastEventIdentifierFields> = {
            ...accessDelete.lastEvent,
            what: {
                ...accessDelete?.lastEvent?.what,
                obj: { ...accessDelete }
            }
        }

        //-- State Updates ---------->
        stateUpdates.accessObj = {
            ...accessDelete
        };

        return {
            eventInsert,
            stateUpdates
        }
    }


    

    enrichAccessServerResponse(serverResponse: any) {
        if (serverResponse?.docs) {
            return serverResponse.docs.map(doc => {
                //-- Check to see if 'lastEvent' field exists in order to enrich date fields -->
                const hasLastEventField = this.hasPropertyField(doc?.data(), 'lastEvent');
                const hasCreatedAtField = this.hasPropertyField(doc?.data(), 'createdAt');


                //-- Has CreatedAt Field must convert dates ------------------------>
                let createdAt = { ...initialAccessDb.createdAt };
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
                let createdAt = { ...initialAccessDb?.createdAt };
                if (hasCreatedAtField) {
                    createdAt = {
                        ...item?.payload.doc.data()?.createdAt,
                        timestamp: item?.payload.doc.data()?.createdAt?.timestamp?.toDate() ?? null
                    };
                }

                //-- Has lastEvent Field must convert dates ----------------------------->
                let lastEvent = { ...initialAccessDb?.lastEvent };
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

                return {
                    ...item?.payload.doc.data(),
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
