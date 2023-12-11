//-------------- Core -----------------------------------------------------------------------------//
import { Injectable } from '@angular/core';
import { tap, switchMap, catchError, last } from 'rxjs/operators';
import { of, throwError } from 'rxjs';
//------------- Data Store ------------------------------------------------------------------------//
import { Actions, ofType, createEffect } from '@ngrx/effects';
import { AppState } from './../../app.reducer';
import * as fromStorage from './storage.actions';
import { Store } from '@ngrx/store';
import * as CoreActions from './../../core/store/core.actions';
import * as ErrorActions from './../../error/store/error.actions';
import * as fromMedia from '../../media/store/media.actions';
//------------- Services/Helpers -----------------------------------------------------------------//
import { UiHelper } from '../../shared/helpers/ui.helper';
import { StorageService } from '../services/storage.service';
import { StorageDataObjHelper } from '../helpers/storage-data-obj.helper';
//-------------- Data Models ---------------------------------------------------------------------//
import { initialLoadingModalConfig } from './../../core/models/core.model';

@Injectable({
  providedIn: 'root'
})
export class StorageEffects {
  constructor(
    private actions$: Actions,
    private store: Store<AppState>,
    private storageService: StorageService,
    private uiHelper: UiHelper,
    private storageDataObjHelper: StorageDataObjHelper,
  ) { }

  //------------------ Upload To Storage----------------------------------------------------------------------------------------------------------//
  uploadToStorage$ = createEffect(() => this.actions$.pipe(
    ofType<fromStorage.UploadToStorage>(fromStorage.StorageActionTypes.UPLOAD_TO_STORAGE),
    tap(() => {
            this.store.dispatch(new CoreActions.SetLoadingModalConfig({loadingModalConfig: { show: true, message: 'Loading...' }}));
    }),
    switchMap((action) => {
      const file = action.payload.file;
      const fileName = action.payload.fileName;
      const storagePath = action.payload.storagePath;
      const insertToMediaDb = action.payload.insertToMediaDb;
      const mediaObj = action.payload.mediaObj;
      const userObj = action.payload.userObj;
      const storageUpload = this.storageDataObjHelper.storageUpload(file, fileName, storagePath);
      //-------------- Begin Uploading to Storage ----------------------------------------------------------------------//
      return this.storageService.uploadToStorage(storagePath, file).pipe(
        switchMap((metaData) => {
          let progress = (metaData.bytesTransferred / metaData.totalBytes) * 100;
          const enrichedStorageObj = this.storageDataObjHelper.uploadToStorageInProgress(storageUpload, progress);
          return of(new fromStorage.UploadToStorageInProgress({ storageUploadObj: enrichedStorageObj }));
        }),
        last(),
        switchMap(() => {
          //------------- Get Download Url Once Upload is complete -----------------------------------------------------------------------------//
          return this.storageService.getDownloadUrl(storagePath).pipe(
            switchMap((downloadUrl) => {
              this.store.dispatch(new CoreActions.SetLoadingModalConfig({loadingModalConfig: {  ...initialLoadingModalConfig }}));
              const dataObj = this.storageDataObjHelper.uploadToStorageSuccess(storageUpload, downloadUrl);
              console.log("final StorageObj Compelted Downloading", dataObj);
              return (insertToMediaDb)
                ? [
                  new fromStorage.UploadToStorageSuccess({ storageUploadObj: dataObj.storageUploadObj }),
                  new fromMedia.CreateMedia({ mediaObj: dataObj.mediaInsert})
                  ]
                : [new fromStorage.UploadToStorageSuccess({ storageUploadObj: dataObj.storageUploadObj })]
            }),
            catchError(error => throwError(error))
          )
        }),
        catchError(error => {
          console.group('error in uploadToStorage$', error);
          this.uiHelper.displayErrorAlert(error?.message ?? error);
          return of(new ErrorActions.HandleError({ error: { ...error }, actionType: action.type, payload: { ...action.payload }, insertError: true }));
        })
      );
    }),
  ));


}
