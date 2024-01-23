// src/screens/SplashScreen.tsx
import React, {useEffect} from 'react';
import {View, Image, StyleSheet, Text} from 'react-native';
import SplashScreen from 'react-native-splash-screen';

const SplashScreenComponent: React.FC<{navigation: any}> = ({navigation}) => {

  useEffect(() => {
    SplashScreen.hide();
    setTimeout(() => {
      navigation.replace('LoginScreen');
    }, 1500);
  }, [navigation]);

  return (
    <View style={styles.container}>
      {/* <Image style={styles.logo} source={require('../assets/images/logo_circle.png')} /> */}
    </View>
  );

};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: '100%',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  logo: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
  },
});

export default SplashScreenComponent;
