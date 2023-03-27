import React, { useState, useEffect } from "react";
import { Alert, SafeAreaView, StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { useRoute } from '@react-navigation/native';

export const VendorDetails = ({navigation}) => {
    const route = useRoute();
    const { username } = route.params;

    const [vendor, setVendor] = useState(null);

    const deleteVendor = async () => {
      try {
        const response = await axios.delete('http://3.239.61.7:3000/vendor/delete', {
          data: {
            username: username
          }
        });
        console.log(response.data); // "User Deleted."
        // Redirect to another page
        navigation.navigate('listVendor');
      } catch (error) {
        console.error(error);
      }  
  };

    if (!vendor) {
        fetch('http://3.239.61.7:3000/vendor/get', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username: username })
        })
        .then(response => response.json())
        .then(data => setVendor(data))
        .catch(error => console.error(error));
    }

    if (!vendor) {
        return (
        <View style={styles.container}>
            <Text>Loading...</Text>
        </View>
        );
    }

    return (
        <View style={styles.container}>
        <View style={styles.card}>
            <Text style={styles.cardText}>Name : {vendor.first_name} {vendor.last_name}</Text>
            <Text style={styles.cardText}>Username : {vendor.username}</Text>
        </View>
        <TouchableOpacity style={styles.button} onPress={deleteVendor}>
            <Text style={styles.buttonText}>Delete Vendor</Text>
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