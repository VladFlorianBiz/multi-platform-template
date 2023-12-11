/*************************************************************************************************
** Imports                                                                                      **
**************************************************************************************************/
//-- **NgRx** -----------------------------------------------------------------------------------//
import { createEntityAdapter, EntityState } from '@ngrx/entity';
//-- **Data Models** ----------------------------------------------------------------------------//
import { EmailDb, initialEmailDb } from '../models/email.model';

/************************************************************************************************************************
** Email State Variables                                                                                             **
**  -State Variables are persistent even when a page/component is destroyed UNLESS app is fully exited                 **
**  -Helps reduce extra calls to server as any calls made i.e. getUsers are stored in state variables until app exited **
**  -State Variables are the single source of state and can only be modified via email.reducer.ts                    **
**  -Access to state variables happens via email.selectors.ts and selectors can be imported into pages/components    ** 
*************************************************************************************************************************/

/* Provides Helper Functions for State Updates inside email.reducer.ts 
** (addOne, updateOne, getOne, removeOne, removeMany, setAll, etc)*/
interface EntityEmailDb extends EntityState<EmailDb> { }
const adapterEmail = createEntityAdapter<EmailDb>();
const emailEntityInitialState: EntityEmailDb = adapterEmail.getInitialState({});
export const emailAdapter = adapterEmail;

//-- Email State Variables ------->
export interface EmailState {
    emailObj: EmailDb;
    emailArray: EntityEmailDb;
}

//-- Initial Email State Variables ------------------>
export const EmailStateInitialState: EmailState = {
    emailObj: initialEmailDb,
    emailArray: emailEntityInitialState,
};
