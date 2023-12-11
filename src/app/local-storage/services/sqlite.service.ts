//-------------- Core ---------------------------------------------------------//
import { Injectable } from '@angular/core';
import { from } from 'rxjs';
//-------------- Native Plugins -----------------------------------------------//
import  PouchDB from 'pouchdb';
import * as  cordovaSqlitePlugin from 'pouchdb-adapter-cordova-sqlite';
import * as idbPlugin from "pouchdb-adapter-idb";
// import * as  webSqlPlugin from 'pouchdb-adapter-websql';
//-------------- Data Models --------------------------------------------------//
import { Platform } from '@ionic/angular';
import * as localStorageData from '../models/local-storage.model';
import { LocalStorageMediaDb } from '../models/local-storage.model';

@Injectable({
    providedIn: 'root'
})

export class SqlService {
    //-- Main Variables --------------------->
    offlineDbs: localStorageData.OfflineDbs = { ...localStorageData.initialOfflineDbs };
    dbType   = localStorageData.localStorageDbTypeOptionsObj.sqlite
    

    //---------- Initialize Pouch Db's Depending on Platform(web or mobile) ----------->
    constructor(
        private platform: Platform,
    ) {
        // this.initializeAll()
    }

    async initializeAll() {
        this.platform.ready().then(() => {

            this.dbType = (this.platform.is('hybrid') || this.platform.is('mobileweb'))
                ? localStorageData.localStorageDbTypeOptionsObj.idb
                : localStorageData.localStorageDbTypeOptionsObj.idb;
             // if (dbType === localStorageData.localStorageDbTypeOptionsObj.webSql) {
        //     PouchDB.plugin(webSqlPlugin);
        //     return new PouchDB(dbName, { revs_limit: 1, auto_compaction: true });
        // }
        // else {

        try {
            //------------ Loop 
            for (let index = 0; index < localStorageData.localStorageKeyOptionsArray.length; index++) {
                const dbName = localStorageData.localStorageKeyOptionsArray[index];
                this.offlineDbs[dbName] = this.initializeOfflineDb(dbName, this.dbType);

            }
        } catch (error) {
            console.log('error', error);
            alert('ERRORRR' + error)
            return error
        }


        })
    }



    //-------- Initialize Offline Db --------------------------------------------------------------->
    initializeOfflineDb(dbName, dbType) {

        if (dbType === localStorageData.localStorageDbTypeOptionsObj.idb) {
            PouchDB.plugin(idbPlugin)
            this.offlineDbs[dbName]?.plugin(idbPlugin);

            return new PouchDB(dbName, { revs_limit: 1, auto_compaction: true, adapter: dbType });
        }
        else {

        PouchDB.plugin(cordovaSqlitePlugin) 
        this.offlineDbs[dbName]?.plugin(cordovaSqlitePlugin);



            return new PouchDB(dbName, { 
                adapter: dbType,
                revs_limit: 1,
                auto_compaction: true,
                location: 'default',
                //-- new stuff try!
                iosDatabaseLocation: 'default',
                androidDatabaseImplementation: 2,     
            });
        // }
    }
}

    //---- Get Rev Id(Single) ----------->
    getRevId(key, id) {
        return from(this.offlineDbs[key].get(id))
    }


    //------ Delete Local Storage Item --->
    delete(key, id, rev) {
        const obj = {
            _id: id,
            _rev: rev
        };
        return from(this.offlineDbs[key].remove(obj));
    }

    //------ Delete Local Storage Item --->
    deleteMedia(key, id, rev) {
        // const obj = {
        //     _id: id,
        //     _rev: rev
        // };
        return from(this.offlineDbs[key].removeAttachment(key, id, rev));
    }

    //---- Insert Local Storage Item --------------------->
    update(key: string, id, value: any, rev?: string) {
        const obj = {
            _id: id,
            value: value,
            _rev: rev
        };
        return from(this.offlineDbs[key]?.put({ ...obj }, { force: true }));
    }

    cleanUpDb(key: string){
        return from(this.offlineDbs[key]?.viewCleanup());
    }

    //---- Get Local Storage Item ---------------------->
    get(key) {
        return from(this.offlineDbs[key]?.allDocs({ include_docs: true }))
    }



    //---- Insert Local Storage Item ------------------------------------------->
    insert(key: string, value: any, rev?: string) {
        const _rev = (typeof (rev) != "undefined" && rev !== null) ? rev : key;
        const obj = {
            _id: key,
            value: value,
            _rev: _rev
        };
        return from(this.offlineDbs[key]?.put({ ...obj }, { force: true }));
    }

    //---- Insert Local Storage Item --------------------->
    insertNew(key: string, id: string, value: any) {
        const obj = {
            _id: id,
            value: value,
        };
        return from(this.offlineDbs[key]?.put({ ...obj }, { force: true }));
    }

    // const localStorageMediaObj = {
    //     key: localStorageKeyOptionsObj.unsavedMedia,
    //     id: dataObj.mediaInsert.id,
    //     value: dataObj.mediaInsert,
    //     fileName: dataObj.mediaInsert.fileName,
    //     mediaContentType: mediaContentTypeOptions.video,
    //     blob: mediaFile.blob
    // }

    //---- Insert Media File -------------------------------------------->
    insertMediaFile(localStorageMedia: LocalStorageMediaDb) {
        const obj = {
            _id: localStorageMedia.id,
            value: localStorageMedia.value,
            _attachments: {
                [localStorageMedia.fileName]: {
                    content_type: localStorageMedia.mediaContentType,
                    data: localStorageMedia.blob
                }
            },
        };
        return from(this.offlineDbs[localStorageMedia.key]?.put({ ...obj }, { force: true }) );
    }

    //---- Get Media Item ----------------------------->
    getMediaItem(key, id, fileName) {
        return from(this.offlineDbs[key]?.getAttachment(id, fileName));
    }
}