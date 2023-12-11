//-------------- Core ------------------------------------------------------------------------------------------------//
import { localStorageInitialState, LocalStorageState } from './local-storage.state';
import { LocalStorageActionTypes, LocalStorageActions } from './local-storage.actions';

//---------------LocalStorage Reducer --------------------------------------------------------------------------------//
export function localStorageReducer(state = localStorageInitialState, action: LocalStorageActions): LocalStorageState {
  switch (action.type) {

    case LocalStorageActionTypes.GET_ITEM_SUCCESS: {
      return Object.assign({}, state, {
        [action.payload.key]: action.payload.value
      });
    }

    case LocalStorageActionTypes.UPDATE_ITEM_IN_LIST_SUCCESS: {
      return Object.assign({}, state, {
        [action.payload.key]: action.payload.value
      });
    }

    case LocalStorageActionTypes.UPSERT_ITEM_IN_LIST_SUCCESS: {
      return Object.assign({}, state, {
        [action.payload.key]: action.payload.value
      });
    }

    case LocalStorageActionTypes.ADD_MULTIPLE_ITEMS_TO_LIST_SUCCESS: {
      return Object.assign({}, state, {
        [action.payload.key]: action.payload.value
      });
    }

    case LocalStorageActionTypes.GET_AND_UPDATE_ITEM_SUCCESS: {
      return Object.assign({}, state, {
        [action.payload.key]: action.payload.value
      });
    }

    case LocalStorageActionTypes.ADD_ITEM_TO_LIST_SUCCESS: {
      return Object.assign({}, state, {
        [action.payload.key]: action.payload.value
      });
    }

    case LocalStorageActionTypes.REMOVE_ITEM_IN_LIST_SUCCESS: {
      return Object.assign({}, state, {
        [action.payload.key]: action.payload.value
      });
    }

    case LocalStorageActionTypes.REMOVE_MULTIPLE_ITEMS_IN_LIST_SUCCESS: {
      return Object.assign({}, state, {
        [action.payload.key]: action.payload.value
      });
    }

    case LocalStorageActionTypes.UPDATE_MULTIPLE_ITEMS_IN_LIST_SUCCESS: {
      return Object.assign({}, state, {
        [action.payload.key]: action.payload.value
      });
    }

    case LocalStorageActionTypes.UPSERT_MULTIPLE_ITEMS_IN_LIST_SUCCESS: {
      return Object.assign({}, state, {
        [action.payload.key]: action.payload.value
      });
    }
      


    case LocalStorageActionTypes.ADD_ITEM_SUCCESS: {
      return Object.assign({}, state, {
        [action.payload.key]: action.payload.value
      });
    }

    case LocalStorageActionTypes.ADD_NEW_ITEM_SUCCESS: {
      return Object.assign({}, state, {
        [action.payload.key]: action.payload.value
      });
    }


    default:
      return state;
  }
}