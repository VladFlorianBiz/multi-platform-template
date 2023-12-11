/*************************************************************************************************
** Imports                                                                                      **
**************************************************************************************************/
//-- **Core** -----------------------------------------------------------------------------------//
import { Injectable } from '@angular/core';
import { fromEvent, throwError } from 'rxjs';
import { mapTo, retryWhen, switchMap } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})

export class OfflineInterceptor {
    private onlineChanges$ = fromEvent(window, 'online').pipe(mapTo(true));

    get isOnline() {
        return navigator.onLine;
    }

    intercept(req, next) {
        return next.handle(req).pipe(
            retryWhen(errors => {
                if (this.isOnline) {
                    return errors.pipe(switchMap(err => throwError(err)));
                }

                return this.onlineChanges$;
            })
        );
    }
}