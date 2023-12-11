import { Directive, ElementRef, Input, NgZone } from '@angular/core';

@Directive({
    selector: "[animateOnce]"
})
export class AnimateOnceDirective {
    private elementRef: ElementRef;
    private observer: IntersectionObserver | null;
    private zone: NgZone;
    private hasAnimated: boolean = false;

    @Input() animationClass: string;

    constructor(
        elementRef: ElementRef,
        zone: NgZone
    ) {
        this.elementRef = elementRef;
        this.zone = zone;
        this.observer = null;
    }

    public ngOnDestroy(): void {
        this.observer?.disconnect();
        this.observer = null;
    }

    public ngOnInit(): void {
        this.zone.runOutsideAngular(() => {
            this.observer = new IntersectionObserver(
                this.handleIntersection,
                {
                    threshold: [0]
                }
            );
            this.observer.observe(this.elementRef.nativeElement);
        });
    }

    private handleIntersection = (entries: IntersectionObserverEntry[]) => {
        for (var entry of entries) {
            if (!this.hasAnimated && entry.isIntersecting) {

                this.elementRef.nativeElement.classList.add(this.animationClass);
                this.hasAnimated = true;
                this.observer?.disconnect();  // Stop observing after animation
            }
        }
    };
}
