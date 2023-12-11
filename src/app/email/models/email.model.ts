/*************************************************************************************************
** Imports                                                                                      **
**************************************************************************************************/
//-- **Data Models** ----------------------------------------------------------------------------//
import { EventDb } from '../../event/models/event.model';
import { initialEventDb } from '../../event/models/event.model';
//------------------------------------------------------------------------------------------------>
//--- ***IMPORTANT*** ---------------------------------------------------------------------------->
//--- Update data version whenever data schema change occurs ------------------------------------->
//------------------------------------------------------------------------------------------------>
export const emailDataVersion = 1;
export const emailDatabaseName = "email"
export const emailEvents = {
  create: '[Email]-Create-Email',
  update: '[Email]-Update-Email',
  delete: '[Email]-Delete-Email'
};

//-- LastEvent Identifier Fields ------------------>
export interface EmailLastEventIdentifierFields {
  emailId?: string;
  eventId?: string;
  eventCorrelationId?: string;
  userId?: string;
  accessId?: string;
}

export const initialEmailLastEventIdentifierFields = {
  emailId: null,
  eventId: null,
  eventCorrelationId: null,
  userId: null,
  accessId: null,
};

//--- Email Db Model ------------------------------------------------------------------------------------------------------------------------------------------------->
export interface EmailDb {
  id?: string;
  //--- Main Database Fields --------------------------------------------------------------------------------------------------------------------------------------------------------->
  type?: string;  //see **emailTypeOptions**
  status?: string; //see **statusOptions** 
  message?: string;
  subject?: string;
  preHeader?: string;
  toEmail?: string;
  fromEmail?: string;
  fromName?: string;
  data?: any;  //used for any type of dynamic data that you want to reference on send grid email template
  retryCount?: number;
  retryLimit?: number;
  //---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------->
  _display?: any; //-- Local front end display(gets deleted on server send) used for data enrichment making it easier to work with data on front by aggregating multiple calls
  display?: any; //-- Unlike '_display' this field does not get deleted on server send, good for labels or enrichment where an extra call would have to be made to display some label 
  //---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------->
  lastEvent?: EventDb<EmailLastEventIdentifierFields>;
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

//-- Email Type Options ------------------------------------------------------------------------->
export const emailTypeOptions = {
  welcome: 'welcome',
  purchaseEmail: 'purchase',
  test: 'Test Email',
  accessInvite: 'Access Invite',
}
export const emailTypeOptionsArray = [emailTypeOptions.welcome, emailTypeOptions.purchaseEmail, emailTypeOptions.test];

//-- Status Type Options -------------------------------------------------------------------------------------------------------------------------------->
export const emailStatusOptions = {
  pending: 'pending',
  sent: 'sent',
  failed: 'failed',
  retryLimitReached: 'retryLimitReached',
}
export const emailStatusOptionsArray = [emailStatusOptions?.pending, emailStatusOptions.sent, emailStatusOptions.failed, emailStatusOptions.retryLimitReached];


//--- List of fields to delete when calling server -------->
export const emailFieldsToDeleteOnServerSend = ['_display'];


export const initialEmailLastEvent: EventDb<EmailLastEventIdentifierFields> = {
  ...initialEventDb,
  ids: { ...initialEmailLastEventIdentifierFields },
  what: {
    ...initialEventDb?.what,
    databaseName: emailDatabaseName
  }
};

export const initialEmailDb = {
  id: null,
  //--- Main Database Fields --------------------------------------------------------------------------------------------------------------------------------------------------------->
  type: null,  //see **emailTypeOptions**
  status: null, //see **statusOptions** 
  message: null,
  subject: null,
  preHeader: null,
  toEmail: null,
  fromEmail: null,
  fromName: null,
  data: {},  //used for any type of dynamic data that you want to reference on send grid email template
  retryCount: 0,
  retryLimit: 3,
  //---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------->
  _display: { //-- Local front end display(gets deleted on server send) used for data enrichment making it easier to work with data on front by aggregating multiple calls

  },
  display: { //-- Unlike '_display' this field does not get deleted on server send, good for labels or enrichment where an extra call would have to be made to display some label 

  },
  //---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------->
  lastEvent: { ...initialEmailLastEvent },
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