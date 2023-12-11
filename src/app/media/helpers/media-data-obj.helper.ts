/*************************************************************************************************
** Imports                                                                                      **
**************************************************************************************************/
//-- **Core** -----------------------------------------------------------------------------------//
import { Injectable } from '@angular/core';
//-- **Services/Helpers** -----------------------------------------------------------------------//
import { FirebaseHelper } from '../../shared/helpers/firebase.helper';
import * as dateHelper from '../../shared/helpers/date.helper';
//-- **Data Models** ----------------------------------------------------------------------------//
import { mediaFieldsToDeleteOnServerSend } from './../models/media.model';
import { MediaLastEventIdentifierFields } from './../models/media.model';
import { eventOperationOptions } from '../../event/models/event.model';
import { environment } from '../../../environments/environment';
import { mediaDatabaseName } from './../models/media.model';
import { initialEventDb } from '../../event/models/event.model';
import { mediaDataVersion } from './../models/media.model';
import { initialMediaDb } from './../models/media.model';
import { mediaEvents } from './../models/media.model';
import { EventDb } from '../../event/models/event.model';
import { UserDb } from '../../user/models/user.model';
import { MediaDb } from './../models/media.model';


@Injectable({
    providedIn: 'root'
})

/*************************************************************************************************
**  Enriches Data For Api Calls/Actions                                                         **
**************************************************************************************************/
export class MediaDataObjHelper {

    constructor(
        private firebaseHelper: FirebaseHelper
    ) { }

    createMedia(media: MediaDb, user?: UserDb) {
        let stateUpdates: { mediaObj: MediaDb } = { mediaObj: { ...initialMediaDb } };

        //-- Identifier Fields --------------------------------------------------->
        const mediaId = (media?.id == null)
            ? this.firebaseHelper.generateFirebaseId()
            : media.id;

        const eventCorrelationId = this.firebaseHelper.generateFirebaseId();
        const eventId = this.firebaseHelper.generateFirebaseId();

        //--- Media Obj ------------------------->
        const mediaObj: MediaDb = {
            ...initialMediaDb,
            ...media,
            id: mediaId,
            lastEvent: {
                ...media?.lastEvent,
                ids: {
                    ...initialMediaDb?.lastEvent?.ids,
                    ...media?.lastEvent?.ids,
                    eventId,
                    eventCorrelationId,
                    userId: user?.id,
                    mediaId,
                    //add additional id's here
                }
            },
        };

        //-- Generate LastEvent Object ---------------------------------------->
        const lastEvent: EventDb<MediaLastEventIdentifierFields> = {
            ...initialMediaDb?.lastEvent,
            id: eventId,
            ids: {
                ...mediaObj?.lastEvent?.ids,
            },
            context: null,
            who: {
                id: user?.id ?? environment.appName,
                name: user?.fullName ?? environment.appName
            },
            what: {
                ...initialMediaDb?.lastEvent.what,
                event: mediaEvents.create,
                databaseName: mediaDatabaseName,
                operation: eventOperationOptions.create,
                dataVersion: mediaDataVersion,
            },
            when: dateHelper.getTimeFromDateTimestamp(new Date()),
        }


        //-- Media Insert ----------------------------------------->
        const mediaInsert: MediaDb = {
            ...mediaObj,
            lastEvent,
            createdBy: {
                id: user?.id ?? environment.appName,
                name: user?.fullName ?? environment.appName
            },
            createdAt: dateHelper.getTimeFromDateTimestamp(new Date())
        }

        //-- Delete Fields Before Sending To Server ------------------>
        mediaFieldsToDeleteOnServerSend.forEach(fieldToDelete => {
            try {
                delete mediaInsert?.[fieldToDelete];
            }
            catch (error) {
                return;
            }
        });

        //-- Event Insert ---------------------------------------------->
        const eventInsert: EventDb<MediaLastEventIdentifierFields> = {
            ...mediaInsert.lastEvent,
            what: {
                ...mediaInsert?.lastEvent?.what,
                obj: { ...mediaInsert }
            }
        }

        //-- State Updates ---------->
        stateUpdates.mediaObj = {
            ...mediaObj,
            lastEvent
        };

        return {
            eventInsert,
            mediaInsert,
            stateUpdates
        }
    }


    //-- Update media --------------------------------------------------------------//
    updateMedia(media: MediaDb, originalMediaObj: MediaDb, user?: UserDb) {
        let stateUpdates: { mediaObj: MediaDb } = { mediaObj: { ...initialMediaDb } };

        //-- Identifier Fields --------------------------------------------------->
        const eventId = this.firebaseHelper.generateFirebaseId();
        const eventCorrelationId = this.firebaseHelper.generateFirebaseId();

        //--- Media Obj -------------------------->
        const mediaObj: MediaDb = {
            ...initialMediaDb,
            ...media,
            lastEvent: {
                ...media?.lastEvent,
                ids: {
                    ...initialMediaDb?.lastEvent?.ids,
                    ...originalMediaObj?.lastEvent?.ids,
                    eventId,
                    eventCorrelationId,
                    userId: user?.id ?? null,
                    mediaId: originalMediaObj?.id,
                    //add additional id's here
                }
            },
        };

        //-- Generate LastEvent Object -------------------------------->
        const lastEvent: EventDb<MediaLastEventIdentifierFields> = {
            ...initialMediaDb,
            id: eventId,
            ids: {
                ...mediaObj?.lastEvent?.ids,
            },
            context: null,
            who: {
                id: user?.id ?? environment.appName,
                name: user?.fullName ?? environment.appName
            },
            what: {
                ...initialMediaDb?.lastEvent?.what,
                event: mediaEvents.update,
                databaseName: mediaDatabaseName,
                operation: eventOperationOptions.update,
                dataVersion: mediaDataVersion,
            },
            when: dateHelper.getTimeFromDateTimestamp(new Date()),
        }

        //-- Media Update ------------->
        const mediaUpdate: MediaDb = {
            ...mediaObj,
            lastEvent
        }

        //-- Delete Fields Before Sending To Server ------------------>
        mediaFieldsToDeleteOnServerSend.forEach(fieldToDelete => {
            try {
                delete mediaUpdate?.[fieldToDelete];
            }
            catch (error) {
                return;
            }
        });

        //-- Event Insert ---------------------------------------------->
        const eventInsert: EventDb<MediaLastEventIdentifierFields> = {
            ...mediaUpdate.lastEvent,
            what: {
                ...mediaUpdate?.lastEvent?.what,
                obj: { ...mediaUpdate }
            }
        }

        //-- State Updates ---------->
        stateUpdates.mediaObj = {
            ...mediaObj,
            lastEvent
        };

        return {
            eventInsert,
            mediaUpdate,
            stateUpdates
        }
    }

    //-- Delete media --------------------------------------------------------//
    deleteMedia(media: MediaDb, user?: UserDb) {
        let stateUpdates: { mediaObj: MediaDb } = { mediaObj: { ...initialMediaDb } };

        //-- Identifier Fields --------------------------------------------------->
        const eventId = this.firebaseHelper.generateFirebaseId();
        const eventCorrelationId = this.firebaseHelper.generateFirebaseId();

        //--- Media Obj -------------------------->
        const mediaObj: MediaDb = {
            ...initialMediaDb,
            ...media,
            lastEvent: {
                ...media?.lastEvent,
                ids: {
                    ...initialMediaDb?.lastEvent?.ids,
                    ...media?.lastEvent?.ids,
                    eventId,
                    eventCorrelationId,
                    userId: user?.id ?? null,
                    mediaId: media?.id,
                    //add additional id's here
                }
            },
        };

        //-- Generate LastEvent Object -------------------------------->
        const lastEvent: EventDb<MediaLastEventIdentifierFields> = {
            ...initialEventDb,
            id: eventId,
            ids: {
                ...mediaObj?.lastEvent?.ids,
            },
            context: null,
            who: {
                id: user?.id ?? environment.appName,
                name: user?.fullName ?? environment.appName
            },
            what: {
                ...initialMediaDb?.lastEvent?.what,
                event: mediaEvents.delete,
                databaseName: mediaDatabaseName,
                operation: eventOperationOptions.delete,
                dataVersion: mediaDataVersion,
            },
            when: dateHelper.getTimeFromDateTimestamp(new Date()),
        }

        //-- Media Delete -------------->
        const mediaDelete: MediaDb = {
            ...mediaObj,
            lastEvent
        }

        //-- Delete Fields Before Sending To Server ------------------>
        mediaFieldsToDeleteOnServerSend.forEach(fieldToDelete => {
            try {
                delete mediaDelete?.[fieldToDelete];
            }
            catch (error) {
                return;
            }
        });

        //-- Event Insert ---------------------------------------------->
        const eventInsert: EventDb<MediaLastEventIdentifierFields> = {
            ...mediaDelete.lastEvent,
            what: {
                ...mediaDelete?.lastEvent?.what,
                obj: { ...mediaDelete }
            }
        }

        //-- State Updates ---------->
        stateUpdates.mediaObj = {
            ...mediaDelete
        };

        return {
            eventInsert,
            stateUpdates
        }
    }


    genMediaFileObj(
        file: File,
        fileExtension: string,           //**mediaFileExtensionOptions**/       
        rootStoragePathFolder: string,  //option & default is  `${this.dbName}/media`
        format,                          //**mediaFormatOptions**
        type: string,                    //**mediaTypeOptions** inventoryMain | userProfile 
        event: string,                   //**mediaEvents**/
        who: { name?: string, id?: string },
        additionalIds: any,
        _eventCorrelationId?: string,
    ) {
        let stateUpdates: { mediaObj: MediaDb } = { mediaObj: { ...initialMediaDb } };

        //-- Identifier Fields --------------------------------------------------->
        const mediaId = this.firebaseHelper.generateFirebaseId();
        const eventId = this.firebaseHelper.generateFirebaseId();

        const noEventCorrelationIdExists = !(_eventCorrelationId?.length > 0);
        const eventCorrelationId = (noEventCorrelationIdExists)
            ? this.firebaseHelper.generateFirebaseId()
            : _eventCorrelationId;

        const storagePath = `${rootStoragePathFolder}/${mediaId}${fileExtension}`

        const mediaObj: MediaDb = {
            ...initialMediaDb,
            id: mediaId,
            //--
            fileName: mediaId,
            originalFileName: file?.name,
            fileExtension: fileExtension,
            // title: null;
            // description: null;
            storagePath,
            // downloadUrl: null
            format: format,    //**mediaFormatOptions** image | video | pdf
            type: type,      //**mediaTypeOptions** inventoryMain | userProfile 
            size: file?.size ?? null,
            lastEvent: {
                ...initialMediaDb?.lastEvent,
                ids: {
                    ...initialMediaDb?.lastEvent?.ids,
                    mediaId: mediaId,
                    eventCorrelationId: eventCorrelationId,
                    eventId: eventId,
                    //-- add ids below ----->
                    userId: who?.id,
                    ...additionalIds,
                },
            },
            createdBy: {
                ...who
            },
            createdAt: dateHelper.getTimeFromDateTimestamp(new Date()),
        }

        //-- Generate LastEvent Object ---------------------------------------->
        const lastEvent: EventDb<MediaLastEventIdentifierFields> = {
            ...initialMediaDb?.lastEvent,
            id: eventId,
            ids: {
                ...mediaObj?.lastEvent?.ids,
            },
            context: null,
            who: {
                id: who?.id ?? environment.appName,
                name: who?.name ?? environment.appName
            },
            what: {
                ...initialMediaDb?.lastEvent?.what,
                event: event,
                databaseName: mediaDatabaseName,
                operation: eventOperationOptions.create,
                dataVersion: mediaDataVersion,
            },
            when: dateHelper.getTimeFromDateTimestamp(new Date()),
        }


        //-- Media Insert ------------>
        const mediaInsert: MediaDb = {
            ...mediaObj,
            lastEvent,

        }

        //-- Delete Fields Before Sending To Server ------------------>
        mediaFieldsToDeleteOnServerSend.forEach(fieldToDelete => {
            try {
                delete mediaInsert?.[fieldToDelete];
            }
            catch (error) {
                return;
            }
        });

        //-- Event Insert ---------------------------------------------->
        const eventInsert: EventDb<MediaLastEventIdentifierFields> = {
            ...mediaInsert.lastEvent,
            what: {
                ...mediaInsert?.lastEvent?.what,
                obj: { ...mediaInsert }
            }
        }

        //-- State Updates ---------->
        stateUpdates.mediaObj = {
            ...mediaObj,
            lastEvent,
            _local: {
                ...initialMediaDb?._local,
                ...mediaObj?._local,
                file: file
            }
        };

        return {
            stateUpdates,
            mediaInsert,
            eventInsert
        }

    }



    enrichMediaServerResponse(serverResponse: any) {
        if (serverResponse?.docs) {
            return serverResponse.docs.map(doc => {
                //-- Check to see if 'lastEvent' field exists in order to enrich date fields -->
                const hasLastEventField = this.hasPropertyField(doc?.data(), 'lastEvent');
                const hasCreatedAtField = this.hasPropertyField(doc?.data(), 'createdAt');


                //-- Has CreatedAt Field must convert dates ------------------------>
                let createdAt = { ...initialMediaDb.createdAt };
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
                let createdAt = { ...initialMediaDb?.createdAt };
                if (hasCreatedAtField) {
                    createdAt = {
                        ...item?.payload.doc.data()?.createdAt,
                        timestamp: item?.payload.doc.data()?.createdAt?.timestamp?.toDate() ?? null
                    };
                }

                //-- Has lastEvent Field must convert dates ----------------------------->
                let lastEvent = { ...initialMediaDb?.lastEvent };
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
