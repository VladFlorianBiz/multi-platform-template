//-------------- Core -----------------------------------------------//
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
//-------------- Firebase ------------------------------------------//
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { AngularFireUploadTask } from '@angular/fire/compat/storage';



@Injectable({
  providedIn: 'root'
})
export class StorageService {
  task: AngularFireUploadTask;

  constructor(
    public http: HttpClient,
    private fireStoreStorage: AngularFireStorage

  ) { }

  //----------------- Upload To Storage ------------------------------------------------//
  uploadToStorage(filePath, file) {
    return this.fireStoreStorage.upload(filePath, file).snapshotChanges();
  }


  getStorageRef(filePath) {

    return this.fireStoreStorage.ref(filePath)
  }


  getDownloadUrl(filePath) {
    const work = this.fireStoreStorage.ref(filePath);
    return work.getDownloadURL();
  }


  //---- OTHER FILE STORAGE IMPLEMENTAITON RETURNING two OBSERVABLES
  // export interface FilesUploadLastEventdata {
  //   uploadProgress$: Observable<number>;
  //   downloadUrl$: Observable<string>;
  // }
  // https://indepth.dev/implement-file-upload-with-firebase-storage/
  // uploadFileAndGetLastEventdata(mediaFolderPath: string, fileToUpload: File): FilesUploadLastEventdata {
  //   const { name } = fileToUpload;
  //   const filePath = `${mediaFolderPath}/${new Date().getTime()}_${name}`;
  //   const uploadTask: AngularFireUploadTask = this.fireStoreStorage.upload(filePath, fileToUpload);
  //   return {
  //     uploadProgress$: uploadTask.percentageChanges(),
  //     downloadUrl$: this.getDownloadUrl$(uploadTask, filePath)
  //   };
  // }

  // private getDownloadUrl$(
  //   uploadTask: AngularFireUploadTask,
  //   path: string,
  // ): Observable<string> {
  //   return from(uploadTask).pipe(
  //     switchMap((_) => this.fireStoreStorage.ref(path).getDownloadURL()),
  //   );
  // }

}