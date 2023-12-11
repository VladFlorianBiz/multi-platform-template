/*************************************************************************************************
** Imports                                                                                      **
**************************************************************************************************/
//-- **Core** -----------------------------------------------------------------------------------//
import { Action } from '@ngrx/store';
//-- **Data Models** ----------------------------------------------------------------------------//
import { MediaDb } from '../models/media.model';

/*************************************************************************************************
** Media Actions and their Payloads                                                           **
** - Actions are sent to the media.effects.ts which performs and executes action              **
** - Set and Success actions are sent to the media.reducer.ts which updates state variables   **
**************************************************************************************************/
export enum MediaActionTypes {
    GET_MEDIA_ARRAY         = '[Media] Get Media array',
    GET_MEDIA_ARRAY_SUCCESS = '[Media] Get Media array Success',

    GET_MEDIA = '[Media] Get Media',
    GET_MEDIA_SUCCESS = '[Media] Get Media Success',

    UPDATE_MEDIA = '[Media] Update Media',
    UPDATE_MEDIA_SUCCESS = '[Media] Update Media Success',

    CREATE_MEDIA = '[Media] Create Media',
    CREATE_MEDIA_SUCCESS = '[Media] Create Media Success',

    DELETE_MEDIA = '[Media] Delete Media',
    DELETE_MEDIA_SUCCESS = '[Media] Delete Media Success',

    CREATE_UNLINKED_MEDIA = '[Media] Create unlinked Media',
    CREATE_UNLINKED_MEDIA_SUCCESS = '[Media] Create unlinked Media Success',

    UPDATE_UNLINKED_MEDIA = '[Media] Update unlinked Media',
    UPDATE_UNLINKED_MEDIA_SUCCESS = '[Media] Update unlinked Media Success',

    DELETE_UNLINKED_MEDIA = '[Media] Delete unlinked Media',
    DELETE_UNLINKED_MEDIA_SUCCESS = '[Media] Delete unlinked Media Success',

    SET_UNLINKED_MEDIA = '[Media] Set Unlinked Media',

    SET_MEDIA = '[Media] Set Media',
    ACTION_SUCCESS = '[Media] Action was successful',
}

//-- Get Media Array ---------------------------------------------------->
export class GetMediaArray implements Action {
    readonly type = MediaActionTypes.GET_MEDIA_ARRAY;
}

export class GetMediaArraySuccess implements Action {
    readonly type = MediaActionTypes.GET_MEDIA_ARRAY_SUCCESS;
    constructor(public payload: { mediaArray: MediaDb[] }) { }
}

//-- Get Media ---------------------------------------->
export class GetMedia implements Action {
    readonly type = MediaActionTypes.GET_MEDIA;
    constructor(public payload: { mediaId: string }) { }
}

export class GetMediaSuccess implements Action {
    readonly type = MediaActionTypes.GET_MEDIA_SUCCESS;
    constructor(public payload: { mediaObj: MediaDb }) { }
}

//-- Update Media ---------------------------------------->
export class UpdateMedia implements Action {
    readonly type = MediaActionTypes.UPDATE_MEDIA;
    constructor(public payload: { mediaObj: MediaDb, redirectUrl?: string; redirectDirection?: string }) { }
}

export class UpdateMediaSuccess implements Action {
    readonly type = MediaActionTypes.UPDATE_MEDIA_SUCCESS;
    constructor(public payload: { mediaObj: MediaDb }) { }
}

//-- Create Media ----------------------------------------->
export class CreateMedia implements Action {
    readonly type = MediaActionTypes.CREATE_MEDIA;
    constructor(public payload: { mediaObj: MediaDb, redirectUrl?: string; redirectDirection?: string }) { }
}

export class CreateMediaSuccess implements Action {
    readonly type = MediaActionTypes.CREATE_MEDIA_SUCCESS;
    constructor(public payload: { mediaObj: MediaDb }) { }
}

//-- Delete Media ----------------------------------------->
export class DeleteMedia implements Action {
    readonly type = MediaActionTypes.DELETE_MEDIA;
    constructor(public payload: { mediaObj: MediaDb, redirectUrl?: string; redirectDirection?: string }) { }
}

export class DeleteMediaSuccess implements Action {
    readonly type = MediaActionTypes.DELETE_MEDIA_SUCCESS;
    constructor(public payload: { mediaObj: MediaDb }) { }
}


//-- Create Unlinked Media ----------------------------------------->
export class CreateUnlinkedMedia implements Action {
    readonly type = MediaActionTypes.CREATE_UNLINKED_MEDIA;
    constructor(public payload: { unlinkedMedia: MediaDb }) { }
}

export class CreateUnlinkedMediaSuccess implements Action {
    readonly type = MediaActionTypes.CREATE_UNLINKED_MEDIA_SUCCESS;
    constructor(public payload: { unlinkedMedia: MediaDb  }) { }
}


//-- Update Unlinked Media ----------------------------------------->
export class UpdateUnlinkedMedia implements Action {
    readonly type = MediaActionTypes.UPDATE_UNLINKED_MEDIA;
    constructor(public payload: { unlinkedMedia: MediaDb }) { }
}

export class UpdateUnlinkedMediaSuccess implements Action {
    readonly type = MediaActionTypes.UPDATE_UNLINKED_MEDIA_SUCCESS;
    constructor(public payload: { unlinkedMedia: MediaDb }) { }
}


//-- Delete Unlinked Media ----------------------------------------->
export class DeleteUnlinkedMedia implements Action {
    readonly type = MediaActionTypes.DELETE_UNLINKED_MEDIA;
    constructor(public payload: { unlinkedMedia: MediaDb }) { }
}

export class DeleteUnlinkedMediaSuccess implements Action {
    readonly type = MediaActionTypes.DELETE_UNLINKED_MEDIA_SUCCESS;
    constructor(public payload: { id?: string }) { }
}


//-- Set Media -------------------------------------------->
export class SetMedia implements Action {
    readonly type = MediaActionTypes.SET_MEDIA;
    constructor(public payload: { mediaObj: MediaDb }) { }
}


//-- Set Unlinked Media  -------------------------------------------->
export class SetUnlinkedMedia implements Action {
    readonly type = MediaActionTypes.SET_UNLINKED_MEDIA;
    constructor(public payload: { unlinkedMedia: MediaDb [] }) { }
}

//-- Action Success --------------------------------->
export class ActionSuccess implements Action {
    readonly type = MediaActionTypes.ACTION_SUCCESS;
}

export type MediaActions =
    | GetMediaArray
    | GetMediaArraySuccess

    | GetMedia
    | GetMediaSuccess

    | UpdateMedia
    | UpdateMediaSuccess

    | CreateMedia
    | CreateMediaSuccess

    | DeleteMedia
    | DeleteMediaSuccess

    | CreateUnlinkedMedia
    | CreateUnlinkedMediaSuccess
    | UpdateUnlinkedMedia
    | UpdateUnlinkedMediaSuccess
    | DeleteUnlinkedMedia
    | DeleteUnlinkedMediaSuccess

    | SetUnlinkedMedia

    | SetMedia
    | ActionSuccess;
