import React, { useState, useEffect, useCallback } from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { useFocusEffect } from '@react-navigation/native';

export const ListUser = ({navigation}) => {
    // variable to store all the user list 
    const [users, setUsers] = useState([]);

    
    // If there has been any change in the number of users it will be refreshed
    const fetchUsers = useCallback(() => {
        fetch('http://3.239.61.7:3000/users/getall')
            .then(response => response.json())
            .then(data => setUsers(data))
            .catch(error => console.error(error))
    }, []);

    // Constructor function kind of
    useEffect(() => {
        setTimeout(fetchUsers, 3000);
    }, [fetchUsers]);

    // Call the function
    useFocusEffect(fetchUsers);

    // pass the details of that particular user to user details page
    const handleCardClick = (username) => {
        navigation.navigate('userDetails', { username });
    };

    // display on screen
    return (
        <View style={styles.container}>
            <Text style={styles.heading}>User List</Text>
            {/* display all items from user list */}
            {users.map(user => (
                // Touchable list
                <TouchableOpacity
                    key={user.username}
                    style={styles.card}
                    onPress={() => handleCardClick(user.username)}
                >
                    <Text style={styles.cardText}>{user.username}</Text>
                </TouchableOpacity>
            ))}
        </View>
    );
};


const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#f5f5f5',
      padding: 20,
    },
    heading: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 20,
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
    },
  });