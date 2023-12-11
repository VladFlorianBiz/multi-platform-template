/*************************************************************************************************
** Imports                                                                                      **
**************************************************************************************************/
//-- **Core** -----------------------------------------------------------------------------------//
import { createSelector } from '@ngrx/store';
import { AppState } from '../../app.reducer';

/**********************************************************************************************************************************
** Fe@ture Selectors                                                                                                             **
**  -Selectors are the way to access feature state variables found in (feature.state)                                            **
**  -Pages and Components import selectors in order to access state variables in a stream like approach(Observable).             **
**  -Whenever state variables are changed via feature.reducer.ts any affected selectors will automatically update with new value **
**  -Selectors are extremely powerful when it comes to enriching data or combining other state variables into custom selectors   **
***********************************************************************************************************************************/

//-- Fe@ture State Variables ----------------------------------------------->
export const getLastErrorState = (state: AppState) => state.error.lastError;

//-- Fe@ture State Variable Selectors -------------------------->
export const selectLastError = createSelector(
  getLastErrorState,
  lastError => lastError
);