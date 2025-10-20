import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, Text, StyleSheet, Alert, Image, TouchableOpacity, ScrollView } from 'react-native';
import { getAuth } from 'firebase/auth';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db, storage } from '../firebase-config';
import * as ImagePicker from 'expo-image-picker';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { Ionicons } from '@expo/vector-icons';
import Spinner from 'react-native-loading-spinner-overlay';

function EditMyInfo({ navigation }) {
    const auth = getAuth();
    const user = auth.currentUser;
    const [username, setUsername] = useState('');
    const [fullName, setFullName] = useState('');
    const [location, setLocation] = useState('');
    const [profileImageUrl, setProfileImageUrl] = useState('');
    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (user) {
            const userRef = doc(db, "users", user.uid);
            getDoc(userRef).then((doc) => {
                if (doc.exists()) {
                    const userData = doc.data();
                    setUsername(userData.username);
                    setFullName(userData.fullName);
                    setLocation(userData.location);
                    setProfileImageUrl(userData.profileImageUrl || '');
                }
            });
        }
    }, [user]);

    const handleSave = async () => {
        const userRef = doc(db, "users", user.uid);
        try {
            const updatedData = {
                username,
                fullName,
                location,
                profileImageUrl
            };
            await updateDoc(userRef, updatedData);
            Alert.alert("Update Success", "Your profile has been updated successfully.");
            navigation.push('MyAccount');
        } catch (error) {
            console.error("Error updating user:", error);
            Alert.alert("Update Failed", error.message);
        }
    };

    const handleImagePick = async () => {
        const { status, granted } = await ImagePicker.getMediaLibraryPermissionsAsync();
        if (!granted && status !== 'granted') {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('İzin reddedildi', 'Medya kütüphanesine erişim izni reddedildi.', [{ text: 'Tamam' }]);
                return;
            }
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaType.Images,
            allowsEditing: true,
            quality: 0.8,
        });

        if (!result.canceled && result.assets.length > 0) {
            const selectedImageUri = result.assets[0].uri;
            setImage(selectedImageUri);
            setImagePreview(selectedImageUri);
        }
    };

    const submitData = async () => {
        if (!image) {
            Alert.alert("Lütfen bir resim seçin.");
            return;
        }

        setLoading(true);

        try {
            const response = await fetch(image);
            const blob = await response.blob();

            const imageName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.jpg`;
            const storageRef = ref(storage, `profilepic/${user.uid}/${imageName}`);

            await uploadBytes(storageRef, blob);
            const imageUrl = await getDownloadURL(storageRef);

            const userRef = doc(db, 'users', user.uid);
            await updateDoc(userRef, {
                profileImageUrl: imageUrl
            });

            setLoading(false);
            console.log('Resim başarıyla Firebase Storage\'a yüklendi ve Firestore güncellendi!');
            setProfileImageUrl(imageUrl);
            Alert.alert("Resim başarıyla yüklendi ve profil güncellendi!");
            clearInputs();
        } catch (error) {
            setLoading(false);
            console.error('Resim yükleme hatası:', error);
            Alert.alert("Resim yüklenemedi. Lütfen tekrar deneyin.");
        }
    };

    const clearInputs = () => {
        setImage(null);
        setImagePreview(null);
        console.log("Önizleme temizlendi");
    };

    const handleImageRemove = async () => {
        const storageRef = ref(storage, profileImageUrl);
        await deleteObject(storageRef)
            .then(() => {
                setProfileImageUrl('');
                const userRef = doc(db, 'users', user.uid);
                updateDoc(userRef, { profileImageUrl: '' });
                Alert.alert('Success', 'Image removed successfully.');
            })
            .catch((error) => {
                console.error('Image remove error:', error);
                Alert.alert('Remove Error', 'Failed to remove image. Please try again.');
            });
    };

    useEffect(() => {
        if (image) submitData();
    }, [image]);

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <TextInput style={styles.input} placeholder="Username" value={username} onChangeText={setUsername} />
            <TextInput style={styles.input} placeholder="Full Name" value={fullName} onChangeText={setFullName} />
            <TextInput style={styles.input} placeholder="Location" value={location} onChangeText={setLocation} />
            {profileImageUrl ? (
                <View>
                    <Image source={{ uri: profileImageUrl }} style={styles.profileImage} />
                    <Button title="Remove Image" onPress={handleImageRemove} />
                </View>
            ) : (
                <Text>No Profile Image</Text>
            )}
            {!imagePreview && (
                <TouchableOpacity style={styles.imageContainer} onPress={handleImagePick}>
                    <View style={styles.imagePlaceholder}>
                        <Ionicons name="image" size={30} color="gray" />
                        <Text>Bir resim seçin</Text>
                    </View>
                </TouchableOpacity>
            )}
            {imagePreview && <Image source={{ uri: imagePreview }} style={styles.profileImage} resizeMode="cover" />}
            <Button title="Save" onPress={handleSave} />
            <Button title="Home" onPress={() => navigation.navigate('Home')} />
            <Spinner visible={loading} textContent={'Yükleniyor...'} textStyle={styles.loadingText} />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        padding: 20,
        justifyContent: 'center',
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 20,
    },
    profileImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginBottom: 20,
    },
    imageContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#F5F5F5',
        width: 150,
        height: 150,
        borderRadius: 75,
        marginBottom: 20,
    },
    imagePlaceholder: {
        alignItems: 'center',
    },
    loadingText: {
        color: '#fff',
    }
});

export default EditMyInfo;
