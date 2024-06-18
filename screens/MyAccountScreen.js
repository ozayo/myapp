import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, Image } from 'react-native';
import { getAuth, signOut } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';

function MyAccountScreen({ navigation }) {
    const auth = getAuth();
    const db = getFirestore();
    const user = auth.currentUser;
    const [profile, setProfile] = useState({
        username: '',
        fullName: '',
        location: '',
        profileImageUrl: '',
        admin: false,
    });

    useEffect(() => {
        if (user) {
            const userRef = doc(db, "users", user.uid);
            getDoc(userRef).then((docSnap) => {
                if (docSnap.exists()) {
                    setProfile(docSnap.data());
                }
            });
        }
    }, [user]);

    const handleLogout = () => {
        signOut(auth).then(() => {
            navigation.navigate('Home'); // Ana ekrana yönlendir
            alert('Logged out successfully!');
        }).catch((error) => {
            console.error('Logout failed', error);
        });
    };

    return (
        <View style={styles.container}>
            <View style={styles.profileContainer}>
                <Image
                    source={{ uri: profile.profileImageUrl || 'https://via.placeholder.com/70x70.png?text=No+Image' }}
                    style={styles.profileImage}
                />
            </View>
            <Text>Email: {user?.email}</Text>
            <Text>Welcome "{profile.username}"</Text>
            <Text>Name: {profile.fullName}</Text>
            <Text>Location: {profile.location}</Text>
            <Text>Role: {profile.admin ? 'Admin' : 'User'}</Text>
            <Button title="Edit Profile" onPress={() => navigation.navigate('EditAccount')} />
            <Button title="Logout" onPress={handleLogout} />
            <Button title="Add New Recipe" onPress={() => navigation.navigate('AddReciept')} />
            <Button title="My Recipes" onPress={() => navigation.navigate('MyRecipesScreen')} />
            <Button title="Home" onPress={() => navigation.navigate('Home')} />
            
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20
    },
    profileContainer: {
        marginBottom: 20
    },
    profileImage: {
        width: 70,
        height: 70,
        borderRadius: 35,
        backgroundColor: 'black'
    }
});

export default MyAccountScreen;
