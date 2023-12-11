/*************************************************************************************************
** Imports                                                                                      **
**************************************************************************************************/
//-- **Core** -----------------------------------------------------------------------------------//
import { Injectable } from '@angular/core';
import { from, of, throwError } from 'rxjs';
//-- **Data Models** ----------------------------------------------------------------------------//
import { EventDb } from '../../event/models/event.model';
import { MediaDb, MediaLastEventIdentifierFields } from './../models/media.model';
//-- **Firebase** -------------------------------------------------------------------------------//
import { AngularFirestore } from '@angular/fire/compat/firestore';
//------------- FireBase Upload -----------------------------------------------------//
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/compat/storage';
import { catchError, concatMapTo, finalize, last, switchMap, take } from 'rxjs/operators';
//-- **Services/Helpers** -----------------------------------------------------------------------//
import { MediaDataObjHelper } from './../helpers/media-data-obj.helper';


@Injectable({
    providedIn: 'root'
})

/*************************************************************************************************
**  API Service Calls                                                                           **
**************************************************************************************************/
export class MediaService {
    task: AngularFireUploadTask;


    constructor(
        public fireStoreDB: AngularFirestore,
        private storage: AngularFireStorage,
        private mediaDataObjHelper: MediaDataObjHelper
    ) { }


    getMediaArray () {
        return this.fireStoreDB.collection<MediaDb>('media').get();
    };

    getMedia(mediaId: string) {
        return this.fireStoreDB.collection<MediaDb>('media', ref => ref.where('id', '==', mediaId)).get();
    };

    createMedia(mediaInsert: MediaDb, eventInsert: EventDb<MediaLastEventIdentifierFields>) {
        const batch = this.fireStoreDB.firestore.batch();

        //-- Insert Media ----------------------------------------------------------------------------------->
        const mediaInsertDbRef = this.fireStoreDB.collection<MediaDb>('media').doc(mediaInsert.id).ref;
        batch.set(mediaInsertDbRef, mediaInsert);

        //-- Event Insert -------------------------------------------------------------------------------------------------------------->
        const eventInsertDbRef = this.fireStoreDB.collection<EventDb<MediaLastEventIdentifierFields>>('event').doc(eventInsert.id).ref;
        batch.set(eventInsertDbRef, eventInsert);

        return from(batch.commit());
    };

    createMediaPromise(mediaInsert: MediaDb, eventInsert: EventDb<MediaLastEventIdentifierFields>) {
        const batch = this.fireStoreDB.firestore.batch();

        //-- Insert Media ----------------------------------------------------------------------------------->
        const mediaInsertDbRef = this.fireStoreDB.collection<MediaDb>('media').doc(mediaInsert.id).ref;
        batch.set(mediaInsertDbRef, mediaInsert);

        //-- Event Insert -------------------------------------------------------------------------------------------------------------->
        const eventInsertDbRef = this.fireStoreDB.collection<EventDb<MediaLastEventIdentifierFields>>('event').doc(eventInsert.id).ref;
        batch.set(eventInsertDbRef, eventInsert);

        return batch.commit();
    };

    updateMedia(mediaUpdate: MediaDb, eventUpdate: EventDb<MediaLastEventIdentifierFields>) {
        const batch = this.fireStoreDB.firestore.batch();

        //-- Update Media ---------------------------------------------------------------------------------->
        const mediaUpdateDbRef = this.fireStoreDB.collection<MediaDb>('media').doc(mediaUpdate.id).ref;
        batch.set(mediaUpdateDbRef, mediaUpdate);

        //-- Event Insert -------------------------------------------------------------------------------------------------------------->
        const eventUpdateDbRef = this.fireStoreDB.collection<EventDb<MediaLastEventIdentifierFields>>('event').doc(eventUpdate.id).ref;
        batch.set(eventUpdateDbRef, eventUpdate);

        return from(batch.commit());
    };


    deleteMedia(mediaId: string, eventDelete: EventDb<MediaLastEventIdentifierFields>) {
        const batch = this.fireStoreDB.firestore.batch();

        //-- Delete Media ----------------------------------------------------------------->
        const mediaDeleteDbRef = this.fireStoreDB.collection('media').doc(mediaId).ref;
        batch.delete(mediaDeleteDbRef);

        //-- Event Insert -------------------------------------------------------------------->
        const eventDeleteDbRef = this.fireStoreDB.collection('event').doc(eventDelete.id).ref;
        batch.set(eventDeleteDbRef, eventDelete);

        return from(batch.commit());
    };


    uploadFileDirty(_mediaInsert: MediaDb, _eventInsert: EventDb<MediaLastEventIdentifierFields>, file) {

        const path = _mediaInsert?.storagePath;  // The storage path

        const ref = this.storage.ref(path); // Reference to storage bucket

        // Note: The upload function returns a promise
        const uploadPromise = this.storage.upload(path, file).then(() => ref.getDownloadURL());

        return from(uploadPromise).pipe(
            switchMap(_downloadUrl => {
                return from(_downloadUrl).pipe(
                    switchMap(downloadUrl => {
                        const mediaInsert = {
                            ..._mediaInsert,
                            downloadUrl: downloadUrl,
                        }

                        const eventInsert = {
                            ..._eventInsert,
                            what: {
                                ...mediaInsert?.lastEvent?.what,
                                obj: { ...mediaInsert }
                            }
                        }

                        return of({
                            mediaInsert: mediaInsert,
                            mediaEventInsert: eventInsert
                        });
                    }),
                )
            }),
            catchError(error => throwError(error))
        );
    }


    uploadFile(_mediaInsert: MediaDb, _eventInsert: EventDb<MediaLastEventIdentifierFields>, file) {

            const path = _mediaInsert?.storagePath;  // The storage path

                const ref = this.storage.ref(path); // Reference to storage bucket
                this.task = this.storage.upload(path, file); // The main task

                return this.task.snapshotChanges().pipe(
                    finalize(async () => {

                        return ref.getDownloadURL().pipe(
                            switchMap(_downloadUrl => {
                                //-- Convert Url And trust Url ----------------------------------->
                                //  var url = URL.createObjectURL(_localMediaInsert?._local?.file);
                                //  const safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url)

                                const mediaInsert = {
                                    ..._mediaInsert,
                                    downloadUrl: _downloadUrl,
                                }

                                const eventInsert = {
                                    ..._eventInsert,
                                    what: {
                                        ...mediaInsert?.lastEvent?.what,
                                        obj: { ...mediaInsert }
                                    }
                                }

                                return of({
                                    mediaInsert: mediaInsert,
                                    mediaEventInsert: eventInsert
                                })
                            }),
                            catchError(error => throwError(error))
                        )
                    }),
                    catchError(error => {
                        console.log('error occured', error)
                        return of(null)
                    }),
                )
            // }
            // catch (error) {
            //     console.log('error occured', error)
            //     return of(null)
            // }
    }

}
