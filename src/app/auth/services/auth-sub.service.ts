/*************************************************************************************************
** Imports                                                                                      **
**************************************************************************************************/
//-- **Core** -----------------------------------------------------------------------------------//
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

/************************************************************************************************************************************
** Sub Service                                                                                                                     **
**  - Used when making an api call that may return multiple live responses(stream) instead of just a single api response           **
**  - While listening to a stream of api responses you can terminate the stream manually inside a page/component/effect.ts         **     
**  - usually used in fe@ture.effect.ts after api call like so return apiCall.pipe(takeUntil(this.subService.fe@tureUnsubscribe$)) **
**  - To stop listening to api response stream you can do so like this this.fe@tureSubService.fe@tureUnsubscribeComponent$.next(); **
*************************************************************************************************************************************/
export class AuthSubService {
  public authUnsubscribeComponent$ = new Subject<void>();
  public authUnsubscribe$ = this.authUnsubscribeComponent$.asObservable();
 }