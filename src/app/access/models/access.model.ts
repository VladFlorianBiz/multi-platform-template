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
export const accessDataVersion = 0;
export const accessDatabaseName = "access"
export const accessEvents = {
  create: '[Access]-Create-Access',
  update: '[Access]-Update-Access',
  delete: '[Access]-Delete-Access'
};

//-- LastEvent Identifier Fields ------------------>
export interface AccessLastEventIdentifierFields {
  eventId?: string;
  eventCorrelationId?: string;
  userId?: string;
  accessId?: string;
  mediaIds?: string [];
  //Add Initial Identifier Id's below
}

export const initialAccessLastEventIdentifierFields = {
  eventId: null,
  eventCorrelationId: null,
  userId: null,
  accessId: null,
  mediaIds: [],
  //Add Identifier Id's below
};

//--- Access Db Model ------------------------------------------------------------------------------------------------------------------------------------------------->
export interface AccessDb {
  id?: string;
  //--- Main Database Fields --------------------------------------------------------------------------------------------------------------------------------------------------------->
  name?: string;
  linkedMedia?: LinkedMedia [] 
  //---
  phone?: string;
  email?: string;
  permissions?: string [];
  role?: string;
  //---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------->
  _local?: { //-- Local front end display(gets deleted on server send) used for data enrichment making it easier to work with data on front by aggregating multiple calls
    mainMedia: LinkedMedia;
  }; 
  display?: {  //-- Unlike '_local' this field does not get deleted on server send, good for labels or enrichment where an extra call would have to be made to display some label 
    mainPhotoUrl?: string,
  };
  //---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------->
  lastEvent?: EventDb<AccessLastEventIdentifierFields>;
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


//--------------------------------------------------------------------------------------------->
//-- accessPermissionOptions --------------------------------------------------------------------->
export const accessPermissionOptions = {
  feature1: 'Feature 1',
  feature2: 'Feature 2',
  manageAccess: 'Manage Access',
};
//---
export const accessPermissionOptionsArray = [
  accessPermissionOptions.feature1,
  accessPermissionOptions.feature2,
  accessPermissionOptions.manageAccess,
]



//--- List of fields to delete when calling server ----------->
export const accessFieldsToDeleteOnServerSend = ['_local'];


export const initialAccessLastEvent: EventDb<AccessLastEventIdentifierFields> = {
  ...initialEventDb,
  ids: { ...initialAccessLastEventIdentifierFields },
  what: {
     ...initialEventDb?.what,
    databaseName: accessDatabaseName
  }
};

export const initialAccessDb: AccessDb = {
  id: null,
  //--- Main Database Fields --------------------------------------------------------------------------------------------------------------------------------------------------------->
  name: null,
  linkedMedia: [],
  //--
  phone: null,
  email: null,
  permissions: [],
  //---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------->
  _local:{ //-- Local front end display(gets deleted on server send) used for data enrichment making it easier to work with data on front by aggregating multiple calls
    mainMedia: {...initialLinkedMedia},
  },
  display: { //-- Unlike '_local' this field does not get deleted on server send, good for labels or enrichment where an extra call would have to be made to display some label 
    mainPhotoUrl: null,
  },
  //---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------->
  lastEvent: { ...initialAccessLastEvent },
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