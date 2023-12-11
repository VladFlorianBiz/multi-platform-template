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
import * as accessReducer from './access.reducer';
import { selectUnlinkedMedia } from './../../media/store/media.selectors';

/*************************************************************************************************************************************************
** Access Selectors                                                                                                              **
**  -Selectors are the way to access access state variables found in (access.state)                             **
**  -Pages and Components import selectors in order to access state variables in a stream like approach(Observable).                            **
**  -Whenever state variables are changed via access.reducer.ts any affected selectors will automatically update with new value **
**  -Selectors are extremely powerful when it comes to enriching data or combining other state variables into custom selectors                  **
*************************************************************************************************************************************************/

//-- Access State Variables ----------------------------------------------------------------//
export const getAccessObjState = (state: AppState) => state.access.accessObj;
export const getAccessArrayState = (state: AppState) => state.access.accessArray;
export const getCurrentAccessState = (state: AppState) => state.access.currentAccess;
export const getCurrentAccessListState = (state: AppState) => state.access.currentAccessList;


//-- Access State Variable Selectors ----------------------------------------------->
export const selectAccessArray = createSelector(
    getAccessArrayState,
    accessReducer.selectAll
);

export const selectAccessObj = createSelector(
    getAccessObjState,
    access => access
);

export const selectCurrentAccess = createSelector(
    getCurrentAccessState,
    currentAccess => currentAccess
);

export const selectCurrentAccessListState = createSelector(
    getCurrentAccessListState,
    accessReducer.selectAll
);


export const selectCurrentAccessList = createSelector(
    selectCurrentAccessListState,
    currentAccessList => currentAccessList
);

//-- Custom State Variable Selectors ----------------------------------------------->
export const selectAccessListWithMainPhoto = createSelector(
    selectCurrentAccessList,
    (accessList) => {
        console.log('CURRENT ACCESS LIST IS', accessList)
        const enrichedAccess = accessList?.map(item => {
            const mainLinkedMediaList = [...item?.linkedMedia];
            const hasMainLinkedMediaFlag = (item?.linkedMedia?.length > 0);

            if (hasMainLinkedMediaFlag) {
                const mainLinkedMedia = mainLinkedMediaList[0];
                return {
                    ...item,
                    _local: {
                        ...item?._local,
                        mainMedia: {...mainLinkedMedia}
                    }
                }
            } 

            else  {
                return {
                    ...item,
                    _local: {
                        ...item?._local,
                        mainMedia: { ...initialLinkedMedia }
                    }
                }
            }
        })

        return enrichedAccess;
    }
);






export const selectUnlinkedMediaAndAccessObj = createSelector(
    selectUnlinkedMedia,
    selectAccessObj,
    (_unlinkedMedia, _access) => {
        const unlinkedMedia = [..._unlinkedMedia]
        const linkedMedia = [..._access?.linkedMedia];
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
            if (a.type === mediaTypeOptions.accessMainMedia && b.type !== mediaTypeOptions.accessMainMedia) {
                return -1; // a comes before b
            }
            if (a.type !== mediaTypeOptions.accessMainMedia && b.type === mediaTypeOptions.accessMainMedia) {
                return 1; // b comes before a
            }
            return 0; // no change in order
        });
        //-- Set Main Linked Media + Other Linked Media --------------------------------------------------------------->
        const mainLinkedMedia = [...linkedMedia?.filter(item => item?.type === mediaTypeOptions.accessMainMedia)]
        const otherLinkedMedia = [...linkedMedia?.filter(item => item?.type === mediaTypeOptions.accessOtherMedia)]
        //-- Set Main Media + Other Media ------------------------------------------------------------------------------------------->
        const mainMedia = [...linkedAndUnlinkedMediaToMediaForm.filter(item => item?.type == mediaTypeOptions.accessMainMedia)]
        const otherMedia = [...linkedAndUnlinkedMediaToMediaForm.filter(item => item?.type == mediaTypeOptions.accessOtherMedia)]

        const hasMainMedia = (mainLinkedMedia?.length > 0);

        const enrichedAccessObj = (hasMainMedia) 
        ?{
            ..._access,
            _local: {
                ..._access?._local,
                mainMedia: mainMedia[0]
            }

        }
        : {
            ..._access
        };


        return {
            allMedia: linkedAndUnlinkedMediaToMediaForm,
            mainMedia,
            otherMedia,
            mainLinkedMedia,
            otherLinkedMedia,
            accessObj: enrichedAccessObj,
        }

    }
);


export const selectEnrichedAccessWithMainMedia = createSelector(
    selectCurrentAccessList,
    (_access) => {

        const enrichedAccess = _access?.map(item => {
            const itemHasMedia = (item?.linkedMedia?.length > 0);
            if (itemHasMedia) {
                let linkedMedia = [...item?.linkedMedia];
                const mainLinkedMedia = linkedMedia?.filter(_item => _item?.type == mediaTypeOptions.accessMainMedia)
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

        return [...enrichedAccess]
    }
);

