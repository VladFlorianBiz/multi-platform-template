import { MediaDb } from './../../media/models/media.model';
//-------------- Core --------------------------------------------------------//
import { Action } from '@ngrx/store';
//-------------- Data Models -------------------------------------------------//
import { StorageUpload } from '../models/storage.model';

export enum StorageActionTypes {
  UPLOAD_TO_STORAGE                       = '[Storage] Upload to Storage',
  UPLOAD_TO_STORAGE_IN_PROGRESS           = '[Storage] Upload to Storage In Progress',
  UPLOAD_TO_STORAGE_SUCCESS               = '[Storage] Upload to Storage Success',

  SET_STORAGE_ITEM                        = '[Storage] Set Storage Item',
  ACTION_SUCCESS                          = '[Storage] Action was Successful',
}

//----- Upload To Storage -----------------------------------------//
export class UploadToStorage implements Action {
  readonly type = StorageActionTypes.UPLOAD_TO_STORAGE;
  constructor(public payload: { 
    storagePath: string, 
    fileName: string, 
    file: any, 
    insertToMediaDb: boolean, 
    mediaObj?: MediaDb, 
    userObj?: any }) { }
}

export class UploadToStorageInProgress implements Action {
  readonly type = StorageActionTypes.UPLOAD_TO_STORAGE_IN_PROGRESS;
  constructor(public payload: { storageUploadObj: StorageUpload }) { }
}

export class UploadToStorageSuccess implements Action {
  readonly type = StorageActionTypes.UPLOAD_TO_STORAGE_SUCCESS;
  constructor(public payload: { storageUploadObj: StorageUpload }) {}
}


//------ Set Storage Item-----------------------------------------//
export class SetStorageItem implements Action {
  readonly type = StorageActionTypes.SET_STORAGE_ITEM;
  constructor(public payload: { storageUploadObj: StorageUpload }) { }
}

//-----Action Success ---------------------------------//
export class ActionSuccess implements Action {
  readonly type = StorageActionTypes.ACTION_SUCCESS;
}

export type StorageActions =
| UploadToStorage
| UploadToStorageInProgress
| UploadToStorageSuccess

| SetStorageItem

| ActionSuccess;
