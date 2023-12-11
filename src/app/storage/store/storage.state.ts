import { createEntityAdapter, EntityState } from '@ngrx/entity';
import { StorageUpload, initialStorageUpload} from '../models/storage.model';

interface EntityStorageDb extends EntityState<StorageUpload> { }
const adapterStorage = createEntityAdapter<StorageUpload>();
const storageEntityInitialState: EntityStorageDb = adapterStorage.getInitialState({});
export const storageAdapter = adapterStorage;

//-------Invetory State Variables ------->
export interface StorageState {
    storageUploads: EntityStorageDb
    storageUploadObj: StorageUpload;
}

//-------Invetory Initial State Variables ------------>
export const StorageInitialState: StorageState = {
    storageUploads: storageEntityInitialState,
    storageUploadObj: initialStorageUpload,
};
