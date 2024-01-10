// src/navigation/index.tsx
import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import SplashScreen from '../screen/SplashScreen'
import LoginScreen from '../screen/AuthScreens/LoginScreen';
import SignupScreen from '../screen/AuthScreens/SignupScreen';
import DashBoard from '../screen/drawerScreen/DashBoard/DashBoard';
import Profile from '../screen/drawerScreen/Profile/Profile';

import { StatusBar } from 'react-native';
import DashboardNavigator from './Drawer';

const Stack = createNativeStackNavigator();

const AppNavigator: React.FC = () => {
  return (
    <NavigationContainer>
      <StatusBar
        backgroundColor="transparent"
        translucent
        barStyle="dark-content"
      />
      <Stack.Navigator initialRouteName="SplashScreen" screenOptions={{headerShown:false}}>
        <Stack.Screen name="SplashScreen" component={SplashScreen} />
        <Stack.Screen name="LoginScreen" component={LoginScreen} />
        <Stack.Screen name="SignupScreen" component={SignupScreen} />
        <Stack.Screen name="DashBoard" component={DashboardNavigator}  />
        {/* <Stack.Screen name="DashBoard" component={DashBoard} options={{ title: 'DashBoard', navigationBarColor:'blue' ,contentStyle:{width:'auto',height:'auto'}}}/> */}
        {/* <Stack.Screen name="Profile" component={Profile} options={{ title: 'Profile', navigationBarColor:'blue' ,contentStyle:{width:'auto',height:'auto'}}}/> */}
      </Stack.Navigator>
    </NavigationContainer>
  );
};


export default AppNavigator;
