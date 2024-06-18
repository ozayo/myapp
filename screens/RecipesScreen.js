import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, FlatList, Modal, Button } from 'react-native';
import { getAuth } from 'firebase/auth';
import { getFirestore, collection, getDocs, query, doc, getDoc, orderBy } from 'firebase/firestore';
import { Ionicons } from '@expo/vector-icons';

function RecipesScreen({ navigation }) {
    const auth = getAuth();
    const db = getFirestore();
    const user = auth.currentUser;
    const [recipes, setRecipes] = useState([]);
    const [categories, setCategories] = useState({});
    const [modalVisible, setModalVisible] = useState(false);
    const [profile, setProfile] = useState({
        username: '',
        profileImageUrl: '',
    });

    useEffect(() => {
        const fetchUserProfile = async () => {
            if (user) {
                const userRef = doc(db, "users", user.uid);
                const docSnap = await getDoc(userRef);
                if (docSnap.exists()) {
                    setProfile(docSnap.data());
                }
            }
        };

        const fetchCategories = async () => {
            const categoriesCollection = collection(db, 'categories');
            const categoriesSnapshot = await getDocs(categoriesCollection);
            const categoriesMap = {};
            categoriesSnapshot.forEach((doc) => {
                categoriesMap[doc.id] = { id: doc.id, ...doc.data() };
            });
            setCategories(categoriesMap);
        };

        const fetchRecipes = async () => {
            const q = query(collection(db, 'recipes'), orderBy('createdAt', 'desc'));
            const querySnapshot = await getDocs(q);
            const allRecipes = [];
            querySnapshot.forEach((doc) => {
                allRecipes.push({ id: doc.id, ...doc.data() });
            });
            setRecipes(allRecipes);
        };

        fetchUserProfile();
        fetchCategories();
        fetchRecipes();
    }, [user]);

    const renderCategory = ({ item }) => (
        <TouchableOpacity style={styles.categoryCard} onPress={() => navigation.navigate('CategoryRecipes', { categoryId: item.id })}>
            <Image source={{ uri: item.catimg }} style={styles.categoryImage} />
            <View style={styles.categoryOverlay}>
                <Text style={styles.categoryTitle}>{item.name}</Text>
            </View>
        </TouchableOpacity>
    );

    const renderRecipe = ({ item }) => (
        <TouchableOpacity style={styles.recipeCard} onPress={() => navigation.navigate('SingleRecipeScreen', { recipeId: item.id })}>
            {item.image ? (
                <Image source={{ uri: item.image }} style={styles.recipeImage} />
            ) : null}
            <Text style={styles.title}>{item.title}</Text>
            <Text numberOfLines={2}>Description: {item.description}</Text>
            <Text>Category: {item.categories?.map(catId => categories[catId]?.name).join(', ')}</Text>
            <Text>Cook time: {item.cookTime} minutes</Text>
            <Text>Servings: {item.servings}</Text>
            <Text>Added by: {profile.username}</Text>
            <Text>Added on: {item.createdAt?.toDate().toLocaleDateString()}</Text>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            {user && (
                <View style={styles.header}>
                    <Image source={{ uri: profile.profileImageUrl || 'https://via.placeholder.com/40' }} style={styles.profileImage} />
                    <Text style={styles.username}>{profile.username}</Text>
                    <TouchableOpacity onPress={() => setModalVisible(true)}>
                        <Ionicons name="menu" size={24} color="black" />
                    </TouchableOpacity>
                </View>
            )}
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    setModalVisible(!modalVisible);
                }}>
                <View style={styles.modalView}>
                    <Text style={styles.modalText}>User Menu</Text>
                    <Button title="My Account" onPress={() => {
                        setModalVisible(false);
                        navigation.navigate('MyAccount');
                    }} />
                    <Button title="Logout" onPress={() => {
                        setModalVisible(false);
                        auth.signOut().then(() => navigation.navigate('Home'));
                    }} />
                    <Button title="Close" onPress={() => setModalVisible(false)} />
                </View>
            </Modal>
            <FlatList
                data={Object.values(categories)}
                renderItem={renderCategory}
                keyExtractor={item => item.id}
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.categoriesList}
            />
            <FlatList
                data={recipes}
                renderItem={renderRecipe}
                keyExtractor={item => item.id}
                style={styles.recipesList}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    profileImage: {
        width: 40,
        height: 40,
        borderRadius: 20,
    },
    username: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    categoriesList: {
        marginVertical: 10,
    },
    categoryCard: {
        position: 'relative',
        marginRight: 10,
        width: 130, // Adjust width as needed
        height: 220, // Adjust height as needed
    },
    categoryImage: {
        width: '100%',
        height: '100%',
        borderRadius: 10, // Adjust borderRadius as needed
    },
    categoryOverlay: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderBottomLeftRadius: 10, // Match the image borderRadius
        borderBottomRightRadius: 10, // Match the image borderRadius
        width: 130, // Adjust width as needed
        height: 220, // Adjust height as needed
    },
    categoryTitle: {
        color: 'white',
      textAlign: 'center',
        fontSize:12,
    },
    recipesList: {
        marginVertical: 10,
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
        borderRadius: 10,
        marginBottom: 10,
    },
    modalView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 22,
        backgroundColor: 'white',
        padding: 35,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    modalText: {
        marginBottom: 15,
        textAlign: 'center',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default RecipesScreen;
