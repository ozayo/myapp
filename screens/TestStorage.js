import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity, Image, Alert } from 'react-native';
import React, { useState } from 'react';
import * as Animatable from 'react-native-animatable';
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage, db } from '../firebase-config';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import Spinner from 'react-native-loading-spinner-overlay';
import { doc, updateDoc } from 'firebase/firestore';

export default function Upload({ route, navigation }) {
    const { recipeId } = route.params; // Parametre olarak gelen recipeId'yi alın
    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [loading, setLoading] = useState(false);

    const clearInputs = () => {
        setImage(null);
        setImagePreview(null);
        console.log("Preview cleared");
    };

    const submitData = async () => {
        if (!image) {
            Alert.alert("Please select an image.");
            return;
        }

        setLoading(true);

        try {
            const response = await fetch(image);
            const blob = await response.blob();

            const imageName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.jpg`;
            const storageRef = ref(storage, `images/${imageName}`);

            await uploadBytes(storageRef, blob);
            const imageUrl = await getDownloadURL(storageRef);

            // Firestore'daki ilgili tarifi güncelleyin
            const recipeRef = doc(db, 'recipes', recipeId);
            await updateDoc(recipeRef, {
                image: imageUrl
            });

            setLoading(false);
            console.log('Resim başarıyla Firebase Storage\'a yüklendi ve Firestore güncellendi!');
            Alert.alert("Image uploaded successfully and recipe updated!");
            clearInputs();
            navigation.goBack(); // Yükleme işlemi bittikten sonra geri dön
        } catch (error) {
            setLoading(false);
            console.error('Resim yükleme hatası:', error);
            Alert.alert("Image could not be loaded. Please try again.");
        }
    };

    const handleChange = async () => {
        const { status, granted } = await ImagePicker.getMediaLibraryPermissionsAsync();
        if (!granted && status !== 'granted') {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('İzin reddedildi', 'Medya kütüphanesine erişim izni reddedildi.', [{ text: 'Tamam' }]);
                return;
            }
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: 'Images',
            allowsEditing: true,
            quality: 0.8,
        });

        if (!result.canceled && result.assets.length > 0) {
            const selectedImageUri = result.assets[0].uri;
            setImage(selectedImageUri);
            setImagePreview(selectedImageUri);
        }
    };

    return (
        <Animatable.View animation='fadeInUp' style={styles.container}>
            <Text style={styles.title}>Görüntüyü buluta gönder</Text>
            <StatusBar style="auto" />

            {imagePreview ? (
                <Image source={{ uri: imagePreview }} style={styles.imagePreview} resizeMode="cover" />
            ) : (
                <TouchableOpacity style={styles.imageContainer} onPress={handleChange}>
                    <View style={styles.imagePlaceholder}>
                        <Ionicons name="image" size={50} color="gray" />
                        <Text>Select a picture</Text>
                    </View>
                </TouchableOpacity>
            )}

            <TouchableOpacity style={styles.clearButton} onPress={clearInputs}>
                <Text style={styles.clearButtonText}>Clear</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.sendButton} onPress={submitData}>
                <Text style={styles.sendTextButton}>Upload</Text>
            </TouchableOpacity>

            <Spinner visible={loading} textContent={'Uploading...'} textStyle={styles.loadingText} />
        </Animatable.View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        backgroundColor: '#E5EAF0',
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: 20,
        color: 'black',
        fontWeight: 'bold',
        marginBottom: 10
    },
    imagePreview: {
        width: 300,
        height: 300,
    },
    imageContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#F5F5F5',
        width: 300,
        height: 300,
    },
    imagePlaceholder: {
        alignItems: 'center',
    },
    sendButton: {
        backgroundColor: '#1A73E8',
        width: '30%',
        borderRadius: 20,
        paddingVertical: 8,
        marginTop: 14,
        justifyContent: 'center',
        alignItems: 'center',
    },
    sendTextButton: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: 'bold'
    },
    clearButton: {
        marginTop: 15,
        marginBottom: 20,
        alignSelf: 'center',
    },
    clearButtonText: {
        color: 'red',
        fontSize: 16,
        fontWeight: 'bold'
    },
    loadingText: {
        color: '#fff',
    },
});
