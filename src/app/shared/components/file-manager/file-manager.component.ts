/*************************************************************************************************
** Imports                                                                                      **
**************************************************************************************************/
//-- **Core** -----------------------------------------------------------------------------------//
import { Component, Input,  EventEmitter, Output } from "@angular/core";
import { Observable } from 'rxjs';
//-- **NgRx Data Store** ------------------------------------------------------------------------//
import { Store } from '@ngrx/store';
import { AppState } from '../../../app.reducer';
import * as MediaActions from './../../../media/store/media.actions';
import * as CoreActions from './../../../core/store/core.actions';

//-- **Data Models** ----------------------------------------------------------------------------//
import { mediaFormatOptions, } from '../../../media/models/media.model';
import { MediaDb } from '../../../media/models/media.model';
import { mediaFileExtensionOptions, UnsavedMediaItem, MediaLastEventIdentifierFields } from './../../../media/models/media.model';
import { environment } from './../../../../environments/environment';
import { LinkedMedia } from './../../../media/models/media.model';
import { EventDb } from './../../../event/models/event.model';
//------------- FireBase Upload -----------------------------------------------------//
import { AngularFireUploadTask } from '@angular/fire/compat/storage';
//-- **Helpers/Services** -----------------------------------------------------------------------//
import { UiHelper } from './../../helpers/ui.helper';
import { MediaDataObjHelper } from './../../../media/helpers/media-data-obj.helper';
import { NgxImageCompressService } from 'ngx-image-compress';

// import * as ImageBlobReduce from 'image-blob-reduce';

@Component({
    selector: 'cstm-file-manager',
    templateUrl: './file-manager.component.html',
    styleUrls: ['./file-manager.component.scss'],
})

/**
 * @export
 * @component FileManagerComponent
 * @example <ion-content>
          <!-- Upload Additional Photos File Manager --------------------------->
          <cstm-file-manager label="Additional photo(s)"
                             fileUploadLabel="Add File"
                             [additionalIds]="mediaAdditionalIds"
                             [mediaType]="mediaTypeOptions.inventoryOtherMedia"
                             [event]="mediaEvents?.createInventoryMedia"
                             [rootStoragePathFolder]="rootStoragePathFolder"
                             [showDeleteBtn]="showMediaDeleteBtn"
                             [showDownloadBtn]="showMediaDownloadBtn"
                             [who]="who"
                             [linkedMedia]="linkedOtherMedia"
                             [limit]="2">
          </cstm-file-manager>
   </ion-content>
 */
export class FileManagerComponent {


    //-------------------------------------------->
    //-- Inputs ---------------------------------->
    @Input() linkedMedia: LinkedMedia[] = [];
    //--------------------------------------------->
    @Input() label: string = '';
    @Input() fileUploadLabel: string = '';
    @Input() mediaType: string = null;  //**mediaTypeOptions** inventoryMain | userProfile 
    @Input() event: string = '[Media]-Create-Media';  //**mediaEvents**/
    @Input() rootStoragePathFolder: string = '';
    @Input() additionalIds?: any = {};
    @Input() who?: { id?: string; name?: string; } = {
        id: environment.appName,
        name: environment.appName
    };
    @Input() showDeleteBtn?: boolean = false;
    @Input() showDownloadBtn?: boolean = false;
    @Input() showEditMetaDataBtn?: boolean = false;
    @Input() limit?: number = 1;

    @Input() isAudioFile?: boolean = false;
    @Input() isTextFile?: boolean = false;

    //------------------------------------------>
    //-- Outputs ------------------------------->
    @Output() removeLinkedMediaItem = new EventEmitter<any>();

    // @Output() onUpdate = new EventEmitter<any>();
    //-------------------------------> 
    //-- Main Vars ----------------->
    task: AngularFireUploadTask;
    percentage: Observable<number>;
    snapshot: Observable<any>;
    downloadUrl;
    uploadComplete = false;
    taskPaused = false;

    //-- Audio -------------------->
    isRecording: boolean = false;
    audioChunks = [];
    mediaRecorder: MediaRecorder;

    //--------------------------->
    unlinkedMedia: {
        id?: string;
        media?: MediaDb,
        event?: EventDb<MediaLastEventIdentifierFields>,
        localMedia?: MediaDb
    }[] = [];
    //--
    imageBlobReduce


    formattedTime: string = '00:00';

    /************************************************************************************
    * @constructor Component Constructor
    * @description  Initialize Class and Dependencies(Imports), see SOME examples below.
    *							- Helpers: UiHelper, userDataObjHelper, FirebaseHelper
    *							- Services: userService
    *							- Ionic: NavController, ModalController
    *							- Form: FormBuilder
    *							- State: Store<AppState>
    * @return void
    **************************************************************************************/
    constructor(
        private uiHelper: UiHelper,
        private mediaDataObjHelper: MediaDataObjHelper,
        private store: Store<AppState>,
        private imageCompress: NgxImageCompressService,
    ) {

    }


async compressImage(file: File, width: number, height: number): Promise<File> {
    const quality = 90; // Quality of the image (0 to 100)

    const img = await this.loadImage(file);

    // Calculate the aspect ratio of the original image
    const aspectRatio = img.width / img.height;

    // Calculate the new dimensions based on the aspect ratio
    let newWidth = width;
    let newHeight = height;
    if (aspectRatio > 1) {
        newHeight = newWidth / aspectRatio;
    } else {
        newWidth = newHeight * aspectRatio;
    }

    // Create a canvas element and draw the resized image with bicubic interpolation
    const canvas = document.createElement('canvas');
    canvas.width = newWidth;
    canvas.height = newHeight;

    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingQuality = 'high';
    ctx.imageSmoothingEnabled = true;
    ctx.drawImage(img, 0, 0, newWidth, newHeight);

    // Convert the canvas element to a Blob object with the specified quality
    const blob = await new Promise<Blob>(resolve => canvas.toBlob(resolve, 'image/jpeg', quality / 100));

    // Create a new File object with the resized image
    const resizedFile = new File([blob], file.name, { type: blob.type });
    return resizedFile;
}

loadImage(file: File): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);

        reader.onload = () => {
            const img = new Image();
            img.onload = () => resolve(img);
            img.onerror = error => reject(error);
            img.src = reader.result as string;
        };

        reader.onerror = error => reject(error);
    });
}




    // Media UPLOAD STUFF TO DO REMOVE AND CLEAN UP -------------------------------------------------------------------------------
    async uploadFiles(media: FileList) {
        for (let i = 0; i < media.length; i++) {
            const _file = media[i];




            //------------------------------------------------------------------------------------------------------------------------------->
            //--- Is Image type ------------------------------------------------------------------------------------------------------------->
            if (_file.type.indexOf(mediaFormatOptions.image) > -1) {
                console.log('went into image')
                this.store.dispatch(new CoreActions.SetLoadingModalConfig({loadingModalConfig: {show: false, message: 'Resizing image...'}}))
                this.store.dispatch(new CoreActions.SetLoadingModalConfig({ loadingModalConfig: { show: true,  } }))

              const file = await   this.compressImage(_file, 800, 600)
                    this.store.dispatch(new CoreActions.SetLoadingModalConfig({ loadingModalConfig: { show: false, message: 'Loading' } }))

                    console.log('successs', file)
                    const dataObj = this.mediaDataObjHelper?.genMediaFileObj(
                        file,
                        mediaFileExtensionOptions.png,
                        this.rootStoragePathFolder,
                        mediaFormatOptions.image,
                        this.mediaType,
                        this.event,
                        this.who,
                        this.additionalIds,
                    );

                    const unlinkedMediaItem: UnsavedMediaItem = {
                        id: dataObj?.mediaInsert?.id,
                        media: dataObj?.mediaInsert,
                        event: dataObj.eventInsert,
                        localMedia: dataObj.stateUpdates.mediaObj
                    }

                    this.unlinkedMedia.push(unlinkedMediaItem);
            }

            //------------------------------------------------------------------------------------------------------------------------------->
            //--- Is Video type ------------------------------------------------------------------------------------------------------------->
            else if (_file.type.indexOf(mediaFormatOptions.video) > -1) {
                console.log('went into video')
                    const dataObj = this.mediaDataObjHelper?.genMediaFileObj(
                        _file,
                        mediaFileExtensionOptions.png,
                        this.rootStoragePathFolder,
                        mediaFormatOptions.image,
                        this.mediaType,
                        this.event,
                        this.who,
                        this.additionalIds,
                    );

                    const unlinkedMediaItem: UnsavedMediaItem = {
                        id: dataObj?.mediaInsert?.id,
                        media: dataObj?.mediaInsert,
                        event: dataObj.eventInsert,
                        localMedia: dataObj.stateUpdates.mediaObj
                    }
                    this.unlinkedMedia.push(unlinkedMediaItem);


            //------------------------------------------------------------------------------------------------------------------------------->
            //--- Is Audio type ------------------------------------------------------------------------------------------------------------->
            } else if (_file.type.indexOf(mediaFormatOptions.audio) > -1) {

                console.log('went into audio')

                const dataObj = this.mediaDataObjHelper?.genMediaFileObj(
                    _file,
                    _file?.type,
                    this.rootStoragePathFolder,
                    mediaFormatOptions.audio,
                    this.mediaType,
                    this.event,
                    this.who,
                    this.additionalIds,
                );

                const unlinkedMediaItem: UnsavedMediaItem = {
                    id: dataObj?.mediaInsert?.id,
                    media: dataObj?.mediaInsert,
                    event: dataObj.eventInsert,
                    localMedia: dataObj.stateUpdates.mediaObj
                }
                this.unlinkedMedia.push(unlinkedMediaItem);
            }

            //------------------------------------------------------------------------------------------------------------------------------->
            //--- Is text type ------------------------------------------------------------------------------------------------------------->
            else if (_file.type.indexOf(mediaFormatOptions.text) > -1) {

                console.log('went into TEXTTT')


                const dataObj = this.mediaDataObjHelper?.genMediaFileObj(
                    _file,
                    mediaFileExtensionOptions.text,                    
                    this.rootStoragePathFolder,
                    mediaFormatOptions.text,
                    this.mediaType,
                    this.event,
                    this.who,
                    this.additionalIds,
                );

                const unlinkedMediaItem: UnsavedMediaItem = {
                    id: dataObj?.mediaInsert?.id,
                    media: dataObj?.mediaInsert,
                    event: dataObj.eventInsert,
                    localMedia: dataObj.stateUpdates.mediaObj
                }
                this.unlinkedMedia.push(unlinkedMediaItem);
            }


            //------------------------------------------------------------------------------------------------------------------------------->
            //--- Is DOCX type ------------------------------------------------------------------------------------------------------------->
            else if (_file.type.indexOf(mediaFormatOptions.docx) > -1) {

                console.log('went into DOCX')

                const dataObj = this.mediaDataObjHelper?.genMediaFileObj(
                    _file,
                    mediaFileExtensionOptions.docx,
                    this.rootStoragePathFolder,
                    mediaFormatOptions.docx,
                    this.mediaType,
                    this.event,
                    this.who,
                    this.additionalIds,
                );

                const unlinkedMediaItem: UnsavedMediaItem = {
                    id: dataObj?.mediaInsert?.id,
                    media: dataObj?.mediaInsert,
                    event: dataObj.eventInsert,
                    localMedia: dataObj.stateUpdates.mediaObj
                }
                this.unlinkedMedia.push(unlinkedMediaItem);
            }


            //------------------------------------------------------------------------------------------------------------------------------->
            //--- Is CSV type ------------------------------------------------------------------------------------------------------------->
            else if (_file.type.indexOf(mediaFormatOptions.csv) > -1) {

                console.log('went into TEXTTT')


                const dataObj = this.mediaDataObjHelper?.genMediaFileObj(
                    _file,
                    mediaFileExtensionOptions.csv,
                    this.rootStoragePathFolder,
                    mediaFormatOptions.csv,
                    this.mediaType,
                    this.event,
                    this.who,
                    this.additionalIds,
                );

                const unlinkedMediaItem: UnsavedMediaItem = {
                    id: dataObj?.mediaInsert?.id,
                    media: dataObj?.mediaInsert,
                    event: dataObj.eventInsert,
                    localMedia: dataObj.stateUpdates.mediaObj
                }
                this.unlinkedMedia.push(unlinkedMediaItem);
            }

            //------------------------------------------------------------------------------------------------------------------------------->
            //--- Is XLSX type ------------------------------------------------------------------------------------------------------------->
            else if (_file.type.indexOf(mediaFormatOptions.xlsx) > -1) {

                console.log('went into .XLSX')


                const dataObj = this.mediaDataObjHelper?.genMediaFileObj(
                    _file,
                    mediaFileExtensionOptions.xlsx,
                    this.rootStoragePathFolder,
                    mediaFormatOptions.xlsx,
                    this.mediaType,
                    this.event,
                    this.who,
                    this.additionalIds,
                );

                const unlinkedMediaItem: UnsavedMediaItem = {
                    id: dataObj?.mediaInsert?.id,
                    media: dataObj?.mediaInsert,
                    event: dataObj.eventInsert,
                    localMedia: dataObj.stateUpdates.mediaObj
                }
                this.unlinkedMedia.push(unlinkedMediaItem);
            }

            //------------------------------------------------------------------------------------------------------------------------------->
            //--- Is XLS type ------------------------------------------------------------------------------------------------------------->
            else if (_file.type.indexOf(mediaFormatOptions.xlsx) > -1) {

                console.log('went into .xls')


                const dataObj = this.mediaDataObjHelper?.genMediaFileObj(
                    _file,
                    mediaFileExtensionOptions.xls,
                    this.rootStoragePathFolder,
                    mediaFormatOptions.xls,
                    this.mediaType,
                    this.event,
                    this.who,
                    this.additionalIds,
                );

                const unlinkedMediaItem: UnsavedMediaItem = {
                    id: dataObj?.mediaInsert?.id,
                    media: dataObj?.mediaInsert,
                    event: dataObj.eventInsert,
                    localMedia: dataObj.stateUpdates.mediaObj
                }
                this.unlinkedMedia.push(unlinkedMediaItem);
            }

            else if (_file.type.indexOf(mediaFormatOptions.pdf) > -1) {

                console.log('went into TEXTTT')


                const dataObj = this.mediaDataObjHelper?.genMediaFileObj(
                    _file,
                    mediaFileExtensionOptions.pdf,
                    this.rootStoragePathFolder,
                    mediaFormatOptions.pdf,
                    this.mediaType,
                    this.event,
                    this.who,
                    this.additionalIds,
                );

                const unlinkedMediaItem: UnsavedMediaItem = {
                    id: dataObj?.mediaInsert?.id,
                    media: dataObj?.mediaInsert,
                    event: dataObj.eventInsert,
                    localMedia: dataObj.stateUpdates.mediaObj
                }
                this.unlinkedMedia.push(unlinkedMediaItem);
            }

            else {
                this.uiHelper.displayMessageAlert('File Type Not Supported', 'Please select an image, pdf, audio, video, text, excel or pdf')
            }
        }
    }


    startTimer() {
        let time = 0;
        setInterval(() => {
            const minutes = Math.floor(time / 60);
            const seconds = time % 60;
            this.formattedTime = `${this.padZero(minutes)}:${this.padZero(seconds)}`;
            time++;
        }, 1000);
    }

    padZero(value: number): string {
        return value < 10 ? `0${value}` : `${value}`;
    }

    startRecording() {
        this.startTimer()
        navigator.mediaDevices.getUserMedia({ audio: true, video: false }).then(stream => {
            this.mediaRecorder = new MediaRecorder(stream);
            this.mediaRecorder.start();
            this.isRecording = true;

            this.mediaRecorder.addEventListener("dataavailable", event => {
                this.audioChunks.push(event.data);
            });
            this.mediaRecorder.addEventListener("stop", () => {
                this.isRecording = false;



                const audioBlob = new Blob(this.audioChunks);

                // const audioUrl = URL.createObjectURL(audioBlob);
                // const audio = new Audio(audioUrl);
                // audio.play();



                const audioFile = new File([audioBlob], "recording.mp3", { type: 'audio/mpeg' });  // create a File
                // create a FileList
                const dt = new DataTransfer();
                dt.items.add(audioFile);
                const fileList = dt.files;

                this.uploadFiles(fileList);  // call your method
            });
        });
    }

    stopRecording() {
        if (this.mediaRecorder) {
            this.mediaRecorder.stream.getTracks().forEach(track => track.stop());
            this.mediaRecorder.stop();
        }
    }

    fileUploadComplete(localMediaInsert) {
        // console.log('fileUpload compelte ', localMediaInsert)
        this.store.dispatch(new MediaActions.CreateUnlinkedMediaSuccess({ unlinkedMedia: localMediaInsert }))
    }

    removeUnlinkedMedia(unlinkedMediaItem: UnsavedMediaItem) {
        // console.log('removeFile  -----   unlinkedMedia', unlinkedMediaItem)
        const oldUploadedMedia = [...this.unlinkedMedia];
        const index = oldUploadedMedia?.findIndex(item => item.id == unlinkedMediaItem?.id)
        // this.unlinkedMedia.splice(index, 1)
        const updatedList = oldUploadedMedia?.filter(item => item?.id != unlinkedMediaItem?.id)


        this.unlinkedMedia = [...updatedList]
        this.store.dispatch(new MediaActions.DeleteUnlinkedMedia({ unlinkedMedia: unlinkedMediaItem }))
    }


    removeLinkedMedia(linkedMediaItem: LinkedMedia) {
        // console.log('removeFile  -----   linkedMediaItem', linkedMediaItem)
        const oldUploadedMedia = [...this.linkedMedia];
        const index = oldUploadedMedia?.findIndex(item => item.id == linkedMediaItem?.id)
        
        
        const updatedLinkedMedia = [...oldUploadedMedia?.filter(item => item?.id != linkedMediaItem?.id)]
        this.linkedMedia = [...updatedLinkedMedia]

        this.removeLinkedMediaItem.emit(linkedMediaItem);
    }


}
