import React, {useEffect, useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import LoginScreen from '../screen/AuthScreens/LoginScreen';
import SignupScreen from '../screen/AuthScreens/SignupScreen';
import DashBoard from './Drawer'

import {StatusBar} from 'react-native';
import {fetchUser, fetchtoken} from '../utils/fetchItem';
import {getProfile} from '../api/api';
import {setUser} from '../store/Features/UserSlice';

const Stack = createNativeStackNavigator();

const AppNavigator: React.FC = () => {
  useEffect(() => {
    const authenticateUser = async () => {
      try {
        const token = await fetchtoken();
        const user = await fetchUser();
        if (token || user) {
          const userData = await getProfile(token, user.id);
          console.log('userData', userData);
          if (userData) {
            setUser(userData);
          }
        }
      } catch (error) {
        console.log('error', error);
      }
    };
    authenticateUser();
  }, []);

  return (
    <NavigationContainer>
      <StatusBar
        backgroundColor="transparent"
        translucent
        barStyle="dark-content"
      />
      <Stack.Navigator
        initialRouteName={'LoginScreen'}
        screenOptions={{headerShown: false}}>
        <Stack.Screen name="LoginScreen" component={LoginScreen} />
        <Stack.Screen name="SignupScreen" component={SignupScreen} />
        <Stack.Screen name="DashBoard" component={DashBoard} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
