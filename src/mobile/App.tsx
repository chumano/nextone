/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React, { useState } from 'react';
import { Text } from 'react-native';
import SamplePage from './src/pages/SamplePage';
import * as samlib from '@chuno/sam';


const App = () => {
  const msg = samlib.saySomething();
  return (
    <>
    <Text>{'Text From Lib: '+msg}</Text>
    <SamplePage></SamplePage>
    </>
  );
};


export default App;
