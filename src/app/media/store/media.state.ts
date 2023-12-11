/*************************************************************************************************
** Imports                                                                                      **
**************************************************************************************************/
//-- **NgRx** -----------------------------------------------------------------------------------//
import { createEntityAdapter, EntityState } from '@ngrx/entity';
//-- **Data Models** ----------------------------------------------------------------------------//
import { MediaDb, initialMediaDb } from '../models/media.model';

/************************************************************************************************************************
** Media State Variables                                                                                             **
**  -State Variables are persistent even when a page/component is destroyed UNLESS app is fully exited                 **
**  -Helps reduce extra calls to server as any calls made i.e. getUsers are stored in state variables until app exited **
**  -State Variables are the single source of state and can only be modified via media.reducer.ts                    **
**  -Access to state variables happens via media.selectors.ts and selectors can be imported into pages/components    ** 
*************************************************************************************************************************/

/* Provides Helper Functions for State Updates inside media.reducer.ts 
** (addOne, updateOne, getOne, removeOne, removeMany, setAll, etc)*/
interface EntityMediaDb extends EntityState<MediaDb> { }
const adapterMedia = createEntityAdapter<MediaDb>();
const mediaEntityInitialState: EntityMediaDb = adapterMedia.getInitialState({});
export const mediaAdapter = adapterMedia;


//-- Media State Variables ------->
export interface MediaState {
    mediaObj: MediaDb;
    mediaArray: EntityMediaDb;
    unlinkedMedia: EntityMediaDb
}

//-- Initial Media State Variables ------------------>
export const MediaStateInitialState: MediaState = {
    mediaObj: initialMediaDb,
    mediaArray: mediaEntityInitialState,
    unlinkedMedia: mediaEntityInitialState
};
