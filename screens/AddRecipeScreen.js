import React, { useState } from 'react';
import { View, TextInput, Button, ScrollView, Text, StyleSheet, Alert } from 'react-native';
import { getFirestore, doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, storage } from '../firebase-config';
import * as ImagePicker from 'expo-image-picker';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

function AddRecipeScreen() {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [cookTime, setCookTime] = useState('');
    const [servings, setServings] = useState('');
    const [ingredients, setIngredients] = useState(['']);
    const [steps, setSteps] = useState(['']);
    const [image, setImage] = useState(null);
    const db = getFirestore();

    const handleAddIngredient = () => {
        setIngredients([...ingredients, '']);
    };

    const handleRemoveIngredient = index => {
        const newIngredients = ingredients.filter((_, idx) => idx !== index);
        setIngredients(newIngredients);
    };

    const handleIngredientChange = (text, index) => {
        const newIngredients = ingredients.map((ingredient, idx) => {
            if (idx === index) return text;
            return ingredient;
        });
        setIngredients(newIngredients);
    };

    const handleAddStep = () => {
        setSteps([...steps, '']);
    };

    const handleRemoveStep = index => {
        const newSteps = steps.filter((_, idx) => idx !== index);
        setSteps(newSteps);
    };

    const handleStepChange = (text, index) => {
        const newSteps = steps.map((step, idx) => {
            if (idx === index) return text;
            return step;
        });
        setSteps(newSteps);
    };

    const handleImagePick = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 1,
        });

        if (!result.cancelled) {
            setImage(result.uri);
        }
    };

    const uploadImage = async (uri) => {
        if (!uri) return null;

        const blob = await new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.onload = () => resolve(xhr.response);
            xhr.onerror = (e) => {
                console.error(e);
                reject(new TypeError('Network request failed'));
            };
            xhr.responseType = 'blob';
            xhr.open('GET', uri, true);
            xhr.send(null);
        });

        const fileRef = ref(storage, `recipes/${auth.currentUser.uid}/${Date.now()}`);
        await uploadBytes(fileRef, blob);
        blob.close();

        return await getDownloadURL(fileRef);
    };

    const handleAddRecipe = async () => {
        if (!auth.currentUser) {
            Alert.alert("Unauthorized", "Please log in to add recipes.");
            return;
        }

        let imageUrl = '';
        if (image) {
            imageUrl = await uploadImage(image);
        }

        const recipeRef = doc(db, 'recipes', `recipe_${Date.now()}`);
        try {
            await setDoc(recipeRef, {
                title,
                description,
                cookTime,
                servings,
                ingredients,
                steps,
                image: imageUrl, // Image URL
                createdBy: auth.currentUser.uid,
                createdAt: serverTimestamp()
            });
            Alert.alert('Success', 'Recipe added successfully!');
            setImage(null); // Reset image state after upload
        } catch (error) {
            Alert.alert('Error', 'Failed to add recipe: ' + error.message);
        }
    };

    return (
        <ScrollView style={styles.container}>
            <TextInput value={title} onChangeText={setTitle} placeholder="Title" style={styles.input} />
            <TextInput value={description} onChangeText={setDescription} placeholder="Description" multiline style={styles.input} />
            <TextInput value={cookTime} onChangeText={setCookTime} placeholder="Cook Time" style={styles.input} />
            <TextInput value={servings} onChangeText={setServings} placeholder="Servings" style={styles.input} />

            <Button title="Pick Image from Gallery" onPress={handleImagePick} />
            {image && <Text>Image Ready for Upload</Text>}

            <Text>Ingredients:</Text>
            {ingredients.map((ingredient, index) => (
                <View key={index} style={styles.inputGroup}>
                    <TextInput
                        value={ingredient}
                        onChangeText={text => handleIngredientChange(text, index)}
                        placeholder={`Ingredient ${index + 1}`}
                        style={styles.input}
                    />
                    <Button title="Remove" onPress={() => handleRemoveIngredient(index)} />
                </View>
            ))}
            <Button title="Add Ingredient" onPress={handleAddIngredient} />

            <Text>Steps:</Text>
            {steps.map((step, index) => (
                <View key={index} style={styles.inputGroup}>
                    <TextInput
                        value={step}
                        onChangeText={text => handleStepChange(text, index)}
                        placeholder={`Step ${index + 1}`}
                        style={styles.input}
                    />
                    <Button title="Remove" onPress={() => handleRemoveStep(index)} />
                </View>
            ))}
            <Button title="Add Step" onPress={handleAddStep} />

            <Button title="Add Recipe" onPress={handleAddRecipe} />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20
    },
    inputGroup: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10
    },
    input: {
        width: '100%',
        padding: 10,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 5,
    }
});

export default AddRecipeScreen;
