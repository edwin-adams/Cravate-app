import React, { useState } from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import axios from 'axios';
import { useRoute } from '@react-navigation/native';

export const UserDetails = ({navigation}) => {
    //Get username passed from user list page
    const route = useRoute();
    const { username } = route.params;

    // Store user object in user
    const [user, setUser] = useState(null);


    // Delete the user
    const deleteUser = async () => {
      try {
        const response = await axios.delete('http://3.239.61.7:3000/user/delete', {
          data: {
            username: username
          }
        });
        console.log(response.data); // "User Deleted."
        // Redirect to another page
        navigation.navigate('listUser');
      } catch (error) {
        console.error(error);
      }  
    };

    // If user is empty fetch user details
    if (!user) {
        fetch('http://3.239.61.7:3000/user/get', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username: username })
        })
        .then(response => response.json())
        .then(data => setUser(data))
        .catch(error => console.error(error));
    }

    // If user is empty return temporary screen
    if (!user) {
        return (
        <View style={styles.container}>
            <Text>Loading...</Text>
        </View>
        );
    }

    // display on screen
    return (
        <View style={styles.container}>
        <View style={styles.card}>
            <Text style={styles.cardText}>Name : {user.first_name} {user.last_name}</Text>
            <Text style={styles.cardText}>Username : {user.username}</Text>
        </View>
        <TouchableOpacity style={styles.button} onPress={deleteUser}>
            <Text style={styles.buttonText}>Delete User</Text>
        </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#f5f5f5',
      padding: 20,
    },
    card: {
      backgroundColor: '#fff',
      borderRadius: 5,
      padding: 10,
      marginBottom: 10,
      width: '100%',
    },
    cardText: {
      fontSize: 16,
      fontWeight: 'bold',
      marginBottom: 5,
    },
    button: {
      backgroundColor: '#f44336',
      paddingVertical: 10,
      paddingHorizontal: 20,
      borderRadius: 5,
      marginTop: 10,
    },
    buttonText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: 'bold',
    },
});