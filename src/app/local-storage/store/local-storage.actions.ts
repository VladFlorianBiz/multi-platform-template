//-------------- Core --------------------------------------------------------//
import { Action } from '@ngrx/store';

export enum LocalStorageActionTypes {
  UPDATE_ITEM_IN_LIST                     = '[LocalStorage] Update Item In List',
  UPDATE_ITEM_IN_LIST_SUCCESS             = '[LocalStorage] Update Item In List Success',

  UPSERT_ITEM_IN_LIST                     = '[LocalStorage] Upsert Item In List',
  UPSERT_ITEM_IN_LIST_SUCCESS             = '[LocalStorage] Upsert Item In List Success',

  UPSERT_MULTIPLE_ITEMS_IN_LIST           = '[LocalStorage] Upsert Multiple Items In List',
  UPSERT_MULTIPLE_ITEMS_IN_LIST_SUCCESS   = '[LocalStorage] Upsert Multiple Items  In List Success',

  ADD_ITEM_TO_LIST                        = '[LocalStorage] Add Item To List',
  ADD_ITEM_TO_LIST_SUCCESS                = '[LocalStorage] Add Item To List Success',

  REMOVE_ITEM_IN_LIST                     = '[LocalStorage] Remove Item In List',
  REMOVE_ITEM_IN_LIST_SUCCESS             = '[LocalStorage] Remove Item In List Success',

  REMOVE_MULTIPLE_ITEMS_IN_LIST           = '[LocalStorage] Remove Multiple Items In List',
  REMOVE_MULTIPLE_ITEMS_IN_LIST_SUCCESS   = '[LocalStorage] Remove Multiple Items In List Success',

  ADD_MULTIPLE_ITEMS_TO_LIST              = '[LocalStorage] Add Multiple Items To List',
  ADD_MULTIPLE_ITEMS_TO_LIST_SUCCESS      = '[LocalStorage] Add Multiple Items To List Success',

  UPDATE_MULTIPLE_ITEMS_IN_LIST          = '[LocalStorage] Update Multiple Items In List',
  UPDATE_MULTIPLE_ITEMS_IN_LIST_SUCCESS  = '[LocalStorage] Update Multiple Items In List Success',

  ADD_ITEM                               = '[LocalStorage] Add Item',
  ADD_ITEM_SUCCESS                       = '[LocalStorage] Add Item Success',

  CLEAR_LOCAL_STORAGE                               = '[LocalStorage] Clear local storage',
  CLEAR_LOCAL_STORAGE_SUCCESS                       = '[LocalStorage] Clear local storage Success',
  
  
  ADD_NEW_ITEM                               = '[LocalStorage] Add New Item',
  ADD_NEW_ITEM_SUCCESS                       = '[LocalStorage] Add New Item Success',



  GET_ITEM                               = '[LocalStorage] Get Item',
  GET_ITEM_SUCCESS                       = '[LocalStorage] Get Item Success',

  GET_AND_UPDATE_ITEM                    = '[LocalStorage] Get And Update Item',
  GET_AND_UPDATE_ITEM_SUCCESS            = '[LocalStorage] Get And Update Item Success',



  ACTION_SUCCESS                         = '[LocalStorage] Action was Successfull',
}

//---- Add Item ------------------------------------------------------------//
export class AddItem implements Action {
  readonly type = LocalStorageActionTypes.ADD_ITEM;
  constructor(public payload: { key: string, value: any, rev?: string;}) { }
}

export class AddItemSuccess implements Action {
  readonly type = LocalStorageActionTypes.ADD_ITEM_SUCCESS;
  constructor(public payload: { key: string, value: any }) { }
}


//---- Clear Local Storage  ------------------------------------------------------------//
export class ClearLocalStorage implements Action {
  readonly type = LocalStorageActionTypes.CLEAR_LOCAL_STORAGE;
}

export class ClearLocalStorageSuccess implements Action {
  readonly type = LocalStorageActionTypes.CLEAR_LOCAL_STORAGE_SUCCESS;
  constructor(public payload: { key: string }) { }

}

//---- Add New Item ------------------------------------------------------------//
export class AddNewItem implements Action {
  readonly type = LocalStorageActionTypes.ADD_NEW_ITEM;
  constructor(public payload: { key: string, id: string, value: any }) { }
}

export class AddNewItemSuccess implements Action {
  readonly type = LocalStorageActionTypes.ADD_NEW_ITEM_SUCCESS;
  constructor(public payload: { key: string, value: any }) { }
}


//---- Get And Replace Item ------------------------------------------------------------//
export class GetAndUpdateItem implements Action {
  readonly type = LocalStorageActionTypes.GET_AND_UPDATE_ITEM;
  constructor(public payload: { key: string, value: any,  }) { }
}

export class GetAndUpdateItemSuccess implements Action {
  readonly type = LocalStorageActionTypes.GET_AND_UPDATE_ITEM_SUCCESS;
  constructor(public payload: { key: string, value: any }) { }
}



//---- Update Item In List ------------------------------------------------------------//
export class UpdateItemInList implements Action {
  readonly type = LocalStorageActionTypes.UPDATE_ITEM_IN_LIST;
  constructor(public payload: { key: string, value: any }) { }
}

export class UpdateItemInListSuccess implements Action {
  readonly type = LocalStorageActionTypes.UPDATE_ITEM_IN_LIST_SUCCESS;
  constructor(public payload: { key: string, value: any }) { }
}

//---- Upsert Item In List ------------------------------------------------------------//
export class UpsertItemInList implements Action {
  readonly type = LocalStorageActionTypes.UPSERT_ITEM_IN_LIST;
  constructor(public payload: { key: string, obj: any }) { }
}

export class UpsertItemInListSuccess implements Action {
  readonly type = LocalStorageActionTypes.UPSERT_ITEM_IN_LIST_SUCCESS;
  constructor(public payload: { key: string, value: any }) { }
}



//---- Upsert Multiple Items In List ------------------------------------------------------------//
export class UpsertMultipleItemsInList implements Action {
  readonly type = LocalStorageActionTypes.UPSERT_MULTIPLE_ITEMS_IN_LIST;
  constructor(public payload: { key: string, objIdKey: string, items: any [] }) { }
}

export class UpsertMultipleItemsInListSuccess implements Action {
  readonly type = LocalStorageActionTypes.UPSERT_MULTIPLE_ITEMS_IN_LIST_SUCCESS;
  constructor(public payload: { key: string, value: any }) { }
}

//---- Add Item In List ------------------------------------------------------------//
export class AddItemToList implements Action {
  readonly type = LocalStorageActionTypes.ADD_ITEM_TO_LIST;
  constructor(public payload: { key: string, obj: any }) { }
}

export class AddItemToListSuccess implements Action {
  readonly type = LocalStorageActionTypes.ADD_ITEM_TO_LIST_SUCCESS;
  constructor(public payload: { key: string, value: any }) { }
}

//---- Remove Item In List ------------------------------------------------------------//
export class RemoveItemInList implements Action {
  readonly type = LocalStorageActionTypes.REMOVE_ITEM_IN_LIST;
  constructor(public payload: { key: string, objIdKey: string, id: string; }) { }
}

export class RemoveItemInListSuccess implements Action {
  readonly type = LocalStorageActionTypes.REMOVE_ITEM_IN_LIST_SUCCESS;
  constructor(public payload: { key: string, value: any }) { }
}


//---- Remove Multiple Items In List ------------------------------------------------------------//
export class RemoveMultipleItemsInList implements Action {
  readonly type = LocalStorageActionTypes.REMOVE_MULTIPLE_ITEMS_IN_LIST;
  constructor(public payload: { key: string, objIdKey: string, ids: string []; }) { }
}

export class RemoveMultipleItemsInListSuccess implements Action {
  readonly type = LocalStorageActionTypes.REMOVE_MULTIPLE_ITEMS_IN_LIST_SUCCESS;
  constructor(public payload: { key: string, value: any }) { }
}


//---- Update Multiple Items In List ------------------------------------------------------------//
export class UpdateMultipleItemsInList implements Action {
  readonly type = LocalStorageActionTypes.UPDATE_MULTIPLE_ITEMS_IN_LIST;
  constructor(public payload: { key: string, objIdKey: string, items: any[]; }) { }
}

export class UpdateMultipleItemsInListSuccess implements Action {
  readonly type = LocalStorageActionTypes.UPDATE_MULTIPLE_ITEMS_IN_LIST_SUCCESS;
  constructor(public payload: { key: string, value: any }) { }
}


//---- Add Multiple Items To List ------------------------------------------------------------//
export class AddMultipleItemsToList implements Action {
  readonly type = LocalStorageActionTypes.ADD_MULTIPLE_ITEMS_TO_LIST;
  constructor(public payload: { key: string, items: any [] }) { }
}

export class AddMultipleItemsToListSuccess implements Action {
  readonly type = LocalStorageActionTypes.ADD_MULTIPLE_ITEMS_TO_LIST_SUCCESS;
  constructor(public payload: { key: string, value: any }) { }
}


//---- Get Item -------------------------------------------------------//
export class GetItem implements Action {
  readonly type = LocalStorageActionTypes.GET_ITEM;
  constructor(public payload: { key: string }) { }
}

export class GetItemSuccess implements Action {
  readonly type = LocalStorageActionTypes.GET_ITEM_SUCCESS;
  constructor(public payload:  { key: string, value: any}) { }
}




//-----Action Success -------------------------------------//
export class ActionSuccess implements Action {
  readonly type = LocalStorageActionTypes.ACTION_SUCCESS;
}

export type LocalStorageActions =

  ClearLocalStorage
| ClearLocalStorageSuccess

  | UpsertItemInList
  | UpsertItemInListSuccess

  | AddNewItem
  | AddNewItemSuccess

  | AddItem
  | AddItemSuccess

  | GetItem
  | GetItemSuccess


  | UpdateMultipleItemsInList
  | UpdateMultipleItemsInListSuccess

  | UpsertMultipleItemsInList
  | UpsertMultipleItemsInListSuccess

  | GetAndUpdateItem
  | GetAndUpdateItemSuccess

  | UpdateItemInList
  | UpdateItemInListSuccess

  | AddItemToList
  | AddItemToListSuccess

  | RemoveItemInList
  | RemoveItemInListSuccess

  | RemoveMultipleItemsInList
  | RemoveMultipleItemsInListSuccess

  | AddMultipleItemsToList
  | AddMultipleItemsToListSuccess

  | ActionSuccess;
