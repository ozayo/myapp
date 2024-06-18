import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';
import { Ionicons } from '@expo/vector-icons';
import { getAuth } from 'firebase/auth';

const CategoryRecipes = ({ route, navigation }) => {
    const { categoryId } = route.params;
    const auth = getAuth();
    const db = getFirestore();
    const [category, setCategory] = useState(null);
    const [recipes, setRecipes] = useState([]);

    useEffect(() => {
        const fetchCategory = async () => {
            const categoryRef = collection(db, 'categories');
            const categorySnapshot = await getDocs(query(categoryRef, where('__name__', '==', categoryId)));
            if (!categorySnapshot.empty) {
                setCategory(categorySnapshot.docs[0].data());
            }
        };

        const fetchRecipes = async () => {
            const recipesRef = collection(db, 'recipes');
            const recipesQuery = query(recipesRef, where('categories', 'array-contains', categoryId));
            const recipesSnapshot = await getDocs(recipesQuery);
            const fetchedRecipes = recipesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })).sort((a, b) => b.createdAt.toDate() - a.createdAt.toDate());
            setRecipes(fetchedRecipes);
        };

        fetchCategory();
        fetchRecipes();
    }, [categoryId]);

    return (
        <ScrollView style={styles.container}>
            {category && (
                <View style={styles.categoryHeader}>
                    <Image source={{ uri: category.catimg }} style={styles.categoryImage} />
                    <View style={styles.categoryInfo}>
                        <Text style={styles.categoryTitle}>{category.name}</Text>
                        <Text>{category.description}</Text>
                    </View>
                </View>
            )}
            {recipes.map((recipe) => (
                <TouchableOpacity key={recipe.id} onPress={() => navigation.navigate('SingleRecipeScreen', { recipeId: recipe.id })}>
                    <View style={styles.recipeCard}>
                        <Text style={styles.title}>{recipe.title}</Text>
                        {recipe.image && (
                            <Image source={{ uri: recipe.image }} style={styles.recipeImage} />
                        )}
                        <Text>Added on: {recipe.createdAt?.toDate().toLocaleDateString()}</Text>
                        <Text>Cook time: {recipe.cookTime} minutes</Text>
                        <Text>Servings: {recipe.servings}</Text>
                        <Text numberOfLines={2}>Description: {recipe.description}</Text>
                        <Text>Added by: {recipe.username}</Text>
                    </View>
                </TouchableOpacity>
            ))}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    categoryHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    categoryImage: {
        width: 100,
        height: 100,
        borderRadius: 10,
        marginRight: 20,
    },
    categoryInfo: {
        flex: 1,
    },
    categoryTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 5,
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
    recipeImage: {
        width: '100%',
        height: 200,
        marginVertical: 10,
        borderRadius: 10,
    },
});

export default CategoryRecipes;
