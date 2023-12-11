/*************************************************************************************************
** Imports                                                                                      **
**************************************************************************************************/
//-- **NgRx State Variables + Actions** ---------------------------------------------------------//
import { MediaState, MediaStateInitialState, mediaAdapter } from './media.state';
import { MediaActionTypes, MediaActions } from './media.actions';

/**********************************************************************************************************************************
** Media Reducer                                                                                                               **
**  -Reducer acts as a que that listens for set/success actions dispatched from the media.effects.ts file or a page/component  **
**  -The success/set actions uses its payload to update the media's state variables found at media.state.ts                  **
**  -The reducer only uses pure functions and it's the only place where the media's state variables can be modified            **
**  -Whenever state variables are changed affected selectors(media.selectors.ts) will automatically update with new value      **
***********************************************************************************************************************************/
export function mediaReducer(state = MediaStateInitialState, action: MediaActions): MediaState {
    switch (action.type) {

        case MediaActionTypes.GET_MEDIA_ARRAY_SUCCESS: {
            return Object.assign({}, state, {
                mediaArray: mediaAdapter.setAll(action.payload.mediaArray, state.mediaArray),
            });
        }

        case MediaActionTypes.GET_MEDIA_SUCCESS: {
            return Object.assign({}, state, {
                mediaObj: action.payload.mediaObj,
            });
        }

        case MediaActionTypes.UPDATE_MEDIA_SUCCESS: {
            const mediaObj = action.payload.mediaObj;
            const changes = { id: mediaObj.id, changes: { ...mediaObj } };
            return Object.assign({}, state, {
                mediaArray: mediaAdapter.updateOne(changes, state.mediaArray)
            });
        }

        case MediaActionTypes.CREATE_MEDIA_SUCCESS: {
            return Object.assign({}, state, {
                mediaArray: mediaAdapter.addOne(action.payload.mediaObj, state.mediaArray)
            });
        }

        case MediaActionTypes.DELETE_MEDIA_SUCCESS: {
            const id: string = action.payload.mediaObj.id
            return Object.assign({}, state, {
                mediaArray: mediaAdapter.removeOne(action.payload?.mediaObj?.id, state.mediaArray)
            });
        }




        case MediaActionTypes.UPDATE_UNLINKED_MEDIA_SUCCESS: {
            const unlinkedMedia = action.payload.unlinkedMedia;
            const changes = { id: unlinkedMedia.id, changes: { ...unlinkedMedia } };
            return Object.assign({}, state, {
                unlinkedMedia: mediaAdapter.updateOne(changes, state.unlinkedMedia)
            });
        }

        case MediaActionTypes.CREATE_UNLINKED_MEDIA_SUCCESS: {
            console.log('*****', action.payload.unlinkedMedia?._local?.file)
            return Object.assign({}, state, {
                unlinkedMedia: mediaAdapter.addOne(action.payload.unlinkedMedia, state.unlinkedMedia)
            });
        }

        case MediaActionTypes.DELETE_UNLINKED_MEDIA_SUCCESS: {
            return Object.assign({}, state, {
                unlinkedMedia: mediaAdapter.removeOne(action.payload?.id, state.unlinkedMedia)
            });
        }


        case MediaActionTypes.SET_UNLINKED_MEDIA: {
            return Object.assign({}, state, {
                unlinkedMedia: mediaAdapter.setAll(action.payload?.unlinkedMedia, state.unlinkedMedia)
            });
        }

        case MediaActionTypes.SET_MEDIA: {
            return Object.assign({}, state, {
                mediaObj: action.payload.mediaObj
            });
        }

        default:
            return state;
    }
}

export const { selectAll } = mediaAdapter.getSelectors();
