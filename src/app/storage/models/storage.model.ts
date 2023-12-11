//--Storage Upload ------------------>
export interface StorageUpload {
  id?: string;
  //-------------------
  fileName?: string;
  size?: number;
  format?: string;
  //-------------------
  storagePath?: string;
  downloadUrl?: string;
  //---------
  progress?: number;
}

//-----Initial Storage Upload  ----------->
export const initialStorageUpload = {
  id: null,
  //-------------------
  fileName: null,
  size: null,
  format: null,
  //-------------------
  storagePath: null,
  downloadUrl: null,
  //---------
  progress: null,
}
