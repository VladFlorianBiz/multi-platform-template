
//-------------- Core ------------------------------------------------------------------------------//
import { StorageInitialState, StorageState, storageAdapter  } from './storage.state';
import { StorageActionTypes, StorageActions } from './storage.actions';
//-------------- Data Models -----------------------------------------------------------------------//


//-------------- Storage Reducer ------------------------------------------------------------------->
export function storageReducer(state = StorageInitialState, action: StorageActions): StorageState {
  switch (action.type) {

    case StorageActionTypes.UPLOAD_TO_STORAGE_IN_PROGRESS: {
      return Object.assign({}, state, {
        storageUploadObj: action.payload.storageUploadObj,
      });
    }

    case StorageActionTypes.UPLOAD_TO_STORAGE_SUCCESS: {
      return Object.assign({}, state, {
        storageUploadObj: action.payload.storageUploadObj,
      });
    }

   
    case StorageActionTypes.SET_STORAGE_ITEM: {
      return Object.assign({}, state, {
        storageUploadObj: action.payload.storageUploadObj,
      });
    }

  

    default:
      return state;
  }
}

export const { selectAll } = storageAdapter.getSelectors();
