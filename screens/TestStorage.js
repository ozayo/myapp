import React, { useState } from 'react';
import { View, Button, Image, StyleSheet, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { storage } from '../firebase-config';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

function TestStorage() {
  const [imageUri, setImageUri] = useState(null);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('İzin Gerekli', 'Fotoğraf galerisine erişim izni vermelisiniz.');
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled && result.uri) {
      setImageUri(result.uri); // Resmi hemen göster
      uploadImage(result.uri);
    }
  };

  const uploadImage = async (uri) => {
    try {
      // URI'yi kontrol et
      let newUri = uri;
      
      // assets-library URI'sini dönüştür
      if (uri.startsWith('assets-library://')) {
        newUri = await FileSystem.getContentUriAsync(uri);
        console.log("Converted URI:", newUri);
      }
      
      console.log("Fetching image from URI:", newUri);

      const response = await fetch(newUri); // Dönüştürülen URI'yi kullan
      console.log("Fetch response status:", response.status);

      const blob = await response.blob();
      console.log("Blob created:", blob);

      const fileRef = ref(storage, `test/${Date.now()}`);
      console.log("File reference created:", fileRef);

      await uploadBytes(fileRef, blob);
      console.log("Upload completed!");

      const url = await getDownloadURL(fileRef);
      console.log("Download URL:", url);

      Alert.alert('Image uploaded!', url);
      setImageUri(url);
    } catch (error) {
      console.error("Error uploading image:", error);
      Alert.alert("Upload Failed", error.message);
    }
  };

  return (
      <View style={styles.container}>
          <Button title="Pick an image from camera roll" onPress={pickImage} />
          {imageUri && <Image source={{ uri: imageUri }} style={{ width: 200, height: 200 }} />}
      </View>
  );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    }
});

export default TestStorage;
