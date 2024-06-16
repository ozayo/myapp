import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, Text, StyleSheet, Alert } from 'react-native';
import { getAuth } from 'firebase/auth';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase-config';

function EditMyInfo({ navigation }) {
    const auth = getAuth();
    const user = auth.currentUser;
    const [username, setUsername] = useState('');
    const [fullName, setFullName] = useState('');
    const [location, setLocation] = useState('');

    useEffect(() => {
        if (user) {
            const userRef = doc(db, "users", user.uid);
            getDoc(userRef).then((doc) => {
                if (doc.exists()) {
                    const userData = doc.data();
                    setUsername(userData.username);
                    setFullName(userData.fullName);
                    setLocation(userData.location);
                }
            });
        }
    }, [user]);

    const handleSave = async () => {
        const userRef = doc(db, "users", user.uid);
        try {
            await updateDoc(userRef, {
                username,
                fullName,
                location
            });
            Alert.alert("Update Success", "Your profile has been updated successfully.");
            navigation.push('MyAccount');
        } catch (error) {
            console.error("Error updating user:", error);
            Alert.alert("Update Failed", error.message);
        }
    };

    return (
        <View style={styles.container}>
            <TextInput style={styles.input} placeholder="Username" value={username} onChangeText={setUsername} />
            <TextInput style={styles.input} placeholder="Full Name" value={fullName} onChangeText={setFullName} />
            <TextInput style={styles.input} placeholder="Location" value={location} onChangeText={setLocation} />
        <Button title="Save" onPress={handleSave} />
         <Button title="Home" onPress={() => navigation.navigate('Home')} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 20,
    }
});

export default EditMyInfo;
