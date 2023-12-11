export interface AuthDb {
  uid?: string;
  displayName?: string;
  photoUrl?: string;
  email?: string;
  emailVerified?: boolean;
  phoneNumber?: any;
  tenantId?: string;
  apiKey?: string;
  appName?: string;
  authDomain?: string;
  stsTokenManager?: {
    apiKey?: string;
    refreshToken?: string;
    accessToken?: string;
    expirationTime?: number;
  }
  redirectEventId?: any;
  lastLoginAt?: string;
  createdAt?: string;
}

export const initialAuthDb = {
  uid: null,
  displayName: null,
  photoUrl: null,
  email: null,
  emailVerified: false,
  phoneNumber: null,
  tenantId: null,
  apiKey: null,
  appName: null,
  authDomain: null,
  stsTokenManager: {
    apiKey: null,
    refreshToken: null,
    accessToken: null,
    expirationTime: null
  },
  redirectEventId: null,
  lastLoginAt: null,
  createdAt: null,
};


export interface DynamicLinkObj {
  apiKey?: string;
  continueUrl?: string;
  mode?: string;
  oobCode?: string;
  oobCodeValid?: boolean;
  email?: any;
  //Extras 
  clientId?: string;
  clientName?: string;
  userId?: string;
  accessId?: string;
  userRole?: string;
  userEmail?: string;
  userFullName?: string;
}

export const initialDynamicLinkObj = {
  apiKey: null,
  continueUrl: null,
  mode: null,
  oobCode: null,
  oobCodeValid: false,
  email: null,
  //Extras 
  clientId: null,
  clientName: null,
  userId: null,
  accessId: null,
  userRole: null,
  userEmail: null,
  userFullName: null,
}

export const dynamicLinkModeOptions = {
  resetPassword: 'resetPassword',
  recoverEmail: 'recoverEmail',
  verifyEmail: 'verifyEmail'
}




export const authErrorMsgs = {
  email: 'Should be a valid email.',
  fullName: 'Enter your full name',
  dateOfBirth: 'Enter your date of birth',
  phone: 'Should be a valid phone number.',
  password: 'Should be between 8-20 characters',
  passwordConfirm: 'Should match password and be between 3-20 characters',
  snopassUid: 'Enter a valid SnoPass ID',
}


export interface SignUpFormObj {
  fullName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  password: string;
  passwordConfirm: string;
}
