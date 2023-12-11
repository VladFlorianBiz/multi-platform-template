/*************************************************************************************************
** Imports                                                                                      **
**************************************************************************************************/
//-- **Data Models** ----------------------------------------------------------------------------//
import { EventDb } from '../../event/models/event.model';
import { initialEventDb } from '../../event/models/event.model';
//------------------------------------------------------------------------------------------------>
//--- ***IMPORTANT*** ---------------------------------------------------------------------------->
//--- Update data version whenever data schema change occurs ------------------------------------->
//------------------------------------------------------------------------------------------------>
export const mediaDataVersion = 0;
export const mediaDatabaseName = "media"
export const mediaEvents = {
  create: '[Media]-Create-Media',
  update: '[Media]-Update-Media',
  delete: '[Media]-Delete-Media',
  createUserMedia: "[Media]-Create-User-Media",
  deleteUserMedia: "[Media]-Delete-User-Media",
  createAccessMedia: "[Media]-Create-Access-Media",
  deleteAccessMedia: "[Media]-Delete-Access-Media",

};

//-- LastEvent Identifier Fields ------------------>
export interface MediaLastEventIdentifierFields {
  eventId?: string;
  eventCorrelationId?: string;
  userId?: string;
  mediaId?: string;
  //Add Initial Identifier Id's below

}

export const initialMediaLastEventIdentifierFields = {
  eventId: null,
  eventCorrelationId: null,
  userId: null,
  mediaId: null,
  //Add Identifier Id's below
};

//--- Media Db Model ------------------------------------------------------------------------------------------------------------------------------------------------->
export interface MediaDb {
  id?: string;
  //--- Main Database Fields --------------------------------------------------------------------------------------------------------------------------------------------------------->
  fileName?: string;
  originalFileName?: string;
  fileExtension?: string; //**mediaFileExtensionOptions** e.g. 'video' | 'picture' | 'video' 
  title?: string;
  description?: string;
  storagePath?: string;
  downloadUrl?: string;
  format?: string;    //**mediaFormatOptions** image | video | pdf
  type?: string;      //**mediaTypeOptions** inventory | user
  size?: number;
  //---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------->
  _local?: {
    file?: File;
    blob?: Blob;
    src?: any;
  }; //-- Local front end display(gets deleted on server send) used for data enrichment making it easier to work with data on front by aggregating multiple calls
  display?: any; //-- Unlike '_local' this field does not get deleted on server send, good for labels or enrichment where an extra call would have to be made to display some label 
  //---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------->
  lastEvent?: EventDb<MediaLastEventIdentifierFields>;
  createdBy?: {
    id?: string;
    name?: string;
  };
  createdAt?: {
    week?: number;
    month?: number;
    year?: number;
    quarter?: number;
    day?: number;
    timestamp?: any;
  };
}


//---------------------------------------------------------------------->
//--- Main Media ------------------------------------------------------->
export interface LinkedMedia {
   id?: string;
  fileName?: string;
   fileExtension?: string; //**mediaTypeOptions**/ //e.g. 'mp4' | 'png'
   format?: string         //**mediaFormatOptions** image | video | pdf
   downloadUrl?: string,
  type?: string;          //**mediaTypeOptions**/ userMainPhoto | userOtherPhotos | userMainVideos | inventoryMainMedia | inventoryOtherMedia etc
  originalFileName?: string;
  metaDataKeyValue?: {key?: string, value?: any} []  //metaDataKeyValue {key: 'about': value: 'asdsa'}
}
//---------------------------------------------------------------------->
export const initialLinkedMedia: LinkedMedia = {
  id: null,
  fileName: null,
  fileExtension: null, //**mediaTypeOptions**/ //e.g. 'mp4' | 'png'
  format: null,        //**mediaFormatOptions** image | video | pdf
  downloadUrl: null,
  type: null,         //**mediaTypeOptions**/ userMainPhoto | userOtherPhotos | userMainVideos | inventoryMainMedia | inventoryOtherMedia etc
  originalFileName: null,
  metaDataKeyValue: []
}


//--- List of fields to delete when calling server ----------->
export const mediaFieldsToDeleteOnServerSend = ['_local'];


export const initialMediaLastEvent: EventDb<MediaLastEventIdentifierFields> = {
  ...initialEventDb,
  ids: { ...initialMediaLastEventIdentifierFields },
  what: {
     ...initialEventDb?.what,
    databaseName: mediaDatabaseName
  }
};

export const initialMediaDb: MediaDb = {
  id: null,
  //--- Main Database Fields --------------------------------------------------------------------------------------------------------------------------------------------------------->
  fileName: null,
  originalFileName: null,
  fileExtension: null,  //**mediaFileExtensionOptions** e.g. 'mp4' | 'png' 
  title: null,
  description: null,
  storagePath: null,
  downloadUrl: null,
  format: null,    //**mediaFormatOptions** image | video | pdf
  type: null,     //**mediaTypeOptions** inventoryMain | userProfile 
  size: null,
  //Add Identifier Id's below
  //---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------->
  _local:{ //-- Local front end display(gets deleted on server send) used for data enrichment making it easier to work with data on front by aggregating multiple calls
    file: null,
    blob: null,
    src: null,
  },
  display: { //-- Unlike '_local' this field does not get deleted on server send, good for labels or enrichment where an extra call would have to be made to display some label 

  },
  //---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------->
  lastEvent: { ...initialMediaLastEvent },
  createdBy: {
    id: null,
    name: null,
  },
  createdAt: {
    week: null,
    month: null,
    year: null,
    quarter: null,
    day: null,
    timestamp: null
  }

};


export interface UnsavedMediaItem {
  id?: string;
  media?: MediaDb,
  event?: EventDb<MediaLastEventIdentifierFields>;
  localMedia?: MediaDb
}

export const initialUnsavedMediaItem =  {
  id: null,
  media: {...initialMediaDb},
  event: {...initialMediaDb},
  localMedia: { ...initialMediaDb },
}


export const mediaContentTypeOptions = {
  photo: 'image/png',
  jpeg: 'image/jpeg',
  video: 'video/mp4',
};




export const mediaTypeOptions = {
  userProfilePicture: 'User Profile Picture',
  userMainMedia: "User Main Media ",
  userOtherMedia: "User Other Media ",
  accessMainMedia: "Access Main Media ",
  accessOtherMedia: "Access Other Media ",

};


export const mediaFileExtensionOptions = {
  png: '.png',
  jpeg: 'jpeg',
  video: '.mp4',
  audio: '.mp3',
  text: '.txt',
  docx: '.docx',
  pdf: '.pdf',
  csv: '.csv',
  xlsx: '.xlsx',
  xls: '.xls',
};


export const mediaFormatOptions = {
  image: 'image',
  video: 'video',
  pdf: 'pdf',
  audio: 'audio',
  text: 'text/plain',
  docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  csv: 'text/csv',
  xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  xls: 'application/vnd.ms-excel'
};