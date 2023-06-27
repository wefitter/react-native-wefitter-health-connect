import { NativeModules } from 'react-native';

export enum Error {
  TokenNotValid = 'Token not valid',
  ApiUrlNotValid = 'Api url not valid',
  NotConfigured = 'Not configured',
  ConfigureNotSucceeded = 'Configure not succeeded',
  NotSupported = 'Health Connect not supported on this device',
  InstallOrUpdate = 'Please install or update Health Connect',
  AcceptAtLeastOnePermission = 'At least one permission should be accepted',
}

export type ConfiguredEvent = {
  configured: boolean;
};

export type ConnectedEvent = {
  connected: boolean;
};

export type ErrorEvent = {
  error: Error;
};

type WeFitterHealthConnectType = {
  configure(config: {
    token: string;
    apiUrl?: string;
    startDate?: string;
    notificationTitle?: string;
    notificationText?: string;
    notificationIcon?: string;
    notificationChannelId?: string;
    notificationChannelName?: string;
  }): void;
  connect(): void;
  disconnect(): void;
  isConnected(callback: (connected: boolean) => void): void;
  isSupported(callback: (supported: boolean) => void): void;
};

const { WeFitterHealthConnect } = NativeModules;

export default WeFitterHealthConnect as WeFitterHealthConnectType;
