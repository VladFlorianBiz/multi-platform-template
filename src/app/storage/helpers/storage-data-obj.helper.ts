//-------------- Core ---------------------------------------------------//
import { Injectable } from '@angular/core';
//------------- Service/Helpers ----------------------------------------//
import { FirebaseHelper } from '../../shared/helpers/firebase.helper';
import { initialStorageUpload } from '../models/storage.model';


@Injectable({
  providedIn: 'root'
})
export class StorageDataObjHelper {
  initialModifiedFields = [];
  constructor(
    private firebaseHelper: FirebaseHelper,
  ) { }

  storageUpload(file, fileName, storagePath) {
    const id = this.firebaseHelper.generateFirebaseId();
    return {
      ...initialStorageUpload,
      id,
      format: file.type,
      size: file.size,
      storagePath: storagePath,
      fileName: fileName,
    };
  }

  uploadToStorageInProgress(storageUpload, progress) {
    return {
      ...initialStorageUpload,
      ...storageUpload,
      progress: progress,
    };
  }

  uploadToStorageSuccess(storageUpload, downloadUrl) {
    return {
      ...initialStorageUpload,
      ...storageUpload,
      progress: 100,
      downloadUrl
    };
  }

  //---------------Enrich Storage Response  -----------------------//





}