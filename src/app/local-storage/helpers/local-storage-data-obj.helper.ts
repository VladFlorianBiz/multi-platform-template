//-------------- Core ---------------------------------------------------------------------------------------//
import { Injectable } from '@angular/core';
//-------------- Services/Helpers ---------------------------------------------------------------------------//
//-------------- Data Models --------------------------------------------------------------------------------//
import { localStorageKeyOptionsObj } from '../models/local-storage.model';


@Injectable({
  providedIn: 'root'
})
export class LocalStorageDataObjHelper {

  constructor(
  ) { }

  //----- Enrich Local Storage Response ----------->
  updateObjInArray(items, obj) {
    return items?.map(item => {
      return (item.id === obj.id) ? obj : item;
    })
  }

  upsertItemInList(items, obj) {
    let itemExists = false;
    const updatedItems = items?.map(item => {
      if (item.id === obj.id) {
        itemExists = true;
        return {
          ...obj
        }
      }
      else {
        return {
          ...item
        }
      }
    })
    const upsertedList = (itemExists) ? updatedItems : [...updatedItems, { ...obj }];

    return upsertedList;
  }

  upsertMultipleItemsInList(items, objIdKey, upsertItems) {
    const updatedItems = items?.map(item => {
      const upsertList = upsertItems.filter(upserItem => upserItem[objIdKey] === item[objIdKey])
      const upsertItemExists = (upsertList.length > 0);
      return (upsertItemExists) ? { ...upsertList[0] } : { ...item }
    })

    const nonExistingUpsertItems = upsertItems.filter(upserItem => items.some(item => item[objIdKey] !== upserItem[objIdKey]))
    const updatedList = [...updatedItems, ...nonExistingUpsertItems];

    return updatedList;
  }


  checkDate(_date) {
    let date = null;
    if (_date != null) {
      try {
        date = new Date(_date)
      } catch (error) {
        date = null;
      }

      if (isNaN(Date.parse(date))) {
        // If the date is not valid, return null
        return null;
      }
    }
    // Otherwise, return the date as-is
    return date;
  }


  updateMultipleItemsInList(allItems, objIdKey, itemsToUpdate) {
    return allItems?.map(oldItem => {
      const itemUpdate = itemsToUpdate.filter(updateItem => updateItem[objIdKey] === oldItem[objIdKey]);
      return (itemUpdate.length > 0)
        ? itemUpdate[0]
        : oldItem
    })
  }

  removeObjInArray(items, objIdKey, id) {
    return items.filter(item => item[objIdKey] !== id);
  }


  removeMultipleItemsInList(items, objIdKey, ids) {
    return items.filter(item => !ids.includes(item[objIdKey]));
  }


  //----- Enrich Local Storage Response ----------->
  enrichLocalStorageByKey(key, localStorageItem) {
    // console.log('enrichLocalStorageByKey - localStorageItem', localStorageItem)
    // console.log('enrichLocalStorageByKey - key', key)

    const rows = localStorageItem?.rows ?? null;


      return []
  }





  enrichOfflineItem(item) {
    //-- Date Enrichments ------------------------------------------------------------------------------->
    const createdAt = {
      ...item?.createdAt,
      timestamp: this.checkDate(item?.createdAt?.timestamp)
    }

    //-- Enrich Last Event Date + Set Last Event Obj --------------------->
    const lastEvent = {
      ...item?.lastEvent,
      when: {
        ...item?.lastEvent?.when,
        timestamp: this.checkDate(item?.lastEvent?.when?.timestamp)
      }
    }

    return {
      ...item,
      lastEvent,
      createdAt,
    }
  }



}



