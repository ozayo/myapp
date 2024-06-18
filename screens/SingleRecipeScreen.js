import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import { getFirestore, doc, getDoc, collection, getDocs } from 'firebase/firestore';
import { Ionicons } from '@expo/vector-icons';
import Checkbox from 'expo-checkbox';

const SingleRecipeScreen = ({ route, navigation }) => {
    const { recipeId } = route.params;
    const [recipe, setRecipe] = useState(null);
    const [categories, setCategories] = useState({});
    const [username, setUsername] = useState('');

    useEffect(() => {
        const fetchCategories = async () => {
            const db = getFirestore();
            const categoriesCollection = collection(db, 'categories');
            const categoriesSnapshot = await getDocs(categoriesCollection);
            const categoriesMap = {};
            categoriesSnapshot.forEach((doc) => {
                categoriesMap[doc.id] = doc.data().name;
            });
            setCategories(categoriesMap);
        };

        const fetchRecipe = async () => {
            const db = getFirestore();
            const recipeRef = doc(db, 'recipes', recipeId);
            const recipeDoc = await getDoc(recipeRef);
            if (recipeDoc.exists()) {
                setRecipe(recipeDoc.data());
                const userRef = doc(db, 'users', recipeDoc.data().createdBy);
                const userDoc = await getDoc(userRef);
                if (userDoc.exists()) {
                    setUsername(userDoc.data().username);
                }
            }
        };

        fetchCategories();
        fetchRecipe();
    }, [recipeId]);

    const [checkedIngredients, setCheckedIngredients] = useState({});

    const toggleCheckbox = (index) => {
        setCheckedIngredients((prev) => ({
            ...prev,
            [index]: !prev[index],
        }));
    };

    if (!recipe) {
        return (
            <View style={styles.container}>
                <Text>Loading...</Text>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.title}>{recipe.title}</Text>
            {recipe.image && (
                <Image source={{ uri: recipe.image }} style={styles.recipeImage} />
            )}
            <Text style={styles.description}>{recipe.description}</Text>
            <Text>Cook time: {recipe.cookTime} minutes</Text>
            <Text>Servings: {recipe.servings}</Text>
            <Text>Added on: {recipe.createdAt?.toDate().toLocaleDateString()}</Text>
            <Text>Added by: {username}</Text>
            <Text>Category: {recipe.categories?.map(catId => categories[catId]).join(', ')}</Text>
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Ingredients:</Text>
                {recipe.ingredients.map((ingredient, index) => (
                    <View key={index} style={styles.ingredient}>
                        <Checkbox 
                            value={checkedIngredients[index] || false} 
                            onValueChange={() => toggleCheckbox(index)} 
                        />
                        <Text style={styles.ingredientText}>{ingredient}</Text>
                    </View>
                ))}
            </View>
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Steps:</Text>
                {recipe.steps.map((step, index) => (
                    <View key={index} style={styles.step}>
                        <Text style={styles.stepNumber}>Step {index + 1}</Text>
                        <Text style={styles.stepText}>{step}</Text>
                    </View>
                ))}
            </View>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                <Text style={styles.backButtonText}>Turn Back</Text>
            </TouchableOpacity>
            <View style={styles.bottomSpacing} />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    recipeImage: {
        width: '100%',
        height: 200,
        marginBottom: 10,
        borderRadius: 10,
    },
    description: {
        fontSize: 16,
        marginBottom: 10,
    },
    section: {
        marginVertical: 10,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    ingredient: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 5,
    },
    ingredientText: {
        marginLeft: 10,
    },
    step: {
        marginBottom: 10,
    },
    stepNumber: {
        fontWeight: 'bold',
    },
    stepText: {
        marginLeft: 10,
    },
    bottomSpacing: {
        height: 50,
    },
    backButton: {
        marginTop: 20,
        padding: 10,
        backgroundColor: '#1A73E8',
        borderRadius: 5,
        alignItems: 'center',
    },
    backButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default SingleRecipeScreen;
