import { Platform, Alert, Linking } from 'react-native';
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';

export const requestPermission = async (callback:any) => {
  try {
    const permissionType =
      Platform.OS === 'android'
        ? PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION
        : PERMISSIONS.IOS.LOCATION_WHEN_IN_USE;

    const result = await request(permissionType, {
      title: 'Location Permission',
      message: 'This app requires access to your location.',
      buttonNeutral: 'Ask Me Later',
      buttonNegative: 'Cancel',
      buttonPositive: 'OK',
    });
    const permissionType2 =
      Platform.OS === 'android'
        ? PERMISSIONS.ANDROID.ACCESS_COARSE_LOCATION
        : PERMISSIONS.IOS.LOCATION_WHEN_IN_USE;

    const result2 = await check(permissionType2);
    // console.log(result2)

    if (result === RESULTS.GRANTED || result2===RESULTS.GRANTED) {
      console.log('Permission Granted!');
      let background_granted = false; // Define granted in the scope of punchIn
      await background_permission((permissionGranted:any) => {
        background_granted = permissionGranted;
        console.log('background locaiton ', permissionGranted);
        callback(true);
      })

    } else {
      console.log('Permission Denied!');
      callback(false);
    }
  } catch (error) {
    console.log(error);
    callback(false);
  }
};

export const background_permission = async (callback:any) => {
  try {
    const permissionType =
      Platform.OS === 'android'
        ? PERMISSIONS.ANDROID.ACCESS_BACKGROUND_LOCATION
        : PERMISSIONS.IOS.LOCATION_ALWAYS;

    const status = await check(permissionType);
    console.log(status)
    if (status === RESULTS.GRANTED) {
      console.log('Background location permission already granted');
      callback(true);
      return;
    }

    const result = await request(permissionType, {
      title: 'Background Location Permission',
      message:
        'We need access to your location ' +
        'so you can get live quality updates.',
      buttonNeutral: 'Ask Me Later',
      buttonNegative: 'Cancel',
      buttonPositive: 'OK',
    });

    if (result === RESULTS.GRANTED) {
      console.log('Background location permission granted');
      callback(true);
    } else {
  
      const androidVersion:any = Platform.OS === 'android' ? Platform.Version : null;
      if(androidVersion <= 28){
        callback(true);
      }
      else{
        callback(false);
      }
      console.log('Android Version:', androidVersion);

  
    }
  } catch (error) {
    console.error('Error requesting background location permission:', error);
    callback(false);
  }
};

const openSettings = () => {
  if (Platform.OS === 'android') {
    Linking.openSettings();
  } else {
    Linking.openURL('app-settings:');
  }
};
// After the user denies permission, you can prompt them to go to settings:
const handlePermissionDenied = () => {
  // Display a message to the user explaining why the permission is necessary
  // and prompt them to go to settings.
  Alert.alert(
    'Permission Required',
    'This app requires background location permission for Best Way Learning. Please enable it in the app settings.',
    [
      {
        text: 'Go to Settings',
        onPress: () => openSettings(),
      },
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
    ],
  );
};
