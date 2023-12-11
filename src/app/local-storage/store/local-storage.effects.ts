//--------------- Core -------------------------------------------------------------------------------//
import { Injectable } from '@angular/core';
import { tap, switchMap, catchError, take } from 'rxjs/operators';
import { of} from 'rxjs';
import { throwError } from 'rxjs';
import { finalize, concatMap, flatMap } from 'rxjs/operators';
//--------------- Data Store -------------------------------------------------------------------------//
import { Actions, ofType, createEffect } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { AppState } from '../../app.reducer';
import * as localStorageActions from './local-storage.actions';
import * as  authActions from './../../auth/store/auth.actions';
import * as ErrorActions from '../../error/store/error.actions';
//--------------- Services/Helpers -------------------------------------------------------------------//
import { UiHelper } from '../../shared/helpers/ui.helper';
import { LocalStorageDataObjHelper } from '../helpers/local-storage-data-obj.helper';
import { SqlService } from '../services/sqlite.service';
//--------------- Data Models ------------------------------------------------------------------------//
import { offlineSqlDefaultSettings } from '../models/local-storage.model';
import { localStorageKeyOptionsObj } from './../models/local-storage.model';


@Injectable()
export class LocalStorageEffects {
  offlineSqlDefaultSettings = offlineSqlDefaultSettings;

  constructor(
    private store: Store<AppState>,
    private actions$: Actions,
    private uiHelper: UiHelper,
    private localStorageDataObjHelper: LocalStorageDataObjHelper,
    private sqlService: SqlService,
  ) { }


  //------------------ Clear Local Storage ----------------------------------------------------------//
  clearLocalStorage$ = createEffect(() => this.actions$.pipe(
    ofType<localStorageActions.ClearLocalStorage>(localStorageActions.LocalStorageActionTypes.CLEAR_LOCAL_STORAGE),
    tap(() => {
      this.uiHelper.showLoader('Loading...')
    }),
    flatMap((action) => {
      //--------------------------------------------------------------------------------------------------------------------------------------------------//
      return [
        //----- From Local Storage - Set In Local Storage ----------------------S----------------------------------------------------------------------->
        // new localStorageActions.GetAndUpdateItem({ key: localStorageKeyOptionsObj.shoppingCart, value: { ...initialOrderDb, type: orderStatusOptions.shoppingCart} }),
        //---- Set State Variables ------------------------------------------------------------------------------------>
        new authActions.Logout(),
      ]
    }),
    finalize(() => {
      this.uiHelper.hideLoader();
      this.uiHelper.displayToast('Success', 2000, 'bottom')
      console.log('made it in here!!')
      window.localStorage.clear();
      sessionStorage.clear()
    })
  ));


  //------------------Get Item ----------------------------------------------------------//
  getItem$ = createEffect(() => this.actions$.pipe(
    ofType<localStorageActions.GetItem>(localStorageActions.LocalStorageActionTypes.GET_ITEM),
    concatMap((action) => {
      const key = action.payload.key;
      //--------------------------------------------------------------------------------------------------------------------------------------------------//
      return this.sqlService.get(key).pipe(
        take(1),
        switchMap((item) => {
          const enrichedItem = this.localStorageDataObjHelper.enrichLocalStorageByKey(key, item);
          return of(new localStorageActions.GetItemSuccess({ key: key, value: {...enrichedItem} }));
        }),
        catchError(error => {
          console.log('error in getItem$', error);
          this.uiHelper.displayErrorAlert(error.message);
          return of(new ErrorActions.HandleError({ error: { ...error }, actionType: action.type, payload: { ...action.payload }, insertError: true }));
        })
      );
    }),
  ));

  //------------------ Get And Update Item ----------------------------------------------------------------------//
  getAndUpdateItem$ = createEffect(() => this.actions$.pipe(
    ofType<localStorageActions.GetAndUpdateItem>(localStorageActions.LocalStorageActionTypes.GET_AND_UPDATE_ITEM),
    concatMap((action) => {
      const key = action.payload.key;
      const value = action.payload.value;


      //--------------------------------------------------------------------------------------------------------------------------------------------------//
      return this.sqlService.get(key).pipe(
        take(1),
        switchMap((res: any) => {
          const rev = (res?.rows?.length === 1) ? res?.rows[0]?.doc._rev : key;

          //--------- Insert Update Local Storage Item ---------------------------------------------->
          return this.sqlService.insert(key, value, rev).pipe(
            take(1),
            switchMap(() => {
              return of(new localStorageActions.GetAndUpdateItemSuccess({ key: key, value: value }));
            }),
            catchError(error => throwError(error))
          )
        }),
        catchError(error => {
          // alert(error)

          console.log('error key', key);
          console.log('error value', value);
          console.log('error in getAndUpdateItem$', error);
          this.uiHelper.displayErrorAlert(error);
          return of(new ErrorActions.HandleError({ error: { ...error }, actionType: action.type, payload: { ...action.payload }, insertError: false }));
        })
      );
    }),
  ));

  //------------------Add New Item ------------------------------------------------------------------//
  addNewItem$ = createEffect(() => this.actions$.pipe(
    ofType<localStorageActions.AddNewItem>(localStorageActions.LocalStorageActionTypes.ADD_NEW_ITEM),
    concatMap((action) => {
      const key = action.payload.key;
      const id = action.payload.id;
      const value = action.payload.value;
      //--------------------------------------------------------------------------------------------------------------------------------------------//

      return this.sqlService.insertNew(key, id, value).pipe(
        take(1),
        switchMap(() => {
          return of(new localStorageActions.AddItemSuccess({ key: key, value }));
        }),
        catchError(error => {
          console.log('error in localStorage - addItem$', error);
          this.uiHelper.displayErrorAlert(error.message);
          return of(new ErrorActions.HandleError({ error: { ...error }, actionType: action.type, payload: { ...action.payload }, insertError: true }));
        })
      );
    }),
  ));

  //------------------Add Item ------------------------------------------------------------------//
  addItem$ = createEffect(() => this.actions$.pipe(
    ofType<localStorageActions.AddItem>(localStorageActions.LocalStorageActionTypes.ADD_ITEM),
    concatMap((action) => {
      const key = action.payload.key;
      const value = action.payload.value;
      const rev = action.payload.rev;
      //--------------------------------------------------------------------------------------------------------------------------------------------//
      
      return this.sqlService.insert(key, value, rev).pipe(
        take(1),
        switchMap(() => {
          // console.log("res From Create Stuff YOOO", res)
          return of(new localStorageActions.AddItemSuccess({ key: key, value }));
        }),
        catchError(error => {
          console.log('error in localStorage - addItem$', error);
          this.uiHelper.displayErrorAlert(error.message);
          return of(new ErrorActions.HandleError({ error: { ...error }, actionType: action.type, payload: { ...action.payload }, insertError: true }));
        })
      );
    }),
  ));




  //   }),
  // ));

  //------------------Add Item To List----------------------------------------------------------------------//
  addItemToList$ = createEffect(() => this.actions$.pipe(
    ofType<localStorageActions.AddItemToList>(localStorageActions.LocalStorageActionTypes.ADD_ITEM_TO_LIST),
    concatMap((action) => {
      const key = action.payload.key;
      const objToAdd = action.payload.obj;

      //--------------------------------------------------------------------------------------------------------------------------------------------------//
      return this.sqlService.get(key).pipe(
        take(1),
        switchMap((res: any) => {
          const items = this.localStorageDataObjHelper.enrichLocalStorageByKey(key, res) as any[];
          const rev = (res?.rows?.length === 1) ? res?.rows[0]?.doc._rev : key;
          const updatedItems = [...items, {...objToAdd}];
          //--------- Insert Update Local Storage Item --------------------------------------------------------->
          return this.sqlService.insert(key, updatedItems, rev).pipe(
            take(1),
            switchMap(() => {
              return of(new localStorageActions.AddItemToListSuccess({ key: key, value: [...updatedItems] }));
            }),
            catchError(error => throwError(error))
          )
        }),
        catchError(error => {
          console.log('error in addItemToList$', error);
          this.uiHelper.displayErrorAlert(error.message);
          return of(new ErrorActions.HandleError({ error: { ...error }, actionType: action.type, payload: { ...action.payload }, insertError: false }));
        })
      );
    }),
  ));

  //----------------- Add Multiple Items To List ----------------------------------------------------------------------//
  addMultipleItemsToList$ = createEffect(() => this.actions$.pipe(
    ofType<localStorageActions.AddMultipleItemsToList>(localStorageActions.LocalStorageActionTypes.ADD_MULTIPLE_ITEMS_TO_LIST),
    concatMap((action) => {
      const key = action.payload.key;
      const itemsToAddToList = action.payload.items;

      //--------------------------------------------------------------------------------------------------------------------------------------------------//
      return this.sqlService.get(key).pipe(
        switchMap((res: any) => {
          const items = this.localStorageDataObjHelper.enrichLocalStorageByKey(key, res) as any [];
          const updatedItems = [...items, ...itemsToAddToList];
          const rev = (res?.rows?.length === 1) ? res?.rows[0]?.doc._rev : key;
          //--------- Insert Update Local Storage Item --------------------------------------------------------->
          return this.sqlService.insert(key, updatedItems, rev).pipe(
            switchMap(() => {
              return of(new localStorageActions.AddMultipleItemsToListSuccess({ key: key, value: [...updatedItems] }));
            }),
            catchError(error => throwError(error))
          )
        }),
        catchError(error => {
          console.log('error in addItemToList$', error);
          this.uiHelper.displayErrorAlert(error.message);
          return of(new ErrorActions.HandleError({ error: { ...error }, actionType: action.type, payload: { ...action.payload }, insertError: false }));
        })
      );
    }),
  ));

  //------------------Update Multiple Items In List----------------------------------------------------------------------------//
  updateMultipleItemsInList$ = createEffect(() => this.actions$.pipe(
    ofType<localStorageActions.UpdateMultipleItemsInList>(localStorageActions.LocalStorageActionTypes.UPDATE_MULTIPLE_ITEMS_IN_LIST),
    concatMap((action) => {

      const key = action.payload.key;
      const objIdKey = action.payload.objIdKey
      const itemsToUpdate = action.payload.items;

      //--------------------------------------------------------------------------------------------------------------------------------------------------//
      return this.sqlService.get(key).pipe(
        switchMap((res: any) => {
          const allItems = this.localStorageDataObjHelper.enrichLocalStorageByKey(key, res);
          const updatedItems = this.localStorageDataObjHelper.updateMultipleItemsInList(allItems, objIdKey, itemsToUpdate)
          const rev = (res?.rows?.length === 1) ? res?.rows[0]?.doc._rev : key;

          //--------- Insert Update Local Storage Item --------------------------------------------------------->
          return this.sqlService.insert(key, updatedItems, rev).pipe(
            switchMap(() => {
              return of(new localStorageActions.UpdateItemInListSuccess({ key: key, value: [...updatedItems] }));
            }),
            catchError(error => throwError(error))
          )
        }),
        catchError(error => {
          console.log('error in updateMultipleItemsInList$', error);
          this.uiHelper.displayErrorAlert(error.message);
          return of(new ErrorActions.HandleError({ error: { ...error }, actionType: action.type, payload: { ...action.payload }, insertError: false }));
        })
      );
    }),
  ));


  //------------------Upsert Multiple Items In List---------------------------------------------------------------------------//
  upsertMultipleItemsInList$ = createEffect(() => this.actions$.pipe(
    ofType<localStorageActions.UpsertMultipleItemsInList>(localStorageActions.LocalStorageActionTypes.UPSERT_MULTIPLE_ITEMS_IN_LIST),
    concatMap((action) => {
      const key = action.payload.key;
      const objIdKey = action.payload.objIdKey
      const upsertItems = action.payload.items;

      //--------------------------------------------------------------------------------------------------------------------------------------------------//
      return this.sqlService.get(key).pipe(
        switchMap((res: any) => {
          const items = this.localStorageDataObjHelper.enrichLocalStorageByKey(key, res);
          const updatedItems = this.localStorageDataObjHelper.upsertMultipleItemsInList(items, objIdKey, upsertItems)
          const rev = (res?.rows?.length === 1) ? res?.rows[0]?.doc._rev : key;

          //--------- Insert Update Local Storage Item --------------------------------------------------------->
          return this.sqlService.insert(key, updatedItems, rev).pipe(
            switchMap(() => {
              return of(new localStorageActions.UpsertMultipleItemsInListSuccess({ key: key, value: [...updatedItems] }));
            }),
            catchError(error => throwError(error))
          )
        }),
        catchError(error => {
          console.log('error in upsertMultipleItemsInList$', error);
          this.uiHelper.displayErrorAlert(error.message);
          return of(new ErrorActions.HandleError({ error: { ...error }, actionType: action.type, payload: { ...action.payload }, insertError: false }));
        })
      );
    }),
  ));


  //------------------Update Item In List----------------------------------------------------------------------//
  updateItemInList$ = createEffect(() => this.actions$.pipe(
    ofType<localStorageActions.UpdateItemInList>(localStorageActions.LocalStorageActionTypes.UPDATE_ITEM_IN_LIST),
    concatMap((action) => {
      const key = action.payload.key;
      const objToUpdate = action.payload.value;

      //--------------------------------------------------------------------------------------------------------------------------------------------------//
      return this.sqlService.get(key).pipe(
        switchMap((res: any) => {
          const items = this.localStorageDataObjHelper.enrichLocalStorageByKey(key, res);
          const updatedItems = this.localStorageDataObjHelper.updateObjInArray(items, objToUpdate)
          const rev = (res?.rows?.length === 1) ? res?.rows[0]?.doc._rev : key;

          //--------- Insert Update Local Storage Item --------------------------------------------------------->
          return this.sqlService.insert(key, updatedItems, rev).pipe(
            switchMap(() => {
              return of(new localStorageActions.UpdateItemInListSuccess({ key: key, value: [...updatedItems] }));
            }),
            catchError(error => throwError(error))
          )
        }),
        catchError(error => {
          console.log('error in updateItemInList$', error);
          this.uiHelper.displayErrorAlert(error.message);
          return of(new ErrorActions.HandleError({ error: { ...error }, actionType: action.type, payload: { ...action.payload }, insertError: false }));
        })
      );
    }),
  ));


  //------------------Upsert Item In List----------------------------------------------------------------------//
  upsertItemInList$ = createEffect(() => this.actions$.pipe(
    ofType<localStorageActions.UpsertItemInList>(localStorageActions.LocalStorageActionTypes.UPSERT_ITEM_IN_LIST),
    concatMap((action) => {
      const key = action.payload.key;
      const objToUpdate = action.payload.obj;

      //--------------------------------------------------------------------------------------------------------------------------------------------------//
      return this.sqlService.get(key).pipe(
        switchMap((res: any) => {
          const items = this.localStorageDataObjHelper.enrichLocalStorageByKey(key, res);
          const updatedItems = this.localStorageDataObjHelper.upsertItemInList(items, objToUpdate)
          const rev = (res?.rows?.length === 1) ? res?.rows[0]?.doc._rev : key;

          //--------- Insert Update Local Storage Item --------------------------------------------------------->
          return this.sqlService.insert(key, updatedItems, rev).pipe(
            switchMap(() => {
              return of(new localStorageActions.UpdateItemInListSuccess({ key: key, value: [...updatedItems] }));
            }),
            catchError(error => throwError(error))
          )
        }),
        catchError(error => {
          console.log('error in upsertItemInList$', error);
          this.uiHelper.displayErrorAlert(error.message);
          return of(new ErrorActions.HandleError({ error: { ...error }, actionType: action.type, payload: { ...action.payload }, insertError: false }));
        })
      );
    }),
  ));






  //------------------Remove  Item In List----------------------------------------------------------------------//
  removeItemInList$ = createEffect(() => this.actions$.pipe(
    ofType<localStorageActions.RemoveItemInList>(localStorageActions.LocalStorageActionTypes.REMOVE_ITEM_IN_LIST),
    concatMap((action) => {
      const key = action.payload.key;
      const objIdKey = action.payload.objIdKey;
      const id = action.payload.id;

      //--------------------------------------------------------------------------------------------------------------------------------------------------//
      return this.sqlService.get(key).pipe(
        switchMap((res: any) => {
          const items = this.localStorageDataObjHelper.enrichLocalStorageByKey(key, res);
          const updatedItems = this.localStorageDataObjHelper.removeObjInArray(items, objIdKey, id)
          const rev = (res?.rows?.length === 1) ? res?.rows[0]?.doc._rev : key;

          //--------- Insert Update Local Storage Item --------------------------------------------------------->
          return this.sqlService.insert(key, updatedItems, rev).pipe(
            switchMap(() => {
              return of(new localStorageActions.RemoveItemInListSuccess({ key: key, value: [...updatedItems] }));
            }),
            catchError(error => throwError(error))
          )
        }),
        catchError(error => {
          console.log('error in local storage - removeItemInList$', error);
          this.uiHelper.displayErrorAlert(error.message);
          return of(new ErrorActions.HandleError({ error: { ...error }, actionType: action.type, payload: { ...action.payload }, insertError: false }));
        })
      );
    }),
  ));

  //------------------Remove Multiple Items In List----------------------------------------------------------------------//
  removeMultipleItemsInList$ = createEffect(() => this.actions$.pipe(
    ofType<localStorageActions.RemoveMultipleItemsInList>(localStorageActions.LocalStorageActionTypes.REMOVE_MULTIPLE_ITEMS_IN_LIST),
    concatMap((action) => {
      const key = action.payload.key;
      const objIdKey = action.payload.objIdKey;
      const ids = action.payload.ids;

      //--------------------------------------------------------------------------------------------------------------------------------------------------//
      return this.sqlService.get(key).pipe(
        switchMap((res: any) => {
          const items = this.localStorageDataObjHelper.enrichLocalStorageByKey(key, res);
          const updatedItems = this.localStorageDataObjHelper.removeMultipleItemsInList(items, objIdKey, ids)
          const rev = (res?.rows?.length === 1) ? res?.rows[0]?.doc._rev : key;

          //--------- Insert Update Local Storage Item --------------------------------------------------------->
          return this.sqlService.insert(key, updatedItems, rev).pipe(
            switchMap(() => {
              return of(new localStorageActions.RemoveMultipleItemsInListSuccess({ key: key, value: [...updatedItems] }));
            }),
            catchError(error => throwError(error))
          )
        }),
        catchError(error => {
          console.log('error in local storage - removeItemInList$', error);
          this.uiHelper.displayErrorAlert(error.message);
          return of(new ErrorActions.HandleError({ error: { ...error }, actionType: action.type, payload: { ...action.payload }, insertError: false }));
        })
      );
    }),
  ));


}
