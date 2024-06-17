import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, FlatList, Text, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { getFirestore, doc, setDoc, collection, getDocs, serverTimestamp } from 'firebase/firestore';
import { auth } from '../firebase-config';
import { Ionicons } from '@expo/vector-icons';
import MultiSelect from 'react-native-multiple-select';

function AddRecipeScreen({ navigation }) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [cookTime, setCookTime] = useState('');
    const [servings, setServings] = useState('');
    const [ingredients, setIngredients] = useState(['']);
    const [steps, setSteps] = useState(['']);
    const [categories, setCategories] = useState([]);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const db = getFirestore();

    useEffect(() => {
        const fetchCategories = async () => {
            const categoriesCol = collection(db, 'categories');
            const categorySnapshot = await getDocs(categoriesCol);
            const categoryList = categorySnapshot.docs.map(doc => ({ id: doc.id, name: doc.data().name }));
            setCategories(categoryList);
        };
        fetchCategories();
    }, []);

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

    const handleAddRecipe = async () => {
        if (!auth.currentUser) {
            Alert.alert("Unauthorized", "Please log in to add recipes.");
            return;
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
                categories: selectedCategories,
                image: "", // Başlangıçta boş bir image URL
                createdBy: auth.currentUser.uid,
                createdAt: serverTimestamp()
            });
            Alert.alert('Success', 'Recipe added successfully!');
            navigation.navigate('TestStorage', { recipeId: recipeRef.id });
        } catch (error) {
            Alert.alert('Error', 'Failed to add recipe: ' + error.message);
        }
    };

    return (
        <FlatList
            style={styles.container}
            ListHeaderComponent={
                <>
                    <TextInput value={title} onChangeText={setTitle} placeholder="Title" style={styles.input} />
                    <TextInput value={description} onChangeText={setDescription} placeholder="Description" multiline style={styles.input} />
                    <TextInput value={cookTime} onChangeText={setCookTime} placeholder="Cook Time" style={styles.input} />
                    <TextInput value={servings} onChangeText={setServings} placeholder="Servings" style={styles.input} />
                    <View style={{ marginBottom: 20 }}>
                        <MultiSelect
                            items={categories}
                            uniqueKey="id"
                            onSelectedItemsChange={setSelectedCategories}
                            selectedItems={selectedCategories}
                            selectText="Pick Categories"
                            searchInputPlaceholderText="Search Categories..."
                            onChangeInput={(text) => console.log(text)}
                            tagRemoveIconColor="#CCC"
                            tagBorderColor="#CCC"
                            tagTextColor="#CCC"
                            selectedItemTextColor="#CCC"
                            selectedItemIconColor="#CCC"
                            itemTextColor="#000"
                            displayKey="name"
                            searchInputStyle={{ color: '#CCC' }}
                            submitButtonColor="#48d22b"
                            submitButtonText="Submit"
                        />
                    </View>
                    <Text>Ingredients:</Text>
                </>
            }
            data={ingredients}
            renderItem={({ item, index }) => (
                <View key={index} style={styles.inputGroup}>
                    <TextInput
                        value={item}
                        onChangeText={text => handleIngredientChange(text, index)}
                        placeholder={`Ingredient ${index + 1}`}
                        style={styles.input}
                    />
                    <TouchableOpacity onPress={() => handleRemoveIngredient(index)}>
                        <Ionicons name="trash" size={24} color="red" />
                    </TouchableOpacity>
                </View>
            )}
            ListFooterComponent={
                <>
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
                            <TouchableOpacity onPress={() => handleRemoveStep(index)}>
                                <Ionicons name="trash" size={24} color="red" />
                            </TouchableOpacity>
                        </View>
                    ))}
                    <Button title="Add Step" onPress={handleAddStep} />
                    <Button title="Save and add image" onPress={handleAddRecipe} />
                </>
            }
        />
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
        flex: 1,
        padding: 10,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 5,
    }
});

export default AddRecipeScreen;
