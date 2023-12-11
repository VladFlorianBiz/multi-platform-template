//-------------- Core -----------------------------------------------------------------------//
import { createSelector } from '@ngrx/store';
import { AppState } from '../../app.reducer';
import * as fromStorage from './storage.reducer';
//---------------Storage State Varaibles ----------------------------------------------------//
export const getStorageUploadsState = (state: AppState) => state.storage.storageUploads;
export const getStorageUploadObjState = (state: AppState) => state.storage.storageUploadObj;

//---------------Storage State Selectors------------------------------------------------------//
export const selectStorageUploads = createSelector(
  getStorageUploadsState,
  fromStorage.selectAll
);

export const selectStorageUploadObj = createSelector(
  getStorageUploadObjState,
  storageUploadObj => storageUploadObj
);

//--------------Custom Slices Of State Selectors--------------------------------------------------
