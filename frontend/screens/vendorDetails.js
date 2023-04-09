import React, { useState } from "react";
import {  StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { useRoute } from '@react-navigation/native';
import axios from 'axios';

export const VendorDetails = ({navigation}) => {
    //Get username passed from vendor list page
    const route = useRoute();
    const { username } = route.params;

    // Store vendor object in user
    const [vendor, setVendor] = useState(null);

    // Delete the vendor
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

  // Navigate to food truck connecter to that particular vendor
  const goToFoodTruck = (vendorId) =>{
    console.log(vendorId);
    navigation.navigate('foodTruckDetails', { vendorId });
  }

  // If vendor is empty vendor details  
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

    // If vendor is empty display temporary screen
    if (!vendor) {
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
            <Text style={styles.cardText}>Name : {vendor.first_name} {vendor.last_name}</Text>
            <Text style={styles.cardText}>Username : {vendor.username}</Text>
        </View>
        <TouchableOpacity style={styles.button} onPress={deleteVendor}>
            <Text style={styles.buttonText}>Delete Vendor</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => goToFoodTruck(vendor._id)}>
            <Text style={styles.buttonText}>Corresponding Food Truck</Text>
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