import React, { useState } from 'react';
import { View, Text, TextInput, Button, TouchableOpacity, StyleSheet, Pressable } from 'react-native';
import { loginWithEmailPassword } from '../firebase-config';
import { Link } from '@react-navigation/native';

function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [error, setError] = useState('');  // Hata mesajları için state ekleyin

  const handleLogin = async () => {
    try {
      await loginWithEmailPassword(email, password);
      // Başarılı giriş sonrası işlemler burada yapılabilir
      navigation.navigate('Home');
    } catch (error) {
      // Hata mesajını ayarla
      setError(error.message);  // Hata mesajını kullanıcıya göster
    }
  };

  return (
    <View style={styles.container}>
      <Text style={{fontSize:24, fontWeight:"bold", color:"#000"}}>Hello,</Text>
      <Text style={{color:"#121212"}}>Welcome back!</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />
      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry={!passwordVisible}
          autoCapitalize="none"
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity
          style={styles.visibilityBtn}
          onPress={() => setPasswordVisible(!passwordVisible)}>
          <Text>{passwordVisible ? 'Hide' : 'Show'}</  Text>
        </TouchableOpacity>
      </View>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
      <Pressable style={styles.greenButton} onPress={handleLogin} >
          <Text style={{color:"#fff",}}>LOGIN</Text>
      </Pressable>    
          <View style={{display:'flex', alignItems:'center'}}>
            <Text style={{color:"#121212", fontSize:12, }}>Don’t have an account?</Text>
            <Link style={{ color: "#FF9C00", fontSize: 13 }} to={{ screen: 'Register' }}>Register here</Link>
          </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
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
  errorText: {
    color: 'red',  // Hata mesajı rengi
    marginBottom: 10,  // Hata mesajından sonra boşluk
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

export default LoginScreen;
