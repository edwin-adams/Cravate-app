import React, { useState, useEffect } from "react";
import { Alert, SafeAreaView, StyleSheet, View, Text, TouchableOpacity } from "react-native";

export const ListFoodTruck = ({navigation}) => {
    const [foodTrucks, setFoodTrucks] = useState([]);

    useEffect(() => {
        fetch('http://3.239.61.7:3000/truck/getall')
        .then(response => response.json())
        .then(data => setFoodTrucks(data))
        .catch(error => console.error(error));
    }, []);

    const handleCardClick = (vendorId) => {
      navigation.navigate('foodTruckDetails', { vendorId });
    };

    return (
        <View style={styles.container}>
        <Text style={styles.heading}>Food Truck List</Text>
        {foodTrucks.map(foodTruck => (
            <TouchableOpacity
            key={foodTruck.truck_name}
            style={styles.card}
            onPress={() => handleCardClick(foodTruck.vendorId)}
            >
            <Text style={styles.cardText}>{foodTruck.truck_name}</Text>
            </TouchableOpacity>
        ))}
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