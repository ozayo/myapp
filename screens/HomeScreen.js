// screens/HomeScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, ImageBackground, Image, Pressable } from 'react-native';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import { Link } from '@react-navigation/native';

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
    
  <ImageBackground
    style={styles.background}
    resizeMode="cover"
    source={require("../assets/homebg.png")}>
      <View style={styles.container}>
        <View style={styles.logo}>
          <Image
            style={styles.logoImage}
            source={require('../assets/myapplogo.png')}
          />
          <Text style={styles.logoTitle}>100K+ Premium Recipe</Text>
        </View>
        <Text style={styles.title}>Get Cooking</Text>
        {user ? (
          <>
            <Text style={{color:"#fff", fontSize:14}}>Welcome Back!</Text>
            <Pressable style={styles.greenButton} onPress={() => navigation.navigate('RecipesScreen')}>
              <Text style={{color:"#fff",}}>START</Text>
            </Pressable> 
            {/* <Button
              title="Logout"
              onPress={handleLogout}
            /> */}
          </>
            ) : (
          <>
            <Pressable style={styles.greenButton} onPress={() => navigation.navigate('Login')}>
              <Text style={{color:"#fff",}}>LOGIN</Text>
            </Pressable>    
              <View style={{display:'flex', alignItems:'center'}}>
                <Text style={{color:"#fff", fontSize:12, }}>Don’t have an account?</Text>
                <Link style={{ color: "#FF9C00", fontSize: 13 }} to={{ screen: 'Register' }}>Register here</Link>
              </View>
          </>
          )}
      </View>
      </ImageBackground>
     
    
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
  },
  container: {
    flex: 1,
    flexDirection: 'column',
    gap: 20,
    justifyContent: "center",
    alignItems: 'center',
  },
  title: {
    color: 'white',
    fontSize: 44,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  logoImage: {
    height: 80,
    width: 80,
  },
  logo: {
    alignItems: 'center',
    display: 'flex',
    justifyContent: 'center',
    gap: 20,
  },
  logoTitle: {
    color: 'white',
    fontSize: 14,
    fontWeight: "400",
    textAlign: 'center',
  },
  greenButton: {
    backgroundColor: "#129575",
    color: "#fff",
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: 40,
    width: 230,
    alignItems:"center",
  }
});

export default HomeScreen;
