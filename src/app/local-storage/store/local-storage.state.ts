//--------------- Core ---------------------------------------------------------//

//-------LocalStorage State Variables ------->
export interface LocalStorageState {
    // offlineDbs?: OfflineDbs
    lastLoginCredentials?: {email?: string; password?: string},
}

//-------LocalStorage Initial State Variables ------------>
export const localStorageInitialState: LocalStorageState = {
  lastLoginCredentials: { email: null, password: null },
};
