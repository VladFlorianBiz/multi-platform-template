/*************************************************************************************************
** Imports                                                                                      **
**************************************************************************************************/
//-- **Data Models** ----------------------------------------------------------------------------//
import { ErrorDb, initialErrorDb } from '../models/error.model';

/************************************************************************************************************************
** Fe@ture State Variables                                                                                             **
**  -State Variables are persistent even when a page/component is destroyed UNLESS app is fully exited                 **
**  -Helps reduce extra calls to server as any calls made i.e. getUsers are stored in state variables until app exited **
**  -State Variables are the single source of state and can only be modified via fe@ture.reducer.ts                    **
**  -Access to state variables happens via fe@ture.selectors.ts and selectors can be imported into pages/components    ** 
*************************************************************************************************************************/

//-- Fe@ture State Variables ------->
export interface ErrorState {
    lastError: ErrorDb
}

//-- Initial Feature State Variables -------->
export const ErrorInitialState: ErrorState = {
    lastError: initialErrorDb
};
