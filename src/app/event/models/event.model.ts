/*************************************************************************************************
 ** Imports                                                                                      **
 **************************************************************************************************/
//-- **Core** -----------------------------------------------------------------------------------//
import { environment } from '../../../environments/environment';

export interface EventDb<Type> {
  id?: string;
  ids?: Type; //  See **EventIdentifierFields** For all possible options
  context?: any;
  who?: {
    id?: string;
    name?: string;
  };
  what?: {
    event?: string; 
    obj?: any; 
    operation?: string;  // **eventOperationOptions***
    dataVersion?: number;
    dataStatus?: any;
    databaseName?: string; 
    appName?: string;
    appVersion?: number;
  };
  when?: {
    week?: number;
    month?: number;
    year?: number;
    quarter?: number;
    day?: number;
    timestamp?: any;
  };
}

export const initialEventDb = {
  id: null,
  ids: null,
  context: null,
  who: {
    id: null,
    name: null,
  },
  what: {
    event: null,
    obj: null,
    operation: null,
    dataVersion: 0,
    dataStatus: null,
    databaseName: null,
    appName: environment.appName,
    appVersion: environment.appVersion,
  },
  when: {
    week: null,
    month: null,
    year: null,
    quarter: null,
    day: null,
    timestamp: null
  }
};


export const initialWhenEvent = {
  week: null,
  month: null,
  year: null,
  quarter: null,
  day: null,
  timestamp: null
};



export const eventOperationOptions = {
  create: 'create',
  update: 'update',
  delete: 'delete'
};

