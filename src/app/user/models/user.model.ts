/*************************************************************************************************
** Imports                                                                                      **
**************************************************************************************************/
//-- **Data Models** ----------------------------------------------------------------------------//
import { EventDb } from '../../event/models/event.model';
import { initialEventDb } from '../../event/models/event.model';
import { initialLinkedMedia, LinkedMedia } from './../../media/models/media.model';

//------------------------------------------------------------------------------------------------>
//--- ***IMPORTANT*** ---------------------------------------------------------------------------->
//--- Update data version whenever data schema change occurs ------------------------------------->
//------------------------------------------------------------------------------------------------>
export const userDataVersion = 0;
export const userDatabaseName = "user"
export const userEvents = {
  create: '[User]-Create-User',
  update: '[User]-Update-User',
  delete: '[User]-Delete-User'
};

//-- LastEvent Identifier Fields ------------------>
export interface UserLastEventIdentifierFields {
  eventId?: string;
  eventCorrelationId?: string;
  userId?: string;
  ipAddress?: string;
  pubAddress?: string;
  deviceId?: string;
  mediaIds?: string [];
  //Add Initial Identifier Id's below

}

export const initialUserLastEventIdentifierFields = {
  eventId: null,
  eventCorrelationId: null,
  userId: null,
  ipAddress: null,
  deviceId: null,
  mediaIds: [],
  //Add Initial Identifier Id's below

};

//--- User Db Model ------------------------------------------------------------------------------------------------------------------------------------------------->
export interface UserDb {
  id?: string;
  //--- Main Database Fields --------------------------------------------------------------------------------------------------------------------------------------------------------->
  fullName?: string;
  email?: string;
  phone?: string;
  profilePhotoUrl?: string;
  coverPhotoUrl?: string;
  dateOfBirth?: string;
  linkedMedia?: LinkedMedia []
  //---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------->
  _local?: { //-- Local front end display(gets deleted on server send) used for data enrichment making it easier to work with data on front by aggregating multiple calls
    mainMedia: LinkedMedia;
    initials?: string;
  }; 
  display?: {  //-- Unlike '_local' this field does not get deleted on server send, good for labels or enrichment where an extra call would have to be made to display some label 
    mainPhotoUrl?: string,
  };
   //---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------->
  lastEvent?: EventDb<UserLastEventIdentifierFields>;
  createdBy?: {
    id?: string;
    name?: string;
  };
  createdAt?: {
    week?: number;
    month?: number;
    year?: number;
    quarter?: number;
    day?: number;
    timestamp?: any;
  };
}


//--- List of fields to delete when calling server ----------->
export const userFieldsToDeleteOnServerSend = ['_local'];


export const initialUserLastEvent: EventDb<UserLastEventIdentifierFields> = {
  ...initialEventDb,
  ids: { ...initialUserLastEventIdentifierFields },
  what: {
     ...initialEventDb?.what,
    databaseName: userDatabaseName
  }
};

export const initialUserDb: UserDb = {
  id: null,
  //--- Main Database Fields --------------------------------------------------------------------------------------------------------------------------------------------------------->
  fullName: null,
  email: null,
  phone: null,
  profilePhotoUrl: null,
  coverPhotoUrl: null,
  dateOfBirth: null,
  linkedMedia: [],
  //---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------->
  _local:{ //-- Local front end display(gets deleted on server send) used for data enrichment making it easier to work with data on front by aggregating multiple calls
    mainMedia: {...initialLinkedMedia},
    initials: null,
  },
  display: { //-- Unlike '_local' this field does not get deleted on server send, good for labels or enrichment where an extra call would have to be made to display some label 
    mainPhotoUrl: null,
  },
  //---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------->
  lastEvent: { ...initialUserLastEvent },
  createdBy: {
    id: null,
    name: null,
  },
  createdAt: {
    week: null,
    month: null,
    year: null,
    quarter: null,
    day: null,
    timestamp: null
  }
};
