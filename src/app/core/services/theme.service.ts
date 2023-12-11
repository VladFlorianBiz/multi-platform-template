/*************************************************************************************************
 ** Imports                                                                                     **
 *************************************************************************************************/
//-- **Core** -----------------------------------------------------------------------------------//
import { Injectable } from '@angular/core';
//-- **Native Plugins** -------------------------------------------------------------------------//
import { Preferences } from '@capacitor/preferences';

@Injectable({
    providedIn: 'root'
})

/**************************************************************************************************
 **  API Theme Calls                                                                             **
 **************************************************************************************************/
export class ThemeService {
    dark: boolean;
    mode = 'auto';
    prefDark = window.matchMedia('(prefers-color-scheme: dark)');


    constructor(

        ) { }

    setMode = async (): Promise<void> => {
        const storeMode = this.mode;

        await Preferences.set({
            key: 'mode',
            value: storeMode
        });

        if (this.mode !== 'auto') {
            this.dark = (this.mode === 'dark') ? true : false;
        } else {
            this.dark = this.prefDark.matches;
            this.prefDark.addEventListener('change', e => {
                this.dark = e.matches;
            });
        }
    };


    checkMode = async (): Promise<void> => {
        const { value } = await Preferences.get({ key: 'mode' });
        if (value) {
            this.mode = value;
        }
    };

}
