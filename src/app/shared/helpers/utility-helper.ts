/*************************************************************************************************
** Imports                                                                                      **
**************************************************************************************************/
//-- **Core** -----------------------------------------------------------------------------------//
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class UtilityHelper {
  constructor( ) { }

  public genDifferencesObj(newObj, oldObj) {
    const changedObj = Object.assign({}, newObj);

    let changedData: any;
    let modifiedFields = [];

    Object.keys(oldObj)
      .filter(k => oldObj[k] !== newObj[k])
      .forEach(element => {
        if (newObj[element] !== null && newObj[element] !== undefined) {
            modifiedFields.push(element);
            changedData = { ...changedData, [element]: changedObj[element] };
        }
      });

    return { changedData, modifiedFields };
  }


}
