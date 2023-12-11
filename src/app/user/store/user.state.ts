/*************************************************************************************************
** Imports                                                                                      **
**************************************************************************************************/
//-- **NgRx** -----------------------------------------------------------------------------------//
import { createEntityAdapter, EntityState } from '@ngrx/entity';
//-- **Data Models** ----------------------------------------------------------------------------//
import { UserDb, initialUserDb } from '../models/user.model';

/************************************************************************************************************************
** User State Variables                                                                                             **
**  -State Variables are persistent even when a page/component is destroyed UNLESS app is fully exited                 **
**  -Helps reduce extra calls to server as any calls made i.e. getUsers are stored in state variables until app exited **
**  -State Variables are the single source of state and can only be modified via user.reducer.ts                    **
**  -Access to state variables happens via user.selectors.ts and selectors can be imported into pages/components    ** 
*************************************************************************************************************************/

/* Provides Helper Functions for State Updates inside user.reducer.ts 
** (addOne, updateOne, getOne, removeOne, removeMany, setAll, etc)*/
interface EntityUserDb extends EntityState<UserDb> { }
const adapterUser = createEntityAdapter<UserDb>();
const userEntityInitialState: EntityUserDb = adapterUser.getInitialState({});
export const userAdapter = adapterUser;

//-- User State Variables ------->
export interface UserState {
    userObj: UserDb;
    userArray: EntityUserDb;
    currentUser: UserDb;
}

//-- Initial User State Variables ------------------>
export const UserStateInitialState: UserState = {
    userObj: initialUserDb,
    userArray: userEntityInitialState,
    currentUser: initialUserDb,
};
