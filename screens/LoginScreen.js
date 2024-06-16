import React, { useState } from 'react';
import { View, Text, TextInput, Button, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { loginWithEmailPassword } from '../firebase-config';

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
      <Button title="Login" onPress={handleLogin} />
      <Button title="Register" onPress={() => navigation.navigate('Register')} />
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
  input: {
    width: '100%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
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
  }
});

export default LoginScreen;
