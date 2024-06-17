import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { getAuth } from 'firebase/auth';
import { getFirestore, collection, query, where, getDocs, doc, deleteDoc } from 'firebase/firestore';
import { Ionicons } from '@expo/vector-icons';

function MyRecipesScreen({ navigation }) {
    const auth = getAuth();
    const db = getFirestore();
    const user = auth.currentUser;
    const [recipes, setRecipes] = useState([]);

    useEffect(() => {
        if (user) {
            const fetchRecipes = async () => {
                const q = query(collection(db, 'recipes'), where('createdBy', '==', user.uid));
                const querySnapshot = await getDocs(q);
                const recipesList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setRecipes(recipesList);
            };
            fetchRecipes();
        }
    }, [user]);

    const handleDelete = async (id) => {
        await deleteDoc(doc(db, 'recipes', id));
        setRecipes(recipes.filter(recipe => recipe.id !== id));
    };

    return (
        <View style={styles.container}>
            <FlatList
                data={recipes}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View style={styles.recipeContainer}>
                        <Text style={styles.title}>{item.title}</Text>
                        <Text style={styles.date}>{item.createdAt?.seconds ? new Date(item.createdAt.seconds * 1000).toLocaleDateString() : 'No date'}</Text>
                        <Text style={styles.category}>{item.categories ? item.categories.join(', ') : 'No categories'}</Text>
                        <Text style={styles.description}>{item.description.substring(0, 100)}...</Text>
                        <View style={styles.actions}>
                            <TouchableOpacity onPress={() => navigation.navigate('EditRecipeScreen', { recipeId: item.id })}>
                                <Ionicons name="create" size={24} color="blue" />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => handleDelete(item.id)}>
                                <Ionicons name="trash" size={24} color="red" />
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20
    },
    recipeContainer: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: 'lightgray'
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold'
    },
    date: {
        color: 'gray'
    },
    category: {
        fontStyle: 'italic'
    },
    description: {
        marginVertical: 10
    },
    actions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: 60
    }
});

export default MyRecipesScreen;
