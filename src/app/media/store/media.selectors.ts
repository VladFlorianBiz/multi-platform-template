import { mediaTypeOptions } from './../models/media.model';
import { selectWho } from './../../user/store/user.selectors';
 /*************************************************************************************************
** Imports                                                                                      **
**************************************************************************************************/
//-- **Core** -----------------------------------------------------------------------------------//
import { AppState } from '../../app.reducer';
//-- **NgRx Data Store** ------------------------------------------------------------------------//
import { createSelector } from '@ngrx/store';
import * as mediaReducer from './media.reducer';

/*************************************************************************************************************************************************
** Media Selectors                                                                                                              **
**  -Selectors are the way to access media state variables found in (media.state)                             **
**  -Pages and Components import selectors in order to access state variables in a stream like approach(Observable).                            **
**  -Whenever state variables are changed via media.reducer.ts any affected selectors will automatically update with new value **
**  -Selectors are extremely powerful when it comes to enriching data or combining other state variables into custom selectors                  **
*************************************************************************************************************************************************/

//-- Media State Variables ---------------------------------------------------------//
export const getMediaObjState = (state: AppState) => state.media.mediaObj;
export const getMediaArrayState = (state: AppState) => state.media.mediaArray;
export const getUnlinkedMediaState = (state: AppState) => state.media.unlinkedMedia;

//-- Media State Variable Selectors ----------------------------------------------->
export const selectMediaArray = createSelector(
    getMediaArrayState,
    mediaReducer.selectAll
);

export const selectMediaObj = createSelector(
    getMediaObjState,
    media => media
);

export const selectUnlinkedMedia = createSelector(
    getUnlinkedMediaState,
    mediaReducer.selectAll
);

//-- Custom State Variable Selectors ----------------------------------------------->

