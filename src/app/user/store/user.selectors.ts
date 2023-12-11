/*************************************************************************************************
** Imports                                                                                      **
**************************************************************************************************/
//-- **Core** -----------------------------------------------------------------------------------//
import { AppState } from '../../app.reducer';
//-- **Data/Models** ----------------------------------------------------------------------------//
import { LinkedMedia, mediaTypeOptions } from './../../media/models/media.model';
import { initialLinkedMedia } from './../../media/models/media.model';
//-- **NgRx Data Store** ------------------------------------------------------------------------//
import { createSelector } from '@ngrx/store';
import * as userReducer from './user.reducer';
import { selectUnlinkedMedia } from './../../media/store/media.selectors';
import { environment } from '../../../environments/environment';

/*************************************************************************************************************************************************
** User Selectors                                                                                                              **
**  -Selectors are the way to access user state variables found in (user.state)                             **
**  -Pages and Components import selectors in order to access state variables in a stream like approach(Observable).                            **
**  -Whenever state variables are changed via user.reducer.ts any affected selectors will automatically update with new value **
**  -Selectors are extremely powerful when it comes to enriching data or combining other state variables into custom selectors                  **
*************************************************************************************************************************************************/

//-- User State Variables ---------------------------------------------------------//
export const getUserObjState = (state: AppState) => state.user.userObj;
export const getCurrentUserState = (state: AppState) => state.user.currentUser;
export const getUserArrayState = (state: AppState) => state.user.userArray;

//-- User State Variable Selectors ----------------------------------------------->
export const selectUserArray = createSelector(
    getUserArrayState,
    userReducer.selectAll
);

export const selectUserObj = createSelector(
    getUserObjState,
    user => user
);

export const selectCurrentUser = createSelector(
    getCurrentUserState,
    currentUser => currentUser
);

export const selectWho = createSelector(
    selectCurrentUser,
    user => {
        const userId = !(user?.id?.length > 0)
            ? environment.appName
            : user?.id;

        const name = !(user?.fullName?.length > 0)
            ? environment.appName
            : user?.fullName;

        const selectWho = {
            name: name,
            id: userId
        }

        return {
            ...selectWho
        };
    }
)

//-- Custom State Variable Selectors ----------------------------------------------->
export const selectUnlinkedMediaAndUserObj = createSelector(
    selectUnlinkedMedia,
    selectCurrentUser,
    (_unlinkedMedia, _user) => {
        const unlinkedMedia = [..._unlinkedMedia]
        const linkedMedia = [..._user?.linkedMedia];
        const linkedAndUnlinkedMedia = [...unlinkedMedia, ...linkedMedia];

        //-- Transform MediaDb + LinkedMedia interface types into LinkedMedia ------------------------->
        const linkedAndUnlinkedMediaToMediaForm: LinkedMedia[] = linkedAndUnlinkedMedia?.map(item => {
            return {
                ...initialLinkedMedia,
                id: item?.id,
                fileName: item?.fileName,
                fileExtension: item?.fileExtension, //**mediaTypeOptions**/ //e.g. 'mp4' | 'png'
                format: item?.format,               //**mediaFormatOptions** image | video | pdf
                downloadUrl: item?.downloadUrl,
                type: item?.type,
            }
        }).sort((a, b) => {
            if (a.type === mediaTypeOptions.userMainMedia && b.type !== mediaTypeOptions.userMainMedia) {
                return -1; // a comes before b
            }
            if (a.type !== mediaTypeOptions.userMainMedia && b.type === mediaTypeOptions.userMainMedia) {
                return 1; // b comes before a
            }
            return 0; // no change in order
        });
        //-- Set Main Linked Media + Other Linked Media --------------------------------------------------------------->
        const mainLinkedMedia = [...linkedMedia?.filter(item => item?.type === mediaTypeOptions.userMainMedia)]
        const otherLinkedMedia = [...linkedMedia?.filter(item => item?.type === mediaTypeOptions.userOtherMedia)]
        //-- Set Main Media + Other Media ------------------------------------------------------------------------------------------->
        const mainMedia = [...linkedAndUnlinkedMediaToMediaForm.filter(item => item?.type == mediaTypeOptions.userMainMedia)]
        const otherMedia = [...linkedAndUnlinkedMediaToMediaForm.filter(item => item?.type == mediaTypeOptions.userOtherMedia)]

        const hasMainMedia = (mainLinkedMedia?.length > 0);

        const enrichedUserObj = (hasMainMedia) 
        ?{
            ..._user,
            _local: {
                ..._user?._local,
                mainMedia: mainMedia[0]
            }

        }
        : {
            ..._user
        };


        return {
            allMedia: linkedAndUnlinkedMediaToMediaForm,
            mainMedia,
            otherMedia,
            mainLinkedMedia,
            otherLinkedMedia,
            userObj: enrichedUserObj,
        }

    }
);


export const selectEnrichedUserWithMainMedia = createSelector(
    selectUserArray,
    (_user) => {

        const enrichedUser = _user?.map(item => {
            const itemHasMedia = (item?.linkedMedia?.length > 0);
            if (itemHasMedia) {
                let linkedMedia = [...item?.linkedMedia];
                const mainLinkedMedia = linkedMedia?.filter(_item => _item?.type == mediaTypeOptions.userMainMedia)
                const mediaItemHasMainMedia = (mainLinkedMedia?.length > 0);

                if (mediaItemHasMainMedia) {
                    return {
                        ...item,
                        _local: {
                            ...item?._local,
                            mainMedia: mainLinkedMedia[0]
                        }
                    }

                } else {
                    return {
                        ...item
                    }
                }
            } else {
                return {
                    ...item
                }
            }
        })

        return [...enrichedUser]
    }
);