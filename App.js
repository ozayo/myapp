import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AppRegistry } from 'react-native';
import HomeScreen from './screens/HomeScreenr';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import MyAccountScreen from './screens/MyAccountScreen';
import EditMyInfoScreen from './screens/EditMyInfo';
import AddNewReciept from './screens/AddRecipeScreen';
import TestStorage from './screens/TestStorage';
import UploadImageScreen from './screens/UploadImageScreen';
import MyRecipesScreen from './screens/MyRecipesScreen';
import RecipesScreen from './screens/RecipesScreen';
import SingleRecipeScreen from './screens/SingleRecipeScreen';
import CategoryRecipes from './screens/CategoryRecipes';

const Stack = createNativeStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home"
      screenOptions={{
        headerStyle: {
          backgroundColor: '#129575',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
          fontSize: 16,
          textAlign: 'center',
        },
          headerTitleAlign: 'center'
      }}>
        <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false, }}  />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="MyAccount" component={MyAccountScreen} options={{ title: 'My Account' }} />
        <Stack.Screen name="EditAccount" component={EditMyInfoScreen} options={{ title: 'Edit Profile' }} />
        <Stack.Screen name="AddReciept" component={AddNewReciept} options={{ title: 'Add Recipe' }} />
        <Stack.Screen name="TestStorage" component={TestStorage} options={{ title: 'Add image' }}  />
        <Stack.Screen name="UploadImageScreen" component={UploadImageScreen} />
        <Stack.Screen name="MyRecipesScreen" component={MyRecipesScreen} options={{ title: 'My Recipes' }} />
        <Stack.Screen name="RecipesScreen" component={RecipesScreen} options={{ title: 'Recipes' }} />
        <Stack.Screen name="SingleRecipeScreen" component={SingleRecipeScreen} options={{ title: 'Recipe detail' }} />
        <Stack.Screen name="CategoryRecipes" component={CategoryRecipes} options={{ title: 'Category list' }}/> 
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// appName değişkenini app.json dosyanızdan alın
import { name as appName } from './app.json';
import EditMyInfo from './screens/EditMyInfo';
AppRegistry.registerComponent(appName, () => App);

export default App;
