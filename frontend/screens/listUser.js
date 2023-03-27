import React, { useState, useEffect, useCallback } from "react";
import { Alert, SafeAreaView, StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { useFocusEffect } from '@react-navigation/native';

export const ListUser = ({navigation}) => {
    const [users, setUsers] = useState([]);

    const fetchUsers = useCallback(() => {
        fetch('http://3.239.61.7:3000/users/getall')
            .then(response => response.json())
            .then(data => setUsers(data))
            .catch(error => console.error(error))
    }, []);

    useEffect(() => {
        setTimeout(fetchUsers, 3000);
    }, [fetchUsers]);

    useFocusEffect(fetchUsers);

    const handleCardClick = (username) => {
        navigation.navigate('userDetails', { username });
    };

    return (
        <View style={styles.container}>
            <Text style={styles.heading}>User List</Text>
            {users.map(user => (
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