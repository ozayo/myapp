import React, { useState } from 'react';
import { View, Button, Image, StyleSheet, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { getFirestore, doc, updateDoc } from 'firebase/firestore';
import { auth, storage } from '../firebase-config';

function UploadImageScreen({ route, navigation }) {
    const [image, setImage] = useState(null);
    const { recipeId } = route.params;
    const db = getFirestore();

    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaType.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.cancelled) {
            setImage(result.uri);
        }
    };

    const uploadImage = async () => {
        if (!image) {
            Alert.alert('No Image Selected', 'Please select an image first.');
            return;
        }

        const blob = await fetch(image).then(res => res.blob());
        const imageRef = ref(storage, `recipe_images/${recipeId}/${Date.now()}`);

        uploadBytes(imageRef, blob)
            .then(async snapshot => {
                const imageUrl = await getDownloadURL(snapshot.ref);
                await updateDoc(doc(db, 'recipes', recipeId), { image: imageUrl });
                Alert.alert('Image Uploaded', 'Your image has been uploaded successfully!');
                navigation.goBack();
            })
            .catch(error => {
                console.error('Error uploading image:', error);
                Alert.alert('Upload Failed', 'Failed to upload image.');
            });
    };

    return (
        <View style={styles.container}>
            <Button title="Pick an Image" onPress={pickImage} />
            {image && (
                <>
                    <Image source={{ uri: image }} style={styles.imagePreview} />
                    <Button title="Upload Image" onPress={uploadImage} />
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
    imagePreview: {
        width: 300,
        height: 300,
        marginTop: 20,
        marginBottom: 20,
        borderRadius: 15,
    }
});

export default UploadImageScreen;
