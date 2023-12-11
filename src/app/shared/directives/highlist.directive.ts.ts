// https://blog.bitsrc.io/angular-maximizing-performance-with-the-intersection-observer-api-23d81312f178
import { Directive, ElementRef, EventEmitter, Input, OnInit, OnDestroy, Output } from '@angular/core';

import { takeUntil } from 'rxjs/operators';
import { Observable, Subject } from "rxjs";
import { debounceTime, filter, mergeMap, tap } from "rxjs/operators";

enum IntersectionStatus {
  Visible = 'Visible',
  Pending = 'Pending',
  NotVisible = 'NotVisible'
}


@Directive({
  selector: '[intersectionObserver]'
})
export class IntersectionObserverDirective implements OnInit, OnDestroy {
  @Input() intersectionDebounce = 0;
  @Input() intersectionRootMargin = '0px';
  @Input() intersectionRoot: HTMLElement;
  @Input() intersectionThreshold: number | number[];

  @Output() visibilityChange = new EventEmitter<IntersectionStatus>();

  private destroy$ = new Subject();

  constructor(private element: ElementRef) { }

  ngOnInit() {
    const element = this.element.nativeElement;
    const config = {
      root: this.intersectionRoot,
      rootMargin: this.intersectionRootMargin,
      threshold: this.intersectionThreshold
    };

    this.fromIntersectionObserver(
      element,
      config,
      this.intersectionDebounce
    ).pipe(
      takeUntil(this.destroy$)
    ).subscribe((status) => {
      this.visibilityChange.emit(status);
    });
  }


  fromIntersectionObserver = (
    element: HTMLElement,
    config: IntersectionObserverInit,
    debounce = 0
  ) =>
    new Observable<IntersectionStatus>(subscriber => {
      const subject$ = new Subject<{
        entry: IntersectionObserverEntry;
        observer: IntersectionObserver;
      }>();

      const intersectionObserver = new IntersectionObserver(
        (entries, observer) => {
          entries.forEach(entry => {
            if (this.isIntersecting(entry)) {
              subject$.next({ entry, observer });
            }
          });
        },
        config
      );

      subject$.subscribe(() => {
        subscriber.next(IntersectionStatus.Pending);
      });

      subject$
        .pipe(
          debounceTime(debounce),
          filter(Boolean)
        )
        .subscribe(async ({ entry, observer }) => {
          const isEntryVisible = await this.isVisible(entry.target as HTMLElement);

          if (isEntryVisible) {
            subscriber.next(IntersectionStatus.Visible);
            observer.unobserve(entry.target);
          } else {
            subscriber.next(IntersectionStatus.NotVisible);
          }
        });

      intersectionObserver.observe(element);

      return {
        unsubscribe() {
          intersectionObserver.disconnect();
          subject$.unsubscribe();
        }
      };
    });




async isVisible(element: HTMLElement) {
  return new Promise(resolve => {
    const observer = new IntersectionObserver(([entry]) => {
      resolve(entry.isIntersecting);
      observer.disconnect();
    });

    observer.observe(element);
  });
}

isIntersecting(entry: IntersectionObserverEntry) {
  return entry.isIntersecting || entry.intersectionRatio > 0;
}



ngOnDestroy() {
  this.destroy$.next();
}

}