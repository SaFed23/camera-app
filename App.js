/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import {
  Colors,
} from 'react-native/Libraries/NewAppScreen';
import Camera from './Camera';
import { NavigationContainer } from '@react-navigation/native';
import Navigation from './Navigation';

const App: () => React$Node = () => {
  return (
      <NavigationContainer>
        <Navigation/>
      </NavigationContainer>
  );
};

export default App;
