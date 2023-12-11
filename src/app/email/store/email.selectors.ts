 /*************************************************************************************************
** Imports                                                                                      **
**************************************************************************************************/
//-- **Core** -----------------------------------------------------------------------------------//
import { AppState } from '../../app.reducer';
//-- **NgRx Data Store** ------------------------------------------------------------------------//
import { createSelector } from '@ngrx/store';
import * as emailReducer from './email.reducer';

/*************************************************************************************************************************************************
** Email Selectors                                                                                                              **
**  -Selectors are the way to access email state variables found in (email.state)                             **
**  -Pages and Components import selectors in order to access state variables in a stream like approach(Observable).                            **
**  -Whenever state variables are changed via email.reducer.ts any affected selectors will automatically update with new value **
**  -Selectors are extremely powerful when it comes to enriching data or combining other state variables into custom selectors                  **
*************************************************************************************************************************************************/

//-- Email State Variables ---------------------------------------------------------//
export const getEmailObjState = (state: AppState) => state.email.emailObj;
export const getEmailArrayState = (state: AppState) => state.email.emailArray;

//-- Email State Variable Selectors ----------------------------------------------->
export const selectEmailArray = createSelector(
    getEmailArrayState,
    emailReducer.selectAll
);

export const selectEmailObj = createSelector(
    getEmailObjState,
    email => email
);

//-- Custom State Variable Selectors ----------------------------------------------->
