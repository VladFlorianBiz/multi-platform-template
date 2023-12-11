/*************************************************************************************************
** Imports                                                                                      **
**************************************************************************************************/
//-- **Core** -----------------------------------------------------------------------------------//
import { Injectable } from '@angular/core';
//-- **Services/Helpers** -----------------------------------------------------------------------//
import { FirebaseHelper } from '../../shared/helpers/firebase.helper';
import * as dateHelper from '../../shared/helpers/date.helper';
//-- **Data Models** ----------------------------------------------------------------------------//
import { emailFieldsToDeleteOnServerSend, emailStatusOptions, emailTypeOptions } from './../models/email.model';
import { EmailLastEventIdentifierFields } from './../models/email.model';
import { eventOperationOptions } from '../../event/models/event.model';
import { environment } from '../../../environments/environment';
import { emailDatabaseName } from './../models/email.model';
import { initialEventDb } from '../../event/models/event.model';
import { emailDataVersion } from './../models/email.model';
import { initialEmailDb } from './../models/email.model';
import { emailEvents } from './../models/email.model';
import { EventDb } from '../../event/models/event.model';
import { UserDb } from '../../user/models/user.model';
import { EmailDb } from './../models/email.model';
import { AccessDb } from '../../access/models/access.model';


@Injectable({
    providedIn: 'root'
})

/*************************************************************************************************
**  Enriches Data For Api Calls/Actions                                                         **
**************************************************************************************************/
export class EmailDataObjHelper {

    constructor(
        private firebaseHelper: FirebaseHelper
    ) { }


    createNewAccessInviteEmail(accessObj: AccessDb, currentUser: UserDb, _eventCorrelationId?: string) {
        let stateUpdates: { emailObj: EmailDb } = { emailObj: { ...initialEmailDb } };


        //--- Data Enrichment ------------------------------------>
        const currentUserIdExists = (currentUser?.id?.length > 0);
        const whoUserId = (currentUserIdExists)
            ? currentUser?.id
            : environment.appName;

        const whoUserFullName = (currentUserIdExists)
            ? currentUser.fullName
            : environment.appName;

        const eventId = this.firebaseHelper.generateFirebaseId();
        const noEventCorrelationIdExists = !(_eventCorrelationId?.length > 0);
        const eventCorrelationId = (noEventCorrelationIdExists)
            ? this.firebaseHelper.generateFirebaseId()
            : _eventCorrelationId;


            
        const toEmail = accessObj?.email?.toLowerCase();
        const data = {
            access: accessObj,
        }

        //-- Identifier Fields --------------------------------------------------->
        const emailId = this.firebaseHelper.generateFirebaseId()


        //--- Email Obj ------------------------->
        const emailObj: EmailDb = {
            ...initialEmailDb,
            id: emailId,
            type: emailTypeOptions.accessInvite,
            status: emailStatusOptions.pending,
            toEmail: toEmail,
            data,
            lastEvent: {
                ...initialEmailDb?.lastEvent,
                ids: {
                    ...initialEmailDb?.lastEvent?.ids,
                    eventId,
                    eventCorrelationId,
                    userId: currentUser?.id,
                    emailId,
                    accessId: accessObj?.id,
                    //add additional id's here
                }
            },
            createdBy: {
                id: currentUser?.id ?? environment.appName,
                name: currentUser?.fullName ?? environment.appName
            },
            createdAt: dateHelper.getTimeFromDateTimestamp(new Date())
        };

        //-- Generate LastEvent Object ---------------------------------------->
        const lastEvent: EventDb<EmailLastEventIdentifierFields> = {
            ...initialEmailDb?.lastEvent,
            id: eventId,
            ids: {
                ...emailObj?.lastEvent?.ids,
            },
            who: {
                id: whoUserId,
                name: whoUserFullName
            },
            what: {
                ...initialEmailDb?.lastEvent.what,
                event: emailEvents.create,
                databaseName: emailDatabaseName,
                operation: eventOperationOptions.create,
                dataVersion: emailDataVersion,
            },
            when: dateHelper.getTimeFromDateTimestamp(new Date()),
        }


        //-- Email Insert ----------------------------------------->
        const emailInsert: EmailDb = {
            ...emailObj,
            lastEvent,
            createdBy: {
                id: whoUserId,
                name: whoUserFullName
            },
            createdAt: dateHelper.getTimeFromDateTimestamp(new Date())
        }

        //-- Delete Fields Before Sending To Server ------------------>
        emailFieldsToDeleteOnServerSend.forEach(fieldToDelete => {
            try {
                delete emailInsert?.[fieldToDelete];
            }
            catch (error) {
                return;
            }
        });

        //-- Event Insert ---------------------------------------------->
        const eventInsert: EventDb<EmailLastEventIdentifierFields> = {
            ...emailInsert.lastEvent,
            what: {
                ...emailInsert?.lastEvent?.what,
                obj: { ...emailInsert }
            }
        }

        //-- State Updates ---------->
        stateUpdates.emailObj = {
            ...emailObj,
            lastEvent
        };

        return {
            eventInsert,
            emailInsert,
            stateUpdates
        }
    }


    createEmail(email: EmailDb, currentUser: UserDb,  _eventCorrelationId?: string) {
        let stateUpdates: { emailObj: EmailDb } = { emailObj: {...initialEmailDb}  };


        //--- Data Enrichment ------------------------------------>
        const currentUserIdExists = (currentUser?.id?.length > 0);
        const whoUserId = (currentUserIdExists)
            ? currentUser?.id
            : environment.appName;

        const whoUserFullName = (currentUserIdExists)
            ? currentUser.fullName
            : environment.appName;

        const eventId = this.firebaseHelper.generateFirebaseId();
        const noEventCorrelationIdExists = !(_eventCorrelationId?.length > 0);
        const eventCorrelationId = (noEventCorrelationIdExists)
            ? this.firebaseHelper.generateFirebaseId()
            : _eventCorrelationId;


        //-- Identifier Fields --------------------------------------------------->
        const emailId = (email?.id == null)
         ? this.firebaseHelper.generateFirebaseId()
         : email.id;


        //--- Email Obj ------------------------->
        const emailObj: EmailDb = {
            ...initialEmailDb,
            ...email,
            id: emailId,
            lastEvent: {
                ...email?.lastEvent,
                ids: {
                    ...initialEmailDb?.lastEvent?.ids,
                    ...email?.lastEvent?.ids,
                    eventId,
                    eventCorrelationId,
                    userId: currentUser?.id,
                    emailId,
                    //add additional id's here
                }
            },
            createdBy: {
                id: currentUser?.id ?? environment.appName,
                name: currentUser?.fullName ?? environment.appName
            },
            createdAt: dateHelper.getTimeFromDateTimestamp(new Date())
            };

        //-- Generate LastEvent Object ---------------------------------------->
        const lastEvent: EventDb<EmailLastEventIdentifierFields> = {
            ...initialEmailDb?.lastEvent,
            id: eventId,
            ids: {
             ...emailObj?.lastEvent?.ids,
            },
            who: {
                id: whoUserId,
                name: whoUserFullName
            },
            what: {
                ...initialEmailDb?.lastEvent.what,
                event: emailEvents.create,
                databaseName: emailDatabaseName,
                operation: eventOperationOptions.create,
                dataVersion: emailDataVersion,
            },
            when: dateHelper.getTimeFromDateTimestamp(new Date()),
        }


        //-- Email Insert ----------------------------------------->
        const emailInsert: EmailDb = {
            ...emailObj,
            lastEvent,
            createdBy: {
                id: whoUserId,
                name: whoUserFullName
            },
            createdAt: dateHelper.getTimeFromDateTimestamp(new Date())
        }

        //-- Delete Fields Before Sending To Server ------------------>
        emailFieldsToDeleteOnServerSend.forEach(fieldToDelete => {
            try {
                delete emailInsert?.[fieldToDelete];
            }
            catch (error) {
                return;
            }
        });

        //-- Event Insert ---------------------------------------------->
        const eventInsert: EventDb<EmailLastEventIdentifierFields> = {
            ...emailInsert.lastEvent,
            what: {
                ...emailInsert?.lastEvent?.what,
                obj: { ...emailInsert }
            }
        }

        //-- State Updates ---------->
        stateUpdates.emailObj = {
            ...emailObj,
            lastEvent
        };

        return {
            eventInsert,
            emailInsert,
            stateUpdates
        }
    }


    //-- Update email --------------------------------------------------------------//
    updateEmail(email: EmailDb, originalEmailObj: EmailDb, user?: UserDb) {
        let stateUpdates: { emailObj: EmailDb } = { emailObj: {...initialEmailDb}  };

        //-- Identifier Fields --------------------------------------------------->
        const eventId = this.firebaseHelper.generateFirebaseId();
        const eventCorrelationId = this.firebaseHelper.generateFirebaseId();

        //--- Email Obj -------------------------->
        const emailObj: EmailDb = {
            ...initialEmailDb,
            ...email,
            lastEvent: {
                ...email?.lastEvent,
                ids: {
                    ...initialEmailDb?.lastEvent?.ids,
                    ...originalEmailObj?.lastEvent?.ids,
                    eventId,
                    eventCorrelationId,
                    userId: user?.id ?? null,
                    emailId: originalEmailObj?.id,
                    //add additional id's here
                }
            },
        };

        //-- Generate LastEvent Object -------------------------------->
        const lastEvent: EventDb<EmailLastEventIdentifierFields> = {
            ...initialEmailDb,
            id: eventId,
            ids: {
             ...emailObj?.lastEvent?.ids,
            },
            context: null,
            who: {
                id: user?.id ?? environment.appName,
                name: user?.fullName ?? environment.appName
            },
            what: {
                ...initialEmailDb?.lastEvent?.what,
                event: emailEvents.update,
                databaseName: emailDatabaseName,
                operation: eventOperationOptions.update,
                dataVersion: emailDataVersion,
            },
            when: dateHelper.getTimeFromDateTimestamp(new Date()),
        }

        //-- Email Update ------------->
        const emailUpdate: EmailDb = {
            ...emailObj,
            lastEvent
        }

        //-- Delete Fields Before Sending To Server ------------------>
        emailFieldsToDeleteOnServerSend.forEach(fieldToDelete => {
            try {
                delete emailUpdate?.[fieldToDelete];
            }
            catch (error) {
                return;
            }
        });

        //-- Event Insert ---------------------------------------------->
        const eventInsert: EventDb<EmailLastEventIdentifierFields> = {
            ...emailUpdate.lastEvent,
            what: {
                ...emailUpdate?.lastEvent?.what,
                obj: { ...emailUpdate }
            }
        }

        //-- State Updates ---------->
        stateUpdates.emailObj = {
            ...emailObj,
            lastEvent
        };

        return {
            eventInsert,
            emailUpdate,
            stateUpdates
        }
    }

    //-- Delete email --------------------------------------------------------//
    deleteEmail(email: EmailDb, user?: UserDb) {
        let stateUpdates: { emailObj: EmailDb } = { emailObj: {...initialEmailDb} };

        //-- Identifier Fields --------------------------------------------------->
        const eventId = this.firebaseHelper.generateFirebaseId();
        const eventCorrelationId = this.firebaseHelper.generateFirebaseId();

        //--- Email Obj -------------------------->
        const emailObj: EmailDb = {
            ...initialEmailDb,
            ...email,
            lastEvent: {
                ...email?.lastEvent,
                ids: {
                    ...initialEmailDb?.lastEvent?.ids,
                    ...email?.lastEvent?.ids,
                    eventId,
                    eventCorrelationId,
                    userId: user?.id ?? null,
                    emailId: email?.id,
                    //add additional id's here
                }
            },
        };

        //-- Generate LastEvent Object -------------------------------->
        const lastEvent: EventDb<EmailLastEventIdentifierFields> = {
            ...initialEventDb,
            id: eventId,
            ids: {
               ...emailObj?.lastEvent?.ids,
            },
            context: null,
            who: {
                id: user?.id ?? environment.appName,
                name: user?.fullName ?? environment.appName
            },
            what: {
                ...initialEmailDb?.lastEvent?.what,
                event: emailEvents.delete,
                databaseName: emailDatabaseName,
                operation: eventOperationOptions.delete,
                dataVersion: emailDataVersion,
            },
            when: dateHelper.getTimeFromDateTimestamp(new Date()),
        }

        //-- Email Delete -------------->
        const emailDelete: EmailDb = {
            ...emailObj,
            lastEvent
        }

        //-- Delete Fields Before Sending To Server ------------------>
        emailFieldsToDeleteOnServerSend.forEach(fieldToDelete => {
            try {
                delete emailDelete?.[fieldToDelete];
            }
            catch (error) {
                return;
            }
        });

        //-- Event Insert ---------------------------------------------->
        const eventInsert: EventDb<EmailLastEventIdentifierFields> = {
            ...emailDelete.lastEvent,
            what: {
                ...emailDelete?.lastEvent?.what,
                obj: { ...emailDelete }
            }
        }

        //-- State Updates ---------->
        stateUpdates.emailObj = {
            ...emailDelete
        };

        return {
            eventInsert,
            stateUpdates
        }
    }

    enrichEmailServerResponse(serverResponse: any) {
    if (serverResponse?.docs) {
        return serverResponse.docs.map(doc => {
            //-- Check to see if 'lastEvent' field exists in order to enrich date fields -->
            const hasLastEventField = this.hasPropertyField(doc?.data(), 'lastEvent');
            const hasCreatedAtField = this.hasPropertyField(doc?.data(), 'createdAt');


            //-- Has CreatedAt Field must convert dates ------------------------>
            let createdAt = { ...initialEmailDb.createdAt };
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
            let createdAt = { ...initialEmailDb?.createdAt };
            if (hasCreatedAtField) {
                createdAt = {
                    ...item?.payload.doc.data()?.createdAt,
                    timestamp: item?.payload.doc.data()?.createdAt?.timestamp?.toDate() ?? null
                };
            }

            //-- Has lastEvent Field must convert dates ----------------------------->
            let lastEvent = { ...initialEmailDb?.lastEvent };
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
