import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, ScrollView, Alert, TouchableOpacity, Image } from 'react-native';
import { getAuth } from 'firebase/auth';
import { getFirestore, collection, query, where, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { Ionicons } from '@expo/vector-icons';

function MyRecipesScreen({ navigation }) {
    const auth = getAuth();
    const db = getFirestore();
    const user = auth.currentUser;
    const [recipes, setRecipes] = useState([]);
    const [categories, setCategories] = useState({});

    useEffect(() => {
        if (user) {
            const fetchCategories = async () => {
                const categoriesCollection = collection(db, 'categories');
                const categoriesSnapshot = await getDocs(categoriesCollection);
                const categoriesMap = {};
                categoriesSnapshot.forEach((doc) => {
                    categoriesMap[doc.id] = doc.data().name;
                });
                setCategories(categoriesMap);
            };

            const fetchRecipes = async () => {
                const q = query(collection(db, 'recipes'), where('createdBy', '==', user.uid));
                const querySnapshot = await getDocs(q);
                const userRecipes = [];
                querySnapshot.forEach((doc) => {
                    userRecipes.push({ id: doc.id, ...doc.data() });
                });
                setRecipes(userRecipes);
            };

            fetchCategories();
            fetchRecipes();
        }
    }, [user]);

    const handleDeleteRecipe = async (recipeId) => {
        try {
            await deleteDoc(doc(db, 'recipes', recipeId));
            setRecipes((prevRecipes) => prevRecipes.filter(recipe => recipe.id !== recipeId));
            Alert.alert('Success', 'Recipe deleted successfully');
        } catch (error) {
            console.error('Error deleting recipe:', error);
            Alert.alert('Error', 'Failed to delete recipe');
        }
    };

    return (
        <ScrollView style={styles.container}>
            {recipes.map((recipe) => (
                <TouchableOpacity key={recipe.id} onPress={() => navigation.navigate('SingleRecipeScreen', { recipeId: recipe.id })}>
                    <View style={styles.recipeCard}>
                        <Text style={styles.title}>{recipe.title}</Text>
                        <Text>Added on: {recipe.createdAt?.toDate().toLocaleDateString()}</Text>
                        <Text>Category: {recipe.categories?.map(catId => categories[catId]).join(', ')}</Text>
                        <Text numberOfLines={2}>Description: {recipe.description}</Text>
                        {recipe.image ? (
                            <Image source={{ uri: recipe.image }} style={styles.recipeImage} />
                        ) : null}
                        <View style={styles.buttonContainer}>
                            <TouchableOpacity onPress={() => navigation.navigate('AddReciept', { recipeId: recipe.id })}>
                                <Ionicons name="create" size={24} color="blue" />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => handleDeleteRecipe(recipe.id)}>
                                <Ionicons name="trash" size={24} color="red" />
                            </TouchableOpacity>
                        </View>
                    </View>
                </TouchableOpacity>
            ))}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20
    },
    recipeCard: {
        backgroundColor: '#fff',
        padding: 15,
        marginVertical: 10,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 8,
        elevation: 5,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    recipeImage: {
        width: '100%',
        height: 200,
        marginVertical: 10,
        borderRadius: 10,
    },
});

export default MyRecipesScreen;
