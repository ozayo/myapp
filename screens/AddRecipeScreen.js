import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, Text, StyleSheet, Alert, TouchableOpacity, FlatList, Pressable } from 'react-native';
import { getFirestore, doc, setDoc, getDoc, updateDoc, serverTimestamp, collection, getDocs } from 'firebase/firestore';
import { auth } from '../firebase-config';
import { Ionicons } from '@expo/vector-icons';
import MultiSelect from 'react-native-multiple-select';

function AddRecipeScreen({ navigation, route }) {
    const { recipeId } = route.params || {};
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
            const categoriesCollection = collection(db, 'categories');
            const categoriesSnapshot = await getDocs(categoriesCollection);
            const categoriesList = categoriesSnapshot.docs.map(doc => ({ id: doc.id, name: doc.data().name }));
            setCategories(categoriesList);
        };

        fetchCategories();

        if (recipeId) {
            const fetchRecipe = async () => {
                const recipeRef = doc(db, 'recipes', recipeId);
                const recipeDoc = await getDoc(recipeRef);
                if (recipeDoc.exists()) {
                    const recipeData = recipeDoc.data();
                    setTitle(recipeData.title);
                    setDescription(recipeData.description);
                    setCookTime(recipeData.cookTime);
                    setServings(recipeData.servings);
                    setIngredients(recipeData.ingredients || ['']);
                    setSteps(recipeData.steps || ['']);
                    setSelectedCategories(recipeData.categories || []);
                }
            };
            fetchRecipe();
        }
    }, [recipeId]);

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

        const recipeData = {
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
        };

        try {
            if (recipeId) {
                const recipeRef = doc(db, 'recipes', recipeId);
                await updateDoc(recipeRef, recipeData);
                Alert.alert('Success', 'Recipe updated successfully!');
                navigation.navigate('TestStorage', { recipeId: recipeId });
            } else {
                const recipeRef = doc(db, 'recipes', `recipe_${Date.now()}`);
                await setDoc(recipeRef, recipeData);
                Alert.alert('Success', 'Recipe added successfully!');
                navigation.navigate('TestStorage', { recipeId: recipeRef.id });
            }
        } catch (error) {
            Alert.alert('Error', 'Failed to save recipe: ' + error.message);
        }
    };

    return (
        <FlatList
            style={styles.container}
            data={[{ key: 'form' }]}
            renderItem={() => (
                <View>
                    <TextInput value={title} onChangeText={setTitle} placeholder="Title" style={styles.input} />
                    <TextInput value={description} onChangeText={setDescription} placeholder="Description" multiline style={styles.input} />
                    <TextInput value={cookTime} onChangeText={setCookTime} placeholder="Cook Time" style={styles.input} />
                    <TextInput value={servings} onChangeText={setServings} placeholder="Servings" style={styles.input} />

                    <MultiSelect
                        items={categories}
                        uniqueKey="id"
                        onSelectedItemsChange={setSelectedCategories}
                        selectedItems={selectedCategories}
                        selectText="Pick Categories"
                        searchInputPlaceholderText="Search Categories..."
                        tagRemoveIconColor="#CCC"
                        tagBorderColor="#CCC"
                        tagTextColor="#CCC"
                        selectedItemTextColor="#CCC"
                        selectedItemIconColor="#CCC"
                        itemTextColor="#000"
                        displayKey="name"
                        searchInputStyle={{ color: '#CCC' }}
                        submitButtonColor="#CCC"
                        submitButtonText="Submit"
                    />

                    <Text>Ingredients:</Text>
                    {ingredients.map((ingredient, index) => (
                        <View key={index} style={styles.inputGroup}>
                            <TextInput
                                value={ingredient}
                                onChangeText={text => handleIngredientChange(text, index)}
                                placeholder={`Ingredient ${index + 1}`}
                                style={styles.input}
                            />
                            <TouchableOpacity onPress={() => handleRemoveIngredient(index)}>
                                <Ionicons name="trash" size={24} color="red" />
                            </TouchableOpacity>
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
                            <TouchableOpacity onPress={() => handleRemoveStep(index)}>
                                <Ionicons name="trash" size={24} color="red" />
                            </TouchableOpacity>
                        </View>
                    ))}
                    <Button title="Add Step" onPress={handleAddStep} />

                    <View style={{marginBottom:50, paddingTop:10, display:'flex', alignItems:'center'}} >
                        {/* <Button title={recipeId ? "Save Changes and add image" : "Save and add image"} onPress={handleAddRecipe} /> */}
                         <Pressable style={styles.greenButton} onPress={handleAddRecipe} >
                            <Text style={{color:"#fff",}}>{recipeId ? "Save Changes and add image" : "Save and add image"}</Text>
                        </Pressable> 
                    </View>
                </View>
            )}
            keyExtractor={item => item.key}
        />
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    inputGroup: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10
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

export default AddRecipeScreen;
