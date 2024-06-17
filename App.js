import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AppRegistry } from 'react-native';
import HomeScreen from './screens/HomeScreen';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import MyAccountScreen from './screens/MyAccountScreen';
import EditMyInfoScreen from './screens/EditMyInfo';
import AddNewReciept from './screens/AddRecipeScreen';
import TestStorage from './screens/TestStorage';
import UploadImageScreen from './screens/UploadImageScreen';

const Stack = createNativeStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="MyAccount" component={MyAccountScreen} />
        <Stack.Screen name="EditAccount" component={EditMyInfoScreen} />
        <Stack.Screen name="AddReciept" component={AddNewReciept} />
        <Stack.Screen name="TestStorage" component={TestStorage} />
        <Stack.Screen name="UploadImageScreen" component={UploadImageScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// appName değişkenini app.json dosyanızdan alın
import { name as appName } from './app.json';
import EditMyInfo from './screens/EditMyInfo';
AppRegistry.registerComponent(appName, () => App);

export default App;
