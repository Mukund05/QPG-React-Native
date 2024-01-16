import React, {useEffect, useState} from 'react';
import {
  Alert,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BackgroundActions from 'react-native-background-actions';
import Header from '../../utils/Header';
import {PERMISSIONS, RESULTS, check, request} from 'react-native-permissions';
import {
  requestBackgroundLocationPermission,
  requestFineLocationPermission,
  showPermissionAlert,
} from '../../utils/Permission';
import Geolocation from 'react-native-geolocation-service';
import { fetchUser, fetchtoken } from '../../utils/fetchItem';
import { mapUpdate } from '../../api/api';

interface PunchScreenProps {
  navigation: any; // Replace with the actual type if possible
}

interface TimerData {
  isPunchedIn: boolean;
  punchInTime?: Date;
  punchOutTime?: Date ;
}

const PunchScreen: React.FC<PunchScreenProps> = ({navigation}) => {
  const [timerData, setTimerData] = useState<TimerData>({
    isPunchedIn: false,
    punchInTime: undefined,
    punchOutTime: undefined,
  });
  const [timer, setTimer] = useState<number>(0);
  const [locationPermission, setLocationPermission] = useState('');
  const [cordinates, setCordinates] = useState<any>([]); // [{lat: 0, lng: 0}]
  const options = {
    taskName: 'Punch In',
    taskTitle: 'Best Way Learning',
    taskDesc: 'Your app running in background',
    taskIcon: {
      name: 'ic_launcher',
      type: 'mipmap',
    },
    color: '#ff00ff',
    linkingURI: '',
    parameters: {
      delay: 60000,
    },
  };

  const handlePunchIn = async () => {
    try {
      let locationPermission = await requestFineLocationPermission();
      let backgroundLocationPermission =
        await requestBackgroundLocationPermission();

      // if (locationPermission && backgroundLocationPermission) {
        const time = new Date();

        setTimerData({
          isPunchedIn: true,
          punchInTime: time,
          punchOutTime: undefined,
        });
        setTimer(0);

        Geolocation.getCurrentPosition(
          async position => {
            

            const cordinate = [
              {lat: position.coords.latitude, lng: position.coords.longitude},
            ];
            setCordinates(cordinate);
            await startBackgroundTimer();
            try {
              await AsyncStorage.setItem('punchIn', JSON.stringify(true));
              await AsyncStorage.setItem('punchedInTime', JSON.stringify(time));
            } catch (error) {
              console.error('Error storing data:', error);
            }
          },
          error => {
            console.log(error.code, error.message);
          },
          {
            enableHighAccuracy: true,
            timeout: 15000,
            maximumAge: 10000,
          },
        );
      // } else {
      //   // Handle denial or take appropriate action
      //   showPermissionAlert();
      // }
    } catch (error) {
      console.error('Error handling location permission:', error);
    }
  };

  const handlePunchOut = async () => {
    if (timerData.isPunchedIn) {
      const time = new Date();
      setTimerData({
        ...timerData,
        punchOutTime: time,
        isPunchedIn: false,
      });
      stopBackgroundTimer();
      try {
        await AsyncStorage.setItem('punchIn', JSON.stringify(false));
      } catch (error) {
        console.error('Error storing data:', error);
      }
    }
  };

  const handleReport = () => {
    // console.log('Report submitted');
    navigation.navigate('SubmitReport');
  };

  const dateModifier = (val: Date | undefined) => {
    return val ? new Date(val).toLocaleDateString() : '';
  };

  const timeModifier = (val: Date | undefined) => {
    return val
      ? new Date(val).toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        })
      : '';
  };

  const formatTime = (timeInSeconds: number) => {
    const hours = Math.floor(timeInSeconds / 3600);
    const minutes = Math.floor((timeInSeconds % 3600) / 60);
    const seconds = timeInSeconds % 60;

    return `${hours.toString().padStart(2, '0')}:${minutes
      .toString()
      .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const sleep = (time: any) =>
    new Promise(resolve => setTimeout(() => resolve(() => {}), time));

  const updatedPosition =async () => {
    try {
      const position = await new Promise((resolve, reject) => {
        Geolocation.getCurrentPosition(
          (position: Geolocation.GeoPosition) => {
            resolve(position);
          },
          (error: Geolocation.GeoError) => {
            reject(error);
          },
          { enableHighAccuracy: true, timeout: 60000, maximumAge: 10000 }
        );
      });

      return position;
    } catch (error:any) {
      console.log(error.code,error.message)
    }
  }

  const update_UserLocation = async (cordinate:any,dateTime:any) => {
    const coords = cordinate.map((coord:any)=>({lat:coord.lat,lng:coord.lng}));
    // console.log(coords) 
    const {id} = await fetchUser();
    const token = await fetchtoken();
    const data = {
      user_id: id,
      coors: JSON.stringify(coords),
      inTime: timeModifier(timerData.punchInTime),
      outTime: timeModifier(timerData.punchOutTime),
      duration: formatTime(timer),
    }
    
    try {
      if(token){
        const response = await mapUpdate(token,data);
        console.log("response",response)
      }
    } catch (error) {
      console.log("PUNCH SCREEN::mapUpdate::SCREEN",error)
    }
  }

  const handleBackgroundTimer = async () => {
    await new Promise(async () => {
      for (let i = 0; BackgroundActions.isRunning(); i++) {
        console.log(i)
        try {
          
          //Only run if user is punched in and background time is running
          if(true){
            const position:any = await updatedPosition();
            // console.log(position);
            if(position){

              const live_cord=[
                {lat:position.coords.latitude,lng:position.coords.longitude}
              ]

              setCordinates((prev:any)=>[
                ...prev,
                {
                  lat: position.coords.latitude,
                  lng: position.coords.longitude,
                }
              ])
              const new_time = new Date();
              await update_UserLocation(live_cord,new Date());
              
            }
          }
        } catch (error) {
          console.log("Error in background running",error)
        }
        await sleep(60000);
      }
    });
  };

  const startBackgroundTimer = async () => {
    try {
      await BackgroundActions.start(handleBackgroundTimer, options);
    } catch (error) {}
  };

  const stopBackgroundTimer = () => {
    try {
      BackgroundActions.stop().then(() => {});
    } catch (error) {
      console.error('Error stopping BackgroundService:', error);
    }
  };

  useEffect(() => {
    const loadStoredValues = async () => {
      try {
        const storedPunchIn = await AsyncStorage.getItem('punchIn');
        const storedPunchedInTime = await AsyncStorage.getItem('punchedInTime');

        if (storedPunchIn) {
          setTimerData(prevData => ({
            ...prevData,
            isPunchedIn: JSON.parse(storedPunchIn),
          }));
        }

        if (storedPunchedInTime) {
          setTimerData(prevData => ({
            ...prevData,
            punchInTime: new Date(JSON.parse(storedPunchedInTime)),
          }));

          const currentTime = new Date();
          const timeDiff = Math.floor(
            (currentTime.getTime() -
              new Date(JSON.parse(storedPunchedInTime)).getTime()) /
              1000,
          );
          setTimer(timeDiff);
        }
      } catch (error) {
        console.error('Error loading stored values:', error);
      }
    };

    loadStoredValues();
  }, []);

  useEffect(() => {
    if (timerData.isPunchedIn) {
      const interval = setInterval(() => {
        setTimer(prevData => prevData + 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [timerData.isPunchedIn]);

  return (
    <>
      <Header
        title="Report"
        leftIcon="arrow-back"
        onPressLeftIcon={() => navigation.goBack()}
        bgColor="blue"
      />
      <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
        <View>
          {(timerData.punchOutTime !== undefined ||
            (timerData.isPunchedIn && timerData.punchInTime !== undefined)) && (
            <>
              <Text style={styles.title}>
                Punch in: {dateModifier(timerData.punchInTime)} :{' '}
                {timeModifier(timerData.punchInTime)}
              </Text>
              {timerData.punchOutTime !== undefined && (
                <Text style={styles.title}>
                  Punch Out : {dateModifier(timerData.punchOutTime)} :{' '}
                  {timeModifier(timerData.punchOutTime)}
                </Text>
              )}
              <Text style={styles.title}>Time : {formatTime(timer)}</Text>
            </>
          )}

          <TouchableOpacity
            style={[
              styles.button,
              timerData.isPunchedIn && styles.punchInButton,
            ]}
            onPress={handlePunchIn}
            disabled={timerData.isPunchedIn}>
            <Text style={styles.buttonTitle}>Punch In</Text>
          </TouchableOpacity>

          {timerData.isPunchedIn ? (
            <>
              <TouchableOpacity
                style={[styles.button, styles.punchOutButton]}
                onPress={handleReport}>
                <Text style={styles.buttonTitle}>Submit Report</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.punchOutButton]}
                onPress={handlePunchOut}>
                <Text style={styles.buttonTitle}>Punch Out</Text>
              </TouchableOpacity>
            </>
          ) : null}
        </View>
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    height: '100%',
    width: '100%',
  },
  title: {
    fontSize: 20,
    textAlign: 'center',
    marginVertical: 10,
    color: 'black',
    fontWeight: 'bold',
  },
  button: {
    borderRadius: 8,
    padding: 10,
    margin: 15,
    width: '80%',
    alignSelf: 'center',
    backgroundColor: 'blue',
  },
  punchInButton: {
    backgroundColor: 'red',
  },
  punchOutButton: {
    backgroundColor: 'green', // Change to your desired color
  },
  buttonTitle: {
    fontSize: 20,
    textAlign: 'center',
    color: 'white',
    fontWeight: 'bold',
  },
});

export default PunchScreen;
