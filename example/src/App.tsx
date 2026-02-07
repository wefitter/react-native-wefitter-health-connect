import React, { useEffect, useState } from 'react';

import {
  StyleSheet,
  View,
  Text,
  Alert,
  Button,
  Platform,
  NativeEventEmitter,
} from 'react-native';
import WeFitterHealthConnect, {
  type ConfiguredEvent,
  type ConnectedEvent,
  type ErrorEvent,
} from 'react-native-wefitter-health-connect';
import { type WFConfig } from '../../specs/NativeWeFitterHealthConnect';

export default function App() {
  const [connected, setConnected] = useState<boolean>(false);
  const [configured, setConfigured] = useState<boolean>(false);
  const [error, setError] = useState<ErrorEvent>();

  const prefix = 'android.permission.health';
  const myAppPermissions: string[] = [
    `${prefix}.READ_DISTANCE`,
    `${prefix}.READ_STEPS`,
    `${prefix}.READ_TOTAL_CALORIES_BURNED`,
    `${prefix}.READ_HEART_RATE`,
    `${prefix}.READ_POWER`,
    `${prefix}.READ_EXERCISE`,
    //"$prefix.READ_BLOOD_GLUCOSE",
    //"$prefix.READ_BLOOD_PRESSURE",
    //"$prefix.READ_BODY_FAT",
    //"$prefix.READ_BODY_TEMPERATURE",
    //`${prefix}.READ_HEIGHT`,
    //"$prefix.READ_OXYGEN_SATURATION",'
    //`${prefix}.READ_WEIGHT`,
    `${prefix}.READ_SPEED`,
    `${prefix}.READ_SLEEP`,
  ];
  const myAppPermissionsString = myAppPermissions.join(',');

  // create config
  const config: WFConfig = {
    token:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJHSi1URVNUIiwiYXBwIjoiYTI3NTlkMzktYTM4Ni00NWQ3LThkYTItNWQzOTExMjdhMDNjIiwiaWF0IjoxNzQ3MTIwOTczLCJpZCI6ImRjZDY0YzlmLTQ4MmMtNGU2Zi1iYWZkLWVmMTY4NTdiNTE4YiJ9.mfWXnDLdkhY4tgtJJtVX5OIFdDOsLe_gZoNWR7E33UM', // required, WeFitter API profile bearer token
    apiUrl: 'https://api.wefitter.com/api/', // optional, only use if you want to use your backend as a proxy and forward all API calls to the WeFitter API. Default: `https://api.wefitter.com/api/`
    // startDate: 'CUSTOM_START_DATE', // optional with format `yyyy-MM-dd`, by default data of the past 20 days will be uploaded
    notificationTitle: 'CUSTOM_TITLE', // optional
    notificationText: 'CUSTOM_TEXT', // optional
    notificationIcon: 'CUSTOM_ICON', // optional, e.g. `ic_notification` placed in either drawable, mipmap or raw
    notificationChannelId: 'CUSTOM_CHANNEL_ID', // optional
    notificationChannelName: 'CUSTOM_CHANNEL_NAME', // optional
    appPermissions: myAppPermissionsString,
    configFGSPermissions: 'true',
  };

  useEffect(() => {
    console.log(`WeFitterHealthConnect useEffect`);

    if (Platform.OS === 'android') {
      // create native event emitter and event listeners to handle status updates
      const emitter = new NativeEventEmitter();
      const configuredListener = emitter.addListener(
        'onConfiguredWeFitterHealthConnect',
        (event: ConfiguredEvent) => {
          console.log(`WeFitterHealthConnect configured: ${event.configured}`);
          setConfigured(event.configured);
        }
      );
      const connectedListener = emitter.addListener(
        'onConnectedWeFitterHealthConnect',
        (event: ConnectedEvent) => {
          console.log(`WeFitterHealthConnect connected: ${event.connected}`);
          setConnected(event.connected);
        }
      );
      const errorListener = emitter.addListener(
        'onErrorWeFitterHealthConnect',
        (event: ErrorEvent) => {
          console.log(`WeFitterHealthConnect error: ${event.error}`);
          setError(event);
        }
      );

      console.log(`WeFitterHealthConnect configure`);
      // configure WeFitterHealthConnect
      WeFitterHealthConnect.configure(config);

      return () => {
        configuredListener.remove();
        connectedListener.remove();
        errorListener.remove();
      };
    }
    return;
  }, []);

  const onPressConnectOrDisconnect = () => {
    if (Platform.OS === 'android') {
      WeFitterHealthConnect.isSupported((supported) => {
        if (supported) {
          connected
            ? WeFitterHealthConnect.disconnect()
            : WeFitterHealthConnect.connect();
        } else {
          Alert.alert(
            'Not supported',
            'WeFitterHealthConnect is not supported on this device'
          );
        }
      });
    } else {
      Alert.alert(
        'Not supported',
        'WeFitterHealthConnect is not supported on iOS'
      );
    }
  };

  return (
    <View style={styles.container}>
      <Text>Configured: {'' + configured}</Text>
      <Text>Connected: {'' + connected}</Text>
      <Button
        onPress={onPressConnectOrDisconnect}
        title={connected ? 'Disconnect' : 'Connect'}
      />
      <Text style={{ color: 'red' }}>
        {error ? 'Error: ' + error.error : ''}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  box: {
    width: 60,
    height: 60,
    marginVertical: 20,
  },
});
