// screens/HomeScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';

function HomeScreen({ navigation }) {
  const [user, setUser] = useState(null);  // Kullanıcı oturum durumu için state
  const auth = getAuth();  // Firebase Auth nesnesi

  useEffect(() => {
    // onAuthStateChanged kullanıcının oturum durumunu dinler
    const unsubscribe = onAuthStateChanged(auth, setUser);
    return unsubscribe;  // Component unmount olduğunda dinlemeyi durdur
  }, []);

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        alert('You have been logged out!');
      })
      .catch(error => {
        console.error('Logout failed', error);
        alert('Logout failed: ' + error.message);
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to My Recipe</Text>
      {user ? (
        <>
          <Button
            title="My Account"
            onPress={() => navigation.navigate('MyAccount')}
          />
          <Button
            title="Logout"
            onPress={handleLogout}
          />
        </>
      ) : (
        <>
          <Button
            title="Login"
            onPress={() => navigation.navigate('Login')}
          />
          <Button
            title="Register"
            onPress={() => navigation.navigate('Register')}
          />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  }
});

export default HomeScreen;
