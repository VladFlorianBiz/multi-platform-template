
//-------------- Core ---------------------------------------------------------------//
import { Component, Input, EventEmitter, Output, OnInit } from "@angular/core";
import { Observable, Subject, of, throwError } from 'rxjs';
import { finalize, take, switchMap, catchError } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { ViewChild, ElementRef } from '@angular/core';
//-------------- Data Store ----------------------------------------------------------//
import { Store } from '@ngrx/store';
import { AppState } from '../../../app.reducer';
import * as ErrorActions from '../../../error/store/error.actions';
import * as MediaActions from '../../../media/store/media.actions';
import * as CoreActions from '../../../core/store/core.actions';
//------------- FireBase Upload -----------------------------------------------------//
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/compat/storage';
//-- **Helpers/Services** -----------------------------------------------------------------------//
import { UiHelper } from '../../helpers/ui.helper';
import { MediaService } from '../../../media/services/media.service';
//-- **Data Models** ----------------------------------------------------------------------------//
import { MediaLastEventIdentifierFields, mediaFormatOptions, } from '../../../media/models/media.model';
import { initialUnsavedMediaItem } from '../../../media/models/media.model';
import { initialLoadingModalConfig } from '../../../core/models/core.model';
import { initialLinkedMedia, LinkedMedia, UnsavedMediaItem } from '../../../media/models/media.model';
import { MediaDb } from '../../../media/models/media.model';
import { EventDb } from '../../../event/models/event.model';


@Component({
  selector: 'cstm-ai-file-item',
  templateUrl: './ai-file-item.component.html',
  styleUrls: ['./ai-file-item.component.scss'],
})
export class AiFileItemComponent implements OnInit {
  //-- Core  -------------------------------------------------->
  private destroy$: Subject<boolean> = new Subject<boolean>();
  @ViewChild('myVideo') myVideo: ElementRef; // Prior to Angular 8
  //-- Inputs ------------------------------------------------------------>
  @Input() unlinkedMedia: UnsavedMediaItem = { ...initialUnsavedMediaItem };
  @Input() linkedMedia: LinkedMedia = { ...initialLinkedMedia }
  @Input() showDeleteBtn: boolean = false;
  @Input() showDownloadBtn: boolean = false;
  //-- Outputs ------------------------------------------>
  @Output() fileUploadComplete = new EventEmitter<any>();
  @Output() removeUnlinkedMedia = new EventEmitter<any>();
  @Output() removeLinkedMedia = new EventEmitter<any>();
  //-- Data Models ----------------------->
  mediaFormatOptions = mediaFormatOptions;
  //-- Main Vars ----------------->
  task: AngularFireUploadTask;
  percentage: Observable<number>;
  snapshot: Observable<any>;
  downloadUrl;
  uploadComplete = false;
  taskPaused = false;
  isLinkedMediaItem = false;

  constructor(
    private uiHelper: UiHelper,
    private storage: AngularFireStorage,
    private store: Store<AppState>,
    private mediaService: MediaService,
    private http: HttpClient,

  ) { }


  ngOnInit() {
    // console.log('this.unlinkedMEdiaItem', this.unlinkedMedia)
    // console.log('this.linkedMediaItem', this.linkedMedia)
    this.isLinkedMediaItem = (this.linkedMedia?.downloadUrl?.length > 0);

    if (this.isLinkedMediaItem) {
      this.downloadUrl = this.linkedMedia?.downloadUrl;
      this.uploadComplete = true;
    } else {
      this.startUpload(this.unlinkedMedia?.media, this.unlinkedMedia?.event, this.unlinkedMedia?.localMedia);

    }
  }

  startUpload(_mediaInsert: MediaDb, _eventInsert: EventDb<MediaLastEventIdentifierFields>, _localMediaInsert: MediaDb) {
    if (_localMediaInsert?._local?.file !== null) {
      
      const path = _mediaInsert?.storagePath;  // The storage path

      try {
        
        const ref = this.storage.ref(path); // Reference to storage bucket
        this.task = this.storage.upload(path, _localMediaInsert?._local?.file); // The main task
        this.percentage = this.task.percentageChanges(); // Progress monitoring

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

                const localMediaInsert: MediaDb = {
                  ..._localMediaInsert,
                  downloadUrl: _downloadUrl,
                  _local: {
                    ..._localMediaInsert?._local,
                    src: _downloadUrl //safeUrl
                  }
                }

                return this.mediaService.createMedia(mediaInsert, eventInsert).pipe(
                  take(1),
                  switchMap(() => {
                    this.downloadUrl = _downloadUrl; // should I use safeUrl instead?
                    this.uploadComplete = true;
                    
                    this.fileUploadComplete.emit(localMediaInsert);
                    return of(true)
                  }),
                  catchError(error => throwError(error))
                )
              }),
              catchError(error => throwError(error))
            ).subscribe(() => {  });
          }),
          catchError(error => {
            this.store.dispatch(new CoreActions.SetLoadingModalConfig({loadingModalConfig: {  ...initialLoadingModalConfig }}))
            console.log('error in removeVideoFromStudentEvaluation$', error);
            this.uiHelper.displayErrorAlert(error.message);
            return of(new ErrorActions.HandleError({ error: { ...error }, actionType: MediaActions.CreateMedia, payload: { ..._mediaInsert }, insertError: true }));
          }),
        ).subscribe(() => { });
      }
      catch (error) {
        console.log('error in startUpload$', error);
        this.store.dispatch(new CoreActions.SetLoadingModalConfig({loadingModalConfig: {  ...initialLoadingModalConfig }}))
        this.uiHelper.displayErrorAlert(error.message);
        this.store.dispatch(new ErrorActions.HandleError({ error: { ...error }, actionType: MediaActions.CreateMedia, payload: { ..._mediaInsert }, insertError: true }));
      }
    } else {
      // TO DO should I use download url OR 
      // var url = URL.createObjectURL(_localMediaInsert?._local?.file);
      // const safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url)
      this.downloadUrl = this.unlinkedMedia?.media.downloadUrl;
      this.uploadComplete = true;
    }
  }
  

  downloadMediaUrl(url: string): Observable<Blob> {
    return this.http.get(url, {
      responseType: 'blob'
    })
  }


  downloadFile() {
    this.downloadMediaUrl(this.downloadUrl).subscribe(blob => {
      const a = document.createElement('a')
      const objectUrl = URL.createObjectURL(blob)
      a.href = objectUrl
      a.download = 'Media-' + this.unlinkedMedia?.media?.fileName + this.unlinkedMedia?.media?.fileExtension;
      a.target = "_blank"
      a.rel = "noopener noreferrer"
      this.store.dispatch(new CoreActions.SetLoadingModalConfig({loadingModalConfig: {  ...initialLoadingModalConfig }}));

      a.click();
      URL.revokeObjectURL(objectUrl);
    })
  }

  
  deleteFile() {
    if (this.isLinkedMediaItem) {
      this.removeLinkedMedia.emit(this.linkedMedia);

    } else {
      this.removeUnlinkedMedia.emit(this.unlinkedMedia?.media);
    }
  }

  playPause() {
    //  ;
    if (this.myVideo.nativeElement.paused) {
      this.myVideo.nativeElement.play();
      // button.innerHTML = "&#10073;&#10073;";
    } else {
      this.myVideo.nativeElement.pause();
      // button.innerHTML = "►";
    }
  }



  pauseTask() {
    this.task.pause();
    this.taskPaused = true;
  }



  resumeTask() {
    this.task.resume();
    this.taskPaused = false;
  }

  cancelTask() {
    this.task.resume();
    this.taskPaused = false;
  }


  ngOnDestroy() {
    // console.log('Destroyed Media Item 2');
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
} 