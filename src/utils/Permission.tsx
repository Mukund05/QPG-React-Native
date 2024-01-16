import {Alert, Platform} from 'react-native';
import {check, PERMISSIONS, RESULTS, request} from 'react-native-permissions';

export const requestFineLocationPermission = async () => {
  try {
    let permissionType;
    if (Platform.OS === 'android') {
      permissionType = PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION;
    } else if (Platform.OS === 'ios') {
      permissionType = PERMISSIONS.IOS.LOCATION_WHEN_IN_USE;
    }

    const result = await check(permissionType as any);

    if (result === RESULTS.DENIED) {
      const requestResult = await request(permissionType as any);
      return requestResult === RESULTS.GRANTED;
    }

    return result === RESULTS.GRANTED;
  } catch (error) {
    console.error(
      'Error checking or requesting fine location permission:',
      error,
    );
    return false;
  }
};

export const requestBackgroundLocationPermission = async () => {
  try {
    let permissionType;
    if (Platform.OS === 'android') {
      permissionType = PERMISSIONS.ANDROID.ACCESS_BACKGROUND_LOCATION;
    } else if (Platform.OS === 'ios') {
      permissionType = PERMISSIONS.IOS.LOCATION_ALWAYS;
    }

    const result = await check(permissionType as any);
    console.log(result)
    if (result === RESULTS.DENIED) {
      return showPermissionAlert(); // Show alert instead of requesting again
    }

    return result === RESULTS.GRANTED;
  } catch (error) {
    console.error('Error checking background location permission:', error);
    return false;
  }
};

export const showPermissionAlert = async () => {
  Alert.alert(
    'Location Permission',
    'This feature requires location access. Please enable location services in your device settings.',
    [
      {
        text: 'Cancel',
        style: 'cancel',
        onPress: () => {
          // Handle cancel action
          console.log('Permission denied');
        },
      },
      {
        text: 'Confirm',
        onPress: async () => {
          // Handle confirm action
          console.log('Asking again for background location permission');
          await requestBackgroundLocationPermission();
        },
      },
    ],
  );
};

export const showAskMeLaterAlert = () => {
  Alert.alert(
    'Location Permission',
    'This feature requires location access. Please enable location services in your device settings.',
    [
      {
        text: 'Cancel',
        style: 'cancel',
        onPress: () => {
          // Handle cancel action
          console.log('Permission denied');
        },
      },
      {
        text: 'Ask Me Later',
        onPress: () => {
          // Handle "Ask Me Later" action
          console.log('Ask Me Later selected');
        },
      },
    ],
  );
};
