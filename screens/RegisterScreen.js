import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, TouchableOpacity, StyleSheet, Pressable, SafeAreaView, ScrollView } from 'react-native';
import { registerWithEmailPassword } from '../firebase-config';  // Bu fonksiyon Firebase işlemlerini yapacak
import { Link } from '@react-navigation/native';

function RegisterScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [fullName, setFullName] = useState('');
  const [location, setLocation] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);

  const handleRegister = async () => {
    try {
      await registerWithEmailPassword(email, password, username, fullName, location);  // Firebase kayıt işlemi
      Alert.alert("Registration Successful", "You have been successfully registered!");
      navigation.navigate('Login');
    } catch (error) {
      Alert.alert("Registration Failed", error.message);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={{marginBottom:20,}}>
          <Text style={{fontSize:24, fontWeight:"bold", color:"#000"}}>Create an account</Text>
          <Text style={{ color: "#121212" }}>Let’s help you set up your account, it won’t take long.</Text> 
        </View>
      <TextInput
        style={styles.input}
        placeholder="Email"
        autoCapitalize="none"
        onChangeText={setEmail}
        value={email}
      />
      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry={!passwordVisible}
          autoCapitalize="none"
          onChangeText={setPassword}
          value={password}
        />
        <TouchableOpacity
          style={styles.visibilityBtn}
          onPress={() => setPasswordVisible(!passwordVisible)}>
          <Text>{passwordVisible ? 'Hide' : 'Show'}</Text>
        </TouchableOpacity>
      </View>
      <TextInput
        style={styles.input}
        placeholder="Username"
        onChangeText={setUsername}
        value={username}
      />
      <TextInput
        style={styles.input}
        placeholder="Full Name"
        onChangeText={setFullName}
        value={fullName}
      />
      <TextInput
        style={styles.input}
        placeholder="Location"
        onChangeText={setLocation}
        value={location}
        />
        <View style={{display:"flex", alignSelf:"center", gap:10, marginTop:20,}}>
          <Pressable style={styles.greenButton} onPress={handleRegister} >
              <Text style={{color:"#fff",}}>REGISTER</Text>
          </Pressable>    
          <View style={{display:'flex', alignItems:'center'}}>
            <Text style={{color:"#121212", fontSize:12, }}>Already a member?</Text>
            <Link style={{ color: "#FF9C00", fontSize: 13 }} to={{ screen: 'Login' }}>Login</Link>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
    gap: 15,
    backgroundColor: '#fff',
  },
  input: {
    width: '100%',
    height: 55,
    borderColor: '#D9D9D9',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    borderRadius: 10,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  visibilityBtn: {
    position: 'absolute',
    right: 10,
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

export default RegisterScreen;
