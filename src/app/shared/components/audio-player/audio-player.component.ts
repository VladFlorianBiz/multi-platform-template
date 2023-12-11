import { Component, Input, AfterViewInit, ElementRef, ViewChild } from '@angular/core';

@Component({
    selector: 'cstm-audio-player',
    templateUrl: './audio-player.component.html',
    styleUrls: ['./audio-player.component.scss']
})
export class AudioPlayerComponent implements AfterViewInit {
    @Input() src!: string;
    @ViewChild('player') player!: ElementRef;
    @ViewChild('playPause') playPause!: ElementRef;
    @ViewChild('progress') progress!: ElementRef;
    @ViewChild('volumeProgress') volumeProgress!: ElementRef;
    @ViewChild('speaker') speaker!: ElementRef;
    @ViewChild('currentTime') currentTime!: ElementRef;
    @ViewChild('totalTime') totalTime!: ElementRef;

    private currentlyDragged = null;
    private draggableClasses = ['pin'];

    ngAfterViewInit() {
        this.addEventListeners();
    }

    private addEventListeners() {
        this.player.nativeElement.addEventListener('timeupdate', () => this.updateProgress());
        this.player.nativeElement.addEventListener('volumechange', () => this.updateVolume());
        this.player.nativeElement.addEventListener('loadedmetadata', () => {
            this.totalTime.nativeElement.textContent = this.formatTime(this.player.nativeElement.duration);
        });
        this.player.nativeElement.addEventListener('canplay', () => this.makePlay());
        this.player.nativeElement.addEventListener('ended', () => {
            this.playPause.nativeElement.attributes.d.value = "M18 12L0 24V0";
            this.player.nativeElement.currentTime = 0;
        });
    }

    togglePlay() {
        if (this.player.nativeElement.paused) {
            this.playPause.nativeElement.attributes.d.value = "M0 0h6v24H0zM12 0h6v24h-6z";
            this.player.nativeElement.play();
        } else {
            this.playPause.nativeElement.attributes.d.value = "M18 12L0 24V0";
            this.player.nativeElement.pause();
        }
    }

    private updateProgress() {
        var current = this.player.nativeElement.currentTime;
        var percent = (current / this.player.nativeElement.duration) * 100;
        this.progress.nativeElement.style.width = percent + '%';
        this.currentTime.nativeElement.textContent = this.formatTime(current);
    }

    private updateVolume() {
        this.volumeProgress.nativeElement.style.height = this.player.nativeElement.volume * 100 + '%';
        if (this.player.nativeElement.volume >= 0.5) {
            this.speaker.nativeElement.attributes.d.value = 'M14.667 0v2.747c3.853 1.146 6.666 4.72 6.666 8.946 0 4.227-2.813 7.787-6.666 8.934v2.76C20 22.173 24 17.4 24 11.693 24 5.987 20 1.213 14.667 0zM18 11.693c0-2.36-1.333-4.386-3.333-5.373v10.707c2-.947 3.333-2.987 3.333-5.334zm-18-4v8h5.333L12 22.36V1.027L5.333 7.693H0z';
        } else if (this.player.nativeElement.volume < 0.5 && this.player.nativeElement.volume > 0.05) {
            this.speaker.nativeElement.attributes.d.value = 'M0 7.667v8h5.333L12 22.333V1L5.333 7.667M17.333 11.373C17.333 9.013 16 6.987 14 6v10.707c2-.947 3.333-2.987 3.333-5.334z';
        } else if (this.player.nativeElement.volume <= 0.05) {
            this.speaker.nativeElement.attributes.d.value = 'M0 7.667v8h5.333L12 22.333V1L5.333 7.667';
        }
    }

    private formatTime(time) {
        var min = Math.floor(time / 60);
        var sec = Math.floor(time % 60);
        return min + ':' + ((sec < 10) ? ('0' + sec) : sec);
    }

    private makePlay() {
        this.playPause.nativeElement.attributes.d.value = this.player.nativeElement.paused ? "M18 12L0 24V0" : "M0 0h6v24H0zM12 0h6v24h-6z";
    }
}