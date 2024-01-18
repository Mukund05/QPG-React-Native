/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */
import 'react-native-gesture-handler'
import React from 'react';
// import type {PropsWithChildren} from 'react';

import AppNavigator from './src/Navigation/Index';
import {ToastProvider} from 'react-native-toast-notifications';
import Icon from 'react-native-vector-icons/FontAwesome';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import {Provider} from 'react-redux';
import Store from './src/store/Store';
import Toast from 'react-native-toast-message';
import ToastConfig from './src/utils/toastConfig';

function App(): React.JSX.Element {
  return (
    <ToastProvider
      placement="top"
      duration={2000}
      textStyle={{fontSize: 16}}
      offsetTop={50}
      offsetBottom={30}
      successColor="green"
      dangerColor="red"
      warningColor="orange"
      normalColor="gray"
      successIcon={<Icon name="check" style={{fontSize: 25, marginEnd: 5}} />}
      dangerIcon={
        <MaterialIcon name="dangerous" style={{fontSize: 25, marginEnd: 5}} />
      }
      warningIcon={<Icon name="warning" style={{fontSize: 25, marginEnd: 5}} />}
      swipeEnabled={true}>
      <Provider store={Store}>
        <AppNavigator />
        <Toast config={ToastConfig}/>
      </Provider>
    </ToastProvider>
  );
}

// const styles = StyleSheet.create({

// });

export default App;
