/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */
import 'react-native-gesture-handler';
import React from 'react';
import {GestureHandlerRootView} from 'react-native-gesture-handler';

import AppNavigator from './src/Navigation/Index';
import {Provider} from 'react-redux';
import Store from './src/store/Store';
import Toast from 'react-native-toast-message';
import ToastConfig from './src/utils/toastConfig';

function App(): React.JSX.Element {
  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <Provider store={Store}>
        <AppNavigator />
        <Toast config={ToastConfig} />
      </Provider>
    </GestureHandlerRootView>
  );
}

export default App;
