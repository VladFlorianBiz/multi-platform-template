/*************************************************************************************************
** Imports                                                                                      **
**************************************************************************************************/
//-- **Data Models** ----------------------------------------------------------------------------//
import { environment } from './../../../environments/environment';

export interface ErrorDb {
  id?: string;
  actionType?: any;
  payload?: any;
  errorMessage?: any,
  errorStack?: any,
  appName?: string;
  appVersion?: number;
  extraDetails?: any;
  createdBy?: {
    id?: string;
    name?: string;
  },
  createdAt?: {
    week?: number;
    month?: number;
    year?: number;
    quarter?: number;
    day?: number;
    timestamp?: any;
  }
}

export const initialErrorDb = {
  id: null,
  actionType: null,
  payload: null,
  errorMessage: null,
  errorStack: null,
  appName: environment.appName,
  appVersion: environment.appVersion,
  extraDetails: null,
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