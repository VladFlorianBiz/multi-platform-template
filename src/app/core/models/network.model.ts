export interface NetworkConnectionDb {
  connected: boolean;
  connectionType: any;
}

export const initialNetworkConnectionDb = {
  connected: null,
  connectionType: null,
};


export const networkConnectionTypeOptionsObj = {
  wifi: 'wifi',
  none: 'none',
  unknown: 'unknown',
  cellular: 'cellular',
}



