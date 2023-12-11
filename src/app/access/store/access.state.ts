/*************************************************************************************************
** Imports                                                                                      **
**************************************************************************************************/
//-- **NgRx** -----------------------------------------------------------------------------------//
import { createEntityAdapter, EntityState } from '@ngrx/entity';
//-- **Data Models** ----------------------------------------------------------------------------//
import { AccessDb, initialAccessDb } from '../models/access.model';

/************************************************************************************************************************
** Access State Variables                                                                                             **
**  -State Variables are persistent even when a page/component is destroyed UNLESS app is fully exited                 **
**  -Helps reduce extra calls to server as any calls made i.e. getUsers are stored in state variables until app exited **
**  -State Variables are the single source of state and can only be modified via access.reducer.ts                    **
**  -Access to state variables happens via access.selectors.ts and selectors can be imported into pages/components    ** 
*************************************************************************************************************************/

/* Provides Helper Functions for State Updates inside access.reducer.ts 
** (addOne, updateOne, getOne, removeOne, removeMany, setAll, etc)*/
interface EntityAccessDb extends EntityState<AccessDb> { }
const adapterAccess = createEntityAdapter<AccessDb>();
const accessEntityInitialState: EntityAccessDb = adapterAccess.getInitialState({});
export const accessAdapter = adapterAccess;

//-- Access State Variables ------->
export interface AccessState {
    accessObj: AccessDb;
    accessArray: EntityAccessDb;
    currentAccess: AccessDb;
    currentAccessList: EntityAccessDb;
}

//-- Initial Access State Variables ------------------>
export const AccessStateInitialState: AccessState = {
    accessObj: initialAccessDb,
    accessArray: accessEntityInitialState,
    currentAccess: initialAccessDb,
    currentAccessList: accessEntityInitialState,

};
