/*************************************************************************************************
** Imports                                                                                      **
**************************************************************************************************/
//-- **Core** -----------------------------------------------------------------------------------//
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { environment } from '../environments/environment';
import { CoreModule } from './core/core.module';
//-- **Firebase** -------------------------------------------------------------------------------//
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { AngularFireStorageModule } from '@angular/fire/compat/storage';
import { AngularFireFunctionsModule } from '@angular/fire/compat/functions';

//-- **NgRx Data Store** ------------------------------------------------------------------------//
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { reducers, metaReducers } from './app.reducer';
import { AuthDataStoreModule } from './auth/store/auth-data-store.module';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { CoreDataStoreModule } from './core/store/core-data-store.module';
import { ErrorDataStoreModule } from './error/store/error-data-store.module';
import { UserDataStoreModule } from './user/store/user-data-store.module';
import { MediaDataStoreModule } from './media/store/media-data-store.module';
import { EmailDataStoreModule } from './email/store/email-data-store.module';
import { LocalStorageDataStoreModule } from './local-storage/store/local-storage-data-store.module';
import { AccessDataStoreModule } from './access/store/access-data-store.module';


//-- **External Modules** ----------------------------------------------------------------------//
// import { Ng2ImgMaxModule, Ng2PicaService } from 'ng2-img-max';
// import pica from 'pica';


@NgModule({
  declarations: [AppComponent],
  imports: [
    //-- Core ------------>
    BrowserModule,
    IonicModule.forRoot({
      mode: 'ios',
    }),
    AppRoutingModule,
    //-- Firebase ---------------------------------------->
    AngularFireFunctionsModule,
    AngularFireAuthModule,
    AngularFireStorageModule,
    AngularFireModule.initializeApp(environment.firebase),
    //-- Ngrx ------------------------------------------------------------------>
    StoreModule.forRoot(reducers, { metaReducers }),
    EffectsModule.forRoot([]),
    StoreDevtoolsModule.instrument({
      maxAge: 25, // Retains last 25 states
      logOnly: environment.production, // Restrict extension to log-only mode
      // trace: true
    },
    ),
    //-- Features ------------>
    CoreModule,
    //-- Data Store Modules ->
    CoreDataStoreModule,
    ErrorDataStoreModule,
    AuthDataStoreModule,
    UserDataStoreModule,
    MediaDataStoreModule,
    EmailDataStoreModule,
    LocalStorageDataStoreModule,
    AccessDataStoreModule,
  ],
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    // {
    //   provide: Ng2PicaService,
    //   useFactory: () => new Ng2PicaService(pica)
    // }
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
