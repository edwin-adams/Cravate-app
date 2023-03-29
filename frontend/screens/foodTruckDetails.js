import React, { useState, useEffect } from "react";
import { Alert, SafeAreaView, StyleSheet, View, Text, TouchableOpacity, ScrollView } from "react-native";
import { useRoute } from '@react-navigation/native';
import MapView, { Marker } from 'react-native-maps';

export const FoodTruckDetails = ({navigation}) => {
    const route = useRoute();
    const { vendorId } = route.params;

    const [foodTruck, setFoodTruck] = useState(null);
    const [region, setRegion] = useState({
        latitude: 44.638642,
        longitude: -63.600575,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
    });


    if (!foodTruck) {
        console.log(vendorId);
        fetch('http://3.239.61.7:3000/truck/getByVendorId', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ vendorId: vendorId })
        })
        .then(response => response.json())
        .then(data => setFoodTruck(data))
        .catch(error => console.error(error));
    }

    if (!foodTruck) {
        return (
        <View style={styles.container}>
            <Text>Loading...</Text>
        </View>
        );
    }

    return (
            <View style={styles.container}>
            <View style={styles.card}>
                <Text style={styles.cardText}>Food Truck Name : {foodTruck.truck_name}</Text>
                <Text style={styles.cardText}>Truck Code : {foodTruck.truck_code}</Text>
                <Text style={styles.cardText}>Address : {foodTruck.address}</Text>
                <Text style={styles.cardText}>City : {foodTruck.city}</Text>
                <Text style={styles.cardText}>Dishes : {[...foodTruck.available_dishes,...foodTruck.unavailable_dishes].join(',')}</Text>
                <Text style={styles.cardText}>Location:</Text>
                <MapView style={{ width: '100%', height: 200 }} region={{
                    latitude: parseFloat(foodTruck.location.latitude),
                    longitude: parseFloat(foodTruck.location.longitude),
                    latitudeDelta: 0.01,
                    longitudeDelta: 0.01,
                }}>
                    <Marker coordinate={{ latitude: parseFloat(foodTruck.location.latitude), longitude: parseFloat(foodTruck.location.longitude) }} />
                </MapView>
            </View>
        {/* <TouchableOpacity style={styles.button} onPress={deleteUser}>
            <Text style={styles.buttonText}>Delete User</Text>
        </TouchableOpacity> */}
            
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