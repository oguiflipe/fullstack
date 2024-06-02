
import {View, StatusBar } from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import Routes from './src/Routes';


import { AuthProvider } from './src/contexts/AuthContext';


export default function App() {
  return (
    <NavigationContainer>
      <AuthProvider>
        <StatusBar 
          backgroundColor="#1d1d23" 
          barStyle="light-content" 
          translucent={false} 
        />
        <Routes />
      </AuthProvider>
    </NavigationContainer>
  );
}

