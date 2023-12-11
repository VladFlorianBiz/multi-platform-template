/*************************************************************************************************
** Imports                                                                                      **
**************************************************************************************************/
//-- **Core** -----------------------------------------------------------------------------------//
import { Injectable } from '@angular/core';

interface Sound {
    key: string;
    asset: string;
}

@Injectable({
    providedIn: 'root'
})
export class AudioHelper {

    private sounds: Sound[] = [];
    private audioPlayer: HTMLAudioElement = new Audio();

    constructor() { }

    preload(key: string, asset: string): void {
        if (!this.sounds.filter((sound) => sound.key === key).length) {
            const audio = new Audio();
            audio.src = asset;
            this.sounds.push({
                key: key,
                asset: asset
            });
        }
    }

    play(key: string): boolean {
        const soundToPlay = this.sounds.find((sound) => sound.key === key);
        if (soundToPlay) {
            this.audioPlayer.src = soundToPlay.asset;
            this.audioPlayer.volume = 0.1;
            this.audioPlayer.play().catch(() => { }); // ignore web player errors
            return true;
        } else {
            return false;
        }
    }
}
