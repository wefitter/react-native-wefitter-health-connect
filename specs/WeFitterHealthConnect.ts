import type {TurboModule} from 'react-native';
import {TurboModuleRegistry} from 'react-native';

export interface WFConfig {
  token: string;
  apiUrl?: string; // optional, only use if you want to use your backend as a proxy and forward all API calls to the WeFitter API. Default: `https://api.wefitter.com/api/`
  startDate?: string; // optional with format `yyyy-MM-dd`, by default data of the past 20 days will be uploaded
  notificationTitle?: string; // optional
  notificationText?: string; // optional
  notificationIcon?: string; // optional, e.g. `ic_notification` placed in either drawable, mipmap or raw
  notificationChannelId?: string; // optional
  notificationChannelName?: string; // optional
  appPermissions?: string;
  configFGSPermissions?: string;
}

export interface Spec extends TurboModule {
  configure(config: WFConfig);
  connect();
  disconnect();
  //isConnected(callback: Callback);
  //isConnected(callback: Callback);
  //isSupported(callback: Callback);
}

export default TurboModuleRegistry.getEnforcing<Spec>(
  'WeFitterHealthConnect',
);
