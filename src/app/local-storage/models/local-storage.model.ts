import { MediaDb } from '../../media/models/media.model';

//--Local Storage DB --------------->
export interface LocalStorageDb {
  key?: string;    //retryAction-key || user-key || auth-key
  rev?: string;
  value?: any;
}


export interface LocalStorageMediaDb {
  id?: string;
  key?: string;
  rev?: string;
  value?: MediaDb;
  fileName?: string;
  mediaContentType?: String;
  blob?: any;
  localPath?: any;
}

export const localStorageDbTypeOptionsObj = {
  webSql: 'cordova-websql',
  sqlite: 'cordova-sqlite',
  sqlite2: 'cordova-plugin-sqlite-2',
  indexeddb: 'indexeddb',
  idb: 'idb',
}

export interface OfflineDbs {
  shoppingCart?: PouchDB.Database<{}>
}

export const initialOfflineDbs = {
  shoppingCart: null,
}


// Local Storage Key Options --------------//
export const localStorageKeyOptionsObj = {
  shoppingCart: 'shoppingCart',
}


export const initializedOfflineDbs = {
  shoppingCart: 'shoppingCart',
}

export const localStorageKeyOptionsArray = [
  localStorageKeyOptionsObj.shoppingCart,

];

export const offlineSqlDefaultSettings = {
  dbName: 'offline.db',
  dbLocation: 'default'
};

//-----Initial Local Storage DB  ------>
export const initialLocalStorageDb = {
  key: null,
  rev: null,
  value: null,
}

export const initialLocalStorageMediaDb = {
  key: null,
  rev: null,
  id: null,
  value: null,
  fileName: null,
  mediaContentType: null,
  blob: null,
  localPath: null,
}